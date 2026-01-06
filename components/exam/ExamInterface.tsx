'use client'

import { useState, useEffect } from 'react'
import BrowserChrome from './BrowserChrome'
import CanvasSidebar from './CanvasSidebar'
import QuestionNavigation from './QuestionNavigation'
import QuestionCard from './QuestionCard'
import HiddenChat from './HiddenChat'
import Taskbar from './Taskbar'
import { Question, Exam } from '@/lib/schemas'

export default function ExamInterface() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [chatOpen, setChatOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExam()
  }, [])

  const loadExam = async () => {
    try {
      const response = await fetch('/api/exam')
      const data = await response.json()

      if (data.exam && data.questions) {
        setExam(data.exam)
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error('Error loading exam:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Save to database
    if (exam?.id) {
      try {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exam_id: exam.id,
            question_id: questionId,
            answer_text: answer,
          }),
        })
      } catch (error) {
        console.error('Error saving answer:', error)
      }
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const showChat = exam?.chat_question_index === currentQuestionIndex + 1

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading exam...</div>
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">No active exam found</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BrowserChrome />
      
      <div className="flex-1 flex overflow-hidden">
        <CanvasSidebar />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto bg-white">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {exam.title}
                </h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  answer={answers[currentQuestion.id!] || ''}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id!, answer)}
                />
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <QuestionNavigation
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        </div>
      </div>

      {showChat && chatOpen && exam.id && (
        <HiddenChat
          examId={exam.id}
          onClose={() => setChatOpen(false)}
        />
      )}

      {showChat && !chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          💬 Chat
        </button>
      )}

      <Taskbar />
    </div>
  )
}
