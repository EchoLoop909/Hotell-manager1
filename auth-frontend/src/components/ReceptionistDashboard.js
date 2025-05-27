import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Trang chủ lễ tân</h1>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </header>

      <main className="dashboard-main">
        <h2>Chào mừng bạn đến với hệ thống lễ tân</h2>
        <p>Sử dụng các chức năng dưới đây để quản lý khách sạn một cách hiệu quả:</p>

        <div className="nav-grid">
          <Link to="/receptionist/search-room" className="nav-card">
            Tìm kiếm phòng trống
          </Link>
          <Link to="/receptionist/book" className="nav-card">
            Đặt phòng
          </Link>
          <Link to="/receptionist/cancel-booking" className="btn btn-danger">
            Hủy đặt phòng
          </Link>
          <Link to="/receptionist/invoices" className="nav-card">
            Xem hóa đơn
          </Link>
          <Link to="/receptionist/custommer" className="nav-card">
            Xem thông tin khách hàng
          </Link>
          <Link to="/receptionist/employeeUpdate" className="nav-card">
            Update thông itn bản thân
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;