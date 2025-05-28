import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
      <div>
        <header>
          <h1>Trang chủ lễ tân</h1>
          <button onClick={handleLogout}>
            Đăng xuất
          </button>
        </header>

        <main>
          <h2>Chào mừng bạn đến với hệ thống lễ tân</h2>
          <p>Sử dụng các chức năng dưới đây để quản lý khách sạn một cách hiệu quả:</p>

          <div>
            <Link to="/receptionist/search-room">Tìm kiếm phòng trống</Link>
            <br />
            <Link to="/receptionist/book">Đặt phòng</Link>
            <br />
            <Link to="/receptionist/cancel-booking">Hủy đặt phòng</Link>
            <br />
            <Link to="/receptionist/invoices">Xem hóa đơn</Link>
            <br />
            <Link to="/receptionist/custommer">Xem thông tin khách hàng</Link>
            <br />
            <Link to="/receptionist/employeeUpdate">Update thông tin bản thân</Link>
          </div>
        </main>
      </div>
  );
};

export default ReceptionistDashboard;
