import { useEffect, useState } from 'react';
import type { QuizQuestion } from '@shared-types';

interface QuestionViewProps {
  question: Omit<QuizQuestion, 'correctIndex'>;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  playerCount: number;
}

const QuestionView = ({ question, questionNumber, totalQuestions, timeRemaining, playerCount }: QuestionViewProps) => {
  const [answeredPlayers, setAnsweredPlayers] = useState(0);

  useEffect(() => {
    setAnsweredPlayers(0);
  }, [question]);

  // Simulation de joueurs répondant (à remplacer par vraie logique WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnsweredPlayers((prev) => {
        const newCount = Math.min(prev + 1, playerCount);
        if (newCount >= playerCount) {
          clearInterval(interval);
        }
        return newCount;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [playerCount]);

  const progressPercentage = ((question.timerSec - timeRemaining) / question.timerSec) * 100;
  const timeColor = 
    timeRemaining > question.timerSec * 0.5 ? '#4ade80' : 
    timeRemaining > question.timerSec * 0.25 ? '#fbbf24' : '#ef4444';

  return (
    <div className="question-view">
      <div className="question-header">
        <div className="question-meta">
          <span className="question-number">
            Question {questionNumber} / {totalQuestions}
          </span>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="question-content">
        <div className="timer-section">
          <div className="timer-circle" style={{ borderColor: timeColor }}>
            <svg className="timer-svg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={timeColor}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (progressPercentage / 100)}`}
                transform="rotate(-90 50 50)"
                className="timer-progress"
              />
            </svg>
            <div className="timer-value" style={{ color: timeColor }}>
              {timeRemaining}s
            </div>
          </div>
        </div>

        <div className="question-text-section">
          <h1 className="question-text">{question.text}</h1>
        </div>

        <div className="options-display">
          <div className="options-grid-view">
            {question.choices.map((option, index) => (
              <div
                key={index}
                className="option-display"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="question-footer">
        <div className="players-status">
          <div className="status-icon">👥</div>
          <div className="status-text">
            {answeredPlayers} / {playerCount} joueurs ont répondu
          </div>
          <div className="status-bar">
            <div 
              className="status-bar-fill"
              style={{ width: `${(answeredPlayers / playerCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
