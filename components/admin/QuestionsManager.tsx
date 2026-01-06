'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Question, EXAMPLE_QUESTIONS_JSON } from '@/lib/schemas'
import { Trash2, Download } from 'lucide-react'

export default function QuestionsManager() {
  const [exam, setExam] = useState<{ id: string; title: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions')
      const data = await response.json()
      
      if (data.exam && data.questions) {
        setExam(data.exam)
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    }
  }

  const handleImportQuestions = async () => {
    if (!exam?.id) {
      setError('No active exam found')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const parsed = JSON.parse(jsonInput) as { questions?: Question[] }
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid format. Expected { questions: [...] }')
      }

      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: parsed.questions }),
      })

      if (!response.ok) throw new Error('Failed to import')

      setSuccess(`Successfully imported ${parsed.questions.length} questions`)
      await loadQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import questions')
    } finally {
      setLoading(false)
    }
  }

  const handleExportQuestions = () => {
    const exportData = {
      questions: questions.map(q => ({
        order_index: q.order_index,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        metadata: q.metadata,
      })),
    }
    setJsonInput(JSON.stringify(exportData, null, 2))
  }

  const handleDeleteAll = async () => {
    if (!confirm('Delete all questions? This cannot be undone.')) return

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: [] }),
      })
      setSuccess('All questions deleted')
      await loadQuestions()
    } catch (error) {
      setError('Error deleting questions')
      console.error('Error deleting questions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Questions (JSON)</CardTitle>
            <CardDescription>
              Paste JSON with questions array
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-base">
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={EXAMPLE_QUESTIONS_JSON}
          className="font-mono text-sm min-h-[400px]"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-medium">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded text-sm font-medium">
            ✅ {success}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleImportQuestions}
            disabled={loading || !jsonInput.trim()}
            size="lg"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportQuestions}
            disabled={questions.length === 0}
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={questions.length === 0 || loading}
            size="lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
