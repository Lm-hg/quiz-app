import { useState, useEffect } from 'react';
import type { Question, Player } from '@shared-types';

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  players: Player[];
}

const QuestionView = ({ question, questionNumber, totalQuestions, players }: QuestionViewProps) => {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [answeredPlayers, setAnsweredPlayers] = useState(0);

  useEffect(() => {
    setTimeLeft(question.timeLimit);
    setAnsweredPlayers(0);
  }, [question]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Simulation de joueurs répondant (à remplacer par vraie logique WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnsweredPlayers((prev) => {
        const newCount = Math.min(prev + 1, players.length);
        if (newCount >= players.length) {
          clearInterval(interval);
        }
        return newCount;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [players.length]);

  const progressPercentage = ((question.timeLimit - timeLeft) / question.timeLimit) * 100;
  const timeColor = 
    timeLeft > question.timeLimit * 0.5 ? '#4ade80' : 
    timeLeft > question.timeLimit * 0.25 ? '#fbbf24' : '#ef4444';

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
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="question-text-section">
          <h1 className="question-text">{question.text}</h1>
        </div>

        <div className="options-display">
          <div className="options-grid-view">
            {question.options.map((option, index) => (
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
            {answeredPlayers} / {players.length} joueurs ont répondu
          </div>
          <div className="status-bar">
            <div 
              className="status-bar-fill"
              style={{ width: `${(answeredPlayers / players.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
