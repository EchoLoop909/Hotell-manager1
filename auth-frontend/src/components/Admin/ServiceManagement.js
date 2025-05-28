import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/admin.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', description: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';

  const token = localStorage.getItem('access_token');

  const api = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:8888/api/Service',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
  }, [token]);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/search');
      setServices(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Lỗi tải dữ liệu: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (isQuanLy) loadServices();
    else {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [isQuanLy, navigate, loadServices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setMessage('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        id: form.id,
        name: form.name,
        description: form.description,
        price: Number(form.price),
      };
      if (editingId == null) {
        await api.post('/create', payload);
        setMessage('Tạo dịch vụ thành công');
      } else {
        await api.put('/services', payload);
        setMessage('Cập nhật dịch vụ thành công');
      }
      setForm({ id: null, name: '', description: '', price: '' });
      setEditingId(null);
      await loadServices();
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.serviceId);
    setForm({
      id: service.serviceId,
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
    });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa dịch vụ này?')) return;
    setLoading(true);
    setMessage('');
    try {
      await api.delete(`/services/${id}`);
      setMessage('Xóa dịch vụ thành công');
      setServices((prev) => prev.filter((s) => s.serviceId !== id));
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' },
      });
      const refreshToken = localStorage.getItem('refresh_token');
      await authAPI.post('/logout', { refreshToken });
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      navigate('/');
    }
  };

  if (!isQuanLy) {
    return <p>{message}</p>;
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
          <h2>Quản lý Dịch vụ</h2>
          {message && <p>{message}</p>}
          {loading && <p>Đang tải...</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Tên dịch vụ *
                <input name="name" value={form.name} onChange={handleChange} disabled={loading} required />
              </label>
            </div>
            <div>
              <label>
                Mô tả
                <textarea name="description" value={form.description} onChange={handleChange} disabled={loading} />
              </label>
            </div>
            <div>
              <label>
                Giá *
                <input name="price" type="number" value={form.price} onChange={handleChange} disabled={loading} required />
              </label>
            </div>
            <div>
              <button type="submit" disabled={loading}>
                {editingId == null ? 'Tạo mới' : 'Cập nhật'}
              </button>
              {editingId != null && (
                  <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({ id: null, name: '', description: '', price: '' });
                        setMessage('');
                      }}
                      disabled={loading}
                  >
                    Hủy
                  </button>
              )}
            </div>
          </form>

          <h3>Danh sách dịch vụ</h3>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {services.length ? (
                services.map((s) => (
                    <tr key={s.serviceId}>
                      <td>{s.serviceId}</td>
                      <td>{s.name}</td>
                      <td>{s.description || 'Không có'}</td>
                      <td>{Number(s.price).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleEdit(s)} disabled={loading}>Sửa</button>
                        <button onClick={() => handleDelete(s.serviceId)} disabled={loading}>Xóa</button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="5">Không có dữ liệu</td>
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

export default ServiceManagement;
