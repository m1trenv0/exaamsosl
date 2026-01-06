'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Exam {
  id: string
  title: string
  chat_question_index: number | null
  is_active: boolean
}

export default function ExamSettings() {
  const [exam, setExam] = useState<Exam | null>(null)
  const [chatQuestionIndex, setChatQuestionIndex] = useState<number>(0)
  const [examTitle, setExamTitle] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const loadSettings = useCallback(async () => {
    try {
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .single()

      if (examData) {
        setExam(examData)
        setExamTitle(examData.title)
        setChatQuestionIndex(examData.chat_question_index ?? 0)
      }

      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('exam_id', examData?.id)

      setTotalQuestions(count || 0)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [supabase])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleSave = async () => {
    if (!exam?.id) return

    setLoading(true)
    try {
      await supabase
        .from('exams')
        .update({
          title: examTitle,
          chat_question_index: chatQuestionIndex,
        })
        .eq('id', exam.id)

      alert('Settings saved successfully!')
      await loadSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Settings</CardTitle>
          <CardDescription>
            Configure exam title and chat settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="examTitle">Exam Title</Label>
            <Input
              id="examTitle"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Practice Exam EN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatQuestion">
              Hidden Chat Question (0-based index)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="chatQuestion"
                type="number"
                min="0"
                max={Math.max(0, totalQuestions - 1)}
                value={chatQuestionIndex}
                onChange={(e) => setChatQuestionIndex(parseInt(e.target.value))}
                className="max-w-xs"
              />
              <div className="text-sm text-gray-600">
                {totalQuestions > 0 && (
                  <span>
                    Question <Badge variant="outline">{chatQuestionIndex + 1}</Badge> of {totalQuestions}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              The hidden chat will appear on this question number (starting from 0)
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exam Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Total Questions</span>
            <Badge>{totalQuestions}</Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-gray-600">Exam Status</span>
            <Badge variant={exam?.is_active ? 'default' : 'secondary'}>
              {exam?.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Chat Question</span>
            <Badge variant="outline">Question {(exam?.chat_question_index ?? 0) + 1}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
