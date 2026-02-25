import { useEffect, useState } from 'react';
import type { QuizQuestion } from '@shared-types';

interface ResultsProps {
  question: QuizQuestion;
  distribution: number[];
  scores: Record<string, number>;
  onNext?: () => void;
}

interface OptionStats {
  index: number;
  text: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
}

const Results = ({ question, distribution, scores, onNext }: ResultsProps) => {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Animation progressive
    setTimeout(() => setShowResults(true), 300);
  }, []);

  const playerCount = Object.keys(scores).length;

  // Calculer les statistiques pour chaque option
  const optionStats: OptionStats[] = question.choices.map((text, index) => {
    const count = distribution[index] || 0;
    const percentage = playerCount > 0 ? (count / playerCount) * 100 : 0;
    
    return {
      index,
      text,
      count,
      percentage,
      isCorrect: index === question.correctIndex,
    };
  });

  const maxCount = Math.max(...optionStats.map(s => s.count), 1);
  const correctCount = optionStats[question.correctIndex].count;

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
            <div className="stat-value">{playerCount - correctCount}</div>
            <div className="stat-label">Mauvaises réponses</div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{playerCount}</div>
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
            La bonne réponse était : <strong>{question.choices[question.correctIndex]}</strong>
          </div>
        </div>
      </div>

      <div className="results-actions">
        {onNext && (
          <button onClick={onNext} className="btn-next">
            Question suivante →
          </button>
        )}
        {!onNext && (
          <div className="results-done">
            <p>Préparation du classement final...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
