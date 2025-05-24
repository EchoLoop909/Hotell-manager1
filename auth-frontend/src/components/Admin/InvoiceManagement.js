import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles.css';

const InvoiceManagement = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchForm, setSearchForm] = useState({
        customerName: '',
        status: '',
        paymentMethod: ''
    });

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' }
    });

    const invoiceAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/invoices',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
        }
    });

    useEffect(() => {
        if (!isQuanLy) {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/login'), 1000);
        }
    }, [isQuanLy, navigate]);

    const fetchInvoices = useCallback(async () => {
        try {
            const res = await invoiceAPI.get('/search', { params: {} });
            setInvoices(res.data);
            setSearchPerformed(false);
            setSearchResults([]);
        } catch (err) {
            setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data || err.message));
        }
    }, [invoiceAPI]);

    useEffect(() => {
        if (isQuanLy) fetchInvoices();
    }, [fetchInvoices, isQuanLy]);

    const handleSearch = async (e, isInternal = false) => {
        if (e) e.preventDefault();
        if (!isInternal) {
            setLoading(true);
            setMessage('');
        }
        try {
            const res = await invoiceAPI.get('/search', { params: searchForm });
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
                <h2>Quản lý hóa đơn</h2>
                {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
                {loading && <div className="loader"></div>}

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        name="customerName"
                        placeholder="Tên khách hàng"
                        value={searchForm.customerName}
                        onChange={e => setSearchForm({ ...searchForm, customerName: e.target.value })}
                    />
                    <input
                        name="status"
                        placeholder="Trạng thái (PENDING/PAID)"
                        value={searchForm.status}
                        onChange={e => setSearchForm({ ...searchForm, status: e.target.value })}
                    />
                    <input
                        name="paymentMethod"
                        placeholder="Phương thức thanh toán"
                        value={searchForm.paymentMethod}
                        onChange={e => setSearchForm({ ...searchForm, paymentMethod: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>Tìm kiếm</button>
                </form>

                <h3>Danh sách hóa đơn</h3>
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>ID Hóa đơn</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Phương thức thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.customerName}</td>
                                <td>{inv.totalAmount}</td>
                                <td>{inv.status}</td>
                                <td>{inv.paymentMethod}</td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>Không có hóa đơn nào</td>
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
                                    <th>ID Hóa đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Phương thức thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.length > 0 ? (
                                    searchResults.map(inv => (
                                        <tr key={inv.id}>
                                            <td>{inv.id}</td>
                                            <td>{inv.customerName}</td>
                                            <td>{inv.totalAmount}</td>
                                            <td>{inv.status}</td>
                                            <td>{inv.paymentMethod}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>Không tìm thấy hóa đơn phù hợp</td>
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

export default InvoiceManagement;
