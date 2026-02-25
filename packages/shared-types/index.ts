export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // en secondes
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface QuizRoom {
  code: string;
  quiz: Quiz | null;
  players: Player[];
  currentQuestionIndex: number;
  phase: 'waiting' | 'question' | 'results' | 'leaderboard';
  answers: Record<string, number>; // playerId -> answerIndex
}

export interface AnswerResult {
  playerId: string;
  playerName: string;
  correct: boolean;
  answerIndex: number;
  timeTaken: number;
}

// Messages WebSocket
export type WSMessage =
  | { type: 'create-room'; quiz: Quiz }
  | { type: 'room-created'; code: string }
  | { type: 'join-room'; code: string; playerName: string }
  | { type: 'player-joined'; player: Player }
  | { type: 'room-state'; room: QuizRoom }
  | { type: 'start-quiz' }
  | { type: 'next-question' }
  | { type: 'submit-answer'; questionId: string; answerIndex: number; timeTaken: number }
  | { type: 'question-results'; results: AnswerResult[] }
  | { type: 'show-leaderboard'; players: Player[] }
  | { type: 'error'; message: string };
