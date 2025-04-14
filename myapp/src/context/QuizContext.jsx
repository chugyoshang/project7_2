import React, { createContext, useReducer, useContext, useEffect } from 'react';
import questions from '../data/questions.json';

const QuizContext = createContext();

const initialState = {
  questions: [],
  allQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  selectedDifficulty: '',
  consecutiveWrong: 0,
  timeRemaining: 30,
  quizStarted: false,
  quizFinished: false,
  filteredQuestions: [],
  isLoading: true,
  error: null
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_QUESTIONS':
      return {
        ...state,
        allQuestions: action.payload.quiz || [],
        questions: action.payload.quiz || [],
        isLoading: false
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'SET_DIFFICULTY':
      return { ...state, selectedDifficulty: action.payload };

    case 'FILTER_QUESTIONS': {
      if (!state.selectedDifficulty) {
        return {
          ...state,
          error: '난이도를 선택해주세요.',
          isLoading: false
        };
      }

      try {
        const filtered = state.questions
          .filter(q => q.difficulty === state.selectedDifficulty)
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);

        if (filtered.length === 0) {
          return {
            ...state,
            error: '선택한 난이도에 해당하는 문제가 없습니다.',
            isLoading: false
          };
        }

        return {
          ...state,
          filteredQuestions: filtered,
          questions: filtered,
          currentQuestionIndex: 0,
          score: 0,
          answers: [],
          consecutiveWrong: 0,
          quizStarted: true,
          quizFinished: false,
          error: null
        };
      } catch (err) {
        console.error('필터링 오류:', err);
        return {
          ...state,
          error: '문제 필터링 중 오류가 발생했습니다.',
          isLoading: false
        };
      }
    }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        timeRemaining: 30
      };

    case 'SUBMIT_ANSWER': {
      const { answer } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];

      let actualIsCorrect = false;
      if (Array.isArray(currentQuestion.answer)) {
        actualIsCorrect = Array.isArray(answer) &&
          answer.length === currentQuestion.answer.length &&
          answer.every(a => currentQuestion.answer.includes(String(a)));
      } else {
        actualIsCorrect = String(answer) === String(currentQuestion.answer);
      }

      const newScore = actualIsCorrect ? state.score + (currentQuestion.points || 10) : state.score;
      const newConsecutiveWrong = actualIsCorrect ? 0 : state.consecutiveWrong + 1;

      return {
        ...state,
        score: newScore,
        consecutiveWrong: newConsecutiveWrong,
        answers: [...state.answers, {
          question: currentQuestion.question,
          userAnswer: answer,
          correctAnswer: currentQuestion.answer,
          isCorrect: actualIsCorrect
        }]
      };
    }

    case 'CHANGE_DIFFICULTY': {
      const newDifficulty = action.payload;

      try {
        const newFiltered = state.allQuestions
          .filter(q => q.difficulty === newDifficulty)
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);

        if (newFiltered.length === 0) {
          return {
            ...state,
            error: `${newDifficulty} 난이도에 해당하는 문제가 없습니다.`,
            isLoading: false
          };
        }

        return {
          ...state,
          selectedDifficulty: newDifficulty,
          questions: newFiltered,
          currentQuestionIndex: 0,
          score: 0,
          answers: [],
          consecutiveWrong: 0,
          error: null
        };
      } catch (err) {
        console.error('난이도 변경 오류:', err);
        return {
          ...state,
          error: '난이도 변경 중 오류가 발생했습니다.',
          isLoading: false
        };
      }
    }

    case 'RESET_CONSECUTIVE_WRONG':
      return {
        ...state,
        consecutiveWrong: 0
      };

    case 'FINISH_QUIZ':
      return { ...state, quizFinished: true };

    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: state.allQuestions,
        isLoading: false
      };

    default:
      return state;
  }
};

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    try {
      if (!questions || !questions.quiz || questions.quiz.length === 0) {
        dispatch({ type: 'SET_ERROR', payload: '문제 데이터 오류' });
        return;
      }
      dispatch({ type: 'INIT_QUESTIONS', payload: questions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '데이터 로딩 실패' });
    }
  }, []);

  useEffect(() => {
    if (state.currentQuestionIndex === state.questions.length - 1) return;
    if (state.consecutiveWrong >= 3) {
      const difficulties = ['초급', '중급', '고급'];
      const currentIndex = difficulties.indexOf(state.selectedDifficulty);

      if (currentIndex > 0) {
        const confirmChange = window.confirm(`연속으로 3번 틀렸습니다! ${difficulties[currentIndex - 1]} 난이도로 변경할까요?`);

        if (confirmChange) {
          dispatch({ type: 'CHANGE_DIFFICULTY', payload: difficulties[currentIndex - 1] });
        } else {
          dispatch({ type: 'RESET_CONSECUTIVE_WRONG' });
        }
      }
    }
  }, [state.consecutiveWrong, state.selectedDifficulty, state.quizFinished]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);