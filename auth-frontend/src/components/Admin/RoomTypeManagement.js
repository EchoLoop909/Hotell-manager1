
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../../api';
import axios from 'axios';

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

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' },
    });

    const loadRoomTypes = useCallback(async () => {
        try {
            setLoading(true);
            setMessage('');
            const res = await fetchRoomTypes();
            setRoomTypes(res.data || []);
        } catch {
            setMessage('Lỗi tải kiểu phòng. Vui lòng đăng nhập lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isQuanLy) {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/'), 1000);
            return;
        }
        loadRoomTypes();
    }, [isQuanLy, navigate, loadRoomTypes]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
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
            if (editingId === null) {
                await createRoomType(payload);
                setMessage('Tạo kiểu phòng thành công');
            } else {
                await updateRoomType(editingId, payload);
                setMessage('Cập nhật kiểu phòng thành công');
            }
            setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
            setEditingId(null);
            await loadRoomTypes();
        } catch {
            setMessage('Lỗi lưu kiểu phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = rt => {
        setEditingId(rt.typeId);
        setForm({
            name: rt.name,
            description: rt.description || '',
            capacity: rt.capacity.toString(),
            defaultPrice: rt.defaultPrice.toString(),
        });
        setMessage('');
    };

    const handleDelete = async id => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa kiểu phòng này?')) return;
        setLoading(true);
        setMessage('');
        try {
            await deleteRoomType(id);
            setMessage('Xóa kiểu phòng thành công');
            await loadRoomTypes();
        } catch {
            setMessage('Lỗi xóa kiểu phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
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
        return <p className="error-message">{message}</p>;
    }

    return (
        <>
            <style>{`
        :root {
          --nav-height: 70px;
          --primary-color: #004080;
          --error-bg: #f8d7da;
          --error-text: #721c24;
          --success-bg: #d4edda;
          --success-text: #155724;
          --loading-bg: #d1ecf1;
          --loading-text: #0c5460;
          --border-color: #ddd;
          --shadow: 0 0 10px rgba(0,0,0,0.1);
          --radius: 8px;
          --transition: all 0.3s ease;
        }
        /* NAV */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: var(--primary-color);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 1000;
        }
        nav .brand { font-size: 1.3rem; font-weight: 700; }
        nav ul {
          list-style: none;
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }
        nav ul li a {
          color: #fff; text-decoration: none; font-weight: 600;
          transition: var(--transition);
        }
        nav ul li a:hover,
        nav ul li a.active {
          text-decoration: underline;
        }
        nav .user-info {
          display: flex; gap: 1rem; align-items: center;
        }
        nav .logout-btn {
          background: #ff4d4d;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        nav .logout-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* CONTAINER */
        .container {
          margin: calc(var(--nav-height) + 1rem) auto 2rem;
          max-width: 900px;
          padding: 0 1rem;
          font-family: Arial, sans-serif;
        }

        /* MESSAGES */
        .error-message, .success-message, .loading-message {
          max-width: 600px;
          margin: 0.5rem auto;
          padding: 0.6rem 1rem;
          border-radius: var(--radius);
          font-weight: 600;
          text-align: center;
        }
        .error-message {
          background: var(--error-bg); color: var(--error-text);
          border: 1px solid #f5c6cb;
        }
        .success-message {
          background: var(--success-bg); color: var(--success-text);
          border: 1px solid #c3e6cb;
        }
        .loading-message {
          background: var(--loading-bg); color: var(--loading-text);
          border: 1px solid #bee5eb;
        }

        /* FORM */
        .form-container {
          background: #fff;
          padding: 2rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
        }
        .form-container h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; }
        .form-group .required { color: red; }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 1rem;
          transition: var(--transition);
        }
        .form-group textarea { resize: vertical; }
        .form-row { display: flex; gap: 1rem; }
        .form-row .form-group { flex: 1; }
        .form-actions { text-align: center; }
        .form-actions button {
          background: var(--primary-color);
          color: #fff;
          padding: 0.6rem 2rem;
          border: none;
          border-radius: var(--radius);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .form-actions .cancel-btn {
          background: #888;
          margin-left: 1rem;
        }
        .form-actions button:disabled { opacity: 0.6; cursor: not-allowed; }

        /* TABLE */
        table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: var(--shadow);
        }
        thead { background: var(--primary-color); color: #fff; }
        th, td {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
        }
        tbody tr:nth-child(even) { background: #f7f9fc; }
        td.center { text-align: center; }
        td.right  { text-align: right; }
        .action-btn {
          background: #007bff;
          color: #fff;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          margin-right: 0.5rem;
        }
        .action-btn.delete { background: #dc3545; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .no-data { text-align: center; padding: 1rem; color: #666; }
      `}</style>

            <div className="container">
                <nav>
                    <div className="brand">Hotel Management</div>
                    <ul>
                        <li><NavLink to="/employees">Quản lý nhân viên</NavLink></li>
                        <li><NavLink to="/customers">Quản lý khách hàng</NavLink></li>
                        <li><NavLink to="/rooms">Quản lý phòng</NavLink></li>
                        <li><NavLink to="/room-types" className={({isActive}) => isActive ? 'active' : ''}>Quản lý kiểu phòng</NavLink></li>
                        <li><NavLink to="/invoices">Quản lý hóa đơn</NavLink></li>
                        <li><NavLink to="/services">Quản lý dịch vụ</NavLink></li>
                    </ul>
                    <div className="user-info">
                        <span>Xin chào, {userName} ({userRole})</span>
                        <button onClick={handleLogout} disabled={loading} className="logout-btn">Đăng xuất</button>
                    </div>
                </nav>

                {message && (
                    <p className={message.toLowerCase().includes('lỗi') ? 'error-message' : 'success-message'}>
                        {message}
                    </p>
                )}
                {loading && <p className="loading-message">Đang xử lý...</p>}

                <form onSubmit={handleSubmit} className="form-container">
                    <h3>{editingId ? 'Cập nhật kiểu phòng' : 'Tạo mới kiểu phòng'}</h3>
                    <div className="form-group">
                        <label>
                            Tên kiểu phòng <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Sức chứa <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                required
                                min="1"
                                value={form.capacity}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Giá mặc định (VNĐ) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="defaultPrice"
                                required
                                min="0"
                                step="1000"
                                value={form.defaultPrice}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {editingId ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                disabled={loading}
                                className="cancel-btn"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
                                    setMessage('');
                                }}
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>

                <table>
                    <thead>
                    <tr>
                        <th>Tên kiểu phòng</th>
                        <th>Mô tả</th>
                        <th className="center">Sức chứa</th>
                        <th className="right">Giá mặc định (VNĐ)</th>
                        <th className="center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roomTypes.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-data">
                                Không có kiểu phòng nào.
                            </td>
                        </tr>
                    ) : (
                        roomTypes.map(rt => (
                            <tr key={rt.typeId}>
                                <td>{rt.name}</td>
                                <td>{rt.description || '-'}</td>
                                <td className="center">{rt.capacity}</td>
                                <td className="right">
                                    {rt.defaultPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </td>
                                <td className="center">
                                    <button
                                        onClick={() => handleEdit(rt)}
                                        disabled={loading}
                                        className="action-btn"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rt.typeId)}
                                        disabled={loading}
                                        className="action-btn delete"
                                    >
                                        Xóa
                                    </button>
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

export default RoomTypeManagement;
