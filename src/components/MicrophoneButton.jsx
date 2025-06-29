"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2, ChevronDown } from 'lucide-react'
import useReverieStt from '@/lib/useReverieStt'

// Language options with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
]

// Separate Language Selector Component
export function LanguageSelector({ selectedLanguage, onLanguageChange, disabled }) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const languageRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  return (
    <div className="relative" ref={languageRef}>
      <button
        type="button"
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        disabled={disabled}
        className={`flex items-center space-x-1 px-2 py-1 text-xs rounded border transition-colors ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="text-xs">▼</span>
      </button>

      {showLanguageMenu && (
        <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-32">
          <div className="max-h-48 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onLanguageChange(lang.code)
                  setShowLanguageMenu(false)
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-xs hover:bg-blue-50 transition-colors ${
                  selectedLanguage === lang.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const MicrophoneButton = ({ 
  onTranscript, 
  disabled = false, 
  apiKey = 'bd448f71dae9549fa69f377a3b5f190775369fba', 
  appId = 'com.ayushman.codefly',
  language = 'en',
  className = '',
  showLanguageSelector = true,
  onLanguageChange
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const buttonRef = useRef(null)
  const lastTranscriptRef = useRef('')
  
  const {
    isListening,
    transcript,
    error,
    isLoading,
    startListening,
    stopListening,
    clearTranscript
  } = useReverieStt(apiKey, appId)

  // Update selected language when prop changes
  useEffect(() => {
    console.log('Language prop changed to:', language)
    setSelectedLanguage(language)
  }, [language])

  // Send transcript to parent when it updates
  useEffect(() => {
    console.log('Transcript updated:', transcript)
    if (transcript && transcript !== lastTranscriptRef.current && onTranscript) {
      console.log('Calling onTranscript with:', transcript)
      onTranscript(transcript)
      lastTranscriptRef.current = transcript
    }
  }, [transcript, onTranscript])

  const handleLanguageChange = (newLanguage) => {
    console.log('Language changed from', selectedLanguage, 'to', newLanguage)
    setSelectedLanguage(newLanguage)
    
    // If currently listening, stop and restart with new language
    if (isListening) {
      console.log('Restarting STT with new language:', newLanguage)
      stopListening().then(() => {
        // Small delay to ensure stop is processed
        setTimeout(() => {
          startListening(newLanguage, {
            continuous: true,
            silence: 1000,
            timeout: 180,
            domain: 'generic'
          })
        }, 100)
      })
    }
    
    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    }
  }

  const handleMicClick = async () => {
    if (disabled) return
    
    console.log('Mic button clicked, isListening:', isListening, 'selectedLanguage:', selectedLanguage)
    
    if (isListening) {
      console.log('Stopping STT...')
      const stopped = await stopListening()
      console.log('STT stop result:', stopped)
    } else {
      console.log('Starting STT with language:', selectedLanguage)
      clearTranscript()
      lastTranscriptRef.current = ''
      
      const success = await startListening(selectedLanguage, {
        continuous: true,
        silence: 1000, // 1 second of silence
        timeout: 180, // 3 minutes max
        domain: 'generic'
      })
      
      console.log('STT start result:', success, 'for language:', selectedLanguage)
      
      if (!success && error) {
        console.error('Failed to start STT:', error)
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Language Selector - only show if enabled */}
      {showLanguageSelector && (
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          disabled={disabled}
        />
      )}

      {/* Main Microphone Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleMicClick}
          disabled={disabled || isLoading}
          className={`
            relative flex items-center justify-center rounded-full transition-all duration-200 
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : isListening 
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }
            ${className || 'h-10 w-10'}
          `}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping" />
          )}
        </button>
      </div>
    </div>
  )
}

export default MicrophoneButton 