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
  const [categoryAssignments, setCategoryAssignments] = useState<Record<string, string[]>>({})

  // Initialize from answer or empty
  useEffect(() => {
    if (answer) {
      try {
        setCategoryAssignments(JSON.parse(answer))
      } catch {
        const initial: Record<string, string[]> = {}
        categories.forEach(cat => {
          initial[cat.name] = []
        })
        setCategoryAssignments(initial)
      }
    } else {
      const initial: Record<string, string[]> = {}
      categories.forEach(cat => {
        initial[cat.name] = []
      })
      setCategoryAssignments(initial)
    }
  }, [categories, answer])

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
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(category.name)}
          >
            <h4 className="font-semibold text-sm text-gray-700 mb-3">{category.name}</h4>
            <div className="space-y-2 min-h-[60px]">
              {(categoryAssignments[category.name] || []).map((item) => (
                <div
                  key={item}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  className="bg-white border border-gray-300 rounded px-3 py-2 text-sm cursor-move hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    {item}
                  </span>
                  <button
                    onClick={() => removeFromCategory(category.name, item)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Possible Answers */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-sm text-gray-600 mb-3">
          Drag Uncategorized Answers Here
        </h4>
        <div className="flex flex-wrap gap-2">
          {getUncategorizedItems().map((item) => (
            <div
              key={item}
              draggable
              onDragStart={() => handleDragStart(item)}
              className="bg-white border border-gray-300 rounded px-3 py-2 text-sm cursor-move hover:shadow-md transition-shadow flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              {item}
            </div>
          ))}
          {getUncategorizedItems().length === 0 && (
            <p className="text-gray-400 text-sm">All items categorized</p>
          )}
        </div>
      </div>
    </div>
  )
}
