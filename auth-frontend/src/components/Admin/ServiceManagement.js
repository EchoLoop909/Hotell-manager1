import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ServiceManagement.css';

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
    return <p className="message error">{message}</p>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">Hotel Management</div>
        <ul className="navbar-menu">
          <li>
            <NavLink to="/employees" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý nhân viên
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý khách hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/rooms" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý phòng
            </NavLink>
          </li>
          <li>
            <NavLink to="/room-types" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý kiểu phòng
            </NavLink>
          </li>
          <li>
            <NavLink to="/invoices" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý hóa đơn
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Quản lý dịch vụ
            </NavLink>
          </li>
        </ul>
        <div className="navbar-user">
          <span>
            Xin chào, <strong>{userName}</strong> ({userRole})
          </span>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="container">
        <h2>Quản lý Dịch vụ</h2>
        {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
        {loading && <div className="loader"></div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>
              Tên dịch vụ <span className="required">*</span>
            </label>
            <input
              name="name"
              placeholder="Tên dịch vụ *"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>
              Giá <span className="required">*</span>
            </label>
            <input
              name="price"
              type="number"
              placeholder="Giá *"
              value={form.price}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editingId == null ? 'Tạo mới' : 'Cập nhật'}
            </button>
            {editingId != null && (
              <button
                type="button"
                className="btn btn-secondary"
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
        <table className="table table-striped table-hover">
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
                    <button className="btn-edit" onClick={() => handleEdit(s)} disabled={loading}>
                      Sửa
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(s.serviceId)} disabled={loading}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ServiceManagement;
