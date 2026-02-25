import './ScoreScreen.css'

interface ScoreScreenProps {
  rankings: Array<{ name: string; score: number }>
  playerName: string
  onPlayAgain: () => void
}

export default function ScoreScreen({ rankings, playerName, onPlayAgain }: ScoreScreenProps) {
  const playerPosition = rankings.findIndex((r) => r.name === playerName) + 1
  const playerScore = rankings.find((r) => r.name === playerName)?.score || 0

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return '•'
    }
  }

  const isPlayer = (name: string) => name === playerName

  return (
    <div className="score-screen">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>🏆 Classement Final</h1>
          <p className="subtitle">Résultats du Quiz</p>
        </div>

        <div className="leaderboard-list">
          {rankings.length === 0 ? (
            <p className="no-rankings">Pas de résultats disponibles</p>
          ) : (
            <div className="rankings">
              {rankings.map((player, index) => (
                <div
                  key={index}
                  className={`ranking-item ${isPlayer(player.name) ? 'current-player' : ''}`}
                >
                  <div className="rank-position">
                    <span className="medal">{getMedalEmoji(index + 1)}</span>
                    <span className="position">{index + 1}</span>
                  </div>

                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    {isPlayer(player.name) && <span className="you-badge">C'est toi</span>}
                  </div>

                  <div className="score-display">
                    <span className="score-value">{player.score}</span>
                    <span className="score-label">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="personal-stats">
          <h2>Ton Résultat</h2>
          <div className="stat-card">
            <div className="stat-item">
              <span className="stat-label">Position</span>
              <span className="stat-value">#{playerPosition}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Points</span>
              <span className="stat-value">{playerScore}</span>
            </div>
          </div>
        </div>

        <button onClick={onPlayAgain} className="play-again-button">
          Rejouer
        </button>

        <p className="footer-text">
          Bien joué {playerName}! 🎉
        </p>
      </div>
    </div>
  )
}
