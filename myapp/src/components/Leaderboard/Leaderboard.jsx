import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Leaderboard.css'; // CSS 파일 import 추가

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  // 리더보드 데이터 로드 함수
  const loadLeaderboardData = () => {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setLeaderboard(leaderboardData);
  };

  // 리더보드 초기화 함수 - 관리자만 가능
  const handleResetLeaderboard = () => {
    if (!currentUser?.isAdmin) {
      alert('리더보드를 초기화할 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말 리더보드를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('leaderboard');
      setLeaderboard([]);
      alert('리더보드가 초기화되었습니다.');
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-box"> {/* 추가: 흰색 박스 컨테이너 */}
        <h2 className="leaderboard-title">리더보드</h2>

        {leaderboard.length === 0 ? (
          <p className="no-data">아직 기록이 없습니다.</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>이름</th>
                <th>점수</th>
                <th>난이도</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.nickname || entry.name || '사용자'}</td>
                  <td>{entry.score}</td>
                  <td>{entry.difficulty}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="button-container"> {/* 추가: 버튼 컨테이너 */}
          {/* 관리자만 초기화 버튼 표시 */}
          {currentUser?.nickname === '관리자' && (
            <button onClick={handleResetLeaderboard} className="reset-button">
              리더보드 초기화
            </button>
          )}

          {/* 돌아가기 버튼 */}
          <button onClick={() => navigate('/')} className="back-button">
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
