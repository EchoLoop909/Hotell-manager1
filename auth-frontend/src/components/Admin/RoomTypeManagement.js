import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../../api';
import axios from 'axios';
import '../../styles/RoomTypeManagement.css';

const RoomTypeManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', capacity: '', defaultPrice: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';

  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await fetchRoomTypes();
      setRoomTypes(res.data || []);
      setMessage('');
    } catch (err) {
      setMessage('Lỗi tải kiểu phòng. Vui lòng đăng nhập lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQuanLy) loadRoomTypes();
    else {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [isQuanLy, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        capacity: Number(form.capacity),
        defaultPrice: Number(form.defaultPrice),
      };
      if (editingId == null) {
        await createRoomType(payload);
      } else {
        await updateRoomType(editingId, payload);
      }
      setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
      setEditingId(null);
      await loadRoomTypes();
      setMessage('Lưu thành công');
    } catch (err) {
      setMessage('Lỗi lưu kiểu phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rt) => {
    setEditingId(rt.typeId);
    setForm({
      name: rt.name,
      description: rt.description || '',
      capacity: rt.capacity.toString(),
      defaultPrice: rt.defaultPrice.toString(),
    });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kiểu phòng này?')) return;
    setLoading(true);
    setMessage('');
    try {
      await deleteRoomType(id);
      await loadRoomTypes();
      setMessage('Xóa thành công');
    } catch (err) {
      setMessage('Lỗi xóa kiểu phòng');
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
          <li><NavLink to="/employees" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý nhân viên</NavLink></li>
          <li><NavLink to="/customers" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý khách hàng</NavLink></li>
          <li><NavLink to="/rooms" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý phòng</NavLink></li>
          <li><NavLink to="/room-types" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý kiểu phòng</NavLink></li>
          <li><NavLink to="/invoices" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý hóa đơn</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý dịch vụ</NavLink></li>
        </ul>
        <div className="navbar-user">
          <span>Xin chào, <strong>{userName}</strong> ({userRole})</span>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>Đăng xuất</button>
        </div>
      </nav>

      <section className="container">
        <header className="header">
          <h1>Quản lý Kiểu Phòng</h1>
        </header>

        {message && (
          <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        {loading && <div className="loader"></div>}

        <section className="form-section">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Tên kiểu phòng <span className="required">*</span></label>
              <input id="name" name="name" placeholder="Tên kiểu phòng" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Sức chứa <span className="required">*</span></label>
              <input id="capacity" name="capacity" type="number" placeholder="Sức chứa" value={form.capacity} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label htmlFor="defaultPrice">Giá mặc định <span className="required">*</span></label>
              <input id="defaultPrice" name="defaultPrice" type="number" placeholder="Giá mặc định" value={form.defaultPrice} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea id="description" name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} rows="3" />
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
                    setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
                    setMessage('');
                  }}
                  disabled={loading}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-section">
          <h2>Danh sách Kiểu Phòng</h2>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Sức chứa</th>
                <th>Giá mặc định</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                </tr>
              ) : (
                roomTypes.map((rt) => (
                  <tr key={rt.typeId}>
                    <td>{rt.typeId}</td>
                    <td>{rt.name}</td>
                    <td>{rt.capacity}</td>
                    <td>{Number(rt.defaultPrice).toLocaleString()} đ</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(rt)} disabled={loading}>Sửa</button>{' '}
                      <button className="btn btn-delete" onClick={() => handleDelete(rt.typeId)} disabled={loading}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
    </>
  );
};

export default RoomTypeManagement;
