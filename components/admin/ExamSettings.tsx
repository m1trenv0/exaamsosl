'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ExamSettings() {
  const [exam, setExam] = useState<{ id: string; title: string; chat_question_index: number | null; chat_question_text?: string | null; is_active?: boolean } | null>(null)
  const [examTitle, setExamTitle] = useState('')
  const [chatQuestionText, setChatQuestionText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.exam) {
        setExam(data.exam)
        setExamTitle(data.exam.title)
        setChatQuestionText(data.exam.chat_question_text || '')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSave = async () => {
    if (!exam?.id) return

    setLoading(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          chat_question_index: 4,
          chat_question_text: chatQuestionText,
        }),
      })

      await loadSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Settings</CardTitle>
        <CardDescription>
          Configure exam title and chat question (chat appears on question 4)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Exam Title
          </label>
          <Input
            id="title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Enter exam title"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="chatQuestion" className="text-sm font-medium">
            Chat Question Text
          </label>
          <textarea
            id="chatQuestion"
            value={chatQuestionText}
            onChange={(e) => setChatQuestionText(e.target.value)}
            placeholder="Enter the question that will appear next to the chat..."
            className="w-full min-h-[120px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className="text-xs text-gray-500">
            This question will be displayed on the left side, with the chat on the right. 
            The chat is only visible when volume is set to 45-55.
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  )
}
