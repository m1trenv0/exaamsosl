'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/auth'
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

      setJsonInput('')
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

    try {
      await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: [] }),
      })
      await loadQuestions()
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questions Manager</CardTitle>
              <CardDescription>
                Import/Export questions in JSON format
              </CardDescription>
            </div>
            <Badge variant="outline">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={EXAMPLE_QUESTIONS_JSON}
            className="font-mono text-sm min-h-[300px]"
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImportQuestions}
              disabled={loading || !jsonInput.trim()}
            >
              {loading ? 'Importing...' : 'Import Questions'}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportQuestions}
              disabled={questions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Current
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={questions.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No questions yet. Import some questions to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">{index + 1}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">{question.question_text}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: {question.question_type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Format Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="text-xs">
{`{
  "questions": [
    {
      "order_index": 1,
      "question_text": "What is React?",
      "question_type": "multiple_choice",
      "options": {
        "options": ["Library", "Framework", "Language"],
        "correct": 0
      }
    }
  ]
}`}
            </pre>
            <p className="text-xs text-gray-600 mt-2">
              <strong>question_type:</strong> &quot;multiple_choice&quot;, &quot;text&quot;, &quot;essay&quot;, or &quot;code&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
