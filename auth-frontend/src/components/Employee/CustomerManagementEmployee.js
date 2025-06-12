// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
//
// const CustomerManagementEmployee = () => {
//     const [customers, setCustomers] = useState([]);
//     const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
//     const [editingId, setEditingId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     const navigate = useNavigate();
//     const userRole = localStorage.getItem('user_role');
//     const isQuanLy = userRole === 'LE_TAN';
//     const token = localStorage.getItem('access_token');
//
//     const fetchCustomers = useCallback(async () => {
//         if (!token) {
//             setMessage('Bạn cần đăng nhập lại');
//             return;
//         }
//         try {
//             setLoading(true);
//             const resp = await axios.get('http://localhost:8888/api/v1/customers', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setCustomers(resp.data);
//         } catch (err) {
//             setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setLoading(false);
//         }
//     }, [token]);
//
//     useEffect(() => {
//         if (isQuanLy) {
//             fetchCustomers();
//         } else {
//             setMessage('Bạn không có quyền truy cập trang này');
//             setTimeout(() => navigate('/'), 1000);
//         }
//     }, [fetchCustomers, isQuanLy, navigate]);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setLoading(true);
//
//         const payload = { ...form };
//         if (editingId && !form.password) {
//             delete payload.password;
//         }
//
//         try {
//             if (editingId) {
//                 await axios.put(`http://localhost:8888/api/v1/customers/${editingId}`, payload, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setMessage('Cập nhật khách hàng thành công');
//             } else {
//                 await axios.post('http://localhost:8888/api/v1/customers/add', payload, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setMessage('Thêm khách hàng thành công');
//             }
//             setForm({ name: '', email: '', phone: '', password: '' });
//             setEditingId(null);
//             fetchCustomers();
//         } catch (err) {
//             setMessage('Lỗi: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleEdit = (cust) => {
//         setEditingId(cust.customerId);
//         setForm({ name: cust.name, email: cust.email, phone: cust.phone, password: '' });
//     };
//
//     const handleDelete = async (id) => {
//         if (!window.confirm('Xác nhận xóa?')) return;
//         setLoading(true);
//         try {
//             await axios.delete(`http://localhost:8888/api/v1/customers/delete/${id}`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setMessage('Xóa thành công');
//             fetchCustomers();
//         } catch (err) {
//             setMessage('Lỗi: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleLogout = async () => {
//         try {
//             const refreshToken = localStorage.getItem('refresh_token');
//             await axios.post('http://localhost:8888/api/v1/auth/logout', { refreshToken }, {
//                 headers: { 'Content-Type': 'application/json' },
//             });
//         } catch {}
//         localStorage.clear();
//         navigate('/');
//     };
//
//     if (!isQuanLy) {
//         return <p>{message}</p>;
//     }
//
//     return (
//         <>
//             <div>
//                 <h2>Quản lý khách hàng</h2>
//                 {message && (
//                     <p>
//                         {message}
//                     </p>
//                 )}
//                 {loading && <div>Loading...</div>}
//
//                 <form onSubmit={handleSubmit} autoComplete="off">
//                     <div>
//                         <label htmlFor="name">Họ tên <span>*</span></label>
//                         <input
//                             id="name"
//                             name="name"
//                             placeholder="Họ tên"
//                             value={form.name}
//                             onChange={(e) => setForm({ ...form, name: e.target.value })}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="email">Email <span>*</span></label>
//                         <input
//                             id="email"
//                             name="email"
//                             type="email"
//                             placeholder="Email"
//                             value={form.email}
//                             onChange={(e) => setForm({ ...form, email: e.target.value })}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="phone">Số điện thoại <span>*</span></label>
//                         <input
//                             id="phone"
//                             name="phone"
//                             placeholder="Số điện thoại"
//                             value={form.phone}
//                             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password">
//                             Mật khẩu {editingId ? '(Để trống nếu không đổi)' : <span>*</span>}
//                         </label>
//                         <input
//                             id="password"
//                             name="password"
//                             type="password"
//                             placeholder="Mật khẩu"
//                             value={form.password}
//                             onChange={(e) => setForm({ ...form, password: e.target.value })}
//                             required={!editingId}
//                             autoComplete={editingId ? "new-password" : "current-password"}
//                         />
//                     </div>
//                     <div>
//                         <button type="submit" disabled={loading}>
//                             {editingId ? 'Cập nhật' : 'Tạo mới'}
//                         </button>
//                         {editingId && (
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setEditingId(null);
//                                     setForm({ name: '', email: '', phone: '', password: '' });
//                                     setMessage('');
//                                 }}
//                                 disabled={loading}
//                             >
//                                 Hủy
//                             </button>
//                         )}
//                     </div>
//                 </form>
//
//                 <h3>Danh sách khách hàng</h3>
//                 <table>
//                     <thead>
//                     <tr>
//                         <th>Họ tên</th>
//                         <th>Email</th>
//                         <th>Số điện thoại</th>
//                         <th>Hành động</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {customers.length > 0 ? (
//                         customers.map((c) => (
//                             <tr key={c.customerId}>
//                                 <td>{c.name}</td>
//                                 <td>{c.email}</td>
//                                 <td>{c.phone}</td>
//                                 <td>
//                                     <button
//                                         onClick={() => handleEdit(c)}
//                                         disabled={loading}
//                                         type="button"
//                                     >
//                                         Sửa
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan={4} style={{ textAlign: 'center' }}>
//                                 Không có khách hàng nào
//                             </td>
//                         </tr>
//                     )}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// };
//
// export default CustomerManagementEmployee;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles/customer-management.css';

const CustomerManagementEmployee = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Lễ tân';
    const userRole = localStorage.getItem('user_role') || 'LE_TAN';
    const isQuanLy = userRole === 'LE_TAN';
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
        navigate('/login');
    };

    if (!isQuanLy) {
        return <p className="error-message">{message}</p>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Quản lý khách hàng</div>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/receptionist/search-room"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Tìm kiếm phòng trống
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/book"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/cancel-booking"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Hủy đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/invoices"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Xem hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/customer"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Thông tin khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/employeeUpdate"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Cập nhật thông tin
                        </NavLink>
                    </li>

                </ul>
                <div className="navbar-user">
                    <span>Xin chào, {userName} ({userRole})</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </nav>

            <main className="customer-management-container">
                <h1 className="title">Quản lý khách hàng</h1>
                {message && <p className={message.includes('thành công') ? 'success-message' : 'error-message'}>{message}</p>}
                {loading && <div className="loading">Loading...</div>}

                <form onSubmit={handleSubmit} className="customer-form" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="name">Họ tên <span className="required">*</span></label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Họ tên"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                        <input
                            id="phone"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            Mật khẩu {editingId ? '(Để trống nếu không đổi)' : <span className="required">*</span>}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="form-input"
                            required={!editingId}
                            autoComplete={editingId ? "new-password" : "current-password"}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="submit-btn">
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
                                className="cancel-btn"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>

                <h2 className="subtitle">Danh sách khách hàng</h2>
                <div className="table-container">
                    <table className="customer-table">
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
                                        <button
                                            onClick={() => handleEdit(c)}
                                            disabled={loading}
                                            className="edit-btn"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.customerId)}
                                            disabled={loading}
                                            className="delete-btn"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="no-data">
                                    Không có khách hàng nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default CustomerManagementEmployee;