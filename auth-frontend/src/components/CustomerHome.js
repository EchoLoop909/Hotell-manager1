// frontend/src/components/CustomerHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
const CustomerHome = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    const API = axios.create({
        baseURL: 'http://localhost:8888/api/v1',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    const handleLogout = async () => {
        setLoading(true);
        setMessage('');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            setMessage('Không tìm thấy refresh token');
            localStorage.clear();
            navigate('/');
            setLoading(false);
            return;
        }

        try {
            await API.post('/api/v1/auth/logout', { refreshToken });
            setMessage('Đăng xuất thành công');
            localStorage.clear();
            navigate('/');
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data?.message || error.message));
            localStorage.clear();
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container customer-home-container">
            <h2>Trang Khách Hàng</h2>
            <p>Xin chào, {userName || 'Khách'} ({userRole || 'Không xác định'})</p>
            <button onClick={handleLogout} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng xuất'}
            </button>
            {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
            <div className="customer-features">
                <h3>Chức năng khách hàng</h3>
                <p>Đây là trang dành cho khách hàng. Bạn có thể:</p>
                <ul>
                    <li>Xem lịch sử đặt phòng</li>
                    <li>Đặt phòng mới</li>
                    <li>Cập nhật thông tin cá nhân</li>
                </ul>
            </div>
        </div>
    );
};

export default CustomerHome;