'use client'

import { useState, useEffect } from 'react'
import BrowserChrome from './BrowserChrome'
import CanvasSidebar from './CanvasSidebar'
import QuestionNavigation from './QuestionNavigation'
import QuestionCard from './QuestionCard'
import Taskbar from './Taskbar'
import { Question, Exam } from '@/lib/schemas'

export default function ExamInterface() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
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
  const isChatQuestion = exam?.chat_question_index === currentQuestionIndex + 1

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
      <BrowserChrome title={exam?.title || 'Exam'}>
        <div className="flex-1 flex overflow-hidden">
          <CanvasSidebar />
          
          <QuestionNavigation
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={setCurrentQuestionIndex}
          />
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {/* Top Action Bar */}
              <div className="flex justify-end items-center mb-6">
                <div className="flex space-x-2">
                  <button className="bg-white border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 font-medium hover:bg-gray-50">Return</button>
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex >= questions.length - 1}
                    className="bg-white border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  answer={answers[currentQuestion.id!] || ''}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id!, answer)}
                  onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  hasPrevious={currentQuestionIndex > 0}
                  hasNext={currentQuestionIndex < questions.length - 1}
                  isChatQuestion={isChatQuestion}
                  onChatToggle={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      </BrowserChrome>

      <Taskbar examTitle={exam?.title || 'Exam'} />
    </div>
  )
}
