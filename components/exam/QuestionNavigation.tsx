import { Question } from '@/lib/schemas'

interface Props {
  questions: Question[]
  currentIndex: number
  onQuestionSelect: (index: number) => void
  answers: Record<string, string>
}

export default function QuestionNavigation({
  questions,
  currentIndex,
  onQuestionSelect,
  answers
}: Props) {
  return (
    <div className="question-nav">
      <div className="flex flex-col items-center py-3 border-b border-gray-200 gap-3">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="flex flex-col items-center py-3 border-b border-gray-200 gap-3">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      </div>

      {questions.map((question, index) => {
        const answer = question.id ? answers[question.id] : undefined
        const isAnswered = answer ? answer.trim().length > 0 : false
        return (
          <div
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`question-nav-item ${currentIndex === index ? 'active' : ''} ${isAnswered ? 'text-blue-600 font-medium' : ''}`}
          >
            {index + 1}
          </div>
        )
      })}

      <div className="mt-auto pt-3 border-t border-gray-200 flex justify-center">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
