"use client"

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Enter description...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold')
        break
      case 'italic':
        execCommand('italic')
        break
      case 'underline':
        execCommand('underline')
        break
      case 'bulletList':
        execCommand('insertUnorderedList')
        break
      case 'numberList':
        execCommand('insertOrderedList')
        break
      case 'alignLeft':
        execCommand('justifyLeft')
        break
      case 'alignCenter':
        execCommand('justifyCenter')
        break
      case 'alignRight':
        execCommand('justifyRight')
        break
      case 'heading':
        execCommand('formatBlock', 'h3')
        break
      case 'paragraph':
        execCommand('formatBlock', 'p')
        break
    }
  }

  const insertLineBreak = () => {
    execCommand('insertHTML', '<br>')
  }

  const clearFormatting = () => {
    execCommand('removeFormat')
  }

  return (
    <div className={`rich-text-editor border border-border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Underline"
        >
          <Type className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => formatText('bulletList')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('numberList')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => formatText('alignLeft')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('alignCenter')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('alignRight')}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => formatText('heading')}
          className="p-2 hover:bg-muted rounded transition-colors text-sm font-semibold"
          title="Heading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatText('paragraph')}
          className="p-2 hover:bg-muted rounded transition-colors text-sm"
          title="Paragraph"
        >
          P
        </button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <button
          type="button"
          onClick={insertLineBreak}
          className="p-2 hover:bg-muted rounded transition-colors text-sm"
          title="Line Break"
        >
          ↵
        </button>
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 hover:bg-muted rounded transition-colors text-sm"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[120px] p-3 focus:outline-none ${
          isFocused ? 'ring-2 ring-primary/20' : ''
        }`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      {/* Placeholder */}
      {!value && !isFocused && (
        <div className="absolute top-12 left-3 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}
