import type { QuizQuestion } from '../../../packages/shared-types'
import './FeedbackScreen.css'

interface FeedbackScreenProps {
  question: Omit<QuizQuestion, 'correctIndex'>
  selectedAnswer: number
  correctIndex: number
  distribution: number[]
  scores: Record<string, number>
  playerName: string
}

export default function FeedbackScreen({
  question,
  selectedAnswer,
  correctIndex,
  distribution,
  scores,
  playerName,
}: FeedbackScreenProps) {
  const isCorrect = selectedAnswer === correctIndex
  const playerScore = scores[playerName] || 0
  const maxScore = Math.max(...Object.values(scores))

  return (
    <div className={`feedback-screen ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-container">
        <div className="feedback-header">
          {isCorrect ? (
            <>
              <div className="emoji">✓</div>
              <h1>Correct!</h1>
              <p className="feedback-message">Excellente réponse!</p>
            </>
          ) : (
            <>
              <div className="emoji">✗</div>
              <h1>Incorrect</h1>
              <p className="feedback-message">La bonne réponse était...</p>
            </>
          )}
        </div>

        <div className="answer-detail">
          <p className="your-answer">
            <strong>Ta réponse:</strong> {question.choices[selectedAnswer]}
          </p>
          {!isCorrect && (
            <p className="correct-answer">
              <strong>Bonne réponse:</strong> {question.choices[correctIndex]}
            </p>
          )}
        </div>

        <div className="stats-section">
          <h3>Statistiques</h3>
          <div className="distribution-chart">
            {question.choices.map((choice, index) => (
              <div key={index} className="choice-stat">
                <div className="stat-label">
                  {String.fromCharCode(65 + index)}: {choice}
                </div>
                <div className="stat-bar-container">
                  <div
                    className={`stat-bar ${
                      index === correctIndex ? 'correct' : ''
                    } ${index === selectedAnswer && !isCorrect ? 'wrong' : ''}`}
                    style={{
                      width: `${distribution[index] > 0 ? (distribution[index] / Math.max(...distribution)) * 100 : 5}%`,
                    }}
                  >
                    <span className="stat-count">{distribution[index]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="score-info">
          <p>
            <strong>Ton score:</strong> {playerScore} pts
          </p>
          <p className="leader-score">
            <strong>Meilleur score:</strong> {maxScore} pts
          </p>
        </div>

        <p className="next-question-info">
          La prochaine question arrive bientôt...
        </p>
      </div>
    </div>
  )
}
