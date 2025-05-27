import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../../styles/ReceptionistHome.css';

const EmployeeUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const navigate = useNavigate();
    const token = localStorage.getItem('access_token') || '';
    let decoded = {};
    try {
        decoded = jwtDecode(token);  // KHÔNG khai báo const mới ở đây
    } catch (e) {
        console.error('Invalid token', e);
    }

    const userId = decoded.id || decoded.sub || null;
    const userName = decoded.name || '';
    const userRole = decoded.role || '';
    const allowedRoles = ['LE_TAN'];
    const isLeTan = allowedRoles.includes(userRole);

    const empAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/employees',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    useEffect(() => {
        if (!isLeTan) {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/'), 1000);
            return;
        }
        if (!userId) {
            setMessage('Không xác định được ID người dùng từ token');
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                const res = await empAPI.get('/get', { params: { id: userId } });
                const data = res.data;
                setForm({ name: data.name || '', email: data.email || '', password: '' });
            } catch (err) {
                setMessage('Lỗi khi lấy thông tin: ' + (err.response?.data || err.message));
            }
        };
        fetchCurrentUser();
    }, [empAPI, userId, isLeTan, navigate]);

    const handleUpdate = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (!userId) {
            setMessage('Không xác định được ID người dùng để cập nhật');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: form.name,
                email: form.email,
                ...(form.password ? { password: form.password } : {})
            };
            // Lưu ý: tham số thứ 3 mới là config chứa params
            await empAPI.put('/update', payload, { params: { id: userId } });
            setMessage('Cập nhật thông tin thành công');
            localStorage.setItem('user_name', form.name);
        } catch (err) {
            setMessage('Lỗi cập nhật: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8888/api/v1/auth/logout', {
                refreshToken: localStorage.getItem('refresh_token')
            });
        } catch {}
        finally {
            localStorage.clear();
            navigate('/login'); // nên chuyển về trang login
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management</div>
                <div className="navbar-user">
                    <span>Xin chào, {userName} ({userRole})</span>
                    <button className="logout-btn" onClick={handleLogout} disabled={loading}>
                        Đăng xuất
                    </button>
                </div>
            </nav>

            <div className="container">
                <h2>Cập nhật thông tin cá nhân</h2>
                {message && (
                    <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
                {loading && <div className="loader"></div>}

                <form onSubmit={handleUpdate} className="form" style={{ maxWidth: '600px' }}>
                    <div className="form-group">
                        <label htmlFor="name">Họ tên</label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Họ tên"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới (để trống nếu không đổi)</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeUpdate;
