// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; // Thêm import
import Home from './components/Home';
import CustomerHome from './components/CustomerHome';
import ReceptionistHome from './components/ReceptionistHome';
import './styles/styles.css';

const ProtectedRoute = ({ children, allowedRole }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role');

    useEffect(() => {
        if (!userRole || (allowedRole && userRole !== allowedRole)) {
            navigate('/');
        }
    }, [userRole, allowedRole, navigate]);

    return userRole ? children : null;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Thêm route */}
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
        </Router>
    );
}

export default App;