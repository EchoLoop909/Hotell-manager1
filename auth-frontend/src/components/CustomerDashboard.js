// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
//
// const CustomerDashboard = () => {
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('user_role');
//         navigate('/login');
//     };
//
//     return (
//         <div>
//             <header>
//                 <h1>Trang chủ khách hàng</h1>
//                 <button onClick={handleLogout}>Đăng xuất</button>
//             </header>
//
//             <main>
//                 <h2>Chào mừng bạn đến với hệ thống khách sạn</h2>
//                 <p>Hãy chọn chức năng bên dưới để bắt đầu:</p>
//
//                 <div>
//                     <Link to="/customer/SearchRoom">Tìm kiếm phòng trống</Link>
//                     <br />
//                     <Link to="/customer/book">Đặt phòng</Link>
//                     <br />
//                     <Link to="/customer/cancelbooking">Hủy đặt phòng</Link>
//                     <br />
//                     <Link to="/customer/invoices">Xem và thanh toán hóa đơn</Link>
//                     <br />
//                     <Link to="/customer/profile">Cập nhật thông tin cá nhân</Link>
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default CustomerDashboard;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/customer-dashboard.css';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Khách hàng';
    const userRole = localStorage.getItem('user_role') || 'CUSTOMER';

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refresh_token');
        fetch('http://localhost:8888/api/v1/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })
            .catch(() => {})
            .finally(() => {
                localStorage.clear();
                navigate('/login');
            });
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Khách hàng</div>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/customer/searchRoom"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Tìm kiếm phòng trống
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/book"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/cancelbooking"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Hủy đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/invoices"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Xem và thanh toán hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/profile"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Cập nhật thông tin cá nhân
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

            <main className="dashboard-container">
                <h1 className="title">Trang chủ khách hàng</h1>
                <div className="welcome-message">
                    <h2>Chào mừng bạn đến với hệ thống khách sạn</h2>
                    <p>Hãy chọn chức năng từ menu phía trên để bắt đầu.</p>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;