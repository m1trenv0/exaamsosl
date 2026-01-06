'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface QuestionBuilderProps {
  onSave: (question: any) => void
  onCancel: () => void
}

export default function QuestionBuilder({ onSave, onCancel }: QuestionBuilderProps) {
  const [questionType, setQuestionType] = useState<string>('multiple_choice')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<string[]>(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number | number[]>(0)
  const [categories, setCategories] = useState([
    { name: 'Category 1', items: [''] },
    { name: 'Category 2', items: [''] }
  ])
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([''])
  const [wordLimitMin, setWordLimitMin] = useState(100)
  const [wordLimitMax, setWordLimitMax] = useState(150)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddCategory = () => {
    setCategories([...categories, { name: `Category ${categories.length + 1}`, items: [''] }])
  }

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const handleCategoryNameChange = (index: number, value: string) => {
    const newCategories = [...categories]
    newCategories[index].name = value
    setCategories(newCategories)
  }

  const handleCategoryItemChange = (catIndex: number, itemIndex: number, value: string) => {
    const newCategories = [...categories]
    newCategories[catIndex].items[itemIndex] = value
    setCategories(newCategories)
  }

  const handleAddCategoryItem = (catIndex: number) => {
    const newCategories = [...categories]
    newCategories[catIndex].items.push('')
    setCategories(newCategories)
  }

  const handleRemoveCategoryItem = (catIndex: number, itemIndex: number) => {
    const newCategories = [...categories]
    newCategories[catIndex].items = newCategories[catIndex].items.filter((_, i) => i !== itemIndex)
    setCategories(newCategories)
  }

  const handleAddPossibleAnswer = () => {
    setPossibleAnswers([...possibleAnswers, ''])
  }

  const handleRemovePossibleAnswer = (index: number) => {
    setPossibleAnswers(possibleAnswers.filter((_, i) => i !== index))
  }

  const handlePossibleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...possibleAnswers]
    newAnswers[index] = value
    setPossibleAnswers(newAnswers)
  }

  const handleMultipleSelectToggle = (index: number) => {
    const current = Array.isArray(correctAnswer) ? correctAnswer : []
    if (current.includes(index)) {
      setCorrectAnswer(current.filter(i => i !== index))
    } else {
      setCorrectAnswer([...current, index])
    }
  }

  const handleSave = () => {
    const question: any = {
      question_text: questionText,
      question_type: questionType,
      options: {}
    }

    switch (questionType) {
      case 'multiple_choice':
        question.options = {
          options: options.filter(o => o.trim()),
          correct: typeof correctAnswer === 'number' ? correctAnswer : 0
        }
        break
      case 'multiple_select':
        question.options = {
          options: options.filter(o => o.trim()),
          correct: Array.isArray(correctAnswer) ? correctAnswer : []
        }
        break
      case 'true_false':
        question.options = {
          correct: typeof correctAnswer === 'number' ? correctAnswer : 0
        }
        break
      case 'categorization':
        question.options = {
          categories: categories.map(cat => ({
            name: cat.name,
            items: cat.items.filter(item => item.trim())
          })),
          possibleAnswers: possibleAnswers.filter(a => a.trim())
        }
        break
      case 'essay_rich':
        question.options = {
          wordLimit: { min: wordLimitMin, max: wordLimitMax }
        }
        break
    }

    onSave(question)
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create New Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Type */}
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="multiple_select">Multiple Select</SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="categorization">Categorization</SelectItem>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
              <SelectItem value="essay_rich">Essay (Rich Text)</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <Label>Question Text</Label>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here..."
            rows={3}
          />
        </div>

        {/* Multiple Choice Options */}
        {questionType === 'multiple_choice' && (
          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={correctAnswer === index}
                  onChange={() => setCorrectAnswer(index)}
                  className="w-4 h-4"
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </div>
        )}

        {/* Multiple Select Options */}
        {questionType === 'multiple_select' && (
          <div className="space-y-2">
            <Label>Options (select correct answers)</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(correctAnswer) && correctAnswer.includes(index)}
                  onChange={() => handleMultipleSelectToggle(index)}
                  className="w-4 h-4"
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </div>
        )}

        {/* True/False */}
        {questionType === 'true_false' && (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={correctAnswer === 0}
                  onChange={() => setCorrectAnswer(0)}
                  className="w-4 h-4"
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={correctAnswer === 1}
                  onChange={() => setCorrectAnswer(1)}
                  className="w-4 h-4"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )}

        {/* Categorization */}
        {questionType === 'categorization' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Categories</Label>
              {categories.map((category, catIndex) => (
                <div key={catIndex} className="border rounded p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={category.name}
                      onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                      placeholder="Category name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(catIndex)}
                      disabled={categories.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="pl-4 space-y-2">
                    <Label className="text-xs">Correct items for this category:</Label>
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleCategoryItemChange(catIndex, itemIndex, e.target.value)}
                          placeholder="Item"
                          size={32}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCategoryItem(catIndex, itemIndex)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCategoryItem(catIndex)}
                    >
                      <Plus className="w-3 h-3 mr-2" /> Add Item
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </Button>
            </div>

            <div className="space-y-2">
              <Label>All Possible Answers (including distractors)</Label>
              {possibleAnswers.map((answer, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={answer}
                    onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePossibleAnswer(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddPossibleAnswer}>
                <Plus className="w-4 h-4 mr-2" /> Add Answer
              </Button>
            </div>
          </div>
        )}

        {/* Essay Rich Text Options */}
        {questionType === 'essay_rich' && (
          <div className="space-y-2">
            <Label>Word Limit</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-xs">Minimum</Label>
                <Input
                  type="number"
                  value={wordLimitMin}
                  onChange={(e) => setWordLimitMin(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Maximum</Label>
                <Input
                  type="number"
                  value={wordLimitMax}
                  onChange={(e) => setWordLimitMax(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={!questionText.trim()}>
            Save Question
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
