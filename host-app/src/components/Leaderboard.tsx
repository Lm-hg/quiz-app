import { Player } from '../../../packages/shared-types';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard = ({ players }: LeaderboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

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
        {sortedPlayers.length === 0 ? (
          <div className="empty-leaderboard">
            <p>Aucun joueur n'a participé</p>
          </div>
        ) : (
          <>
            {/* Podium pour les 3 premiers */}
            {sortedPlayers.length >= 3 && (
              <div className="podium">
                <div className="podium-position second">
                  <div className="podium-player">
                    <div className="podium-avatar">{sortedPlayers[1].name.charAt(0).toUpperCase()}</div>
                    <div className="podium-name">{sortedPlayers[1].name}</div>
                    <div className="podium-score">{sortedPlayers[1].score} pts</div>
                  </div>
                  <div className="podium-base">
                    <div className="podium-medal">🥈</div>
                    <div className="podium-rank">2</div>
                  </div>
                </div>

                <div className="podium-position first">
                  <div className="podium-player">
                    <div className="podium-avatar winner">{sortedPlayers[0].name.charAt(0).toUpperCase()}</div>
                    <div className="podium-crown">👑</div>
                    <div className="podium-name">{sortedPlayers[0].name}</div>
                    <div className="podium-score">{sortedPlayers[0].score} pts</div>
                  </div>
                  <div className="podium-base">
                    <div className="podium-medal">🥇</div>
                    <div className="podium-rank">1</div>
                  </div>
                </div>

                {sortedPlayers.length >= 3 && (
                  <div className="podium-position third">
                    <div className="podium-player">
                      <div className="podium-avatar">{sortedPlayers[2].name.charAt(0).toUpperCase()}</div>
                      <div className="podium-name">{sortedPlayers[2].name}</div>
                      <div className="podium-score">{sortedPlayers[2].score} pts</div>
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
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
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
                    {index === 0 && sortedPlayers.length > 1 && (
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
      </div>
    </div>
  );
};

export default Leaderboard;
