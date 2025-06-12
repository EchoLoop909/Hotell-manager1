// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../../styles/employee-update.css"
// function EmployeeUpdate() {
//   const [employee, setEmployee] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     employee_role: "",
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
//         .get("http://localhost:8888/api/v1/employees/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setEmployee(res.data);
//           setForm({
//             name: res.data.name,
//             email: res.data.email,
//             password: "", // không hiện mật khẩu cũ, để trống để nhập mới
//             employee_role: res.data.employee_role,
//           });
//           setError(null);
//         })
//         .catch(() => setError("Lấy thông tin người dùng thất bại"));
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
//     if (!employee || !employee.id) {
//       setError("Không xác định được ID nhân viên");
//       return;
//     }
//
//     axios
//         .put(
//             `http://localhost:8888/api/v1/employees/update?id=${employee.id}`,
//             {
//               name: form.name,
//               email: form.email,
//               password: form.password,
//               employee_role: form.employee_role,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//         )
//         .then(() => {
//           setSuccessMsg("Cập nhật thông tin thành công!");
//           setError(null);
//           setForm((prev) => ({ ...prev, password: "" })); // reset password input
//         })
//         .catch(() => setError("Cập nhật thông tin thất bại"));
//   };
//
//   if (error) return <div>{error}</div>;
//   if (!employee) return <div>Đang tải thông tin...</div>;
//
//   return (
//       <div>
//         <h2>Chỉnh sửa thông tin cá nhân</h2>
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
//             <label>Mật khẩu mới (để trống nếu không đổi):</label><br />
//             <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//             />
//           </div>
//
//           <div>
//             <label>Vai trò:</label><br />
//             <select
//                 name="employee_role"
//                 value={form.employee_role}
//                 onChange={handleChange}
//                 required
//             >
//               <option value="">-- Chọn vai trò --</option>
//               <option value="QUAN_LY">Quản lý</option>
//               <option value="LE_TAN">Lễ tân</option>
//             </select>
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
// export default EmployeeUpdate;

// frontend/src/components/Admin/EmployeeUpdate.js
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import "../../styles/employee-update.css";

function EmployeeUpdate() {
    const [employee, setEmployee] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        employee_role: "",
    });
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem("user_name") || "Lễ tân";
    const userRole = localStorage.getItem("user_role") || "LE_TAN";

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("Bạn chưa đăng nhập");
            return;
        }

        axios
            .get("http://localhost:8888/api/v1/employees/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setEmployee(res.data);
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                    password: "",
                    employee_role: res.data.employee_role,
                });
                setError(null);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Lấy thông tin người dùng thất bại");
            });
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

        if (!employee || !employee.id) {
            setError("Không xác định được ID nhân viên");
            return;
        }

        if (userRole === "LE_TAN" && form.employee_role === "QUAN_LY") {
            setError("Lễ tân không thể đổi thành Quản lý");
            return;
        }

        const payload = {
            name: form.name,
            email: form.email,
            employee_role: form.employee_role,
        };
        if (form.password) {
            payload.password = form.password;
        }

        axios
            .put(
                `http://localhost:8888/api/v1/employees/update?id=${employee.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(() => {
                setSuccessMsg("Cập nhật thông tin thành công!");
                setError(null);
                setForm((prev) => ({ ...prev, password: "" }));
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Cập nhật thông tin thất bại");
            });
    };

    const handleLogout = () => {
        const refreshToken = localStorage.getItem("refresh_token");
        axios
            .post(
                "http://localhost:8888/api/v1/auth/logout",
                { refreshToken },
                { headers: { "Content-Type": "application/json" } }
            )
            .catch(() => {})
            .finally(() => {
                localStorage.clear();
                navigate("/login");
            });
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!employee) return <div className="loading">Đang tải thông tin...</div>;

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Cập nhật thông tin</div>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/receptionist/search-room"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Tìm kiếm phòng trống
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/book"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/cancel-booking"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Hủy đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/invoices"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Xem hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/customer"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Thông tin khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/employeeUpdate"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
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

            <main className="employee-update-container">
                <h1 className="title">Chỉnh sửa thông tin cá nhân</h1>
                <form onSubmit={handleSubmit} className="update-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            Họ và tên <span className="required">*</span>
                        </label>
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
                        <label htmlFor="email">
                            Email <span className="required">*</span>
                        </label>
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
                {successMsg && <div className="success-message">{successMsg}</div>}
            </main>
        </div>
    );
}

export default EmployeeUpdate;