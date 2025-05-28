import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (error) return <div>{error}</div>;
  if (!customer) return <div>Đang tải thông tin...</div>;

  return (
      <div>
        <h2>Chỉnh sửa thông tin khách hàng</h2>
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
            <label>Số điện thoại:</label><br />
            <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
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

          <button type="submit">Cập nhật</button>
        </form>

        {successMsg && <div>{successMsg}</div>}
      </div>
  );
}

export default CustomerUpdate;
