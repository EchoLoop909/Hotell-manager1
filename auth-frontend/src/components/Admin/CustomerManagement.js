import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles.css';

const CustomerManagement = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [customerForm, setCustomerForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [searchForm, setSearchForm] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [editingCustomerId, setEditingCustomerId] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    const customerAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/customers',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
        }
    });

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' }
    });

    useEffect(() => {
        if (!isQuanLy) {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/login'), 1000);
        }
    }, [isQuanLy, navigate]);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await customerAPI.get('');
            setCustomers(res.data);
            setSearchPerformed(false);
            setSearchResults([]);
        } catch (err) {
            setMessage('Lỗi khi lấy danh sách khách hàng: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    }, [customerAPI]);

    useEffect(() => {
        if (isQuanLy) fetchCustomers();
    }, [fetchCustomers, isQuanLy]);

    const handleCreateOrUpdate = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const payload = {
            name: customerForm.name,
            email: customerForm.email,
            password: customerForm.password,
            phone: customerForm.phone
        };
        try {
            if (editingCustomerId) {
                await customerAPI.put(`/${editingCustomerId}`, payload);
                setMessage('Cập nhật khách hàng thành công');
                setEditingCustomerId(null);
            } else {
                await customerAPI.post('/add', payload);
                setMessage('Thêm khách hàng thành công');
            }
            fetchCustomers();
            setCustomerForm({ name: '', email: '', password: '', phone: '' });
        } catch (err) {
            setMessage('Lỗi: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (!id) {
            alert('ID không hợp lệ!');
            return;
        }
        if (!window.confirm('Xác nhận xóa khách hàng?')) return;

        setLoading(true);
        setMessage('');
        try {
            await customerAPI.delete(`/delete/${id}`);
            setMessage('Xóa khách hàng thành công');
            if (searchPerformed) {
                await handleSearch(null, true);
            } else {
                fetchCustomers();
            }
        } catch (err) {
            setMessage('Lỗi: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = customer => {
        setEditingCustomerId(customer.customerId);
        setCustomerForm({
            name: customer.name,
            email: customer.email,
            password: '',
            phone: customer.phone
        });
    };

    const handleSearch = async (e, isInternal = false) => {
        if (e) e.preventDefault();
        if (!isInternal) {
            setLoading(true);
            setMessage('');
        }
        try {
            const res = await customerAPI.get('', { params: searchForm });
            setSearchResults(res.data);
            setSearchPerformed(true);
            setMessage('Tìm kiếm thành công');
        } catch (err) {
            setMessage('Lỗi tìm kiếm: ' + (err.response?.data || err.message));
        } finally {
            if (!isInternal) setLoading(false);
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
            navigate('/login');
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
                        <NavLink
                            to="/employees"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý nhân viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customers"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/rooms"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/invoices"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/services"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Quản lý dịch vụ
                        </NavLink>
                    </li>
                </ul>
                <div className="navbar-user">
                    <span>Xin chào, {userName} ({userRole})</span>
                    <button className="logout-btn" onClick={handleLogout} disabled={loading}>
                        Đăng xuất
                    </button>
                </div>
            </nav>
            <div className="home-container">
                <h2>Quản lý khách hàng</h2>
                {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
                {loading && <div className="loader"></div>}

                <form onSubmit={handleCreateOrUpdate} className="employee-form">
                    <input
                        name="name"
                        placeholder="Họ tên"
                        value={customerForm.name}
                        onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={customerForm.email}
                        onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        value={customerForm.password}
                        onChange={e => setCustomerForm({ ...customerForm, password: e.target.value })}
                        required={!editingCustomerId}
                    />
                    <input
                        name="phone"
                        placeholder="Số điện thoại"
                        value={customerForm.phone}
                        onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {editingCustomerId ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </form>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        name="name"
                        placeholder="Tên"
                        value={searchForm.name}
                        onChange={e => setSearchForm({ ...searchForm, name: e.target.value })}
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={searchForm.email}
                        onChange={e => setSearchForm({ ...searchForm, email: e.target.value })}
                    />
                    <input
                        name="phone"
                        placeholder="Số điện thoại"
                        value={searchForm.phone}
                        onChange={e => setSearchForm({ ...searchForm, phone: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>Tìm kiếm</button>
                </form>

                <h3>Danh sách khách hàng</h3>
                <table className="employee-table">
                    <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map(customer => (
                        <tr key={customer.customerId}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>
                                <button onClick={() => handleEdit(customer)} disabled={loading}>Sửa</button>
                                <button onClick={() => handleDelete(customer.customerId)} disabled={loading}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>Không có khách hàng nào</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {searchPerformed && (
                    <>
                        <h3>Kết quả tìm kiếm</h3>
                        <table className="employee-table">
                            <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map(customer => (
                                    <tr key={customer.customerId}>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <button onClick={() => handleEdit(customer)} disabled={loading}>Sửa</button>
                                            <button onClick={() => handleDelete(customer.customerId)} disabled={loading}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>Không tìm thấy khách hàng phù hợp</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </>
    );
};

export default CustomerManagement;