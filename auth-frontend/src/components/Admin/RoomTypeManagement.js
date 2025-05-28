// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../../api';
// import axios from 'axios';
//
// const RoomTypeManagement = () => {
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [form, setForm] = useState({ name: '', description: '', capacity: '', defaultPrice: '' });
//   const [editingId, setEditingId] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//
//   const navigate = useNavigate();
//   const userName = localStorage.getItem('user_name');
//   const userRole = localStorage.getItem('user_role');
//   const isQuanLy = userRole === 'QUAN_LY';
//
//   const loadRoomTypes = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchRoomTypes();
//       setRoomTypes(res.data || []);
//       setMessage('');
//     } catch (err) {
//       setMessage('Lỗi tải kiểu phòng. Vui lòng đăng nhập lại.');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     if (isQuanLy) loadRoomTypes();
//     else {
//       setMessage('Bạn không có quyền truy cập trang này');
//       setTimeout(() => navigate('/'), 1000);
//     }
//   }, [isQuanLy, navigate]);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       const payload = {
//         name: form.name.trim(),
//         description: form.description.trim(),
//         capacity: Number(form.capacity),
//         defaultPrice: Number(form.defaultPrice),
//       };
//       if (editingId == null) {
//         await createRoomType(payload);
//       } else {
//         await updateRoomType(editingId, payload);
//       }
//       setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
//       setEditingId(null);
//       await loadRoomTypes();
//       setMessage('Lưu thành công');
//     } catch (err) {
//       setMessage('Lỗi lưu kiểu phòng');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleEdit = (rt) => {
//     setEditingId(rt.typeId);
//     setForm({
//       name: rt.name,
//       description: rt.description || '',
//       capacity: rt.capacity.toString(),
//       defaultPrice: rt.defaultPrice.toString(),
//     });
//     setMessage('');
//   };
//
//   const handleDelete = async (id) => {
//     if (!window.confirm('Bạn có chắc chắn muốn xóa kiểu phòng này?')) return;
//     setLoading(true);
//     setMessage('');
//     try {
//       await deleteRoomType(id);
//       await loadRoomTypes();
//       setMessage('Xóa thành công');
//     } catch (err) {
//       setMessage('Lỗi xóa kiểu phòng');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       const authAPI = axios.create({
//         baseURL: 'http://localhost:8888/api/v1/auth',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const refreshToken = localStorage.getItem('refresh_token');
//       await authAPI.post('/logout', { refreshToken });
//     } catch {
//       // ignore
//     } finally {
//       localStorage.clear();
//       navigate('/');
//     }
//   };
//
//   if (!isQuanLy) {
//     return <p>{message}</p>;
//   }
//
//     return (
//         <div>
//             <style>{`
//   /* NAVIGATION BAR */
//   nav {
//     background-color: #004080;
//     color: white;
//     padding: 1rem 2rem;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     font-weight: 600;
//     flex-wrap: wrap;
//   }
//   nav > div:first-child {
//     font-size: 1.3rem;
//     font-weight: 700;
//   }
//   nav ul {
//     list-style: none;
//     display: flex;
//     gap: 1.8rem;
//     margin: 0;
//     padding: 0;
//     flex-wrap: wrap;
//   }
//   nav ul li a {
//     color: white;
//     text-decoration: none;
//     font-weight: 600;
//     transition: color 0.3s ease;
//   }
//   nav ul li a.active,
//   nav ul li a:hover {
//     color: #ffd700;
//     text-decoration: underline;
//   }
//   nav > div:last-child {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//     flex-wrap: wrap;
//   }
//   nav button {
//     background-color: #ff4d4d;
//     border: none;
//     padding: 0.5rem 1.1rem;
//     color: white;
//     border-radius: 5px;
//     cursor: pointer;
//     font-weight: 700;
//     transition: background-color 0.3s ease;
//   }
//   nav button:disabled {
//     background-color: #cc6666;
//     cursor: not-allowed;
//   }
//   nav button:hover:not(:disabled) {
//     background-color: #e60000;
//   }
//
//   /* PAGE TITLE */
//   h2 {
//     text-align: center;
//     color: #004080;
//     margin: 2.5rem 0 1.2rem;
//     font-weight: 700;
//     font-size: 2rem;
//   }
//   h3 {
//     color: #004080;
//     margin: 1.5rem auto 0.8rem;
//     max-width: 600px;
//     font-weight: 700;
//     font-size: 1.4rem;
//   }
//
//   /* MESSAGES */
//   p {
//     max-width: 600px;
//     margin: 0.6rem auto 1.2rem;
//     padding: 0.6rem 1rem;
//     background-color: #f8d7da;
//     color: #721c24;
//     border-radius: 5px;
//     border: 1px solid #f5c6cb;
//     font-weight: 600;
//     text-align: center;
//   }
//   p.loading {
//     background-color: #d1ecf1;
//     color: #0c5460;
//     border-color: #bee5eb;
//   }
//
//   /* FORM */
//   form {
//     max-width: 600px;
//     margin: 0 auto 3rem;
//     background: #fff;
//     padding: 1.8rem 2.2rem;
//     border-radius: 8px;
//     box-shadow: 0 0 15px rgba(0,0,0,0.08);
//     font-size: 1rem;
//   }
//   form > div {
//     margin-bottom: 1.3rem;
//   }
//   label {
//     font-weight: 600;
//     display: block;
//     margin-bottom: 0.5rem;
//     color: #333;
//   }
//   input[type="text"],
//   input[type="number"],
//   textarea {
//     width: 100%;
//     padding: 0.5rem 0.7rem;
//     border: 1.8px solid #ccc;
//     border-radius: 5px;
//     font-size: 1rem;
//     box-sizing: border-box;
//     transition: border-color 0.3s ease;
//   }
//   input[type="text"]:focus,
//   input[type="number"]:focus,
//   textarea:focus {
//     outline: none;
//     border-color: #007bff;
//     box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
//   }
//   textarea {
//     resize: vertical;
//     min-height: 70px;
//   }
//   button {
//     background-color: #007bff;
//     color: white;
//     border: none;
//     padding: 0.65rem 1.6rem;
//     border-radius: 5px;
//     cursor: pointer;
//     font-weight: 700;
//     margin-right: 1rem;
//     transition: background-color 0.3s ease;
//   }
//   button:disabled {
//     background-color: #99c2ff;
//     cursor: not-allowed;
//   }
//   form button:hover:not(:disabled) {
//     background-color: #0056b3;
//   }
//   form button[type="button"] {
//     background-color: #6c757d;
//   }
//   form button[type="button"]:hover:not(:disabled) {
//     background-color: #5a6268;
//   }
//
//   /* TABLE */
//   table {
//     width: 90%;
//     max-width: 900px;
//     margin: 0 auto 3rem;
//     border-collapse: collapse;
//     box-shadow: 0 0 14px rgba(0,0,0,0.1);
//     font-size: 1rem;
//     border-radius: 6px;
//     overflow: hidden;
//   }
//   th, td {
//     padding: 0.85rem 1.2rem;
//     border: 1px solid #ddd;
//     text-align: left;
//     vertical-align: middle;
//   }
//   th {
//     background-color: #007bff;
//     color: white;
//     font-weight: 700;
//   }
//   tbody tr:nth-child(even) {
//     background-color: #f7f9fc;
//   }
//   tbody tr:hover {
//     background-color: #e9f1ff;
//   }
//
//   /* ACTION BUTTONS */
//   table button {
//     margin-right: 0.5rem;
//     padding: 0.4rem 0.9rem;
//     border: none;
//     border-radius: 5px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: opacity 0.25s ease;
//   }
//   table button:hover {
//     opacity: 0.85;
//   }
//   table button:first-child {
//     background-color: #ffc107;
//     color: #222;
//   }
//   table button:last-child {
//     background-color: #dc3545;
//     color: white;
//   }
//   table button:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
//
//   /* RESPONSIVE */
//   @media (max-width: 700px) {
//     nav ul {
//       gap: 1rem;
//       font-size: 0.9rem;
//     }
//     nav, nav > div:last-child {
//       flex-wrap: wrap;
//     }
//     form, table {
//       width: 95%;
//       font-size: 0.95rem;
//     }
//     table button {
//       padding: 0.3rem 0.7rem;
//       font-size: 0.85rem;
//     }
//   }
// `}</style>
//
//             <div className="container" style={{ marginTop: '2rem' }}>
//             <h2>Quản lý kiểu phòng</h2>
//             <nav>
//                 <div >Hotel Management</div>
//                 <ul>
//                     <li><NavLink to="/employees">Quản lý nhân viên</NavLink></li>
//                     <li><NavLink to="/customers">Quản lý khách hàng</NavLink></li>
//                     <li><NavLink to="/rooms">Quản lý phòng</NavLink></li>
//                     <li><NavLink to="/room-types">Quản lý kiểu phòng</NavLink></li>
//                     <li><NavLink to="/invoices">Quản lý hóa đơn</NavLink></li>
//                     <li><NavLink to="/services">Quản lý dịch vụ</NavLink></li>
//                 </ul>
//                 <div>
//                     <span>Xin chào, {userName} ({userRole})</span>
//                     <button onClick={handleLogout} disabled={loading}>Đăng xuất</button>
//                 </div>
//             </nav>
//
//             {/* MESSAGES */}
//             {message && <p>{message}</p>}
//             {loading && <p>Đang xử lý...</p>}
//
//             {/* FORM */}
//             <h3>{editingId ? 'Cập nhật kiểu phòng' : 'Tạo mới kiểu phòng'}</h3>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Tên kiểu phòng:</label>
//                     <input name="name" value={form.name} onChange={handleChange} required disabled={loading} />
//                 </div>
//                 <div>
//                     <label>Sức chứa:</label>
//                     <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required min="1" disabled={loading} />
//                 </div>
//                 <div>
//                     <label>Giá mặc định:</label>
//                     <input type="number" name="defaultPrice" value={form.defaultPrice} onChange={handleChange} required min="0" disabled={loading} />
//                 </div>
//                 <div>
//                     <label>Mô tả:</label>
//                     <textarea name="description" value={form.description} onChange={handleChange} disabled={loading} />
//                 </div>
//                 <button type="submit" disabled={loading}>{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
//                 {editingId && (
//                     <button type="button" onClick={() => {
//                         setEditingId(null);
//                         setForm({ name: '', description: '', capacity: '', defaultPrice: '' });
//                         setMessage('');
//                     }} disabled={loading}>Hủy</button>
//                 )}
//             </form>
//
//             {/* TABLE */}
//             <h3>Danh sách Kiểu Phòng</h3>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Tên</th>
//                     <th>Sức chứa</th>
//                     <th>Giá mặc định</th>
//                     <th>Mô tả</th>
//                     <th>Hành động</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {roomTypes.length === 0 ? (
//                     <tr>
//                         <td colSpan="6" align="center">Không có dữ liệu</td>
//                     </tr>
//                 ) : (
//                     roomTypes.map((rt) => (
//                         <tr key={rt.typeId}>
//                             <td>{rt.typeId}</td>
//                             <td>{rt.name}</td>
//                             <td>{rt.capacity}</td>
//                             <td>{Number(rt.defaultPrice).toLocaleString()} đ</td>
//                             <td>{rt.description}</td>
//                             <td>
//                                 <button onClick={() => handleEdit(rt)} disabled={loading}>Sửa</button>
//                                 <button onClick={() => handleDelete(rt.typeId)} disabled={loading}>Xóa</button>
//                             </td>
//                         </tr>
//                     ))
//                 )}
//                 </tbody>
//             </table>
//             </div>
//         </div>
//     );
// };
//
// export default RoomTypeManagement;
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
