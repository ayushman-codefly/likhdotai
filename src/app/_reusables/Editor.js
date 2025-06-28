"use client"

import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
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

export default ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: content || `<p>Start typing your document here...</p>`,
    onUpdate: ({ editor }) => {
      if (setContent) {
        setContent(editor.getHTML())
      }
    },
  })

  // Update editor content when prop changes
  React.useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return (
    <div className="w-full h-full border border-blue-200 rounded-md bg-white flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent 
        className="p-4 text-black flex-1 focus-within:outline-none overflow-auto" 
        editor={editor} 
      />
    </div>
  )
}