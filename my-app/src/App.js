// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Home from './components/Home';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Ứng dụng xác thực</h1>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;