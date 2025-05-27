// // // src/components/RoomManagement.jsx
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
        api.get('/roomType/getall'),
        api.get('/rooms/getall'),
      ]);
      setRoomTypes(typesRes.data);
      const enrichedRooms = roomsRes.data.map(room => {
        const matchedType = typesRes.data.find(rt => rt.typeId === room.typeId);
        return {
          ...room,
          typeName: matchedType ? matchedType.name : 'Không rõ',
        };
      });
      setRooms(enrichedRooms);
      setMessage('');
    } catch (err) {
      setMessage('Lỗi tải dữ liệu: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isQuanLy) {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1500);
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
    if (!form.sku.trim() || !form.typeId || !form.price) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setMessage('Giá phòng phải là số lớn hơn 0');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      if (editingId == null) {
        await api.post('/rooms/create', {
          sku: form.sku.trim(),
          typeId: form.typeId,
          price: Number(form.price),
        });
        setMessage('Tạo phòng thành công');
      } else {
        await api.put(`/rooms/${editingId}`, {
          sku: form.sku.trim(),
          typeId: form.typeId,
          price: Number(form.price),
          status: 'trống',
        });
        setMessage('Cập nhật phòng thành công');
      }
      setForm({ sku: '', typeId: 0, price: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Lỗi không xác định';
      setMessage('Lỗi lưu phòng: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = room => {
    setEditingId(room.roomId);
    setForm({
      sku: room.sku,
      typeId: room.typeId,
      price: room.price,
    });
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
    setLoading(true);
    setMessage('');
    try {
      await api.delete(`/rooms/${id}`);
      setMessage('Xóa phòng thành công');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi xóa phòng';
      setMessage('Lỗi xóa phòng: ' + msg);
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
            <li><NavLink to="/employees" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý nhân viên</NavLink></li>
            <li><NavLink to="/customers" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý khách hàng</NavLink></li>
            <li><NavLink to="/rooms" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý phòng</NavLink></li>
            <li><NavLink to="/room-types" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý kiểu phòng</NavLink></li>
            <li><NavLink to="/invoices" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý hóa đơn</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quản lý dịch vụ</NavLink></li>
          </ul>
          <div className="navbar-user">
            <span>Xin chào, {userName} ({userRole})</span>
            <button className="logout-btn" onClick={handleLogout} disabled={loading}>Đăng xuất</button>
          </div>
        </nav>

        <div className="container">
          <h2>Quản lý phòng</h2>
          {message && (<p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>)}
          {loading && <div className="loader"></div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="sku">Mã phòng <span className="required">*</span></label>
              <input id="sku" name="sku" placeholder="Mã phòng" value={form.sku} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="typeId">Kiểu phòng <span className="required">*</span></label>
              <select id="typeId" name="typeId" value={form.typeId} onChange={handleChange} required disabled={loading}>
                <option value={0}>-- Chọn kiểu phòng --</option>
                {roomTypes.map(rt => (
                    <option key={rt.typeId} value={rt.typeId}>{rt.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Giá phòng <span className="required">*</span></label>
              <input id="price" name="price" type="number" min="0" step="1000" placeholder="Giá phòng" value={form.price} onChange={handleChange} required disabled={loading} />
            </div>

            <button type="submit" disabled={loading}>{editingId == null ? 'Tạo phòng' : 'Cập nhật phòng'}</button>
            {editingId != null && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ sku: '', typeId: 0, price: '' }); setMessage(''); }} disabled={loading} className="cancel-btn">Hủy</button>
            )}
          </form>

          <table className="room-table">
            <thead>
            <tr>
              <th>Mã phòng</th>
              <th>Kiểu phòng</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {rooms.length === 0 ? (
                <tr><td colSpan={5}>Chưa có phòng nào.</td></tr>
            ) : (
                rooms.map(room => (
                    <tr key={room.roomId}>
                      <td>{room.sku}</td>
                      <td>{room.typeName}</td>
                      <td>{room.price.toLocaleString('vi-VN')} VNĐ</td>
                      <td>{room.status}</td>
                      <td>
                        <button onClick={() => handleEdit(room)} disabled={loading}>Sửa</button>
                        <button onClick={() => handleDelete(room.roomId)} disabled={loading} className="delete-btn">Xóa</button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </>
  );
};

export default RoomManagement;
