'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  
  const supabase = createClient()

  useEffect(() => {
    loadExam()
  }, [])

  const loadExam = async () => {
    try {
      // Get active exam
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .single()

      if (examData) {
        setExam(examData)

        // Get questions for this exam
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
      console.error('Error loading exam:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Save to database
    if (exam) {
      await supabase
        .from('participant_answers')
        .upsert({
          exam_id: exam.id,
          question_id: questionId,
          answer_text: answer,
        })
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isChatQuestion = exam?.chat_question_index === currentQuestionIndex

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading exam...</div>
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">No active exam found</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BrowserChrome title={exam.title} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <CanvasSidebar />
        
        <QuestionNavigation
          questions={questions}
          currentIndex={currentQuestionIndex}
          onQuestionSelect={setCurrentQuestionIndex}
          answers={answers}
        />

        <main className="flex-1 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-end items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-white border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50"
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
                onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                onNext={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                hasPrevious={currentQuestionIndex > 0}
                hasNext={currentQuestionIndex < questions.length - 1}
                isChatQuestion={isChatQuestion}
                onChatToggle={() => setChatOpen(!chatOpen)}
              />
            )}
          </div>
        </main>

        {isChatQuestion && chatOpen && exam && (
          <HiddenChat examId={exam.id!} onClose={() => setChatOpen(false)} />
        )}
      </div>

      <Taskbar examTitle={exam.title} />
    </div>
  )
}
