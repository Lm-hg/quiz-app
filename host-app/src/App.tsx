import { useState, useEffect } from 'react';
import './App.css';
import { useWebSocket } from './hooks/useWebSocket';
import type { Quiz } from '@shared-types';
import CreateQuiz from './components/CreateQuiz';
import Lobby from './components/Lobby';
import QuestionView from './components/QuestionView';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';

function App() {
  const [phase, setPhase] = useState<'create' | 'lobby' | 'question' | 'results' | 'leaderboard'>('create');
  const { roomState, connected, error, sendMessage } = useWebSocket('ws://localhost:3001');

  // Synchroniser la phase avec l'état de la room
  useEffect(() => {
    if (roomState) {
      if (roomState.phase === 'waiting' && phase !== 'lobby') {
        setPhase('lobby');
      } else if (roomState.phase === 'question' && phase !== 'question') {
        setPhase('question');
      } else if (roomState.phase === 'results' && phase !== 'results') {
        setPhase('results');
      } else if (roomState.phase === 'leaderboard' && phase !== 'leaderboard') {
        setPhase('leaderboard');
      }
    }
  }, [roomState, phase]);

  const handleCreateQuiz = (quiz: Quiz) => {
    sendMessage({ type: 'create-room', quiz });
  };

  const handleStartQuiz = () => {
    sendMessage({ type: 'start-quiz' });
  };

  const handleNextQuestion = () => {
    sendMessage({ type: 'next-question' });
  };

  return (
    <div className="app">
      {!connected && (
        <div className="connection-status">
          <div className="loading-spinner"></div>
          <p>Connexion au serveur...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
        </div>
      )}

      {connected && (
        <>
          {phase === 'create' && (
            <CreateQuiz onCreateQuiz={handleCreateQuiz} />
          )}

          {phase === 'lobby' && roomState && (
            <Lobby
              code={roomState.code}
              players={roomState.players}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {phase === 'question' && roomState && roomState.quiz && (
            <QuestionView
              question={roomState.quiz.questions[roomState.currentQuestionIndex]}
              questionNumber={roomState.currentQuestionIndex + 1}
              totalQuestions={roomState.quiz.questions.length}
              players={roomState.players}
            />
          )}

          {phase === 'results' && roomState && roomState.quiz && (
            <Results
              question={roomState.quiz.questions[roomState.currentQuestionIndex]}
              answers={roomState.answers}
              players={roomState.players}
              onNext={handleNextQuestion}
            />
          )}

          {phase === 'leaderboard' && roomState && (
            <Leaderboard players={roomState.players} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
