// src/components/Quiz/Results.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import './Results.css';

const Results = () => {
  const { state, dispatch } = useQuiz();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false); // 점수 저장 여부 추적
  
  const { 
    score, 
    answers, 
    questions, 
    selectedCategory, 
    selectedDifficulty 
  } = state;
  
  // 총 가능한 점수 계산 (NaN 방지)
  const totalPoints = questions.reduce((total, q) => total + (q.points || 10), 0);
  
  // 정답 개수 계산
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  
  // 정답률 계산 (0으로 나누기 방지)
  const percentage = questions.length > 0 
    ? Math.round((correctAnswers / questions.length) * 100) 
    : 0;
  
  // 디버깅용 로그
  console.log('결과 화면 데이터:', {
    score,
    totalPoints,
    correctAnswers,
    questions: questions.length,
    answers: answers.length,
    selectedCategory,
    selectedDifficulty
  });
  
  useEffect(() => {
    if (currentUser && !saved) {
      try {
        // 점수가 0점이고 난이도가 '미분류'인 경우 저장하지 않음
        if (score === 0 && (selectedDifficulty === '미분류' || !selectedDifficulty)) {
          console.log('0점 미분류 기록은 저장하지 않습니다.');
          setSaved(true);
          return;
        }
        
        // 기존 리더보드 데이터 로드
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        // 새 점수 항목 생성 (필드 최소화)
        const newEntry = {
          name: currentUser.nickname || currentUser.displayName || '사용자',
          score, // 점수 필드
          difficulty: selectedDifficulty || '미분류',
          date: new Date().toLocaleDateString()
        };
        
        console.log('리더보드에 저장 시도:', newEntry);
  
        // 중복 체크 개선: 동일 사용자+난이도+점수+날짜 조합 체크
        const isDuplicate = leaderboard.some(entry => 
          entry.name === newEntry.name && 
          entry.difficulty === newEntry.difficulty &&
          entry.score === newEntry.score &&
          entry.date === newEntry.date
        );
        
        // 점수가 0점 이상인 경우만 저장
        if (!isDuplicate && score > 0) {
          // 유효한 기록만 추가
          leaderboard.push(newEntry);
          
          // 점수 내림차순 정렬 (고득점 우선)
          leaderboard.sort((a, b) => b.score - a.score);
          
          // 상위 10개만 저장 (이미지에 맞게 조정)
          localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
          console.log('리더보드 저장 완료!');
        } else if (isDuplicate) {
          console.log('이미 동일한 기록이 존재합니다. 중복 저장 방지됨.');
        } else {
          console.log('0점 기록은 저장하지 않습니다.');
        }
  
        setSaved(true);
      } catch (error) {
        console.error('리더보드 저장 오류:', error);
        setSaved(true); // 오류 발생해도 저장 시도 플래그는 true로 설정
      }
    }
  }, [currentUser, score, selectedDifficulty, saved]);
  

  const handleTryAgain = () => {
    setSaved(false); 
    dispatch({ type: 'RESET_QUIZ' });
    navigate('/');
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  
  return (
    <div className="results-container">
      <h2>퀴즈 결과</h2>
      
      <div className="score-summary">
        <p className="total-score">총점: {score} / {totalPoints}</p>
        <p className="correct-count">정답 수: {correctAnswers} / {questions.length}</p>
        <p className="percentage">정답률: {percentage}%</p>
      </div>
      
      <div className="answers-review">
        <h3>문제 리뷰</h3>
        {answers?.map((answer, index) => (
          <div 
            key={index} 
            className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <h4>문제 {index + 1}: {answer.question}</h4>
            <p>내 답변: {Array.isArray(answer.userAnswer) ? answer.userAnswer.join(', ') : answer.userAnswer || '답변 없음'}</p>
            <p>정답: {Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(', ') : answer.correctAnswer}</p>
          </div>
        ))}
      </div>
      
      <div className="action-buttons">
        <button onClick={handleTryAgain}>다시 시도</button>
        <button onClick={handleViewLeaderboard}>리더보드 보기</button>
        {currentUser && (
        <button onClick={() => logout()} className="logout-button">
          로그아웃
        </button>
        )}
      </div>
    </div>
  );
};

export default Results;
