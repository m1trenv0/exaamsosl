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

  const onPrevious = () => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
  const onNext = () => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))

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
          
          <div className="flex-1 flex overflow-hidden">
            <QuestionNavigation
              questions={questions}
              currentIndex={currentQuestionIndex}
              answers={answers}
              onQuestionSelect={setCurrentQuestionIndex}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F5F5]">
              {/* Top Bar with Return and Next */}
              <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#C7CDD1]">
                <div className="flex items-center gap-4">
                  {/* Mute/unmute icon */}
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </button>
                  {/* Navigation arrows */}
                  <div className="flex items-center gap-1 text-gray-400">
                    <span>→</span>
                    <span>|</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onPrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-1.5 border border-[#C7CDD1] rounded text-[13px] text-gray-700 bg-[#F5F5F5] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Return
                  </button>
                  <button 
                    onClick={onNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-4 py-1.5 border border-[#C7CDD1] rounded text-[13px] text-gray-700 bg-[#F5F5F5] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
              
              {/* Question Content Area */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl">
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
