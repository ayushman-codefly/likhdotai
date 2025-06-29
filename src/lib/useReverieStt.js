"use client"

import ReverieClient from '@reverieit/reverie-client'
import { useState, useRef, useCallback, useEffect } from 'react'

const useReverieStt = (apiKey, appId) => {
  const [isListening, setIsListening] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const reverieClientRef = useRef(null)
  const finalResultRef = useRef('')
  const partialResultRef = useRef('')
  const fullTranscriptRef = useRef('')
  const isActivelyListeningRef = useRef(false) // Track if we should process events

  // Initialize Reverie client
  const initializeClient = useCallback(async () => {
    if (typeof window === 'undefined') return false
    
    try {
      setIsLoading(true)
      setError(null)

      const client = new ReverieClient({
        apiKey: apiKey,
        appId: appId,
      })

      reverieClientRef.current = client
      setIsInitialized(true)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Failed to initialize Reverie client:', err)
      setError(err.message || 'Failed to initialize speech recognition')
      setIsLoading(false)
      return false
    }
  }, [apiKey, appId])

  // Voice text callback
  const voiceText = useCallback((event) => {
    // Don't process events if we're not actively listening
    if (!isActivelyListeningRef.current) {
      console.log('Ignoring STT event - not actively listening:', event.stt_event?.event)
      return
    }

    console.log('STT Event received:', event)
    
    if (!event.stt_event) {
      console.error("Invalid STT event received:", event)
      return
    }

    const sttEvent = event.stt_event
    let text = ''

    // Extract text based on event type
    if (sttEvent.event === "FINAL_RESULT") {
      // For final results, try multiple fields
      text = event.text || sttEvent.data || ''
      console.log('Final result text:', text)
      
      if (text.trim()) {
        finalResultRef.current = text.trim()
        partialResultRef.current = ""
        
        // Add to full transcript
        fullTranscriptRef.current = fullTranscriptRef.current ? 
          `${fullTranscriptRef.current} ${text.trim()}` : 
          text.trim()
        setTranscript(fullTranscriptRef.current)
        console.log('Updated full transcript:', fullTranscriptRef.current)
      }
    } else if (sttEvent.event === "PARTIAL_RESULTS") {
      // For partial results, the text is often in the data field
      text = sttEvent.data || event.text || ''
      console.log('Partial result text:', text)
      
      if (text.trim()) {
        partialResultRef.current = text.trim()
        
        // Show current full transcript + partial result
        const currentTranscript = fullTranscriptRef.current ? 
          `${fullTranscriptRef.current} ${text.trim()}` : 
          text.trim()
        setTranscript(currentTranscript)
        console.log('Updated transcript with partial:', currentTranscript)
      }
    } else if (sttEvent.event === "MSG_WEB_SOCKET") {
      // Handle WebSocket messages that might contain JSON data
      try {
        const wsData = JSON.parse(sttEvent.data || '{}')
        if (wsData.text && wsData.text.trim()) {
          text = wsData.text.trim()
          console.log('WebSocket result text:', text)
          
          if (wsData.final) {
            finalResultRef.current = text
            partialResultRef.current = ""
            fullTranscriptRef.current = fullTranscriptRef.current ? 
              `${fullTranscriptRef.current} ${text}` : 
              text
            setTranscript(fullTranscriptRef.current)
          } else {
            partialResultRef.current = text
            const currentTranscript = fullTranscriptRef.current ? 
              `${fullTranscriptRef.current} ${text}` : 
              text
            setTranscript(currentTranscript)
          }
        }
      } catch (e) {
        // Not JSON data, ignore
      }
    }

    if (event.error) {
      console.error('STT Error:', event.error)
      setError(event.error)
      setIsListening(false)
      isActivelyListeningRef.current = false
    }
  }, [])

  // Initialize STT with language and callback
  const initializeStt = useCallback(async (language = 'en', options = {}) => {
    if (!reverieClientRef.current) {
      const initialized = await initializeClient()
      if (!initialized) return false
    }

    try {
      setError(null)
      
      // Reset transcript variables
      finalResultRef.current = ''
      partialResultRef.current = ''
      fullTranscriptRef.current = ''
      
      await reverieClientRef.current.init_stt({
        src_lang: language,
        domain: options.domain || 'generic',
        silence: options.silence || 1,
        continuous: options.continuous !== false,
        logging: true, // Enable logging for debugging
        timeout: options.timeout || 180,
        callback: voiceText,
        errorHandler: (error) => {
          console.error('STT Error Handler:', error)
          setError(error.message || 'Speech recognition error')
          setIsListening(false)
          isActivelyListeningRef.current = false
        },
        ...options
      })
      
      console.log('STT initialized successfully for language:', language)
      return true
    } catch (err) {
      console.error('Failed to initialize STT:', err)
      setError(err.message || 'Failed to initialize STT')
      return false
    }
  }, [initializeClient, voiceText])

  // Start listening
  const startListening = useCallback(async (language = 'en', options = {}) => {
    try {
      setError(null)
      console.log('Starting STT for language:', language)
      
      // Initialize STT if not already done
      const sttInitialized = await initializeStt(language, options)
      if (!sttInitialized) return false
      
      // Set the flag before starting
      isActivelyListeningRef.current = true
      
      await reverieClientRef.current.start_stt()
      setIsListening(true)
      console.log('STT started successfully')
      return true
    } catch (err) {
      console.error('Failed to start listening:', err)
      setError(err.message || 'Failed to start listening')
      setIsListening(false)
      isActivelyListeningRef.current = false
      return false
    }
  }, [initializeStt])

  // Stop listening
  const stopListening = useCallback(async () => {
    try {
      console.log('Stopping STT...')
      
      // Set the flag immediately to stop processing new events
      isActivelyListeningRef.current = false
      setIsListening(false)
      
      if (reverieClientRef.current) {
        await reverieClientRef.current.stop_stt()
        console.log('STT stopped successfully')
        
        // Give it a moment then try to clean up any lingering connections
        setTimeout(() => {
          if (reverieClientRef.current) {
            try {
              // Force cleanup if needed
              reverieClientRef.current.stop_stt().catch(() => {
                // Ignore errors on second stop attempt
              })
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        }, 100)
      }
      
      return true
    } catch (err) {
      console.error('Failed to stop listening:', err)
      setError(err.message || 'Failed to stop listening')
      setIsListening(false)
      isActivelyListeningRef.current = false
      return false
    }
  }, [])

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('')
    finalResultRef.current = ''
    partialResultRef.current = ''
    fullTranscriptRef.current = ''
    console.log('Transcript cleared')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening && reverieClientRef.current) {
        console.log('Cleaning up STT on unmount')
        isActivelyListeningRef.current = false
        reverieClientRef.current.stop_stt().catch(console.error)
      }
    }
  }, [isListening])

  return {
    isListening,
    isInitialized,
    transcript,
    error,
    isLoading,
    startListening,
    stopListening,
    clearTranscript,
    initializeClient
  }
}

export default useReverieStt 