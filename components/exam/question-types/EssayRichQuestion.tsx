'use client'

import { useEffect, useRef, useState } from 'react'

interface EssayRichQuestionProps {
  answer: string
  onAnswerChange: (answer: string) => void
  wordLimit?: { min?: number; max?: number }
}

interface ToolbarButtonProps {
  active?: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
}

const ToolbarButton = ({ active, onClick, icon, title }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-gray-300' : ''}`}
  >
    {icon}
  </button>
)

export default function EssayRichQuestion({ 
  answer, 
  onAnswerChange,
  wordLimit 
}: EssayRichQuestionProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && answer) {
      editorRef.current.innerHTML = answer
    }
  }, [answer])

  const updateWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    const words = plainText.split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onAnswerChange(content)
      updateWordCount(content)
      updateToolbarState()
    }
  }

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateToolbarState()
  }

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      handleFormat('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      handleFormat('insertImage', url)
    }
  }

  const getWordLimitColor = () => {
    if (!wordLimit?.max) return 'text-gray-600'
    if (wordCount > wordLimit.max) return 'text-red-600'
    if (wordLimit.min && wordCount < wordLimit.min) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            active={isBold}
            onClick={() => handleFormat('bold')}
            title="Bold"
            icon={<span className="font-bold text-sm">B</span>}
          />
          <ToolbarButton
            active={isItalic}
            onClick={() => handleFormat('italic')}
            title="Italic"
            icon={<span className="italic text-sm">I</span>}
          />
          <ToolbarButton
            active={isUnderline}
            onClick={() => handleFormat('underline')}
            title="Underline"
            icon={<span className="underline text-sm">U</span>}
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => handleFormat('formatBlock', '<p>')}
            title="Paragraph"
            icon={<span className="text-xs">¶</span>}
          />
          <ToolbarButton
            onClick={() => handleFormat('formatBlock', '<h3>')}
            title="Heading"
            icon={<span className="text-xs font-bold">H</span>}
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => handleFormat('insertUnorderedList')}
            title="Bullet List"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
          <ToolbarButton
            onClick={() => handleFormat('insertOrderedList')}
            title="Numbered List"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
              </svg>
            }
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={insertLink}
            title="Insert Link"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          />
          <ToolbarButton
            onClick={insertImage}
            title="Insert Image"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => handleFormat('undo')}
            title="Undo"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            }
          />
          <ToolbarButton
            onClick={() => handleFormat('redo')}
            title="Redo"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
        className="min-h-[200px] p-4 text-[14px] text-gray-700 focus:outline-none prose prose-sm max-w-none"
        style={{ wordWrap: 'break-word' }}
      />

      {/* Footer with word count */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs text-gray-500">Click to edit</span>
        </div>
        <div className={`text-xs font-medium ${getWordLimitColor()}`}>
          {wordCount} words
          {wordLimit && (
            <span className="text-gray-400 ml-1">
              ({wordLimit.min || 0} min / {wordLimit.max || 0} max)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
