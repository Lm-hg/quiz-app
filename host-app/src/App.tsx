import { useState, useEffect } from 'react';
import './App.css';
import { useWebSocket } from './hooks/useWebSocket';
import type { QuizQuestion, QuizPhase } from '@shared-types';
import CreateQuiz from './components/CreateQuiz';
import Lobby from './components/Lobby';
import QuestionView from './components/QuestionView';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';

function App() {
  const [phase, setPhase] = useState<QuizPhase>('lobby');
  const [quizCode, setQuizCode] = useState<string>('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Omit<QuizQuestion, 'correctIndex'> | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState<{ correctIndex: number; distribution: number[]; scores: Record<string, number> } | null>(null);
  const [rankings, setRankings] = useState<{ name: string; score: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { status, sendMessage, lastMessage } = useWebSocket('ws://7ce2-185-226-32-80.ngrok-free.app');

  // Gérer les messages reçus du serveur
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[App] Message reçu:', lastMessage);

    switch (lastMessage.type) {
      case 'sync':
        if (lastMessage.phase === 'lobby' && typeof lastMessage.data === 'object' && lastMessage.data !== null) {
          const data = lastMessage.data as { quizCode: string };
          setQuizCode(data.quizCode);
          setPhase('lobby');
        }
        break;

      case 'joined':
        setPlayerNames(lastMessage.players);
        break;

      case 'question':
        setCurrentQuestion(lastMessage.question);
        setQuestionIndex(lastMessage.index);
        setTotalQuestions(lastMessage.total);
        setTimeRemaining(lastMessage.question.timerSec);
        setPhase('question');
        break;

      case 'tick':
        setTimeRemaining(lastMessage.remaining);
        break;

      case 'results':
        setResults({
          correctIndex: lastMessage.correctIndex,
          distribution: lastMessage.distribution,
          scores: lastMessage.scores
        });
        setPhase('results');
        break;

      case 'leaderboard':
        setRankings(lastMessage.rankings);
        setPhase('leaderboard');
        break;

      case 'ended':
        setPhase('ended');
        break;

      case 'error':
        setError(lastMessage.message);
        setTimeout(() => setError(null), 5000);
        break;
    }
  }, [lastMessage]);

  const handleCreateQuiz = (title: string, questions: QuizQuestion[]) => {
    sendMessage({ type: 'host:create', title, questions });
  };

  const handleStartQuiz = () => {
    sendMessage({ type: 'host:start' });
  };

  const handleNextQuestion = () => {
    sendMessage({ type: 'host:next' });
  };

  const handleEndQuiz = () => {
    sendMessage({ type: 'host:end' });
  };

  return (
    <div className="app">
      {status === 'connecting' && (
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

      {status === 'connected' && (
        <>
          {!quizCode && phase === 'lobby' && (
            <CreateQuiz onCreateQuiz={handleCreateQuiz} />
          )}

          {quizCode && phase === 'lobby' && (
            <Lobby
              code={quizCode}
              players={playerNames}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {phase === 'question' && currentQuestion && (
            <QuestionView
              question={currentQuestion}
              questionNumber={questionIndex + 1}
              totalQuestions={totalQuestions}
              timeRemaining={timeRemaining}
              playerCount={playerNames.length}
            />
          )}

          {phase === 'results' && currentQuestion && results && (
            <Results
              question={{ ...currentQuestion, correctIndex: results.correctIndex }}
              distribution={results.distribution}
              scores={results.scores}
              onNext={questionIndex + 1 < totalQuestions ? handleNextQuestion : undefined}
            />
          )}

          {phase === 'leaderboard' && (
            <Leaderboard rankings={rankings} onEnd={handleEndQuiz} />
          )}

          {phase === 'ended' && (
            <div className="ended-screen">
              <h1>Quiz terminé</h1>
              <p>Merci d'avoir participé !</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
