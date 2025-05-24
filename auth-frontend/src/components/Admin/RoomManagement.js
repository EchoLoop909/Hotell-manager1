import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles.css';

const RoomManagement = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [roomForm, setRoomForm] = useState({
        roomNumber: '',
        type: 'SINGLE',
        price: '',
        status: 'AVAILABLE'
    });
    const [searchForm, setSearchForm] = useState({
        roomNumber: '',
        type: '',
        status: ''
    });
    const [editingRoomId, setEditingRoomId] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    const authAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/auth',
        headers: { 'Content-Type': 'application/json' }
    });

    const roomAPI = axios.create({
        baseURL: 'http://localhost:8888/api/v1/rooms',
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

    const fetchRooms = useCallback(async () => {
        try {
            const res = await roomAPI.get('/search', { params: {} });
            setRooms(res.data);
            setSearchPerformed(false);
            setSearchResults([]);
        } catch (err) {
            setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data || err.message));
        }
    }, [roomAPI]);

    useEffect(() => {
        if (isQuanLy) fetchRooms();
    }, [fetchRooms, isQuanLy]);

    const handleCreateOrUpdate = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const payload = {
            roomNumber: roomForm.roomNumber,
            type: roomForm.type,
            price: parseFloat(roomForm.price),
            status: roomForm.status
        };
        try {
            if (editingRoomId) {
                await roomAPI.put(`/update?id=${editingRoomId}`, payload);
                setMessage('Cập nhật phòng thành công');
                setEditingRoomId(null);
            } else {
                await roomAPI.post('', payload);
                setMessage('Tạo phòng thành công');
            }
            fetchRooms();
            setRoomForm({ roomNumber: '', type: 'SINGLE', price: '', status: 'AVAILABLE' });
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
            await roomAPI.delete(`/delete?id=${id}`);
            setMessage('Xóa thành công');
            if (searchPerformed) {
                await handleSearch(null, true);
            } else {
                fetchRooms();
            }
        } catch (err) {
            setMessage('Lỗi: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = room => {
        setEditingRoomId(room.id);
        setRoomForm({
            roomNumber: room.roomNumber,
            type: room.type,
            price: room.price.toString(),
            status: room.status
        });
    };

    const handleSearch = async (e, isInternal = false) => {
        if (e) e.preventDefault();
        if (!isInternal) {
            setLoading(true);
            setMessage('');
        }
        try {
            const res = await roomAPI.get('/search', { params: searchForm });
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
                <h2>Quản lý phòng</h2>
                {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
                {loading && <div className="loader"></div>}

                <form onSubmit={handleCreateOrUpdate} className="employee-form">
                    <input
                        name="roomNumber"
                        placeholder="Số phòng"
                        value={roomForm.roomNumber}
                        onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                        required
                    />
                    <select
                        name="type"
                        value={roomForm.type}
                        onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                    >
                        <option value="SINGLE">Phòng đơn</option>
                        <option value="DOUBLE">Phòng đôi</option>
                        <option value="SUITE">Phòng suite</option>
                    </select>
                    <input
                        name="price"
                        type="number"
                        placeholder="Giá (USD)"
                        value={roomForm.price}
                        onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                        required
                    />
                    <select
                        name="status"
                        value={roomForm.status}
                        onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}
                    >
                        <option value="AVAILABLE">Sẵn sàng</option>
                        <option value="OCCUPIED">Đang sử dụng</option>
                        <option value="MAINTENANCE">Bảo trì</option>
                    </select>
                    <button type="submit" disabled={loading}>
                        {editingRoomId ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </form>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        name="roomNumber"
                        placeholder="Số phòng"
                        value={searchForm.roomNumber}
                        onChange={e => setSearchForm({ ...searchForm, roomNumber: e.target.value })}
                    />
                    <input
                        name="type"
                        placeholder="Loại phòng"
                        value={searchForm.type}
                        onChange={e => setSearchForm({ ...searchForm, type: e.target.value })}
                    />
                    <input
                        name="status"
                        placeholder="Trạng thái"
                        value={searchForm.status}
                        onChange={e => setSearchForm({ ...searchForm, status: e.target.value })}
                    />
                    <button type="submit" disabled={loading}>Tìm kiếm</button>
                </form>

                <h3>Danh sách phòng</h3>
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Số phòng</th>
                            <th>Loại phòng</th>
                            <th>Giá (USD)</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>{room.roomNumber}</td>
                                <td>{room.type}</td>
                                <td>{room.price}</td>
                                <td>{room.status}</td>
                                <td>
                                    <button onClick={() => handleEdit(room)} disabled={loading}>Sửa</button>
                                    <button onClick={() => handleDelete(room.id)} disabled={loading}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                        {rooms.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>Không có phòng nào</td>
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
                                    <th>Số phòng</th>
                                    <th>Loại phòng</th>
                                    <th>Giá (USD)</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.length > 0 ? (
                                    searchResults.map(room => (
                                        <tr key={room.id}>
                                            <td>{room.roomNumber}</td>
                                            <td>{room.type}</td>
                                            <td>{room.price}</td>
                                            <td>{room.status}</td>
                                            <td>
                                                <button onClick={() => handleEdit(room)} disabled={loading}>Sửa</button>
                                                <button onClick={() => handleDelete(room.id)} disabled={loading}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>Không tìm thấy phòng phù hợp</td>
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

export default RoomManagement;
