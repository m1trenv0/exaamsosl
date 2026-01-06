import { Question } from '@/lib/schemas'
import TrueFalseQuestion from './question-types/TrueFalseQuestion'
import MultipleSelectQuestion from './question-types/MultipleSelectQuestion'
import CategorizationQuestion from './question-types/CategorizationQuestion'
import EssayRichQuestion from './question-types/EssayRichQuestion'

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
      case 'true_false': return 'True/False'
      case 'multiple_select': return 'Multiple Select'
      case 'categorization': return 'Categorization'
      case 'essay_rich': return 'Essay Question'
      default: return 'Question'
    }
  }

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 rounded shadow-sm relative bg-white mb-6">
      {/* Pin Icon */}
      <div className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
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
      <div className="px-6 py-3 border-b border-gray-300 flex items-center gap-3 bg-gray-50">
        <span className="bg-gray-800 text-white font-bold px-3 py-1.5 text-sm rounded min-w-[32px] text-center">
          {questionNumber}
        </span>
        <span className="text-gray-600 text-sm">1 point</span>
        
        {isChatQuestion && (
          <button
            onClick={onChatToggle}
            className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            💬 Help
          </button>
        )}
      </div>

      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-gray-900 text-[15px] font-semibold mb-5">
          {question.question_text}
        </h3>
        
        {question.question_type === 'multiple_choice' && question.options?.options && (
          <div className="space-y-3">
            {question.options.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-[18px] h-[18px] text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-[14px] text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.question_type === 'text' && (
          <input
            type="text"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="border border-gray-300 bg-white px-4 py-3 rounded text-[14px] w-full max-w-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        )}

        {question.question_type === 'true_false' && (
          <TrueFalseQuestion
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        )}

        {question.question_type === 'multiple_select' && question.options?.options && (
          <MultipleSelectQuestion
            options={question.options.options}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        )}

        {question.question_type === 'categorization' && question.options?.categories && question.options?.possibleAnswers && (
          <CategorizationQuestion
            categories={question.options.categories}
            possibleAnswers={question.options.possibleAnswers}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        )}

        {question.question_type === 'essay_rich' && (
          <EssayRichQuestion
            answer={answer}
            onAnswerChange={onAnswerChange}
            wordLimit={question.options?.wordLimit}
          />
        )}

        {(question.question_type === 'essay' || question.question_type === 'code') && (
          <textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={question.question_type === 'code' ? 12 : 6}
            className={`border border-gray-300 bg-white px-4 py-3 rounded text-[14px] w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-y ${
              question.question_type === 'code' ? 'font-mono' : ''
            }`}
          />
        )}
      </div>

      {/* Question Footer Navigation */}
      <div className="px-6 py-4 flex justify-between border-t border-gray-300">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="bg-white border border-gray-400 px-5 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="bg-white border border-gray-400 px-5 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  )
}
