import { useEffect, useState } from 'react';
import { Question, Player } from '../../../packages/shared-types';

interface ResultsProps {
  question: Question;
  answers: Record<string, number>;
  players: Player[];
  onNext: () => void;
}

interface OptionStats {
  index: number;
  text: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
}

const Results = ({ question, answers, players, onNext }: ResultsProps) => {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Animation progressive
    setTimeout(() => setShowResults(true), 300);
  }, []);

  // Calculer les statistiques pour chaque option
  const optionStats: OptionStats[] = question.options.map((text, index) => {
    const count = Object.values(answers).filter(a => a === index).length;
    const percentage = players.length > 0 ? (count / players.length) * 100 : 0;
    
    return {
      index,
      text,
      count,
      percentage,
      isCorrect: index === question.correctAnswer,
    };
  });

  const maxCount = Math.max(...optionStats.map(s => s.count), 1);
  const correctCount = optionStats[question.correctAnswer].count;

  return (
    <div className="results">
      <div className="results-header">
        <h1>📊 Résultats</h1>
        <p className="results-question">{question.text}</p>
      </div>

      <div className="results-content">
        <div className="stats-summary">
          <div className="stat-card correct">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{correctCount}</div>
            <div className="stat-label">Bonnes réponses</div>
          </div>
          <div className="stat-card incorrect">
            <div className="stat-icon">❌</div>
            <div className="stat-value">{players.length - correctCount}</div>
            <div className="stat-label">Mauvaises réponses</div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{players.length}</div>
            <div className="stat-label">Joueurs</div>
          </div>
        </div>

        <div className="options-results">
          {optionStats.map((stat, index) => (
            <div
              key={index}
              className={`result-option ${stat.isCorrect ? 'correct-answer' : ''} ${showResults ? 'show' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="result-option-header">
                <div className="option-label">
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{stat.text}</span>
                  {stat.isCorrect && <span className="correct-badge">✓ Bonne réponse</span>}
                </div>
                <div className="option-stats-text">
                  <span className="option-count">{stat.count} joueur{stat.count !== 1 ? 's' : ''}</span>
                  <span className="option-percentage">{stat.percentage.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="result-bar-container">
                <div
                  className={`result-bar ${stat.isCorrect ? 'bar-correct' : 'bar-incorrect'}`}
                  style={{
                    width: showResults ? `${(stat.count / maxCount) * 100}%` : '0%',
                    transitionDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="bar-shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="correct-answer-highlight">
          <div className="highlight-icon">🎯</div>
          <div className="highlight-text">
            La bonne réponse était : <strong>{question.options[question.correctAnswer]}</strong>
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={onNext} className="btn-next">
          Continuer →
        </button>
      </div>
    </div>
  );
};

export default Results;
