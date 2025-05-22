import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../styles/styles.css';
export default function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <div className="auth-form-container">
            <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h2>
            <div className="auth-toggle">
                {isLogin ? (
                    <p>
                        Chưa có tài khoản?{' '}
                        <button onClick={toggleForm} className="auth-toggle-btn">
                            Đăng ký tại đây
                        </button>
                    </p>
                ) : (
                    <p>
                        Đã có tài khoản?{' '}
                        <button onClick={toggleForm} className="auth-toggle-btn">
                            Đăng nhập tại đây
                        </button>
                    </p>
                )}
            </div>
            {isLogin ? <Login onLogin={onLogin} /> : <Register />}
        </div>
    );
}