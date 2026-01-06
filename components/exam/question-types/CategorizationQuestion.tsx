'use client'

import { useState, useEffect } from 'react'

interface Category {
  name: string
  items: string[]
}

interface CategorizationQuestionProps {
  categories: Category[]
  possibleAnswers: string[]
  answer: string
  onAnswerChange: (answer: string) => void
}

export default function CategorizationQuestion({
  categories,
  possibleAnswers,
  answer,
  onAnswerChange
}: CategorizationQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  
  const getInitialAssignments = () => {
    if (answer) {
      try {
        return JSON.parse(answer)
      } catch {
        const initial: Record<string, string[]> = {}
        categories.forEach(cat => {
          initial[cat.name] = []
        })
        return initial
      }
    }
    const initial: Record<string, string[]> = {}
    categories.forEach(cat => {
      initial[cat.name] = []
    })
    return initial
  }
  
  const [categoryAssignments, setCategoryAssignments] = useState<Record<string, string[]>>(getInitialAssignments)

  // Update on answer change from outside
  useEffect(() => {
    if (answer) {
      try {
        const parsed = JSON.parse(answer)
        // Use functional update to avoid direct setState in effect
        setCategoryAssignments((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
            return parsed
          }
          return prev
        })
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [answer])

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDrop = (categoryName: string) => {
    if (!draggedItem) return

    const newAssignments = { ...categoryAssignments }
    
    // Remove from all categories
    Object.keys(newAssignments).forEach(key => {
      if (newAssignments[key]) {
        newAssignments[key] = newAssignments[key].filter(item => item !== draggedItem)
      }
    })
    
    // Add to new category
    if (!newAssignments[categoryName]) {
      newAssignments[categoryName] = []
    }
    newAssignments[categoryName].push(draggedItem)
    
    setCategoryAssignments(newAssignments)
    onAnswerChange(JSON.stringify(newAssignments))
    setDraggedItem(null)
  }

  const removeFromCategory = (categoryName: string, item: string) => {
    const newAssignments = { ...categoryAssignments }
    if (newAssignments[categoryName]) {
      newAssignments[categoryName] = newAssignments[categoryName].filter(i => i !== item)
    }
    setCategoryAssignments(newAssignments)
    onAnswerChange(JSON.stringify(newAssignments))
  }

  const getUncategorizedItems = () => {
    const assigned = new Set(
      Object.values(categoryAssignments).flat()
    )
    return possibleAnswers.filter(item => !assigned.has(item))
  }

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="grid grid-cols-2 gap-6">
        {categories.map((category) => {
          const hasItems = (categoryAssignments[category.name] || []).length > 0
          return (
            <div key={category.name} className="space-y-2">
              <h4 className="font-semibold text-[15px] text-gray-800 mb-2">{category.name}</h4>
              <div
                className="border border-gray-300 rounded bg-white min-h-[120px] p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(category.name)}
              >
                {!hasItems && (
                  <p className="text-gray-400 text-center py-8 text-sm">No Answers Chosen</p>
                )}
                <div className="space-y-2">
                  {(categoryAssignments[category.name] || []).map((item) => (
                    <div
                      key={item}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      className="bg-yellow-100 border border-gray-300 rounded px-3 py-2 text-[14px] cursor-move hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => removeFromCategory(category.name, item)}
                        className="text-gray-400 hover:text-red-500 text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Possible Answers */}
      <div className="mt-6">
        <h4 className="font-semibold text-[15px] text-gray-800 mb-3">
          Possible answers
        </h4>
        <div className="border border-gray-300 rounded bg-gray-50 p-4 min-h-[80px]">
          <div className="flex flex-wrap gap-3">
            {getUncategorizedItems().map((item) => (
              <div
                key={item}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-white border border-gray-300 rounded px-4 py-2 text-[14px] cursor-move hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                {item}
              </div>
            ))}
            {getUncategorizedItems().length === 0 && (
              <p className="text-gray-400 text-sm">All items have been categorized</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
