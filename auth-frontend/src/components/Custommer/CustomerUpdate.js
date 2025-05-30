// import React, { useEffect, useState } from "react";
// import axios from "axios";
//
// function CustomerUpdate() {
//   const [customer, setCustomer] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);
//
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("Bạn chưa đăng nhập");
//       return;
//     }
//
//     axios
//         .get("http://localhost:8888/api/v1/customers/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setCustomer(res.data);
//           setForm({
//             name: res.data.name || "",
//             email: res.data.email || "",
//             phone: res.data.phone || "",
//             password: "",
//           });
//           setError(null);
//         })
//         .catch(() => setError("Lấy thông tin khách hàng thất bại"));
//   }, []);
//
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccessMsg(null);
//
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("Bạn chưa đăng nhập");
//       return;
//     }
//
//     if (!customer || !customer.customerId) {
//       setError("Không xác định được ID khách hàng");
//       return;
//     }
//
//     const payload = {
//       name: form.name,
//       email: form.email,
//       phone: form.phone,
//       ...(form.password.trim() !== "" && { password: form.password }),
//     };
//
//     axios
//         .put(`http://localhost:8888/api/v1/customers/${customer.customerId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         .then(() => {
//           setSuccessMsg("Cập nhật thông tin thành công!");
//           setError(null);
//           setForm((prev) => ({ ...prev, password: "" }));
//         })
//         .catch(() => {
//           setError("Cập nhật thông tin thất bại");
//         });
//   };
//
//   if (error) return <div>{error}</div>;
//   if (!customer) return <div>Đang tải thông tin...</div>;
//
//   return (
//       <div>
//         <h2>Chỉnh sửa thông tin khách hàng</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Họ và tên:</label><br />
//             <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//             />
//           </div>
//
//           <div>
//             <label>Email:</label><br />
//             <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//             />
//           </div>
//
//           <div>
//             <label>Số điện thoại:</label><br />
//             <input
//                 type="text"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//             />
//           </div>
//
//           <div>
//             <label>Mật khẩu mới (để trống nếu không đổi):</label><br />
//             <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//             />
//           </div>
//
//           <button type="submit">Cập nhật</button>
//         </form>
//
//         {successMsg && <div>{successMsg}</div>}
//       </div>
//   );
// }
//
// export default CustomerUpdate;

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/customer-update.css';

function CustomerUpdate() {
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Khách hàng';
  const userRole = localStorage.getItem('user_role') || 'CUSTOMER';

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Bạn chưa đăng nhập");
      return;
    }

    axios
        .get("http://localhost:8888/api/v1/customers/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCustomer(res.data);
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            password: "",
          });
          setError(null);
        })
        .catch(() => setError("Lấy thông tin khách hàng thất bại"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Bạn chưa đăng nhập");
      return;
    }

    if (!customer || !customer.customerId) {
      setError("Không xác định được ID khách hàng");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      ...(form.password.trim() !== "" && { password: form.password }),
    };

    axios
        .put(`http://localhost:8888/api/v1/customers/${customer.customerId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setSuccessMsg("Cập nhật thông tin thành công!");
          setError(null);
          setForm((prev) => ({ ...prev, password: "" }));
        })
        .catch(() => {
          setError("Cập nhật thông tin thất bại");
        });
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    axios
        .post(
            'http://localhost:8888/api/v1/auth/logout',
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
        )
        .catch(() => {})
        .finally(() => {
          localStorage.clear();
          navigate('/login');
        });
  };

  return (
      <div className="dashboard-wrapper">
        <nav className="navbar">
          <div className="navbar-brand">Hotel Management - Cập nhật thông tin</div>
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
            <li>
              <NavLink
                  to="/customer"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Quay lại Dashboard
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

        <main className="customer-update-container">
          <h1 className="title">Cập nhật thông tin cá nhân</h1>

          {error && <div className="error-message">{error}</div>}
          {!customer ? (
              <div className="loading">Đang tải thông tin...</div>
          ) : (
              <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên <span className="required">*</span></label>
                  <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu mới (để trống nếu không đổi)</label>
                  <input
                      type="password"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-input"
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Cập nhật
                </button>
              </form>
          )}
          {successMsg && <div className="success-message">{successMsg}</div>}
        </main>
      </div>
  );
}

export default CustomerUpdate;