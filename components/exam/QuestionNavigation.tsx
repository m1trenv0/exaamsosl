import { Question } from '@/lib/schemas'
import { useState } from 'react'

interface Props {
  questions: Question[]
  currentIndex: number
  onQuestionSelect: (index: number) => void
  answers: Record<string, string>
  examTitle?: string
}

export default function QuestionNavigation({
  questions,
  currentIndex,
  onQuestionSelect,
  answers,
  examTitle = 'Normalisation exercise Basketball'
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="canvas-sidebar-wrapper">
      <div className={`canvas-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <nav role="navigation" aria-label="Question Navigator" className="canvas-sidebar-nav">
          {/* Header section */}
          <div className="canvas-sidebar-header">
            <div className="canvas-sidebar-header-content">
              <h2 className="canvas-sidebar-heading">Question Navigator</h2>
            </div>
            <div className="canvas-sidebar-toggle-wrapper">
              <button
                type="button"
                aria-label={isExpanded ? 'Hide Question Navigator Menu' : 'Show Question Navigator Menu'}
                className="canvas-sidebar-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="canvas-sidebar-toggle-icon">
                  <svg viewBox="0 0 1920 1920" width="1em" height="1em" aria-hidden="true">
                    <path d="M1805.937 276v1368.756H1920V276h-114.063Zm-739.106 73.765-80.642 80.642 473.02 473.02H0v113.948h1459.208l-473.02 473.02 80.643 80.642 610.694-610.693-610.694-610.58Z" fillRule="evenodd"></path>
                  </svg>
                </span>
                <span className="sr-only">{isExpanded ? 'Hide' : 'Show'} Question Navigator Menu</span>
              </button>
            </div>
          </div>

          {/* Pinned questions section */}
          <div className="canvas-pinned-section">
            <div className="canvas-pinned-header">
              <h2 className="canvas-sidebar-heading">Pinned questions</h2>
            </div>
            <div className="canvas-pinned-icon-wrapper">
              <span aria-label="Pinned questions" role="img" className="canvas-pinned-icon">
                <svg viewBox="0 0 1920 1920" width="1em" height="1em" aria-hidden="true">
                  <path d="M1154.976 0 988.342 166.52c-60.448 60.447-63.436 153.418-15.4 220.646L670.359 689.751c-4.022 4.022-6.55 8.964-9.079 13.79-147.212-61.022-328.671-34.246-444.626 81.709l-98.027 98.141 418.31 418.195-520.129 520.129c-22.41 22.409-22.41 58.724 0 81.248 11.262 11.147 25.972 16.778 40.682 16.778s29.42-5.63 40.567-16.778l520.128-520.129 418.195 418.31 98.142-98.142c75.962-75.847 117.793-176.862 117.793-284.313 0-56.195-12.067-110.208-33.787-160.198 2.758-1.839 5.861-2.988 8.275-5.516l303.963-303.964c29.19 21.145 63.896 33.097 100.67 33.097 46.083 0 89.293-17.928 121.93-50.565L1920 764.909 1154.976 0Z" fillRule="evenodd"></path>
                </svg>
              </span>
            </div>
            <div className="canvas-pinned-empty"></div>
          </div>

          {/* Title link */}
          <div className="canvas-title-section">
            <a href="#" className="canvas-title-link">
              <span className="canvas-title-icon">
                <svg viewBox="0 0 1920 1920" width="1em" height="1em" aria-hidden="true">
                  <path d="M1751 0v1920H169V0h1582Zm-115 112H290v9h-1v1678h1v20h1346V112Zm-234 235v321H514V347h888Z" fillRule="evenodd"></path>
                </svg>
              </span>
              <span className="sr-only">Navigate to title</span>
            </a>
            <span aria-hidden="true">
              <span className="canvas-title-text">{examTitle}</span>
            </span>
          </div>

          {/* Instructions link */}
          <div className="canvas-instructions-section">
            <a href="#" className="canvas-instructions-link">
              <span className="canvas-instructions-icon">
                <svg viewBox="0 0 1920 1920" width="1em" height="1em" aria-hidden="true">
                  <path d="M1920 332v1257H0V332h1920Zm-115 114H115v1032h1690V446Zm-574 683v113H409v-113h822Zm275-226v113H409V903h1097Zm-275-226v113H409V677h822Z" fillRule="evenodd"></path>
                </svg>
              </span>
              <span className="sr-only">Navigate to instructions</span>
            </a>
            <span aria-hidden="true">
              <span className="canvas-instructions-text">Instructions</span>
            </span>
          </div>

          {/* Question list */}
          <div className="canvas-questions-list">
            {questions.map((question, index) => {
              const answer = question.id ? answers[question.id] : undefined
              const isAnswered = answer ? answer.trim().length > 0 : false
              const isCurrent = currentIndex === index

              return (
                <div key={question.id} className="canvas-question-wrapper">
                  <div className="canvas-question-dot-wrapper">
                    {!isAnswered && (
                      <div className="canvas-question-unanswered-dot"></div>
                    )}
                  </div>
                  <div className={`canvas-question-item ${isCurrent ? 'active' : ''}`}>
                    <a
                      href="#"
                      className="canvas-question-link"
                      onClick={(e) => {
                        e.preventDefault()
                        onQuestionSelect(index)
                      }}
                    >
                      <span className="sr-only">
                        Navigate to question at position {index + 1}, {isAnswered ? 'answered' : 'unanswered'}
                      </span>
                      <span aria-hidden="true">
                        <span className="canvas-question-number">{index + 1}</span>
                      </span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
