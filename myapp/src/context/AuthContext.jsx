// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // localStorage에서 사용자 정보를 불러오는 로직
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // src/context/AuthContext.jsx 수정
  const login = (email, password, nickname = '') => {
    // 기존 사용자 정보 불러오기 (이메일 주소로 확인)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    // 사용자가 이미 존재하는지 확인
    const existingNickname = storedUsers[email]?.nickname;
    
    // 닉네임 우선순위: 1. 입력값, 2. 저장된 값, 3. 이메일 아이디
    const userNickname = nickname.trim() || existingNickname || email.split('@')[0];
    
    // 새 사용자 객체 생성 (이메일 제거 또는 변경)
    const user = { 
      email, 
      displayName: userNickname,
      nickname: userNickname,
      isAdmin: userNickname === '관리자'
    };
    
    // 사용자 정보 저장 (이메일 주소를 키로 사용)
    storedUsers[email] = user;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    // 현재 로그인한 사용자 정보 저장
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    
    console.log('로그인 완료:', user); // 디버깅용
    return true;
  };

  // useEffect에서 로그인 상태 복원 (변경 불필요)
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // 관리자 여부 확인
      currentUser.isAdmin = currentUser.nickname === '관리자';
      setCurrentUser(currentUser);
    }
    setLoading(false);
  }, []);

  // 로그아웃 시 현재 사용자만 제거 (변경 불필요)
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  

  // 사용자 정보 업데이트 함수 추가
  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser, // 새 함수 추가
    loading,
    isAdmin: currentUser?.isAdmin || false // 관리자 여부 확인 속성 추가
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
