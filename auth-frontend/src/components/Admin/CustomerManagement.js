import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';
  const token = localStorage.getItem('access_token');

  const fetchCustomers = useCallback(async () => {
    if (!token) {
      setMessage('Bạn cần đăng nhập lại');
      return;
    }
    try {
      setLoading(true);
      const resp = await axios.get('http://localhost:8888/api/v1/customers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(resp.data);
    } catch (err) {
      setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isQuanLy) {
      fetchCustomers();
    } else {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [fetchCustomers, isQuanLy, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const payload = { ...form };
    if (editingId && !form.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8888/api/v1/customers/${editingId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Cập nhật khách hàng thành công');
      } else {
        await axios.post('http://localhost:8888/api/v1/customers/add', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Thêm khách hàng thành công');
      }
      setForm({ name: '', email: '', phone: '', password: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cust) => {
    setEditingId(cust.customerId);
    setForm({ name: cust.name, email: cust.email, phone: cust.phone, password: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8888/api/v1/customers/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Xóa thành công');
      fetchCustomers();
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await axios.post('http://localhost:8888/api/v1/auth/logout', { refreshToken }, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {}
    localStorage.clear();
    navigate('/');
  };

  if (!isQuanLy) {
    return <p className="message error">{message}</p>;
  }

  return (
      <>
        <nav>
          <div>Hotel Management</div>
          <ul>
            <li><NavLink to="/employees">Quản lý nhân viên</NavLink></li>
            <li><NavLink to="/customers">Quản lý khách hàng</NavLink></li>
            <li><NavLink to="/rooms">Quản lý phòng</NavLink></li>
            <li><NavLink to="/room-types">Quản lý kiểu phòng</NavLink></li>
            <li><NavLink to="/invoices">Quản lý hóa đơn</NavLink></li>
            <li><NavLink to="/services">Quản lý dịch vụ</NavLink></li>
          </ul>
          <div>
            <span>Xin chào, {userName} ({userRole})</span>
            <button onClick={handleLogout} disabled={loading}>Đăng xuất</button>
          </div>
        </nav>

        <div className="component-container">
          <h2>Quản lý khách hàng</h2>
          {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
          {loading && <div className="loading">Đang tải...</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label htmlFor="name">Họ tên *</label>
              <input
                  id="name"
                  name="name"
                  placeholder="Họ tên"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
              />
            </div>
            <div>
              <label htmlFor="email">Email *</label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
              />
            </div>
            <div>
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                  id="phone"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
              />
            </div>
            <div>
              <label htmlFor="password">
                Mật khẩu {editingId ? '(Để trống nếu không đổi)' : '*'}
              </label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                  autoComplete={editingId ? "new-password" : "current-password"}
              />
            </div>
            <div>
              <button type="submit" disabled={loading}>
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              {editingId && (
                  <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({ name: '', email: '', phone: '', password: '' });
                        setMessage('');
                      }}
                      disabled={loading}
                  >
                    Hủy
                  </button>
              )}
            </div>
          </form>

          <h3>Danh sách khách hàng</h3>
          <table>
            <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {customers.length > 0 ? (
                customers.map((c) => (
                    <tr key={c.customerId}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>
                        <button onClick={() => handleEdit(c)} disabled={loading} type="button">
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(c.customerId)} disabled={loading} type="button">
                          Xóa
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="4">Không có khách hàng nào</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        <style>{`
        nav {
          background-color: #333;
          color: #fff;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        nav ul {
          list-style: none;
          display: flex;
          gap: 10px;
          padding: 0;
          margin: 0;
        }

        nav ul li a {
          color: white;
          text-decoration: none;
        }

        nav ul li a.active {
          font-weight: bold;
          border-bottom: 2px solid #fff;
        }

        .component-container {
          padding: 20px;
          max-width: 900px;
          margin: auto;
        }

        h2, h3 {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #333;
        }

        form {
          margin-bottom: 20px;
          display: grid;
          gap: 10px;
        }

        form div {
          display: flex;
          flex-direction: column;
        }

        input {
          padding: 8px;
          font-size: 16px;
        }

        button {
          margin-right: 10px;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .loading {
          color: #555;
          font-style: italic;
        }

        .message {
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        table, th, td {
          border: 1px solid #ccc;
        }

        th, td {
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f0f0f0;
        }

        td button {
          margin-right: 5px;
        }
      `}</style>
      </>
  );
};

export default CustomerManagement;
