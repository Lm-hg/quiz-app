import type { QuizQuestion } from '../../../packages/shared-types'
import './AnswerScreen.css'

interface AnswerScreenProps {
  question: Omit<QuizQuestion, 'correctIndex'>
  timeRemaining: number
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | null
  onAnswer: (choiceIndex: number) => void
  isAnswered: boolean
}

export default function AnswerScreen({
  question,
  timeRemaining,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  isAnswered,
}: AnswerScreenProps) {
  const progress = ((questionIndex) / totalQuestions) * 100

  const getButtonClass = (index: number) => {
    let className = 'answer-button'
    if (selectedAnswer === index) {
      className += ' selected'
    }
    if (isAnswered) {
      className += ' answered'
    }
    return className
  }

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

  return (
    <div className="answer-screen">
      <div className="screen-header">
        <div className="progress-info">
          <span>Question {questionIndex + 1} / {totalQuestions}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className={`timer ${timeRemaining <= 5 ? 'warning' : ''}`}>
          <span className="timer-label">Temps restant</span>
          <span className="timer-value">{timeRemaining}s</span>
        </div>
      </div>

      <div className="screen-content">
        <h1 className="question-text">{question.text}</h1>

        <div className="answers-grid">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              className={getButtonClass(index)}
              onClick={() => !isAnswered && onAnswer(index)}
              disabled={isAnswered}
              style={{
                '--button-color': colors[index],
              } as React.CSSProperties}
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="answer-text">{choice}</span>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="answer-submitted">
            <p>✓ Réponse soumise</p>
          </div>
        )}
      </div>
    </div>
  )
}
