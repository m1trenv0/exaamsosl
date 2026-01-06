import { Question } from '@/lib/schemas'
import TrueFalseQuestion from './question-types/TrueFalseQuestion'
import MultipleSelectQuestion from './question-types/MultipleSelectQuestion'
import CategorizationQuestion from './question-types/CategorizationQuestion'
import EssayRichQuestion from './question-types/EssayRichQuestion'
import ChatQuestion from './question-types/ChatQuestion'

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
  chatQuestionText?: string | null
  volume?: number
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
  chatQuestionText,
  volume,
}: Props) {
  return (
    <div className="border border-[#C7CDD1] rounded bg-white shadow-sm relative">
      {/* Pin Icon - absolute positioned */}
      <div className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-gray-600">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="rotate-45"
        >
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
      </div>

      {/* Question Header - simple inline */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <span className="bg-[#394B58] text-white font-semibold px-1.5 py-0.5 text-[12px] rounded-[3px] min-w-[22px] text-center">
          {questionNumber}
        </span>
        <span className="text-gray-600 text-sm">1 point</span>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {isChatQuestion ? (
          <div>
            <ChatQuestion questionText={chatQuestionText} volume={volume} />
          </div>
        ) : (
          <>
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="type your answer..."
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="border border-[#C7CDD1] bg-white px-3 py-2 text-[13px] w-64 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[#6B7280] text-[13px]">+ de Grote</span>
          </div>
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
          </>
        )}
      </div>

      {/* Question Footer Navigation */}
      <div className="px-4 py-3 flex justify-between items-center border-t border-transparent">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="bg-white border border-[#C7CDD1] px-4 py-1.5 rounded text-[13px] text-[#2D3B45] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="bg-white border border-[#C7CDD1] px-4 py-1.5 rounded text-[13px] text-[#2D3B45] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
