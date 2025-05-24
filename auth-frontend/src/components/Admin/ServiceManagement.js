import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles.css';

const ServiceManagement = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        price: ''
    });
    const [searchForm, setSearchForm] = useState({
        name: ''
    });
    const [editingServiceId, setEditingServiceId] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' }
    });

    const serviceAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/services',
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

    const fetchServices = useCallback(async () => {
        try {
            const res = await serviceAPI.get('/search', { params: {} });
            setServices(res.data);
            setSearchPerformed(false);
            setSearchResults([]);
        } catch (err) {
            setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data || err.message));
        }
    }, [serviceAPI]);

    useEffect(() => {
        if (isQuanLy) fetchServices();
    }, [fetchServices, isQuanLy]);

    const handleCreateOrUpdate = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const payload = {
            name: serviceForm.name,
            price: parseFloat(serviceForm.price)
        };
        try {
            if (editingServiceId) {
                await serviceAPI.put(`/update?id=${editingServiceId}`, payload);
                setMessage('Cập nhật dịch vụ thành công');
                setEditingServiceId(null);
            } else {
                await serviceAPI.post('', payload);
                setMessage('Tạo dịch vụ thành công');
            }
            fetchServices();
            setServiceForm({ name: '', price: '' });
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
        if (!window.confirm('Xác nhận xóa?')) return;

        setLoading(true);
        setMessage('');
        try {
            await serviceAPI.delete(`/delete?id=${id}`);
            setMessage('Xóa thành công');
            if (searchPerformed) {
                await handleSearch(null, true);
            } else {
                fetchServices();
            }
        } catch (err) {
            setMessage('Lỗi: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = service => {
        setEditingServiceId(service.id);
        setServiceForm({
            name: service.name,
            price: service.price.toString()
        });
    };

    const handleSearch = async (e, isInternal = false) => {
        if (e) e.preventDefault();
        if (!isInternal) {
            setLoading(true);
            setMessage('');
        }
        try {
            const res = await serviceAPI.get('/search', { params: searchForm });
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
                <h2>Quản lý dịch vụ</h2>
                {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
                {loading && <div className="loader"></div>}

                <form onSubmit={handleCreateOrUpdate} className="employee-form">
                    <input
                        name="name"
                        placeholder="Tên dịch vụ"
                        value={serviceForm.name}
                        onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                        required
                    />
                    <input
                        name="price"
                        type="number"
                        placeholder="Giá (USD)"
                        value={serviceForm.price}
                        onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {editingServiceId ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </form>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        name="name"
                        placeholder="Tên dịch vụ"
                        value={searchForm.name}
                        onChange={e => setSearchForm({ ...searchForm, name: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>Tìm kiếm</button>
                </form>

                <h3>Danh sách dịch vụ</h3>
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Tên dịch vụ</th>
                            <th>Giá (USD)</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{service.price}</td>
                                <td>
                                    <button onClick={() => handleEdit(service)} disabled={loading}>Sửa</button>
                                    <button onClick={() => handleDelete(service.id)} disabled={loading}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center' }}>Không có dịch vụ nào</td>
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
                                    <th>Tên dịch vụ</th>
                                    <th>Giá (USD)</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.length > 0 ? (
                                    searchResults.map(service => (
                                        <tr key={service.id}>
                                            <td>{service.name}</td>
                                            <td>{service.price}</td>
                                            <td>
                                                <button onClick={() => handleEdit(service)} disabled={loading}>Sửa</button>
                                                <button onClick={() => handleDelete(service.id)} disabled={loading}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center' }}>Không tìm thấy dịch vụ phù hợp</td>
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

export default ServiceManagement;
