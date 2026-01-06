'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ExamSettings() {
  const [exam, setExam] = useState<{ id: string; title: string; chat_question_index: number | null; is_active?: boolean } | null>(null)
  const [chatQuestionIndex, setChatQuestionIndex] = useState<number>(0)
  const [examTitle, setExamTitle] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(0)
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
        setChatQuestionIndex(data.exam.chat_question_index || 0)
        setTotalQuestions(data.questionCount || 0)
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
          chat_question_index: chatQuestionIndex,
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
          Configure exam title and chat visibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Exam Title</Label>
          <Input
            id="title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Enter exam title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chatQuestion">
            Show Chat on Question Number
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="chatQuestion"
              type="number"
              min="0"
              max={totalQuestions}
              value={chatQuestionIndex}
              onChange={(e) => setChatQuestionIndex(parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-sm text-gray-500">
              (0 = disabled, max: {totalQuestions})
            </span>
          </div>
          {chatQuestionIndex > 0 && chatQuestionIndex <= totalQuestions && (
            <p className="text-sm text-blue-600">
              Chat will appear on question #{chatQuestionIndex}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Total Questions: {totalQuestions}
          </Badge>
          <Badge variant={exam?.is_active ? 'default' : 'secondary'}>
            {exam?.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <Button onClick={handleSave} disabled={loading || !exam}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  )
}
