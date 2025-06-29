"use client"

import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState, useCallback, useMemo } from 'react'

// Custom extension for conflict highlighting
import { Node, mergeAttributes } from '@tiptap/core'

const ConflictHighlight = Node.create({
  name: 'conflictHighlight',
  
  group: 'inline',
  inline: true,
  
  addAttributes() {
    return {
      type: {
        default: 'accept', // 'accept', 'reject', 'neutral'
      },
      conflictId: {
        default: null,
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-conflict]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    const { type, conflictId } = HTMLAttributes
    const className = type === 'accept' ? 'bg-green-200 text-green-800 hover:bg-green-300' : 
                     type === 'reject' ? 'bg-red-200 text-red-800 hover:bg-red-300' : 
                     'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
    
    return ['span', mergeAttributes(HTMLAttributes, {
      'data-conflict': conflictId,
      'data-type': type,
      'class': `${className} px-1 rounded cursor-pointer transition-colors duration-200 relative`,
      'title': type === 'accept' ? 'Click to accept this change' : 
               type === 'reject' ? 'Click to reject this change' : 'Conflicted change'
    }), 0]
  },
})

// Word-level diff algorithm implementation
class WordDiff {
  static computeDiff(original, modified) {
    const originalWords = this.tokenize(original)
    const modifiedWords = this.tokenize(modified)
    
    // Simple LCS-based diff algorithm
    const matrix = this.buildLCSMatrix(originalWords, modifiedWords)
    return this.extractDiff(originalWords, modifiedWords, matrix)
  }
  
  static tokenize(text) {
    // Split by words and preserve whitespace
    return text.match(/\S+|\s+/g) || []
  }
  
  static buildLCSMatrix(arr1, arr2) {
    const matrix = Array(arr1.length + 1).fill(null).map(() => 
      Array(arr2.length + 1).fill(0)
    )
    
    for (let i = 1; i <= arr1.length; i++) {
      for (let j = 1; j <= arr2.length; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1])
        }
      }
    }
    
    return matrix
  }
  
  static extractDiff(arr1, arr2, matrix) {
    const result = []
    let i = arr1.length
    let j = arr2.length
    let conflictId = 0
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
        result.unshift({ type: 'equal', content: arr1[i - 1] })
        i--
        j--
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        result.unshift({ 
          type: 'accept', 
          content: arr2[j - 1], 
          conflictId: `conflict-${conflictId++}` 
        })
        j--
      } else if (i > 0) {
        result.unshift({ 
          type: 'reject', 
          content: arr1[i - 1], 
          conflictId: `conflict-${conflictId++}` 
        })
        i--
      }
    }
    
    return result
  }
  
  static generateMergeHTML(diffResult) {
    return diffResult.map(item => {
      if (item.type === 'equal') {
        return item.content
      } else {
        return `<span data-conflict="${item.conflictId}" data-type="${item.type}" class="${
          item.type === 'accept' ? 'bg-green-200 text-green-800 hover:bg-green-300' : 
          'bg-red-200 text-red-800 hover:bg-red-300'
        } px-1 rounded cursor-pointer transition-colors duration-200" title="${
          item.type === 'accept' ? 'Click to accept this change' : 'Click to reject this change'
        }">${item.content}</span>`
      }
    }).join('')
  }
}

// Conflict tooltip component
const ConflictTooltip = ({ visible, x, y, type, onAccept, onReject }) => {
  if (!visible) return null
  
  return (
    <div 
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex space-x-2"
      style={{ left: x, top: y - 60 }}
    >
      <button
        onClick={onAccept}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Accept
      </button>
      <button
        onClick={onReject}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Reject
      </button>
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
          <span className="text-sm font-medium text-blue-800">Merge Mode: Resolve Conflicts</span>
          <button 
            onClick={onAcceptAll}
            className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Accept All
          </button>
          <button 
            onClick={onRejectAll}
            className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Reject All
          </button>
          <button 
            onClick={onExitMerge}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Exit Merge
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
    return WordDiff.generateMergeHTML(diffResult)
  }, [mergeMode, originalContent, modifiedContent, content])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      ConflictHighlight,
    ],
    content: mergeMode ? mergeContent : (content || `<p>Start typing your document here...</p>`),
    editable: !mergeMode,
    onUpdate: ({ editor }) => {
      if (setContent && !mergeMode) {
        setContent(editor.getHTML())
      }
    },
  })

  // Handle conflict clicks and hovers
  const handleEditorClick = useCallback((event) => {
    const conflictElement = event.target.closest('[data-conflict]')
    if (conflictElement && mergeMode) {
      const conflictId = conflictElement.getAttribute('data-conflict')
      const type = conflictElement.getAttribute('data-type')
      const rect = conflictElement.getBoundingClientRect()
      
      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2 - 50,
        y: rect.top,
        type,
        conflictId
      })
    } else {
      setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
    }
  }, [mergeMode])

  const handleAcceptConflict = useCallback((conflictId) => {
    if (!editor || !conflictId) return
    
    const html = editor.getHTML()
    const updatedHTML = html.replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="reject"[^>]*>.*?</span>`, 'g'),
      ''
    ).replace(
      new RegExp(`<span([^>]*data-conflict="${conflictId}"[^>]*data-type="accept"[^>]*)>(.*?)</span>`, 'g'),
      '$2'
    )
    
    editor.commands.setContent(updatedHTML)
    setTooltip({ visible: false, x: 0, y: 0, type: null, conflictId: null })
    
    if (setContent) setContent(updatedHTML)
  }, [editor, setContent])

  const handleRejectConflict = useCallback((conflictId) => {
    if (!editor || !conflictId) return
    
    const html = editor.getHTML()
    const updatedHTML = html.replace(
      new RegExp(`<span[^>]*data-conflict="${conflictId}"[^>]*data-type="accept"[^>]*>.*?</span>`, 'g'),
      ''
    ).replace(
      new RegExp(`<span([^>]*data-conflict="${conflictId}"[^>]*data-type="reject"[^>]*)>(.*?)</span>`, 'g'),
      '$2'
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
        onClick={handleEditorClick}
      />
      
      <ConflictTooltip
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