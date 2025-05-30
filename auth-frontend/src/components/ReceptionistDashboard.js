// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
//
// const ReceptionistDashboard = () => {
//   const navigate = useNavigate();
//
//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user_role');
//     navigate('/login');
//   };
//
//   return (
//       <div>
//         <header>
//           <h1>Trang chủ lễ tân</h1>
//           <button onClick={handleLogout}>
//             Đăng xuất
//           </button>
//         </header>
//
//         <main>
//           <h2>Chào mừng bạn đến với hệ thống lễ tân</h2>
//           <p>Sử dụng các chức năng dưới đây để quản lý khách sạn một cách hiệu quả:</p>
//
//           <div>
//             <Link to="/receptionist.css/search-room">Tìm kiếm phòng trống</Link>
//             <br />
//             <Link to="/receptionist.css/book">Đặt phòng</Link>
//             <br />
//             <Link to="/receptionist.css/cancel-booking">Hủy đặt phòng</Link>
//             <br />
//             <Link to="/receptionist.css/invoices">Xem hóa đơn</Link>
//             <br />
//             <Link to="/receptionist.css/custommer">Xem thông tin khách hàng</Link>
//             <br />
//             <Link to="/receptionist.css/employeeUpdate">Update thông tin bản thân</Link>
//           </div>
//         </main>
//       </div>
//   );
// };
//
// export default ReceptionistDashboard;


import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/receptionist.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Lễ tân';
  const userRole = localStorage.getItem('user_role') || 'LE_TAN';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
      <div className="dashboard-wrapper">
        <nav className="navbar">
          <div className="navbar-brand">Hotel Management - Lễ tân</div>
          <ul className="navbar-menu">
            <li>
              <NavLink
                  to="/receptionist/search-room"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Tìm kiếm phòng trống
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/receptionist/book"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Đặt phòng
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/receptionist/cancel-booking"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Hủy đặt phòng
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/receptionist/invoices"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Xem hóa đơn
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/receptionist/customer"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Thông tin khách hàng
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/receptionist/employeeUpdate"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Cập nhật thông tin
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
          <header className="dashboard-header">
            <h1>Trang chủ lễ tân</h1>
          </header>
          <section className="dashboard-content">
            <h2>Chào mừng bạn đến với hệ thống lễ tân</h2>
            <p>Sử dụng các chức năng dưới đây để quản lý khách sạn một cách hiệu quả:</p>
            <div className="dashboard-grid">
              <NavLink to="/receptionist/search-room" className="dashboard-card">
                <h3>Tìm kiếm phòng trống</h3>
                <p>Kiểm tra các phòng hiện có để đặt cho khách.</p>
              </NavLink>
              <NavLink to="/receptionist/book" className="dashboard-card">
                <h3>Đặt phòng</h3>
                <p>Thực hiện đặt phòng cho khách hàng.</p>
              </NavLink>
              <NavLink to="/receptionist/cancel-booking" className="dashboard-card">
                <h3>Hủy đặt phòng</h3>
                <p>Hủy các đặt phòng theo yêu cầu.</p>
              </NavLink>
              <NavLink to="/receptionist/invoices" className="dashboard-card">
                <h3>Xem hóa đơn</h3>
                <p>Quản lý và xem thông tin hóa đơn.</p>
              </NavLink>
              <NavLink to="/receptionist/customer" className="dashboard-card">
                <h3>Thông tin khách hàng</h3>
                <p>Xem và quản lý thông tin khách hàng.</p>
              </NavLink>
              <NavLink to="/receptionist/employeeUpdate" className="dashboard-card">
                <h3>Cập nhật thông tin</h3>
                <p>Cập nhật thông tin cá nhân của bạn.</p>
              </NavLink>
            </div>
          </section>
        </main>
      </div>
  );
};

export default ReceptionistDashboard;