"use client"

import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState, useCallback, useMemo } from 'react'

// Word-level diff algorithm implementation
class WordDiff {
  static computeDiff(original, modified) {
    // Convert HTML to plain text for comparison
    const originalText = this.htmlToText(original)
    const modifiedText = this.htmlToText(modified)
    
    const originalWords = this.tokenize(originalText)
    const modifiedWords = this.tokenize(modifiedText)
    
    // Use Myers diff algorithm for better word-level comparison
    return this.myersDiff(originalWords, modifiedWords)
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
    let conflictId = 0
    
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
            content: original[x - 1],
            conflictId: `conflict-${conflictId++}`
          })
          x--
        } else {
          result.unshift({
            type: 'insert',
            content: modified[y - 1],
            conflictId: `conflict-${conflictId++}`
          })
          y--
        }
      }
    }
    
    return result
  }
  
  static generateMergeHTML(diffResult) {
    return diffResult.map(item => {
      if (item.type === 'equal') {
        return this.escapeHtml(item.content)
      } else if (item.type === 'insert') {
        return `<span data-conflict="${item.conflictId}" data-type="accept" class="bg-green-200 text-green-800 hover:bg-green-300 px-1 rounded cursor-pointer transition-all duration-200 relative inline-block">${this.escapeHtml(item.content)}</span>`
      } else if (item.type === 'delete') {
        return `<span data-conflict="${item.conflictId}" data-type="reject" class="bg-red-200 text-red-800 hover:bg-red-300 px-1 rounded cursor-pointer transition-all duration-200 relative inline-block">${this.escapeHtml(item.content)}</span>`
      }
    }).join('')
  }
  
  static escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Hover tooltip component
const HoverTooltip = ({ visible, x, y, type, onAccept, onReject }) => {
  if (!visible) return null
  
  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex space-x-2 pointer-events-none"
      style={{ left: x, top: y - 70 }}
    >
      <button
        onClick={onAccept}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors pointer-events-auto"
      >
        Accept
      </button>
      <button
        onClick={onReject}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors pointer-events-auto"
      >
        Reject
      </button>
      <div className="text-xs text-gray-600 flex items-center pointer-events-none">
        {type === 'accept' ? 'New suggestion' : 'Remove this'}
      </div>
    </div>
  )
}

const MenuBar = ({ editor, mergeMode, onExitMerge, onAcceptAll, onRejectAll }) => {
  if (!editor) {
    return null
  }
  
  if (mergeMode) {
    return (
      <div className="control-group border-b border-blue-200 p-3 bg-blue-50">
        <div className="button-group flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-blue-800">Merge Mode: Word-by-word conflict resolution</span>
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
      <div className="button-group flex flex-wrap gap-2">
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
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('bold') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Bold
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('italic') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Italic
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('strike') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Strike
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            editor.isActive('highlight') 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-black border-blue-200 hover:bg-blue-100'
          }`}
        >
          Highlight
        </button>
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

export default ({ content, setContent, mergeMode = false, originalContent = '', modifiedContent = '' }) => {
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    type: null, 
    conflictId: null 
  })
  
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

  // Handle conflict hovers
  const handleEditorMouseMove = useCallback((event) => {
    if (!mergeMode) return
    
    const conflictElement = event.target.closest('[data-conflict]')
    if (conflictElement) {
      const conflictId = conflictElement.getAttribute('data-conflict')
      const type = conflictElement.getAttribute('data-type')
      const rect = conflictElement.getBoundingClientRect()
      
      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2 - 75,
        y: rect.top + window.scrollY,
        type,
        conflictId
      })
    } else {
      setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
    }
  }, [mergeMode])

  const handleEditorMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
  }, [])

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
    setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
    
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
    setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
    
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
      />
      <EditorContent 
        className={`p-4 text-black flex-1 focus-within:outline-none overflow-auto ${
          mergeMode ? 'cursor-pointer select-none' : ''
        }`}
        editor={editor}
        onMouseMove={handleEditorMouseMove}
        onMouseLeave={handleEditorMouseLeave}
      />
      
      <HoverTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        type={tooltip.type}
        onAccept={() => handleAcceptConflict(tooltip.conflictId)}
        onReject={() => handleRejectConflict(tooltip.conflictId)}
      />
    </div>
  )
}