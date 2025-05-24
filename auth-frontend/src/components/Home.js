import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Home = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' }
    });

    useEffect(() => {
        if (!isQuanLy) {
            alert('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/login'), 1000);
        }
    }, [isQuanLy, navigate]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            await authAPI.post('/logout', { refreshToken });
        } catch {
            // ignore
        } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    if (!isQuanLy) {
        return <p className="message error">Bạn không có quyền truy cập trang này</p>;
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management</div>
                <ul className="navbar-menu">
                    <li>
                        <NavLink
                            to="/employees"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý nhân viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customers"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/rooms"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/invoices"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/services"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý dịch vụ
                        </NavLink>
                    </li>
                </ul>
                <div className="navbar-user">
                    <span>Xin chào, {userName} ({userRole})</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </nav>
            <div className="dashboard-container">
                <h2>Dashboard Quản lý Khách sạn</h2>
                <div className="dashboard-grid">
                    <NavLink to="/employees" className="dashboard-card">
                        <h3>Quản lý nhân viên</h3>
                        <p>Thêm, sửa, xóa thông tin nhân viên (Lễ tân, Quản lý).</p>
                    </NavLink>
                    <NavLink to="/customers" className="dashboard-card">
                        <h3>Quản lý khách hàng</h3>
                        <p>Thêm, sửa, xóa thông tin khách hàng.</p>
                    </NavLink>
                    <NavLink to="/rooms" className="dashboard-card">
                        <h3>Quản lý phòng</h3>
                        <p>Quản lý danh sách phòng, loại phòng, giá và trạng thái.</p>
                    </NavLink>
                    <NavLink to="/invoices" className="dashboard-card">
                        <h3>Quản lý hóa đơn</h3>
                        <p>Xem, tạo hóa đơn cho các đơn đặt phòng và dịch vụ.</p>
                    </NavLink>
                    <NavLink to="/services" className="dashboard-card">
                        <h3>Quản lý dịch vụ</h3>
                        <p>Quản lý các dịch vụ bổ sung (ăn sáng, giặt ủi, v.v.).</p>
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default Home;