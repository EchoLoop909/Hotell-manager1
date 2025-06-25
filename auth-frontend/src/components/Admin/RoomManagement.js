import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ sku: '', typeId: 0, price: '', status: 'trống' });
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
        await api.post('/rooms/new', {
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
          status: form.status,
        });
        setMessage('Cập nhật phòng thành công');
      }
      setForm({ sku: '', typeId: 0, price: '', status: 'trống' });
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
      status: room.status,
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

      <div style={{ padding: '1rem' }}>
        <h2>Quản lý phòng</h2>
        {message && <p>{message}</p>}
        {loading && <div>Đang tải...</div>}

        <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', marginBottom: '2rem' }}>
          <div>
            <label htmlFor="sku">Mã phòng *</label>
            <input id="sku" name="sku" placeholder="Mã phòng" value={form.sku} onChange={handleChange} required disabled={loading} />
          </div>

          <div>
            <label htmlFor="typeId">Kiểu phòng *</label>
            <select id="typeId" name="typeId" value={form.typeId} onChange={handleChange} required disabled={loading}>
              <option value={0}>-- Chọn kiểu phòng --</option>
              {roomTypes.map(rt => (
                <option key={rt.typeId} value={rt.typeId}>{rt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price">Giá phòng *</label>
            <input id="price" name="price" type="number" min="0" step="1000" placeholder="Giá phòng" value={form.price} onChange={handleChange} required disabled={loading} />
          </div>

          {editingId != null && (
            <div>
              <label htmlFor="status">Trạng thái *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} required disabled={loading}>
                <option value="trống">Trống</option>
                <option value="đã_đặt">Đã đặt</option>
                <option value="đang_dọn_dẹp">Đang dọn dẹp</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}>{editingId == null ? 'Tạo phòng' : 'Cập nhật phòng'}</button>
          {editingId != null && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ sku: '', typeId: 0, price: '', status: 'trống' }); setMessage(''); }} disabled={loading}>
              Hủy
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Mã phòng</th>
              <th>Kiểu phòng</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr><td colSpan={6}>Chưa có phòng nào.</td></tr>
            ) : (
              rooms.map(room => (
                <tr key={room.roomId}>
                  <td>
                    <img src={room.imageUrl || 'https://via.placeholder.com/100'} alt="Phòng" style={{ width: '100px', height: '80px', objectFit: 'cover' }} />
                  </td>
                  <td>{room.sku}</td>
                  <td>{room.typeName}</td>
                  <td>{Number(room.price).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{room.status}</td>
                  <td>
                    <button onClick={() => handleEdit(room)} disabled={loading}>Sửa</button>
                    <button onClick={() => handleDelete(room.roomId)} disabled={loading}>Xóa</button>
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
