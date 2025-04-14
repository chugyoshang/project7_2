// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizContainer from './components/Quiz/QuizContainer';
// import Leaderboard from './components/Leaderboard/Leaderboard';
import Results from './components/Quiz/Results';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import PrivateRoute from './components/Auth/PrivateRoute';
import { QuizProvider } from './context/QuizContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Home';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className="app-container">
            <h1 className="app-title">의료 퀴즈 앱</h1>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <QuizContainer />
                </PrivateRoute>
              } />
              <Route path="/results" element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              } />
              <Route path="/leaderboard" element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
