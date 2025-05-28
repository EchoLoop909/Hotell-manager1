import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    return (
        <div>
            <header>
                <h1>Trang chủ khách hàng</h1>
                <button onClick={handleLogout}>Đăng xuất</button>
            </header>

            <main>
                <h2>Chào mừng bạn đến với hệ thống khách sạn</h2>
                <p>Hãy chọn chức năng bên dưới để bắt đầu:</p>

                <div>
                    <Link to="/customer/SearchRoom">Tìm kiếm phòng trống</Link>
                    <br />
                    <Link to="/customer/book">Đặt phòng</Link>
                    <br />
                    <Link to="/customer/cancelbooking">Hủy đặt phòng</Link>
                    <br />
                    <Link to="/customer/invoices">Xem và thanh toán hóa đơn</Link>
                    <br />
                    <Link to="/customer/profile">Cập nhật thông tin cá nhân</Link>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
