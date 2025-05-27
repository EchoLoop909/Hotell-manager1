import React, { useEffect, useState } from "react";
import axios from "axios";

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
          password: "", // không hiện mật khẩu cũ, để trống để nhập mới
          employee_role: res.data.employee_role,
        });
        setError(null);
      })
      .catch(() => setError("Lấy thông tin người dùng thất bại"));
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

    axios
      .put(
        `http://localhost:8888/api/v1/employees/update?id=${employee.id}`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          employee_role: form.employee_role,
        },
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
        setForm((prev) => ({ ...prev, password: "" })); // reset password input
      })
      .catch(() => setError("Cập nhật thông tin thất bại"));
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!employee) return <div>Đang tải thông tin...</div>;

  return (
    <div>
      <h2>Chỉnh sửa thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ và tên:</label><br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Mật khẩu mới (để trống nếu không đổi):</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Vai trò:</label><br />
          <select
            name="employee_role"
            value={form.employee_role}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="QUAN_LY">Quản lý</option>
            <option value="LE_TAN">Lễ tân</option>
            {/* Thêm các role khác nếu có */}
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Cập nhật
        </button>
      </form>

      {successMsg && <div style={{ color: "green", marginTop: "10px" }}>{successMsg}</div>}
    </div>
  );
}

export default EmployeeUpdate;

//export default EmployeeUpdate;
