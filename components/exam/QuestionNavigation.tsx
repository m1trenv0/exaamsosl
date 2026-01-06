'use client'

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
}: Props) {

  return (
    <div className="question-nav">
      <div className="question-nav-icons">
        <i className="fas fa-rocket"></i>
        <i className="fas fa-arrow-right"></i>
      </div>
      
      <div className="question-nav-icons">
        <i className="fas fa-pencil"></i>
        <i className="far fa-file-alt"></i>
      </div>

      <div className="question-nav-scroll">
        {questions.map((question, index) => (
          <div
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`question-nav-item ${currentIndex === index ? 'active' : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="question-nav-bottom">
        <i className="fas fa-bars"></i>
      </div>
    </div>
  )
}
