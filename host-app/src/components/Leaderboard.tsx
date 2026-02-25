interface LeaderboardProps {
  rankings: { name: string; score: number }[];
  onEnd?: () => void;
}

const Leaderboard = ({ rankings, onEnd }: LeaderboardProps) => {

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return null;
    }
  };

  const getPositionClass = (rank: number) => {
    switch (rank) {
      case 0: return 'rank-first';
      case 1: return 'rank-second';
      case 2: return 'rank-third';
      default: return '';
    }
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <div className="trophy-animation">
          <div className="trophy">🏆</div>
          <div className="confetti">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#fbbf24', '#ef4444', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)],
                }}
              />
            ))}
          </div>
        </div>
        <h1>🎉 Classement Final</h1>
        <p>Félicitations à tous les participants !</p>
      </div>

      <div className="leaderboard-content">
        {rankings.length === 0 ? (
          <div className="empty-leaderboard">
            <p>Aucun joueur n'a participé</p>
          </div>
        ) : (
          <>
            {/* Podium pour les 3 premiers */}
            {rankings.length >= 3 && (
              <div className="podium">
                <div className="podium-position second">
                  <div className="podium-player">
                    <div className="podium-avatar">{rankings[1].name.charAt(0).toUpperCase()}</div>
                    <div className="podium-name">{rankings[1].name}</div>
                    <div className="podium-score">{rankings[1].score} pts</div>
                  </div>
                  <div className="podium-base">
                    <div className="podium-medal">🥈</div>
                    <div className="podium-rank">2</div>
                  </div>
                </div>

                <div className="podium-position first">
                  <div className="podium-player">
                    <div className="podium-avatar winner">{rankings[0].name.charAt(0).toUpperCase()}</div>
                    <div className="podium-crown">👑</div>
                    <div className="podium-name">{rankings[0].name}</div>
                    <div className="podium-score">{rankings[0].score} pts</div>
                  </div>
                  <div className="podium-base">
                    <div className="podium-medal">🥇</div>
                    <div className="podium-rank">1</div>
                  </div>
                </div>

                {rankings.length >= 3 && (
                  <div className="podium-position third">
                    <div className="podium-player">
                      <div className="podium-avatar">{rankings[2].name.charAt(0).toUpperCase()}</div>
                      <div className="podium-name">{rankings[2].name}</div>
                      <div className="podium-score">{rankings[2].score} pts</div>
                    </div>
                    <div className="podium-base">
                      <div className="podium-medal">🥉</div>
                      <div className="podium-rank">3</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Liste complète des joueurs */}
            <div className="rankings-list">
              <h2>📋 Classement complet</h2>
              <div className="rankings-table">
                {rankings.map((player, index) => (
                  <div
                    key={index}
                    className={`ranking-row ${getPositionClass(index)}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="ranking-position">
                      {getMedalEmoji(index) || `#${index + 1}`}
                    </div>
                    <div className="ranking-avatar">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ranking-name">{player.name}</div>
                    <div className="ranking-score">
                      <span className="score-value">{player.score}</span>
                      <span className="score-label">points</span>
                    </div>
                    {index === 0 && rankings.length > 1 && (
                      <div className="winner-badge">Champion</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="leaderboard-footer">
        <p>Merci d'avoir joué ! 🎮</p>
        {onEnd && (
          <button onClick={onEnd} className="btn-end-quiz">
            Terminer le quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
