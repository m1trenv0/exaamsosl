'use client'

import { useState, useEffect } from 'react'
import BrowserChrome from './BrowserChrome'
import CanvasSidebar from './CanvasSidebar'
import QuestionNavigation from './QuestionNavigation'
import QuestionCard from './QuestionCard'
import HiddenChat from '@/components/HiddenChat'
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
      <BrowserChrome title={exam?.title || 'Exam'}>
        <div className="flex-1 flex overflow-hidden">
          <CanvasSidebar />
          
          <QuestionNavigation
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={setCurrentQuestionIndex}
            examTitle={exam.title}
          />
          
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
                  questionNumber={currentQuestionIndex + 1}
                  answer={answers[currentQuestion.id!] || ''}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id!, answer)}
                  onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  hasPrevious={currentQuestionIndex > 0}
                  hasNext={currentQuestionIndex < questions.length - 1}
                  isChatQuestion={exam?.chat_question_index === currentQuestionIndex + 1}
                  onChatToggle={() => setChatOpen(!chatOpen)}
                />
              )}
            </div>
          </div>
        </div>
      </BrowserChrome>

      {showChat && chatOpen && exam.id && (
        <HiddenChat />
      )}

      {showChat && !chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          💬 Chat
        </button>
      )}

      <Taskbar examTitle={exam?.title || 'Exam'} />
    </div>
  )
}
