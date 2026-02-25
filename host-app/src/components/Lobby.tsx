import type { Player } from '@shared-types';

interface LobbyProps {
  code: string;
  players: Player[];
  onStartQuiz: () => void;
}

const Lobby = ({ code, players, onStartQuiz }: LobbyProps) => {
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    // Effet visuel de copie
    const btn = document.querySelector('.code-display') as HTMLElement;
    if (btn) {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1000);
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h1>🎮 Salle d'attente</h1>
        <p>Partagez ce code avec vos joueurs</p>
      </div>

      <div className="code-section">
        <div className="code-display" onClick={copyCode}>
          <span className="code-label">Code de la partie</span>
          <div className="code-value">{code}</div>
          <span className="code-hint">📋 Cliquer pour copier</span>
        </div>
      </div>

      <div className="players-section">
        <div className="players-header">
          <h2>👥 Joueurs ({players.length})</h2>
          <div className="pulse-indicator">
            <span className="pulse-dot"></span>
            En attente...
          </div>
        </div>

        <div className="players-grid">
          {players.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <p>En attente de joueurs...</p>
              <p className="empty-hint">Les joueurs apparaîtront ici quand ils rejoindront</p>
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.id}
                className="player-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="player-avatar">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-status">✓ Prêt</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lobby-actions">
        <button
          onClick={onStartQuiz}
          className="btn-start"
          disabled={players.length === 0}
        >
          {players.length === 0 ? (
            <>⏳ En attente de joueurs</>
          ) : (
            <>🚀 Lancer le quiz ({players.length} joueur{players.length > 1 ? 's' : ''})</>
          )}
        </button>
        
        {players.length === 0 && (
          <p className="start-hint">
            Au moins un joueur doit rejoindre pour commencer
          </p>
        )}
      </div>

      <div className="lobby-footer">
        <p>💡 Les joueurs peuvent rejoindre avec l'application joueur</p>
      </div>
    </div>
  );
};

export default Lobby;
