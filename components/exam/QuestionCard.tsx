import { Question } from '@/lib/schemas'

interface Props {
  question: Question
  questionNumber: number
  answer: string
  onAnswerChange: (answer: string) => void
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
  isChatQuestion: boolean
  onChatToggle: () => void
}

export default function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  isChatQuestion,
  onChatToggle
}: Props) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Multiple Choice'
      case 'text': return 'Fill in the Blank'
      case 'essay': return 'Essay Question'
      case 'code': return 'Code Question'
      default: return 'Question'
    }
  }

  return (
    <div className="max-w-4xl mx-auto border border-gray-200 rounded shadow-sm relative bg-white">
      {/* Pin Icon */}
      <div className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="rotate-45"
        >
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
      </div>

      {/* Question Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <span className="bg-gray-900 text-white font-semibold px-2.5 py-1 text-[13px] rounded">
          {questionNumber}
        </span>
        <span className="text-gray-700 text-[13px]">
          {getQuestionTypeLabel(question.question_type)}
        </span>
        <span className="text-gray-400 text-[13px]">1 point</span>
        
        {isChatQuestion && (
          <button
            onClick={onChatToggle}
            className="ml-auto text-blue-600 hover:text-blue-700 text-[13px] font-medium"
          >
            💬 Help
          </button>
        )}
      </div>

      {/* Question Content */}
      <div className="p-6 pt-5">
        <p className="text-gray-700 text-[14px] mb-5 whitespace-pre-wrap">
          {question.question_text}
        </p>
        
        {question.question_type === 'multiple_choice' && question.options?.options && (
          <div className="space-y-2">
            {question.options.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-[14px] text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.question_type === 'text' && (
          <input
            type="text"
            placeholder="type your answer..."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="border border-gray-300 bg-gray-50 px-3 py-2 rounded text-[13px] w-full max-w-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white"
          />
        )}

        {(question.question_type === 'essay' || question.question_type === 'code') && (
          <textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={question.question_type === 'code' ? 12 : 6}
            className={`border border-gray-300 bg-gray-50 px-3 py-2 rounded text-[13px] w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white resize-y ${
              question.question_type === 'code' ? 'font-mono' : ''
            }`}
          />
        )}
      </div>

      {/* Question Footer Navigation */}
      <div className="px-6 py-4 flex justify-between border-t border-gray-100 mt-6">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="bg-[#f8f9fa] border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="bg-[#f8f9fa] border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
