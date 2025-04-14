import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 상대 경로 수정
import '../components/Home.css';


const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // logout 함수 가져오기

  const handleStartQuiz = () => {
    navigate('/quiz'); // 퀴즈 화면으로 이동
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">의료 퀴즈 앱</h1>
        <p className="home-subtitle">난이도를 선택하세요</p>
        <div className="difficulty-selection">
          <button
            className="difficulty-button"
            onClick={() => navigate('/quiz?difficulty=easy')}
          >
            초급
          </button>
          <button
            className="difficulty-button"
            onClick={() => navigate('/quiz?difficulty=medium')}
          >
            중급
          </button>
          <button
            className="difficulty-button"
            onClick={() => navigate('/quiz?difficulty=hard')}
          >
            고급
          </button>
        </div>
        {/* 로그아웃 버튼 추가 */}
        <button onClick={logout} className="logout-button">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Home;
