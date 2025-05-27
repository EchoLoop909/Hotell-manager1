import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Trang chủ khách hàng</h1>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </header>

      <main className="dashboard-main">
        <h2>Chào mừng bạn đến với hệ thống khách sạn</h2>
        <p>Hãy chọn chức năng bên dưới để bắt đầu:</p>

        <div className="nav-grid">
          <Link to="/customer/SearchRoom" className="nav-card">
             Tìm kiếm phòng trống
          </Link>
          <Link to="/customer/book" className="nav-card">
             Đặt phòng
          </Link>
          <Link to="/customer/cancel-booking" className="nav-card">
             Hủy đặt phòng
          </Link>
          <Link to="/customer/invoices" className="nav-card">
             Xem và thanh toán hóa đơn
          </Link>
          <Link to="/customer/profile" className="nav-card">
             Cập nhật thông tin cá nhân
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
