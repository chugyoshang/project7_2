import React, { useState } from 'react';
import './Question.css';
const Question = ({ question, onAnswerSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleAnswerSelect = (option) => {
    if (question.type === 'MAQ') {
      // 다중 선택 처리
      if (selectedAnswers.includes(option)) {
        setSelectedAnswers(selectedAnswers.filter(a => a !== option));
      } else {
        setSelectedAnswers([...selectedAnswers, option]);
      }
    } else {
      // 단일 선택 처리
      setSelectedAnswers([option]);
    }
  };
  
  const handleSubmit = () => {
    let isCorrect = false;
    
    // 문제 유형에 따른 정답 체크
    switch(question.type) {
      case 'MCQ': // 객관식
        // 문자열로 변환하여 비교 (타입 불일치 문제 해결)
        isCorrect = String(selectedAnswers[0]) === String(question.answer);
        break;
      case 'TF': // 참/거짓
        isCorrect = String(selectedAnswers[0]) === String(question.answer);
        break;
      case 'MAQ': // 다중 선택
        // 정답이 배열인 경우
        const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
        isCorrect = 
          selectedAnswers.length === correctAnswers.length && 
          selectedAnswers.every(a => correctAnswers.some(ca => String(a) === String(ca)));
        break;
      default:
        // 기본적으로 단일 선택형 처리
        isCorrect = String(selectedAnswers[0]) === String(question.answer);
        break;
    }
    
    // 정답 확인 디버깅 로그 추가
    console.log('제출한 답변:', selectedAnswers);
    console.log('정답:', question.answer);
    console.log('정답 여부:', isCorrect);
    
    // 피드백 표시
    setShowFeedback(true);
    
    // 3초 후에 다음 문제로
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswers([]);
      onAnswerSubmit(selectedAnswers[0] || selectedAnswers, isCorrect); // 단일 선택일 경우 첫 번째 항목만 전달
    }, 3000);
  };
  
  
  
  return (
    <div className="question-container">
      <div className="question-header">
        <span className="question-category">{question.category}</span>
        <span className="question-difficulty">{question.difficulty}</span>
        <span className="question-points">{question.points}10점</span>
      </div>
      
      <h2 className="question-text">{question.question}</h2>
      
      {question.image && (
        <div className="question-image">
          <img src={question.image} alt="문제 이미지" />
        </div>
      )}
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`option ${selectedAnswers.includes(option) ? 'selected' : ''}`}
            onClick={() => !showFeedback && handleAnswerSelect(option)}
          >
            {question.type === 'MAQ' ? (
              <input 
                type="checkbox" 
                checked={selectedAnswers.includes(option)} 
                readOnly 
              />
            ) : (
              <input 
                type="radio" 
                checked={selectedAnswers.includes(option)} 
                readOnly 
              />
            )}
            <span>{option}</span>
          </div>
        ))}
      </div>
      
      {showFeedback ? (
        <div className="feedback">
          <h3>정답: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}</h3>
          <p className="explanation">{question.explanation}</p>
          <p className="source">출처: {question.source}</p>
        </div>
      ) : (
        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0}
        >
          제출하기
        </button>
      )}
    </div>
  );
};

export default Question;
