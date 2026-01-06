'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ExamSettings() {
  const [exam, setExam] = useState<{ id: string; title: string; chat_question_index: number | null; is_active?: boolean } | null>(null)
  const [examTitle, setExamTitle] = useState('')
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
        <CardTitle>Exam Title</CardTitle>
        <CardDescription>
          Set the exam name (chat will appear on question 4)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Input
            id="title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Enter exam title"
            className="text-lg"
          />
        </div>

        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save Title'}
        </Button>
      </CardContent>
    </Card>
  )
}
