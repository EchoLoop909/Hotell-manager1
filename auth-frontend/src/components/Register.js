// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const Register = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8888/api/v1/auth/register', {
                name,
                phone,
                email,
                password,
            });

            setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
            setName('');
            setPhone('');
            setEmail('');
            setPassword('');

            // Chuyển hướng về trang đăng nhập sau 2 giây
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra thông tin.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container login-container">
            <h2>Đăng ký</h2>
            <form onSubmit={handleRegister} className="login-form">
                <input
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    title="Số điện thoại phải gồm 10 chữ số"
                />
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
                    minLength="6"
                    title="Mật khẩu phải có ít nhất 6 ký tự"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>
            {message && (
                <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                </p>
            )}
            <p>
                Đã có tài khoản? <Link to="/">Đăng nhập</Link>
            </p>
        </div>
    );
};

export default Register;