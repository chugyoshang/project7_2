import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import './QuizContainer.css';

const QuizContainer = () => {
  const { state, dispatch } = useQuiz();
  const navigate = useNavigate();

  const {
    selectedDifficulty,
    quizStarted,
    currentQuestionIndex,
    questions,
    quizFinished,
    isLoading,
    error
  } = state;

  // 타이머 종료 시 호출되는 함수 - 방어적 로직 추가
  const handleTimeout = () => {
    // 현재 인덱스가 유효한지 확인
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      dispatch({ type: 'FINISH_QUIZ' });
      navigate('/results');
      return;
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    dispatch({
      type: 'SUBMIT_ANSWER',
      payload: { answer: null, isCorrect: false }
    });

    if (isLastQuestion) {
      dispatch({ type: 'FINISH_QUIZ' });
      navigate('/results');
    } else {
      // 다음 문제로 넘어가기 전에 유효성 검사
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        dispatch({ type: 'NEXT_QUESTION' });
      } else {
        // 안전장치: 다음 문제가 없는 경우
        dispatch({ type: 'FINISH_QUIZ' });
        navigate('/results');
      }
    }
  };

  // 답변 제출 핸들러 - 방어적 로직 추가
  const handleAnswerSubmit = (answer, isCorrect) => {
    // 현재 인덱스가 유효한지 확인
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      dispatch({ type: 'FINISH_QUIZ' });
      navigate('/results');
      return;
    }

    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer, isCorrect } });

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      dispatch({ type: 'FINISH_QUIZ' });
      navigate('/results');
    } else {
      // 다음 문제로 넘어가기 전에 유효성 검사
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        dispatch({ type: 'NEXT_QUESTION' });
      } else {
        // 안전장치: 다음 문제가 없는 경우
        dispatch({ type: 'FINISH_QUIZ' });
        navigate('/results');
      }
    }
  };

  // 퀴즈 종료 감지
  useEffect(() => {
    if (quizFinished) {
      navigate('/results');
    }
  }, [quizFinished, navigate]);

  // 로딩 상태 처리
  if (isLoading) {
    return <div className="loading-container">문제를 불러오는 중입니다...</div>;
  }

  // 에러 처리
  if (error) {
    return (
      <div className="error-container">
        <div className="quiz-box">
          <p>오류 발생: {error}</p>
          <button 
            onClick={() => {
              dispatch({ type: 'RESET_QUIZ' });
              navigate('/');
            }}
            className="retry-button"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 난이도 선택 화면
  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-box">
          <h2>난이도를 선택하세요</h2>
          <div className="difficulty-selection">
            <button
              className={selectedDifficulty === '초급' ? 'selected' : ''}
              onClick={() => dispatch({ type: 'SET_DIFFICULTY', payload: '초급' })}
            >
              초급
            </button>
            <button
              className={selectedDifficulty === '중급' ? 'selected' : ''}
              onClick={() => dispatch({ type: 'SET_DIFFICULTY', payload: '중급' })}
            >
              중급
            </button>
            <button
              className={selectedDifficulty === '고급' ? 'selected' : ''}
              onClick={() => dispatch({ type: 'SET_DIFFICULTY', payload: '고급' })}
            >
              고급
            </button>
          </div>

          {selectedDifficulty && (
            <button
              className="start-quiz-btn"
              onClick={() => dispatch({ type: 'FILTER_QUESTIONS' })}
            >
              퀴즈 시작
            </button>
          )}
        </div>
      </div>
    );
  }

  // 문제가 없는 경우 처리 추가
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-box">
          <p>선택한 난이도에 해당하는 문제가 없습니다.</p>
          <button 
            onClick={() => dispatch({ type: 'RESET_QUIZ' })}
            className="retry-button"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 퀴즈 메인 화면 렌더링 - 방어적 렌더링 추가
  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <div className="quiz-header">
          <div className="question-progress">
            문제 {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="timer-display">
            <Timer timeout={30} onTimeout={handleTimeout} questionIndex={currentQuestionIndex} />
          </div>
        </div>
        
        <div className="quiz-content">
          {questions[currentQuestionIndex] ? (
            <Question 
              question={questions[currentQuestionIndex]} 
              onAnswerSubmit={handleAnswerSubmit} 
            />
          ) : (
            <p>다음 문제를 불러오는 중입니다...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
