// src/components/RoomManagement.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/RoomManagement.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ sku: '', typeId: 0, price: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';
  const token = localStorage.getItem('access_token');

  const api = axios.create({
    baseURL: 'http://localhost:8888/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesRes, roomsRes] = await Promise.all([
        api.get('/roomType/search'),
        api.get('/rooms/getall'),
      ]);
      setRoomTypes(typesRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      setMessage('Lỗi tải dữ liệu: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isQuanLy) {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
      return;
    }
    fetchData();
  }, [isQuanLy, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'typeId' ? Number(value) : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.sku || !form.typeId || !form.price) {
      setMessage('Vui lòng điền đầy đủ');
      return;
    }
    setLoading(true);
    try {
      if (editingId == null) {
        await api.post('/rooms/create', { sku: form.sku, typeId: form.typeId, price: Number(form.price) });
        setMessage('Tạo phòng thành công');
      } else {
        await api.put(`/rooms/${editingId}`, { sku: form.sku, typeId: form.typeId, price: Number(form.price) });
        setMessage('Cập nhật phòng thành công');
      }
      setForm({ sku: '', typeId: 0, price: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setMessage('Lỗi lưu phòng: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = r => {
    setEditingId(r.roomId);
    setForm({ sku: r.sku, typeId: r.typeId, price: r.price });
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Xác nhận xóa?')) return;
    setLoading(true);
    try {
      await api.delete(`/rooms/${id}`);
      setMessage('Xóa phòng thành công');
      fetchData();
    } catch {
      setMessage('Lỗi xóa phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await axios.post('http://localhost:8888/api/v1/auth/logout', { refreshToken });
    } catch {}
    localStorage.clear();
    navigate('/');
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
            Xin chào, {userName} ({userRole})
          </span>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="container">
        <h2>Quản lý phòng</h2>
        {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
        {loading && <div className="loader"></div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="sku">
              Mã phòng <span className="required">*</span>
            </label>
            <input
              id="sku"
              name="sku"
              placeholder="Mã phòng"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="typeId">
              Kiểu phòng <span className="required">*</span>
            </label>
            <select id="typeId" name="typeId" value={form.typeId} onChange={handleChange} required>
              <option value={0}>-- Chọn kiểu phòng --</option>
              {roomTypes.map(rt => (
                <option key={rt.typeId} value={rt.typeId}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">
              Giá <span className="required">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="Giá"
              value={form.price}
              onChange={handleChange}
              required
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
                  setForm({ sku: '', typeId: 0, price: '' });
                  setMessage('');
                }}
                disabled={loading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        <h3>Danh sách phòng</h3>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Mã phòng</th>
              <th>Kiểu</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map(r => (
                <tr key={r.roomId}>
                  <td>{r.sku}</td>
                  <td>{roomTypes.find(rt => rt.typeId === r.typeId)?.name || ''}</td>
                  <td>{Number(r.price).toLocaleString()}</td>
                  <td>{r.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(r)} disabled={loading}>
                      Sửa
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(r.roomId)} disabled={loading}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Không có phòng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomManagement;
