'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Question, EXAMPLE_QUESTIONS_JSON } from '@/lib/schemas'
import { Trash2, Download, Plus } from 'lucide-react'
import QuestionBuilder from './QuestionBuilder'

export default function QuestionsManager() {
  const [exam, setExam] = useState<{ id: string; title: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBuilder, setShowBuilder] = useState(false)

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

  const handleSaveQuestion = async (newQuestion: any) => {
    try {
      const newQuestions = [...questions, { ...newQuestion, order_index: questions.length }]
      await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: newQuestions }),
      })
      await loadQuestions()
      setShowBuilder(false)
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  if (showBuilder) {
    return (
      <div className="space-y-6">
        <QuestionBuilder
          onSave={handleSaveQuestion}
          onCancel={() => setShowBuilder(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questions Manager</CardTitle>
              <CardDescription>
                Create questions visually or import JSON
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </Badge>
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visual" className="w-full">
            <TabsList>
              <TabsTrigger value="visual">Visual Builder</TabsTrigger>
              <TabsTrigger value="json">JSON Import/Export</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                  <p className="text-gray-500 mb-4">No questions yet</p>
                  <Button onClick={() => setShowBuilder(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1 bg-gray-900 text-white">{index + 1}</Badge>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{question.question_text}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{question.question_type}</Badge>
                            {question.options?.options && (
                              <Badge variant="secondary">
                                {question.options.options.length} options
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Question Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Multiple Choice</h4>
              <p className="text-xs text-gray-600">Single correct answer from options</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Multiple Select</h4>
              <p className="text-xs text-gray-600">Multiple correct answers</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">True/False</h4>
              <p className="text-xs text-gray-600">Boolean answer</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Categorization</h4>
              <p className="text-xs text-gray-600">Drag and drop matching</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Text Input</h4>
              <p className="text-xs text-gray-600">Short answer field</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Essay</h4>
              <p className="text-xs text-gray-600">Long form text</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Essay (Rich Text)</h4>
              <p className="text-xs text-gray-600">With formatting toolbar</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-1">Code</h4>
              <p className="text-xs text-gray-600">Monospace coding area</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
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
