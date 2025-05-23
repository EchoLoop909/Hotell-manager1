import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8888/api/v1/auth/authenticate', {
                email,
                password,
            });

            const { access_token, refresh_token, user } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user_name', user.name);
            localStorage.setItem('user_role', user.role);

            setMessage('Đăng nhập thành công');

            switch (user.role) {
                case 'CUSTOMER':
                    navigate('/customer');
                    break;
                case 'QUAN_LY':
                    navigate('/home');
                    break;
                case 'LE_TAN':
                    navigate('/receptionist');
                    break;
                default:
                    setMessage('Vai trò không hợp lệ');
                    localStorage.clear();
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">Employee Management</div>
            </nav>
            <div className="component-container login-container">
                <h2>Đăng nhập</h2>
                {message && (
                    <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
                {loading && <div className="loader"></div>}
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <p>
                    Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký</Link>
                </p>
            </div>
        </>
    );
};

export default Login;