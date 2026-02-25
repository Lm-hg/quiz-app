import { useState } from 'react'
import './JoinScreen.css'

interface JoinScreenProps {
  onJoin: (quizCode: string, name: string) => void
  error?: string | null
}

export default function JoinScreen({ onJoin, error }: JoinScreenProps) {
  const [quizCode, setQuizCode] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (quizCode.trim() && name.trim()) {
      onJoin(quizCode.trim(), name.trim())
    }
  }

  return (
    <div className="join-screen">
      <div className="join-container">
        <h1>Quiz Master</h1>
        <p className="subtitle">Rejoins un quiz en direct</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="code">Code du Quiz</label>
            <input
              id="code"
              type="text"
              placeholder="Ex: ABC123"
              value={quizCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizCode(e.target.value.toUpperCase())}
              maxLength={10}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Ton Pseudo</label>
            <input
              id="name"
              type="text"
              placeholder="Entre ton nom"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              maxLength={30}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={!quizCode.trim() || !name.trim()}
            className="join-button"
          >
            Rejoindre
          </button>
        </form>

        <div className="info-box">
          <p>✨ Réponds correctement et rapidement pour obtenir le maximum de points!</p>
        </div>
      </div>
    </div>
  )
}
