import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CustomerHome from './components/CustomerHome';
import ReceptionistHome from './components/ReceptionistHome';
import './styles.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('user_role');
  if (!userRole || (allowedRole && userRole !== allowedRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className={isLoginPage ? 'login-page' : ''}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="QUAN_LY">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="QUAN_LY">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute allowedRole="LE_TAN">
              <ReceptionistHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
