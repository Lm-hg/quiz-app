import './WaitingLobby.css'

interface WaitingLobbyProps {
  playerName: string
  players: string[]
  playerId: string
}

export default function WaitingLobby({ playerName, players }: WaitingLobbyProps) {
  return (
    <div className="waiting-lobby">
      <div className="lobby-container">
        <h1>Salle d'Attente</h1>

        <div className="player-info">
          <p className="welcome">Bienvenue, <strong>{playerName}</strong>!</p>
        </div>

        <div className="players-section">
          <h2>Joueurs Connectés ({players.length})</h2>
          <div className="players-list">
            {players.length === 0 ? (
              <p className="no-players">En attente d'autres joueurs...</p>
            ) : (
              <ul>
                {players.map((player, index) => (
                  <li key={index} className="player-item">
                    <span className="player-number">{index + 1}</span>
                    <span className="player-name">{player}</span>
                    {player === playerName && <span className="badge">Toi</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Le quiz commence bientôt...</p>
        </div>

        <div className="info-box">
          <p>💡 Prépare-toi! Le quiz va commencer dès que l'animateur aura démarré le jeu.</p>
        </div>
      </div>
    </div>
  )
}
