import { useState } from 'react';
import type { QuizQuestion } from '@shared-types';

interface CreateQuizProps {
  onCreateQuiz: (title: string, questions: QuizQuestion[]) => void;
}

const CreateQuiz = ({ onCreateQuiz }: CreateQuizProps) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      text: '',
      choices: ['', '', '', ''],
      correctIndex: 0,
      timerSec: 30,
    },
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: String(questions.length + 1),
      text: '',
      choices: ['', '', '', ''],
      correctIndex: 0,
      timerSec: 30,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const choices = [...updated[qIndex].choices];
    choices[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], choices };
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateQuiz(title, questions);
  };

  const isValid = title.trim() && questions.every(q => 
    q.text.trim() && q.choices.every(o => o.trim())
  );

  return (
    <div className="create-quiz">
      <div className="create-quiz-header">
        <h1>🎯 Créer un Quiz</h1>
        <p>Préparez vos questions et lancez la partie</p>
      </div>

      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label htmlFor="quiz-title">Titre du quiz</label>
          <input
            id="quiz-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Culture générale 2026"
            className="title-input"
            required
          />
        </div>

        <div className="questions-list">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="btn-remove"
                    aria-label="Supprimer la question"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`question-${qIndex}`}>Question</label>
                <input
                  id={`question-${qIndex}`}
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  placeholder="Posez votre question..."
                  required
                />
              </div>

              <div className="options-grid">
                {question.choices.map((option, oIndex) => (
                  <div key={oIndex} className="option-group">
                    <label htmlFor={`q${qIndex}-opt${oIndex}`}>
                      Option {oIndex + 1}
                    </label>
                    <div className="option-input-wrapper">
                      <input
                        id={`q${qIndex}-opt${oIndex}`}
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className={question.correctIndex === oIndex ? 'correct-option' : ''}
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctIndex === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                        aria-label={`Marquer comme bonne réponse`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor={`time-${qIndex}`}>
                  Temps limite: {question.timerSec}s
                </label>
                <input
                  id={`time-${qIndex}`}
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={question.timerSec}
                  onChange={(e) => updateQuestion(qIndex, 'timerSec', Number(e.target.value))}
                  className="time-slider"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addQuestion} className="btn-add-question">
          ➕ Ajouter une question
        </button>

        <button
          type="submit"
          className="btn-create-quiz"
          disabled={!isValid}
        >
          🚀 Créer le quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
