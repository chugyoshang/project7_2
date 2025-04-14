import React, { useEffect, useState } from 'react';
import './Timer.css';

const Timer = ({ timeout, onTimeout, questionIndex }) => { // ✅ questionIndex prop 추가
  const [timeLeft, setTimeLeft] = useState(timeout);

  useEffect(() => {
    setTimeLeft(timeout); // ✅ 새로운 문제마다 타이머 초기화
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionIndex, timeout, onTimeout]); // ✅ questionIndex 의존성 추가

  return (
    <div className="timer-container">
      <div className="timer-text">{timeLeft}초</div>
      <div className="timer-bar-container">
        <div 
          className="timer-bar" 
          style={{ width: `${(timeLeft/timeout)*100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
