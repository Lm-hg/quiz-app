import { useState, useEffect } from 'react'
import type { QuizPhase, QuizQuestion } from '../../../packages/shared-types'
import { useWebSocket } from './hooks/useWebsocket'
import JoinScreen from './components/JoinScreen'
import WaitingLobby from './components/WaitingLobby'
import AnswerScreen from './components/AnswerScreen'
import FeedbackScreen from './components/FeedbackScreen'
import ScoreScreen from './components/ScoreScreen'
import './App.css'

interface GameState {
  phase: QuizPhase
  playerId: string | null
  playerName: string | null
  players: string[]
  currentQuestion: Omit<QuizQuestion, 'correctIndex'> | null
  questionIndex: number
  totalQuestions: number
  timeRemaining: number
  selectedAnswer: number | null
  correctIndex: number | null
  distribution: number[]
  scores: Record<string, number>
  rankings: Array<{ name: string; score: number }>
  error: string | null
}

function App() {
  const ws = useWebSocket('ws://localhost:3000')
  const [state, setState] = useState<GameState>({
    phase: 'lobby',
    playerId: null,
    playerName: null,
    players: [],
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 0,
    timeRemaining: 0,
    selectedAnswer: null,
    correctIndex: null,
    distribution: [],
    scores: {},
    rankings: [],
    error: null,
  })

  // Enregistrer les handlers WebSocket
  useEffect(() => {
    const unsubscribers = [
      ws.on('joined', (msg) => {
        if (msg.type === 'joined') {
          setState((prev) => ({
            ...prev,
            playerId: msg.playerId,
            players: msg.players,
            phase: 'lobby',
          }))
        }
      }),

      ws.on('question', (msg) => {
        if (msg.type === 'question') {
          setState((prev) => ({
            ...prev,
            phase: 'question',
            currentQuestion: msg.question,
            questionIndex: msg.index,
            totalQuestions: msg.total,
            timeRemaining: msg.question.timerSec,
            selectedAnswer: null,
            correctIndex: null,
            distribution: [],
          }))
        }
      }),

      ws.on('tick', (msg) => {
        if (msg.type === 'tick') {
          setState((prev) => ({
            ...prev,
            timeRemaining: msg.remaining,
          }))
        }
      }),

      ws.on('results', (msg) => {
        if (msg.type === 'results') {
          setState((prev) => ({
            ...prev,
            phase: 'results',
            correctIndex: msg.correctIndex,
            distribution: msg.distribution,
            scores: msg.scores,
          }))
        }
      }),

      ws.on('leaderboard', (msg) => {
        if (msg.type === 'leaderboard') {
          setState((prev) => ({
            ...prev,
            phase: 'leaderboard',
            rankings: msg.rankings,
          }))
        }
      }),

      ws.on('ended', (msg) => {
        if (msg.type === 'ended') {
          setState((prev) => ({
            ...prev,
            phase: 'ended',
          }))
        }
      }),

      ws.on('error', (msg) => {
        if (msg.type === 'error') {
          setState((prev) => ({
            ...prev,
            error: msg.message,
          }))
        }
      }),
    ]

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [ws])

  const handleJoin = (quizCode: string, name: string) => {
    setState((prev) => ({
      ...prev,
      playerName: name,
    }))
    ws.send({
      type: 'join',
      quizCode,
      name,
    })
  }

  const handleAnswer = (choiceIndex: number) => {
    setState((prev) => ({
      ...prev,
      selectedAnswer: choiceIndex,
    }))
    if (state.currentQuestion) {
      ws.send({
        type: 'answer',
        questionId: state.currentQuestion.id,
        choiceIndex,
      })
    }
  }

  const handlePlayAgain = () => {
    setState((prev) => ({
      ...prev,
      phase: 'lobby',
      selectedAnswer: null,
      correctIndex: null,
    }))
  }

  // Rendu conditionnel basé sur la phase
  const renderPhase = () => {
    switch (state.phase) {
      case 'lobby':
        if (!state.playerId) {
          return <JoinScreen onJoin={handleJoin} error={state.error} />
        } else {
          return (
            <WaitingLobby
              playerName={state.playerName || ''}
              players={state.players}
              playerId={state.playerId}
            />
          )
        }

      case 'question':
        return (
          <AnswerScreen
            question={state.currentQuestion!}
            timeRemaining={state.timeRemaining}
            questionIndex={state.questionIndex}
            totalQuestions={state.totalQuestions}
            selectedAnswer={state.selectedAnswer}
            onAnswer={handleAnswer}
            isAnswered={state.selectedAnswer !== null}
          />
        )

      case 'results':
        return (
          <FeedbackScreen
            question={state.currentQuestion!}
            selectedAnswer={state.selectedAnswer!}
            correctIndex={state.correctIndex!}
            distribution={state.distribution}
            scores={state.scores}
            playerName={state.playerName || ''}
          />
        )

      case 'leaderboard':
        return (
          <ScoreScreen
            rankings={state.rankings}
            playerName={state.playerName || ''}
            onPlayAgain={handlePlayAgain}
          />
        )

      case 'ended':
        return (
          <div className="final-screen">
            <h1>Quiz Terminé!</h1>
            <p>Merci d'avoir participé</p>
            <button onClick={handlePlayAgain}>Rejouer</button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="app">
      {state.error && <div className="error-banner">{state.error}</div>}
      {renderPhase()}
    </div>
  )
}

export default App
