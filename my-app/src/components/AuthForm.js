// src/components/AuthForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, authenticate } from '../api';
import '../styles.css';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '', // Thêm trường phone
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isRegister) {
        // Gửi dữ liệu đăng ký bao gồm name và phone
        const response = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        });
        setMessage(response);
        setIsRegister(false); // Chuyển về tab Đăng nhập
        setFormData({ email: '', password: '', name: '', phone: '' }); // Reset form
      } else {
        // Gửi dữ liệu đăng nhập chỉ với email và password
        const response = await authenticate({
          email: formData.email,
          password: formData.password,
        });
        setMessage('Đăng nhập thành công');
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user_name', response.user.name);
        localStorage.setItem('user_role', response.user.role);
        navigate('/home'); // Chuyển hướng đến trang chủ
      }
    } catch (error) {
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <div className="auth-tabs">
        <input
          type="radio"
          id="login"
          name="auth-type"
          checked={!isRegister}
          onChange={() => setIsRegister(false)}
        />
        <label htmlFor="login">Đăng nhập</label>
        <input
          type="radio"
          id="register"
          name="auth-type"
          checked={isRegister}
          onChange={() => setIsRegister(true)}
        />
        <label htmlFor="register">Đăng ký</label>
      </div>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10,11}" // Chỉ cho phép 10-11 số
              title="Số điện thoại phải có 10 hoặc 11 số"
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </button>
        {loading && <div className="loader"></div>}
      </form>
      {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
};

export default AuthForm;