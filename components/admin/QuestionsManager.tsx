'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Question, EXAMPLE_QUESTIONS_JSON } from '@/lib/schemas'
import { Trash2, Download } from 'lucide-react'

export default function QuestionsManager() {
  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .single()

      if (examData) {
        setExam(examData)

        const { data: questionsData } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', examData.id)
          .order('order_index')

        if (questionsData) {
          setQuestions(questionsData as Question[])
        }
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    }
  }

  const handleImportQuestions = async () => {
    if (!exam) {
      setError('No active exam found')
      return
    }

    setLoading(true)
    setError('')

    try {
      const parsed = JSON.parse(jsonInput)
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid format. Expected { questions: [...] }')
      }

      // Delete existing questions
      await supabase
        .from('questions')
        .delete()
        .eq('exam_id', exam.id)

      // Insert new questions
      const questionsToInsert = parsed.questions.map((q: any) => ({
        exam_id: exam.id,
        order_index: q.order_index,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || null,
      }))

      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert)

      if (error) throw error

      setJsonInput('')
      await loadQuestions()
      alert('Questions imported successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to import questions')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!exam) return
    
    if (!confirm('Are you sure you want to delete all questions?')) return

    try {
      await supabase
        .from('questions')
        .delete()
        .eq('exam_id', exam.id)
      
      await loadQuestions()
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }

  const handleExportQuestions = () => {
    const exportData = {
      questions: questions.map(q => ({
        order_index: q.order_index,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'questions.json'
    a.click()
  }

  const loadExampleJSON = () => {
    setJsonInput(JSON.stringify(EXAMPLE_QUESTIONS_JSON, null, 2))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Questions (JSON)</CardTitle>
          <CardDescription>
            Paste your questions in JSON format. See example below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadExampleJSON}>
              Load Example
            </Button>
            <Button variant="outline" size="sm" onClick={() => setJsonInput('')}>
              Clear
            </Button>
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"questions": [...]}'
            rows={12}
            className="font-mono text-sm"
          />

          <div className="flex gap-2">
            <Button onClick={handleImportQuestions} disabled={loading || !jsonInput.trim()}>
              {loading ? 'Importing...' : 'Import Questions'}
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Expected JSON Format:</p>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`{
  "questions": [
    {
      "order_index": 0,
      "question_text": "What is 2+2?",
      "question_type": "multiple_choice",
      "options": {
        "options": ["2", "3", "4", "5"],
        "correct": 2
      }
    },
    {
      "order_index": 1,
      "question_text": "Explain...",
      "question_type": "essay"
    }
  ]
}`}
            </pre>
            <p className="text-xs text-gray-600 mt-2">
              <strong>question_type:</strong> "multiple_choice", "text", "essay", or "code"
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Questions ({questions.length})</CardTitle>
              <CardDescription>Questions currently in the exam</CardDescription>
            </div>
            <div className="flex gap-2">
              {questions.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExportQuestions}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No questions yet. Import some to get started!</p>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Q{idx + 1}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {q.question_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {q.question_text}
                      </p>
                      {q.options?.options && (
                        <div className="mt-2 text-xs text-gray-600">
                          Options: {q.options.options.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
