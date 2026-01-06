'use client'

import { useState } from 'react'
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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div id="sidebar-wrapper" tabIndex={-1} className="css-15b56az">
      <div data-automation="sdk-sidebar-closed" className="css-61f5jb">
        <div role="navigation" id="quiz-react-sdk_sidebar-nav" aria-label="Question Navigator" className="css-1g4yje1">
          <div className="css-vxx3a1">
            <div className="css-dgowx7">
              <h2 dir="ltr" className="css-1haj8ie-view-heading">Question Navigator</h2>
            </div>
            <div className="css-1ko13ha">
              <button 
                dir="ltr" 
                data-automation="sidebar-toggle-button" 
                type="button" 
                className="css-1lsv873-view--inlineBlock-baseButton"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="css-19dh8cm-baseButton__content">
                  <span className="css-qi8ml9-baseButton__childrenLayout">
                    <span className="css-5udsuu-baseButton__iconOnly">
                      <span className="css-31gkb3-baseButton__iconSVG">
                        <svg name="IconMoveEnd" viewBox="0 0 1920 1920" rotate="0" width="1em" height="1em" aria-hidden="true" role="presentation" focusable="false" className="css-1xnn9jb-inlineSVG-svgIcon" style={{width: '1em', height: '1em'}}>
                          <g role="presentation">
                            <path d="M1805.937 276v1368.756H1920V276h-114.063Zm-739.106 73.765-80.642 80.642 473.02 473.02H0v113.948h1459.208l-473.02 473.02 80.643 80.642 610.694-610.693-610.694-610.58Z" fillRule="evenodd"></path>
                          </g>
                        </svg>
                      </span>
                      <span className="css-r9cwls-screenReaderContent">Show Question Navigator Menu</span>
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="css-1ns0lj3">
            <div className="css-idkx5z">
              <div className="css-h5hkld">
                <h2 dir="ltr" className="css-1haj8ie-view-heading">Pinned questions</h2>
              </div>
              <div aria-hidden="false" className="css-1ko13ha">
                <span aria-label="Pinned questions" role="img" className="css-1e177bn-text">
                  <svg name="IconPin" viewBox="0 0 1920 1920" rotate="0" width="1em" height="1em" aria-hidden="true" role="presentation" focusable="false" className="css-1uh2md0-inlineSVG-svgIcon" style={{width: '1em', height: '1em'}}>
                    <g role="presentation">
                      <path d="M1154.976 0 988.342 166.52c-60.448 60.447-63.436 153.418-15.4 220.646L670.359 689.751c-4.022 4.022-6.55 8.964-9.079 13.79-147.212-61.022-328.671-34.246-444.626 81.709l-98.027 98.141 418.31 418.195-520.129 520.129c-22.41 22.409-22.41 58.724 0 81.248 11.262 11.147 25.972 16.778 40.682 16.778s29.42-5.63 40.567-16.778l520.128-520.129 418.195 418.31 98.142-98.142c75.962-75.847 117.793-176.862 117.793-284.313 0-56.195-12.067-110.208-33.787-160.198 2.758-1.839 5.861-2.988 8.275-5.516l303.963-303.964c29.19 21.145 63.896 33.097 100.67 33.097 46.083 0 89.293-17.928 121.93-50.565L1920 764.909 1154.976 0Z" fillRule="evenodd"></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="css-h5hkld"></div>
          </div>

          <div className="endEditingTrigger css-bqrhy9">
            <span data-position="Popover___0" className="css-1ihz85b-position">
              <a dir="ltr" data-automation="sidebar-title-button" aria-describedby="Tooltip___0" data-popover-trigger="true" data-position-target="Popover___0" href="#" className="css-1y79uck-view--inlineBlock-link">
                <span className="css-732i71-icon">
                  <svg name="IconQuizTitle" viewBox="0 0 1920 1920" rotate="0" width="1em" height="1em" aria-hidden="true" role="presentation" focusable="false" className="css-11mxtos-inlineSVG-svgIcon" style={{width: '1em', height: '1em'}}>
                    <g role="presentation">
                      <path d="M1751 0v1920H169V0h1582Zm-115 112H290v9h-1v1678h1v20h1346V112Zm-234 235v321H514V347h888Z" fillRule="evenodd"></path>
                    </g>
                  </svg>
                </span>
                <span className="css-r9cwls-screenReaderContent">Navigate to title</span>
              </a>
            </span>
            <span aria-hidden="true">
              <span data-automation="sidebar-title-text" tabIndex={-1} className="css-wwmiec">Normalisation exercise Basketball</span>
            </span>
          </div>

          <div className="endEditingTrigger css-bqrhy9">
            <span data-position="Popover___1" className="css-1ihz85b-position">
              <a dir="ltr" data-automation="sidebar-instructions-button" aria-describedby="Tooltip___1" data-popover-trigger="true" data-position-target="Popover___1" href="#" className="css-1y79uck-view--inlineBlock-link">
                <span className="css-732i71-icon">
                  <svg name="IconQuizInstructions" viewBox="0 0 1920 1920" rotate="0" width="1em" height="1em" aria-hidden="true" role="presentation" focusable="false" className="css-11mxtos-inlineSVG-svgIcon" style={{width: '1em', height: '1em'}}>
                    <g role="presentation">
                      <path d="M1920 332v1257H0V332h1920Zm-115 114H115v1032h1690V446Zm-574 683v113H409v-113h822Zm275-226v113H409V903h1097Zm-275-226v113H409V677h822Z" fillRule="evenodd"></path>
                    </g>
                  </svg>
                </span>
                <span className="css-r9cwls-screenReaderContent">Navigate to instructions</span>
              </a>
            </span>
            <span aria-hidden="true">
              <span data-automation="sidebar-instructions-text" tabIndex={-1} className="css-wwmiec">Instructions</span>
            </span>
          </div>

          <div className="css-1wzx962">
            {questions.map((question, index) => {
              const answer = question.id ? answers[question.id] : undefined
              const isAnswered = answer ? answer.trim().length > 0 : false
              
              return (
                <div key={question.id}>
                  <div className="css-79elbk">
                    {!isAnswered && (
                      <div data-automation="sdk-take-sidebar-item-unanswered-dot" className="css-1hzheqm"></div>
                    )}
                    <div className="endEditingTrigger css-gywuyv">
                      <span data-position={`Popover___${index + 2}`} className="css-1ihz85b-position">
                        <span aria-describedby={`Tooltip___${index + 2}`} data-popover-trigger="true" data-position-target={`Popover___${index + 2}`}>
                          <a 
                            dir="ltr" 
                            data-automation-item-id={`455738_${index + 1}`} 
                            data-automation="sdk-sidebar-item-button" 
                            href="#" 
                            className="css-ungqpd-view-link"
                            onClick={(e) => {
                              e.preventDefault()
                              onQuestionSelect(index)
                            }}
                          >
                            <span>
                              <span className="css-r9cwls-screenReaderContent">
                                Navigate to question at position {index + 1}, {isAnswered ? 'answered' : 'unanswered'}
                              </span>
                              <span aria-hidden="true">
                                <span className="css-jtarf9">{index + 1}</span>
                              </span>
                            </span>
                          </a>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
