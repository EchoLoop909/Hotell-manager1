// frontend/src/components/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
const Home = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [roomForm, setRoomForm] = useState({ sku: '', typeId: '', price: '', status: 'trống' });
    const [roomTypeForm, setRoomTypeForm] = useState({ name: '', capacity: '', defaultPrice: '', description: '' });
    const [searchRoomTypeForm, setSearchRoomTypeForm] = useState({ capacity: '', name: '', description: '', minPrice: '', maxPrice: '' });
    const [roomTypes, setRoomTypes] = useState([]);
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [editingRoomTypeId, setEditingRoomTypeId] = useState(null);
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'QUAN_LY';

    useEffect(() => {
        if (!isQuanLy) {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/'), 1000);
        }
    }, [isQuanLy, navigate]);

    const API = axios.create({
        baseURL: 'http://localhost:9999/api/v1',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    const fetchRooms = useCallback(async () => {
        try {
            const response = await API.get('/room');
            setRooms(response.data); // Fixed to avoid ESLint warning
        } catch (error) {
            setMessage('Lỗi khi lấy danh sách phòng: ' + (error.response?.data || error.message));
        }
    }, [API]);

    const fetchRoomTypes = useCallback(async () => {
        try {
            const response = await API.get('/room-type/search');
            setRoomTypes(response.data); // Fixed to avoid ESLint warning
        } catch (error) {
            setMessage('Lỗi khi lấy danh sách loại phòng: ' + (error.response?.data || error.message));
        }
    }, [API]);

    useEffect(() => {
        if (isQuanLy) {
            fetchRooms();
            fetchRoomTypes();
        }
    }, [fetchRooms, fetchRoomTypes, isQuanLy]);

    const handleRoomFormChange = (e) => {
        setRoomForm({ ...roomForm, [e.target.name]: e.target.value });
    };

    const handleRoomTypeFormChange = (e) => {
        setRoomTypeForm({ ...roomTypeForm, [e.target.name]: e.target.value });
    };

    const handleSearchRoomTypeFormChange = (e) => {
        setSearchRoomTypeForm({ ...searchRoomTypeForm, [e.target.name]: e.target.value });
    };

    const handleCreateOrUpdateRoom = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            if (editingRoomId) {
                await API.put(`/room/${editingRoomId}`, roomForm);
                setMessage('Cập nhật phòng thành công');
                setEditingRoomId(null);
            } else {
                await API.post('/room', roomForm);
                setMessage('Tạo phòng thành công');
            }
            fetchRooms();
            setRoomForm({ sku: '', typeId: '', price: '', status: 'trống' });
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (id) => {
        setLoading(true);
        setMessage('');
        try {
            await API.delete(`/room/${id}`);
            setMessage('Xóa phòng thành công');
            fetchRooms();
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoom = (room) => {
        setEditingRoomId(room.roomId);
        setRoomForm({
            sku: room.sku,
            typeId: room.typeId,
            price: room.price,
            status: room.status,
        });
    };

    const handleCreateOrUpdateRoomType = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            if (editingRoomTypeId) {
                await API.put(`/room-type/${editingRoomTypeId}`, roomTypeForm);
                setMessage('Cập nhật loại phòng thành công');
                setEditingRoomTypeId(null);
            } else {
                await API.post('/room-type', roomTypeForm);
                setMessage('Tạo loại phòng thành công');
            }
            fetchRoomTypes();
            setRoomTypeForm({ name: '', capacity: '', defaultPrice: '', description: '' });
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoomType = async (id) => {
        setLoading(true);
        setMessage('');
        try {
            await API.delete(`/room-type/${id}`);
            setMessage('Xóa loại phòng thành công');
            fetchRoomTypes();
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoomType = (roomType) => {
        setEditingRoomTypeId(roomType.typeId);
        setRoomTypeForm({
            name: roomType.name,
            capacity: roomType.capacity,
            defaultPrice: roomType.defaultPrice,
            description: roomType.description,
        });
    };

    const handleSearchRoomType = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await API.get('/room-type/search', {
                params: searchRoomTypeForm,
            });
            setRoomTypes(response.data);
            setMessage('Tìm kiếm loại phòng thành công');
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setMessage('');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            setMessage('Không tìm thấy refresh token');
            localStorage.clear();
            navigate('/');
            setLoading(false);
            return;
        }

        try {
            await API.post('/api/v1/auth/logout', { refreshToken });
            setMessage('Đăng xuất thành công');
            localStorage.clear();
            navigate('/');
        } catch (error) {
            setMessage('Lỗi: ' + (error.response?.data?.message || error.message));
            localStorage.clear();
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    if (!isQuanLy) {
        return (
            <div className="component-container">
                <p className="message error">{message}</p>
            </div>
        );
    }

    return (
        <div className="component-container home-container">
            <h2>Chào mừng đến với Trang Quản Lý</h2>
            <p>Xin chào, {userName || 'Khách'} ({userRole || 'Không xác định'})</p>
            <button onClick={handleLogout} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng xuất'}
            </button>
            {loading && <div className="loader"></div>}
            {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}

            {isQuanLy && (
                <>
                    <h3>{editingRoomId ? 'Cập nhật phòng' : 'Tạo phòng'}</h3>
                    <form onSubmit={handleCreateOrUpdateRoom} className="room-form">
                        <input
                            type="text"
                            name="sku"
                            placeholder="Mã phòng"
                            value={roomForm.sku}
                            onChange={handleRoomFormChange}
                            required
                        />
                        <select name="typeId" value={roomForm.typeId} onChange={handleRoomFormChange} required>
                            <option value="">Chọn loại phòng</option>
                            {roomTypes.map((type) => (
                                <option key={type.typeId} value={type.typeId}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="price"
                            placeholder="Giá phòng"
                            value={roomForm.price}
                            onChange={handleRoomFormChange}
                            required
                            min="0"
                        />
                        <select name="status" value={roomForm.status} onChange={handleRoomFormChange} required>
                            <option value="trống">Trống</option>
                            <option value="đã_đặt">Đã đặt</option>
                        </select>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : editingRoomId ? 'Cập nhật' : 'Tạo'}
                        </button>
                    </form>
                </>
            )}

            <h3>Danh sách phòng</h3>
            <table className="room-table">
                <thead>
                <tr>
                    <th>Mã phòng</th>
                    <th>Loại phòng</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    {isQuanLy && <th>Hành động</th>}
                </tr>
                </thead>
                <tbody>
                {rooms.map((room) => (
                    <tr key={room.roomId}>
                        <td>{room.sku}</td>
                        <td>{room.typeId}</td>
                        <td>{room.price}</td>
                        <td>{room.status}</td>
                        {isQuanLy && (
                            <td>
                                <button onClick={() => handleEditRoom(room)} disabled={loading}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDeleteRoom(room.roomId)} disabled={loading}>
                                    Xóa
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            {isQuanLy && (
                <>
                    <h3>{editingRoomTypeId ? 'Cập nhật loại phòng' : 'Tạo loại phòng'}</h3>
                    <form onSubmit={handleCreateOrUpdateRoomType} className="room-type-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên loại phòng"
                            value={roomTypeForm.name}
                            onChange={handleRoomTypeFormChange}
                            required
                        />
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Sức chứa"
                            value={roomTypeForm.capacity}
                            onChange={handleRoomTypeFormChange}
                            required
                            min="1"
                        />
                        <input
                            type="number"
                            name="defaultPrice"
                            placeholder="Giá mặc định"
                            value={roomTypeForm.defaultPrice}
                            onChange={handleRoomTypeFormChange}
                            required
                            min="0"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Mô tả"
                            value={roomTypeForm.description}
                            onChange={handleRoomTypeFormChange}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : editingRoomTypeId ? 'Cập nhật' : 'Tạo'}
                        </button>
                    </form>
                </>
            )}

            <h3>Tìm kiếm loại phòng</h3>
            <form onSubmit={handleSearchRoomType} className="search-room-type-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Tên loại phòng"
                    value={searchRoomTypeForm.name}
                    onChange={handleSearchRoomTypeFormChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Mô tả"
                    value={searchRoomTypeForm.description}
                    onChange={handleSearchRoomTypeFormChange}
                />
                <input
                    type="number"
                    name="capacity"
                    placeholder="Sức chứa"
                    value={searchRoomTypeForm.capacity}
                    onChange={handleSearchRoomTypeFormChange}
                    min="0"
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Giá tối thiểu"
                    value={searchRoomTypeForm.minPrice}
                    onChange={handleSearchRoomTypeFormChange}
                    min="0"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Giá tối đa"
                    value={searchRoomTypeForm.maxPrice}
                    onChange={handleSearchRoomTypeFormChange}
                    min="0"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Tìm kiếm'}
                </button>
            </form>

            <h3>Danh sách loại phòng</h3>
            <table className="room-type-table">
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Sức chứa</th>
                    <th>Giá mặc định</th>
                    <th>Mô tả</th>
                    {isQuanLy && <th>Hành động</th>}
                </tr>
                </thead>
                <tbody>
                {roomTypes.map((type) => (
                    <tr key={type.typeId}>
                        <td>{type.name}</td>
                        <td>{type.capacity}</td>
                        <td>{type.defaultPrice}</td>
                        <td>{type.description}</td>
                        {isQuanLy && (
                            <td>
                                <button onClick={() => handleEditRoomType(type)} disabled={loading}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDeleteRoomType(type.typeId)} disabled={loading}>
                                    Xóa
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;