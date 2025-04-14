import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizContainer from './components/Quiz/QuizContainer';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<QuizContainer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
