"use client"

import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState, useCallback, useMemo } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import useReverieStt from '@/lib/useReverieStt'

// Word-level diff algorithm implementation
class WordDiff {
  static computeDiff(original, modified) {
    // Convert HTML to plain text for comparison
    const originalText = this.htmlToText(original)
    const modifiedText = this.htmlToText(modified)
    
    const originalWords = this.tokenize(originalText)
    const modifiedWords = this.tokenize(modifiedText)
    
    // Use Myers diff algorithm and then group consecutive changes
    const rawDiff = this.myersDiff(originalWords, modifiedWords)
    return this.groupConsecutiveChanges(rawDiff)
  }
  
  static htmlToText(html) {
    // Create a temporary div to extract text content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }
  
  static tokenize(text) {
    // Split by words and preserve whitespace/punctuation
    return text.match(/\S+|\s+/g) || []
  }
  
  static myersDiff(original, modified) {
    const N = original.length
    const M = modified.length
    const MAX = N + M
    
    const v = {}
    const trace = []
    
    v[1] = 0
    
    for (let d = 0; d <= MAX; d++) {
      trace.push({...v})
      
      for (let k = -d; k <= d; k += 2) {
        let x
        if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
          x = v[k + 1]
        } else {
          x = v[k - 1] + 1
        }
        
        let y = x - k
        
        while (x < N && y < M && original[x] === modified[y]) {
          x++
          y++
        }
        
        v[k] = x
        
        if (x >= N && y >= M) {
          return this.buildDiffResult(original, modified, trace, d)
        }
      }
    }
    
    return this.buildDiffResult(original, modified, trace, MAX)
  }
  
  static buildDiffResult(original, modified, trace, d) {
    const result = []
    let x = original.length
    let y = modified.length
    
    for (let step = d; step >= 0; step--) {
      const v = trace[step]
      const k = x - y
      
      let prevK
      if (k === -step || (k !== step && v[k - 1] < v[k + 1])) {
        prevK = k + 1
      } else {
        prevK = k - 1
      }
      
      const prevX = v[prevK]
      const prevY = prevX - prevK
      
      while (x > prevX && y > prevY) {
        result.unshift({
          type: 'equal',
          content: original[x - 1]
        })
        x--
        y--
      }
      
      if (step > 0) {
        if (x > prevX) {
          result.unshift({
            type: 'delete',
            content: original[x - 1]
          })
          x--
        } else {
          result.unshift({
            type: 'insert',
            content: modified[y - 1]
          })
          y--
        }
      }
    }
    
    return result
  }
  
  static groupConsecutiveChanges(diffResult) {
    const grouped = []
    let currentGroup = null
    let conflictId = 0
    
    for (const item of diffResult) {
      if (item.type === 'equal') {
        // Finish any current group
        if (currentGroup) {
          currentGroup.conflictId = `conflict-${conflictId++}`
          grouped.push(currentGroup)
          currentGroup = null
        }
        // Add the equal item
        grouped.push(item)
      } else {
        // Start a new group or continue existing one
        if (!currentGroup) {
          currentGroup = {
            type: 'conflict',
            deletes: [],
            inserts: []
          }
        }
        
        if (item.type === 'delete') {
          currentGroup.deletes.push(item.content)
        } else if (item.type === 'insert') {
          currentGroup.inserts.push(item.content)
        }
      }
    }
    
    // Finish any remaining group
    if (currentGroup) {
      currentGroup.conflictId = `conflict-${conflictId++}`
      grouped.push(currentGroup)
    }
    
    return grouped
  }
  
  static generateMergeHTML(diffResult) {
    return diffResult.map(item => {
      if (item.type === 'equal') {
        return this.escapeHtml(item.content)
      } else if (item.type === 'conflict') {
        let html = ''
        
        // Add deletions (red)
        if (item.deletes.length > 0) {
          const deleteContent = item.deletes.join('')
          html += `<span data-conflict="${item.conflictId}" data-type="reject" class="bg-red-200 text-red-800 hover:bg-red-300 px-1 rounded cursor-pointer transition-all duration-200 relative inline-block" title="Click to remove: ${deleteContent.trim()}">${this.escapeHtml(deleteContent)}</span>`
        }
        
        // Add insertions (green)
        if (item.inserts.length > 0) {
          const insertContent = item.inserts.join('')
          html += `<span data-conflict="${item.conflictId}" data-type="accept" class="bg-green-200 text-green-800 hover:bg-green-300 px-1 rounded cursor-pointer transition-all duration-200 relative inline-block" title="Click to add: ${insertContent.trim()}">${this.escapeHtml(insertContent)}</span>`
        }
        
        return html
      }
    }).join('')
  }
  
  static escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

const MenuBar = ({ editor, mergeMode, onExitMerge, onAcceptAll, onRejectAll, onSTTStateChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Language options with flags
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', flag: '🇮🇳' }
  ]

  const selectedLang = languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0]

  // Platform detection for keyboard shortcuts
  const [keyName, setKeyName] = React.useState('')
  
  React.useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    const platform = navigator.platform.toLowerCase()
    
    if (platform.includes('mac') || userAgent.includes('mac')) {
      setKeyName('Option')
    } else {
      setKeyName('Alt')
    }
  }, [])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.relative')) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageDropdown])
  
  const {
    isListening,
    transcript,
    isPartial,
    error,
    isLoading,
    startListening,
    stopListening,
    clearTranscript
  } = useReverieStt(
    process.env.NEXT_PUBLIC_REVERIE_API_KEY || 'bd448f71dae9549fa69f377a3b5f190775369fba',
    process.env.NEXT_PUBLIC_REVERIE_APP_ID || 'com.ayushman.codefly'
  )

  // Notify parent component about STT state changes
  React.useEffect(() => {
    if (onSTTStateChange) {
      onSTTStateChange({
        isListening,
        transcript,
        isPartial,
        error,
        isLoading
      })
    }
  }, [isListening, transcript, isPartial, error, isLoading, onSTTStateChange])

  // Track STT insertion state
  const sttStateRef = React.useRef({
    insertionStart: null,
    partialLength: 0,
    lastTranscript: ''
  })

  // Handle transcript updates with proper partial/final management
  React.useEffect(() => {
    if (!editor || mergeMode || !transcript) return

    const sttState = sttStateRef.current
    const currentTranscript = transcript.trim()
    
    // Skip if transcript hasn't changed
    if (currentTranscript === sttState.lastTranscript) return
    
    console.log('STT Update:', { 
      current: currentTranscript, 
      last: sttState.lastTranscript, 
      isPartial: isPartial,
      insertionStart: sttState.insertionStart,
      partialLength: sttState.partialLength
    })

    if (isPartial) {
      // Handle partial result
      if (sttState.insertionStart !== null && sttState.partialLength > 0) {
        // Remove previous partial text
        const from = sttState.insertionStart
        const to = sttState.insertionStart + sttState.partialLength
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .deleteSelection()
          .insertContent(currentTranscript)
          .run()
        
        // Update tracking
        sttState.partialLength = currentTranscript.length
      } else {
        // First partial result - insert at cursor
        const currentPos = editor.state.selection.from
        
        editor.chain()
          .focus()
          .insertContent(currentTranscript)
          .run()
        
        // Track insertion
        sttState.insertionStart = currentPos
        sttState.partialLength = currentTranscript.length
      }
    } else {
      // Handle final result
      if (sttState.insertionStart !== null && sttState.partialLength > 0) {
        // Remove all partial text and insert final
        const from = sttState.insertionStart
        const to = sttState.insertionStart + sttState.partialLength
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .deleteSelection()
          .insertContent(currentTranscript + ' ')
          .run()
      } else {
        // No previous partial, just insert final
        editor.chain()
          .focus()
          .insertContent(currentTranscript + ' ')
          .run()
      }
      
      // Reset tracking
      sttState.insertionStart = null
      sttState.partialLength = 0
      
      // Clear transcript after final insertion
      clearTranscript()
    }
    
    sttState.lastTranscript = currentTranscript
  }, [transcript, editor, mergeMode, isPartial, clearTranscript])

  // Keyboard shortcuts for STT (Fn key)
  React.useEffect(() => {
    if (!editor || mergeMode) return

          const handleKeyDown = async (event) => {
        // Check for Alt key (Microphone shortcut)
      if ((event.altKey || event.key === 'Alt' || event.key === 'AltGraph')) {
        event.preventDefault()
        if (!isListening && !isLoading) {
          clearTranscript()
          // Reset STT state when starting
          sttStateRef.current = {
            insertionStart: null,
            partialLength: 0,
            lastTranscript: ''
          }
          await startListening(selectedLanguage, {
            continuous: true,
            silence: 1000,
            timeout: 180,
            domain: 'generic'
          })
        }
      }
    }

          const handleKeyUp = async (event) => {
        // Check for Alt key release
      if ((event.altKey || event.key === 'Alt' || event.key === 'AltGraph')) {
        event.preventDefault()
        if (isListening) {
          await stopListening()
          // Reset STT state when stopping
          sttStateRef.current = {
            insertionStart: null,
            partialLength: 0,
            lastTranscript: ''
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [editor, mergeMode, isListening, isLoading, selectedLanguage, startListening, stopListening, clearTranscript])

  const handleMicClick = async () => {
    if (isListening) {
      await stopListening()
      // Reset STT state when stopping
      sttStateRef.current = {
        insertionStart: null,
        partialLength: 0,
        lastTranscript: ''
      }
    } else {
      clearTranscript()
      // Reset STT state when starting
      sttStateRef.current = {
        insertionStart: null,
        partialLength: 0,
        lastTranscript: ''
      }
      await startListening(selectedLanguage, {
        continuous: true,
        silence: 1000,
        timeout: 180,
        domain: 'generic'
      })
    }
  }

  if (!editor) {
    return null
  }
  
  if (mergeMode) {
    return (
      <div className="control-group border-b border-blue-200 p-3 bg-blue-50">
        <div className="button-group flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-blue-800">Merge Mode: Click on highlighted text to resolve conflicts</span>
          <button 
            onClick={onAcceptAll}
            className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Accept All Green
          </button>
          <button 
            onClick={onRejectAll}
            className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Reject All Red
          </button>
          <button 
            onClick={onExitMerge}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Finalize Merge
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="control-group border-b border-blue-200 p-3 bg-blue-50">
      <div className="button-group flex flex-wrap gap-2 items-center">
        {/* Language Dropdown for STT */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-2 py-1 text-sm rounded border bg-white text-gray-700 border-blue-200 hover:bg-blue-100 transition-colors flex items-center space-x-1"
            title="Select Language"
          >
            <span>{selectedLang.flag}</span>
            <span className="text-xs">▼</span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-blue-200 rounded-md shadow-lg z-50 min-w-[150px]">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code)
                    setShowLanguageDropdown(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center space-x-2 transition-colors ${
                    selectedLanguage === lang.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Speech-to-Text Button */}
        <button
          onClick={handleMicClick}
          disabled={isLoading}
          className={`px-3 py-1 text-sm rounded border transition-colors flex items-center space-x-1 ${
            isListening
              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
              : 'bg-white text-gray-700 border-blue-200 hover:bg-blue-100'
          }`}
          title={`Speech to Text - Click or hold ${keyName} key to dictate`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isListening ? 'Stop' : 'Speak'}
          </span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-blue-300"></div>

        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          H1
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          H2
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          H3
        </button>
        <button 
          onClick={() => editor.chain().focus().setParagraph().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('paragraph') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Paragraph
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-blue-300"></div>

        <button 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors font-bold ${
            editor.isActive('bold') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Bold
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors italic ${
            editor.isActive('italic') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Italic
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors line-through ${
            editor.isActive('strike') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Strike
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-blue-300"></div>

        <button 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Left
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Center
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Right
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive({ textAlign: 'justify' }) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Justify
        </button>
      </div>
    </div>
  )
}

// Real-time Audio Waveform Visualizer Component
const AudioWaveform = ({ isActive, audioLevel = 0 }) => {
  const canvasRef = React.useRef(null)
  const animationRef = React.useRef(null)
  const barsRef = React.useRef([])
  
  // Initialize bars with random heights for animation
  React.useEffect(() => {
    barsRef.current = Array.from({ length: 20 }, () => Math.random() * 0.5 + 0.1)
  }, [])
  
  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Update bars based on audio level and animation
    const bars = barsRef.current
    const barWidth = width / bars.length
    const centerY = height / 2
    
    bars.forEach((bar, index) => {
      if (isActive) {
        // Animate bars based on audio level + some randomness for natural look
        const targetHeight = (audioLevel * 0.7 + Math.random() * 0.3) * height * 0.8
        bars[index] = bar + (targetHeight / height - bar) * 0.1
      } else {
        // Fade out when not active
        bars[index] = bars[index] * 0.95
      }
      
      const barHeight = bars[index] * height * 0.8
      const x = index * barWidth + barWidth * 0.2
      const y = centerY - barHeight / 2
      
      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      if (isActive) {
        gradient.addColorStop(0, '#3b82f6') // Blue top
        gradient.addColorStop(1, '#1d4ed8') // Darker blue bottom
      } else {
        gradient.addColorStop(0, '#9ca3af') // Gray top
        gradient.addColorStop(1, '#6b7280') // Darker gray bottom
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth * 0.6, barHeight)
    })
    
    // Continue animation
    if (isActive || bars.some(bar => bar > 0.01)) {
      animationRef.current = requestAnimationFrame(draw)
    }
  }, [isActive, audioLevel])
  
  React.useEffect(() => {
    if (isActive) {
      draw()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, draw])
  
  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={32}
      className="rounded"
      style={{ background: 'transparent' }}
    />
  )
}

// Audio Level Monitor Hook
const useAudioLevel = (isListening) => {
  const [audioLevel, setAudioLevel] = React.useState(0)
  const audioContextRef = React.useRef(null)
  const analyserRef = React.useRef(null)
  const dataArrayRef = React.useRef(null)
  const animationFrameRef = React.useRef(null)
  
  const getAudioLevel = React.useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current)
    
    // Calculate average audio level
    let sum = 0
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i]
    }
    const average = sum / dataArrayRef.current.length / 255 // Normalize to 0-1
    
    setAudioLevel(average)
    
    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(getAudioLevel)
    }
  }, [isListening])
  
  React.useEffect(() => {
    if (isListening && !audioContextRef.current) {
      // Initialize audio context for level monitoring
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
          const source = audioContextRef.current.createMediaStreamSource(stream)
          
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 256
          
          const bufferLength = analyserRef.current.frequencyBinCount
          dataArrayRef.current = new Uint8Array(bufferLength)
          
          source.connect(analyserRef.current)
          
          getAudioLevel()
        })
        .catch(err => {
          console.error('Error accessing microphone for visualization:', err)
        })
    } else if (!isListening) {
      // Clean up
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      setAudioLevel(0)
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isListening, getAudioLevel])
  
  return audioLevel
}

// Interactive Key Test Component for Onboarding
const KeyTestComponent = ({ onKeyDetected, className = "" }) => {
  const [keyPressed, setKeyPressed] = useState(false)
  const [keySymbol, setKeySymbol] = useState('')
  const [keyName, setKeyName] = useState('')
  const [platform, setPlatform] = useState('')
  const [testCompleted, setTestCompleted] = useState(false)

  // Platform detection
  React.useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const platformInfo = navigator.platform.toLowerCase()
    
    if (platformInfo.includes('mac') || userAgent.includes('mac')) {
      setPlatform('mac')
      setKeySymbol('⌥')
      setKeyName('Option')
    } else {
      setPlatform('other')
      setKeySymbol('Alt')
      setKeyName('Alt')
    }
  }, [])

  // Key detection
  React.useEffect(() => {
    let pressTimer

    const handleKeyDown = (event) => {
      if ((event.altKey || event.key === 'Alt' || event.key === 'AltGraph')) {
        event.preventDefault()
        setKeyPressed(true)
        
        // Clear any existing timer
        if (pressTimer) clearTimeout(pressTimer)
        
        // Set completion after a brief delay to show the visual feedback
        pressTimer = setTimeout(() => {
          setTestCompleted(true)
          if (onKeyDetected) {
            onKeyDetected(true)
          }
        }, 500)
      }
    }

    const handleKeyUp = (event) => {
      if ((event.altKey || event.key === 'Alt' || event.key === 'AltGraph')) {
        setKeyPressed(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (pressTimer) clearTimeout(pressTimer)
    }
  }, [onKeyDetected])

  return (
    <div className={`inline-flex flex-col items-center space-y-3 ${className}`}>
      {/* Instruction */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Press and hold the <strong>{keyName}</strong> key to test dictation shortcut
        </p>
      </div>

      {/* Interactive Key Display */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hold:</span>
          <kbd 
            className={`
              px-4 py-3 text-lg font-bold rounded-lg border-2 shadow-lg transition-all duration-200 transform
              ${keyPressed 
                ? 'bg-blue-500 text-white border-blue-600 scale-110 shadow-blue-200' 
                : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
              }
              ${testCompleted ? 'ring-2 ring-green-400' : ''}
            `}
            style={{ minWidth: '60px', textAlign: 'center' }}
          >
            {keySymbol}
          </kbd>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center">
          {testCompleted ? (
            <div className="flex items-center space-x-1 text-green-600">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium">Perfect!</span>
            </div>
          ) : keyPressed ? (
            <div className="flex items-center space-x-1 text-blue-600">
              <span className="text-lg animate-pulse">🎤</span>
              <span className="text-sm font-medium">Detected!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-400">
              <span className="text-lg">⏳</span>
              <span className="text-sm">Waiting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {platform === 'mac' ? (
            <>On Mac  the Option key is located next to the Command Button</>
          ) : (
            <>On Windows ⊞ the Alt key is located next to the spacebar</>
          )}
        </p>
        {testCompleted && (
          <p className="text-xs text-green-600 mt-1 font-medium">
            Great! You can now use this shortcut anywhere in the editor to start dictating.
          </p>
        )}
      </div>
    </div>
  )
}

// Export the component for use in onboarding
export { KeyTestComponent }

export default ({ content, setContent, mergeMode = false, originalContent = '', modifiedContent = '' }) => {
  // STT state from MenuBar
  const [sttState, setSttState] = useState({
    isListening: false,
    transcript: '',
    isPartial: false,
    error: null,
    isLoading: false
  })
  
  // Audio level for waveform visualization
  const audioLevel = useAudioLevel(sttState.isListening)

  // Show initial tip about dictation
  const [showInitialTip, setShowInitialTip] = useState(true)

  React.useEffect(() => {
    // Hide the initial tip after 5 seconds
    const timer = setTimeout(() => {
      setShowInitialTip(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Platform detection for keyboard shortcuts
  const [platform, setPlatform] = useState('')
  const [keySymbol, setKeySymbol] = useState('')
  const [keyName, setKeyName] = useState('')

  React.useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    const platform = navigator.platform.toLowerCase()
    
    if (platform.includes('mac') || userAgent.includes('mac')) {
      setPlatform('mac')
      setKeySymbol('⌥') // Option symbol
      setKeyName('Option')
    } else if (platform.includes('win') || userAgent.includes('windows')) {
      setPlatform('windows')
      setKeySymbol('Alt') // Alt text
      setKeyName('Alt')
    } else {
      // Linux and others
      setPlatform('linux')
      setKeySymbol('Alt') // Alt text
      setKeyName('Alt')
    }
  }, [])

  // Generate merge content when in merge mode
  const mergeContent = useMemo(() => {
    if (!mergeMode || !originalContent || !modifiedContent) return content
    
    const diffResult = WordDiff.computeDiff(originalContent, modifiedContent)
    return `<p>${WordDiff.generateMergeHTML(diffResult)}</p>`
  }, [mergeMode, originalContent, modifiedContent, content])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: mergeMode ? mergeContent : (content || `<p>Start typing your document here...</p>`),
    editable: !mergeMode,
    onUpdate: ({ editor }) => {
      if (setContent && !mergeMode) {
        setContent(editor.getHTML())
      }
    },
  })

  // Handle direct clicks on conflict spans - no popups, direct action
  const handleEditorClick = useCallback((event) => {
    if (!mergeMode){
      if(typeof window !== 'undefined'){
        document.querySelector('.tiptap').focus();
      }
      
      return;
    }
    
    const conflictElement = event.target.closest('[data-conflict]')
    if (conflictElement) {
      event.preventDefault()
      event.stopPropagation()
      
      const conflictId = conflictElement.getAttribute('data-conflict')
      const type = conflictElement.getAttribute('data-type')
      
      if (type === 'accept') {
        handleAcceptConflict(conflictId)
      } else if (type === 'reject') {
        handleRejectConflict(conflictId)
      }
    }
  }, [mergeMode])

  const handleAcceptConflict = useCallback((conflictId) => {
    if (!editor || !conflictId) return
    
    const html = editor.getHTML()
    // Remove the reject span and keep accept span content
    const updatedHTML = html.replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="reject"[^>]*>.*?</span>`, 'g'),
      ''
    ).replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="accept"[^>]*>(.*?)</span>`, 'g'),
      '$1'
    )
    
    editor.commands.setContent(updatedHTML)
    if (setContent) setContent(updatedHTML)
  }, [editor, setContent])

  const handleRejectConflict = useCallback((conflictId) => {
    if (!editor || !conflictId) return
    
    const html = editor.getHTML()
    // Remove the accept span and keep reject span content
    const updatedHTML = html.replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="accept"[^>]*>.*?</span>`, 'g'),
      ''
    ).replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="reject"[^>]*>(.*?)</span>`, 'g'),
      '$1'
    )
    
    editor.commands.setContent(updatedHTML)
    if (setContent) setContent(updatedHTML)
  }, [editor, setContent])

  const handleAcceptAll = useCallback(() => {
    if (!editor) return
    
    const html = editor.getHTML()
    const updatedHTML = html
      .replace(/<span[^>]*data-type="reject"[^>]*>.*?<\/span>/g, '')
      .replace(/<span[^>]*data-type="accept"[^>]*>(.*?)<\/span>/g, '$1')
    
    editor.commands.setContent(updatedHTML)
    if (setContent) setContent(updatedHTML)
  }, [editor, setContent])

  const handleRejectAll = useCallback(() => {
    if (!editor) return
    
    const html = editor.getHTML()
    const updatedHTML = html
      .replace(/<span[^>]*data-type="accept"[^>]*>.*?<\/span>/g, '')
      .replace(/<span[^>]*data-type="reject"[^>]*>(.*?)<\/span>/g, '$1')
    
    editor.commands.setContent(updatedHTML)
    if (setContent) setContent(updatedHTML)
  }, [editor, setContent])

  const handleExitMerge = useCallback(() => {
    if (!editor) return
    
    const html = editor.getHTML()
    const cleanHTML = html.replace(/<span[^>]*data-conflict[^>]*>(.*?)<\/span>/g, '$1')
    
    editor.commands.setContent(cleanHTML)
    if (setContent) setContent(cleanHTML)
  }, [editor, setContent])

  // Update editor content when prop changes
  React.useEffect(() => {
    if (editor && content !== undefined && !mergeMode && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content, mergeMode])

  // Update merge content when merge mode changes
  React.useEffect(() => {
    if (editor && mergeMode && mergeContent) {
      editor.commands.setContent(mergeContent)
    }
  }, [editor, mergeMode, mergeContent])

  return (
    <div className="w-full h-full border border-blue-200 rounded-md bg-white flex flex-col relative">
      <MenuBar 
        editor={editor} 
        mergeMode={mergeMode}
        onExitMerge={handleExitMerge}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        onSTTStateChange={setSttState}
      />
      <EditorContent 
        className={`p-4 text-black flex-1 focus-within:outline-none overflow-auto ${
          mergeMode ? 'cursor-pointer select-none' : ''
        }`}
        editor={editor}
        onClick={handleEditorClick}
      />
      
      {/* Audio Recorder Visual Section */}
      {!mergeMode && (
        <>
          {/* Initial Dictation Tip */}
          {showInitialTip && !sttState.isListening && (
            <div className="border-t border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 flex items-center justify-between animate-slide-down">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎤</span>
                <span className="text-sm font-medium text-blue-800">
                  Pro Tip: Hold <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-bold shadow-sm">{keySymbol}</kbd> {keyName} anywhere to start dictating instantly!
                </span>
              </div>
              <button
                onClick={() => setShowInitialTip(false)}
                className="text-blue-400 hover:text-blue-600 transition-colors text-lg"
                title="Dismiss tip"
              >
                ×
              </button>
            </div>
          )}

          {/* Recording Status */}
          {(sttState.isListening || sttState.isLoading) && (
            <div className="border-t border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="flex items-center space-x-2">
                  <AudioWaveform isActive={sttState.isListening} audioLevel={audioLevel} />
                  <span className="text-sm font-medium text-blue-700">
                    {sttState.isLoading ? 'Initializing...' : 'Listening...'}
                  </span>
                  {sttState.transcript && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      "{sttState.transcript}"
                    </span>
                  )}
                </div>
              </div>
              {/* Pro tip during listening */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  💡 Next time, just hold <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-bold shadow-sm mx-1">{keySymbol}</kbd> {keyName} to start dictating instantly!
                </span>
              </div>
            </div>
          )}
          
          {/* User Guidance */}
          <div className="border-t border-blue-100 bg-gray-50 px-3 py-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <span>💡 <strong>Quick Dictation:</strong> Click the microphone button or hold <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium shadow-sm animate-pulse">{keySymbol}</kbd> <strong>{keyName}</strong> to start dictating</span>
                {platform && (
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                    {platform === 'mac' ? '🍎 macOS' : platform === 'windows' ? '🪟 Windows' : '🐧 Linux'}
                  </span>
                )}
              </div>
              {sttState.error && (
                <span className="text-red-600 bg-red-100 px-2 py-1 rounded">
                  {sttState.error}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}