// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// const BookingCancel = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [error, setError] = useState(null);
//     const [customer, setCustomer] = useState(null);
//
//     useEffect(() => {
//         const token = localStorage.getItem('access_token');
//         if (!token) {
//             setError('Bạn chưa đăng nhập');
//             return;
//         }
//
//         const fetchCustomer = async () => {
//             try {
//                 const res = await axios.get('http://localhost:8888/api/v1/customers/me', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setCustomer(res.data);
//                 fetchBookings(res.data.customerId);
//             } catch {
//                 setError('Không thể tải thông tin khách hàng');
//             }
//         };
//
//         const fetchBookings = async (customerId) => {
//             setLoading(true);
//             setMessage(null);
//             setError(null);
//             try {
//                 const bookingsData = [];
//                 for (let id = 1; id <= 10; id++) {
//                     try {
//                         const response = await axios.get(`http://localhost:8888/api/bookings/${id}`, {
//                             headers: { Authorization: `Bearer ${token}` },
//                         });
//                         if (response.data.customerId === customerId) {
//                             bookingsData.push(response.data);
//                         }
//                     } catch {}
//                 }
//                 setBookings(bookingsData);
//                 if (bookingsData.length === 0) {
//                     setMessage('Bạn chưa có đặt phòng nào.');
//                 }
//             } catch {
//                 setError('Lỗi khi lấy danh sách đặt phòng');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchCustomer();
//     }, []);
//
//     const handleCancel = async (bookingId) => {
//         setMessage(null);
//         setError(null);
//         setLoading(true);
//         const token = localStorage.getItem('access_token');
//         try {
//             const bookingResponse = await axios.get(`http://localhost:8888/api/bookings/${bookingId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (bookingResponse.data.customerId !== customer?.customerId) {
//                 setError('Bạn không có quyền hủy đặt phòng này');
//                 setLoading(false);
//                 return;
//             }
//
//             const response = await axios.post(
//                 'http://localhost:8888/api/bookings/CancelbookingRoom',
//                 null,
//                 {
//                     params: { id: bookingId },
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             setMessage(response.data);
//             setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
//         } catch (err) {
//             setError(err.response?.data || 'Lỗi khi hủy đặt phòng');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div>
//             <h2>Danh sách đặt phòng của bạn</h2>
//
//             {loading && <p>Đang tải...</p>}
//             {error && <p>{error}</p>}
//             {message && <p>{message}</p>}
//
//             {customer && (
//                 <div>
//                     <h3>Thông tin khách hàng</h3>
//                     <p>Họ tên: {customer.name}</p>
//                     <p>Email: {customer.email}</p>
//                     <p>Số điện thoại: {customer.phone}</p>
//                 </div>
//             )}
//
//             {bookings.length === 0 && !loading && !message && <p>Bạn chưa có đặt phòng nào.</p>}
//
//             {bookings.length > 0 && (
//                 <div>
//                     {bookings.map((booking) => (
//                         <div key={booking.bookingId}>
//                             <h3>Booking ID: {booking.bookingId}</h3>
//                             <p>Phòng: {booking.roomId}</p>
//                             <p>Check-in: {new Date(booking.checkIn).toLocaleDateString('vi-VN')}</p>
//                             <p>Check-out: {new Date(booking.checkOut).toLocaleDateString('vi-VN')}</p>
//                             <p>Tổng tiền: {booking.totalPrice.toLocaleString('vi-VN')} VND</p>
//                             <p>Trạng thái: {booking.status}</p>
//                             <button onClick={() => handleCancel(booking.bookingId)} disabled={loading}>
//                                 {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default BookingCancel;


import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/booking-cancel.css';

const BookingCancel = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Khách hàng';
    const userRole = localStorage.getItem('user_role') || 'CUSTOMER';

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('Bạn chưa đăng nhập');
            return;
        }

        const fetchCustomer = async () => {
            try {
                const res = await axios.get('http://localhost:8888/api/v1/customers/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomer(res.data);
                fetchBookings(res.data.customerId);
            } catch {
                setError('Không thể tải thông tin khách hàng');
            }
        };

        const fetchBookings = async (customerId) => {
            setLoading(true);
            setMessage(null);
            setError(null);
            try {
                const bookingsData = [];
                for (let id = 1; id <= 10; id++) {
                    try {
                        const response = await axios.get(`http://localhost:8888/api/bookings/${id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (response.data.customerId === customerId) {
                            bookingsData.push(response.data);
                        }
                    } catch {}
                }
                setBookings(bookingsData);
                if (bookingsData.length === 0) {
                    setMessage('Bạn chưa có đặt phòng nào.');
                }
            } catch {
                setError('Lỗi khi lấy danh sách đặt phòng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, []);

    const handleCancel = async (bookingId) => {
        setMessage(null);
        setError(null);
        setLoading(true);
        const token = localStorage.getItem('access_token');
        try {
            const bookingResponse = await axios.get(`http://localhost:8888/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (bookingResponse.data.customerId !== customer?.customerId) {
                setError('Bạn không có quyền hủy đặt phòng này');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:8888/api/bookings/CancelbookingRoom',
                null,
                {
                    params: { id: bookingId },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage(response.data);
            setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
        } catch (err) {
            setError(err.response?.data || 'Lỗi khi hủy đặt phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refresh_token');
        axios
            .post(
                'http://localhost:8888/api/v1/auth/logout',
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .catch(() => {})
            .finally(() => {
                localStorage.clear();
                navigate('/login');
            });
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Hủy đặt phòng</div>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/customer/searchRoom"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Tìm kiếm phòng trống
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/book"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/cancelbooking"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Hủy đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/invoices"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Xem và thanh toán hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer/profile"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Cập nhật thông tin cá nhân
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/customer"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Quay lại Dashboard
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

            <main className="booking-cancel-container">
                <h1 className="title">Hủy đặt phòng</h1>

                {loading && <div className="loading">Đang tải...</div>}
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {customer && (
                    <div className="customer-info">
                        <h2 className="subtitle">Thông tin khách hàng</h2>
                        <p><strong>Họ tên:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Số điện thoại:</strong> {customer.phone}</p>
                    </div>
                )}

                <div className="bookings-section">
                    <h2 className="subtitle">Danh sách đặt phòng của bạn</h2>
                    {bookings.length === 0 && !loading && !message && (
                        <p className="no-data">Bạn chưa có đặt phòng nào.</p>
                    )}
                    {bookings.length > 0 && (
                        <div className="bookings-list">
                            {bookings.map((booking) => (
                                <div key={booking.bookingId} className="booking-item">
                                    <h3>Booking ID: {booking.bookingId}</h3>
                                    <p><strong>Phòng:</strong> {booking.roomId}</p>
                                    <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString('vi-VN')}</p>
                                    <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString('vi-VN')}</p>
                                    <p><strong>Tổng tiền:</strong> {booking.totalPrice.toLocaleString('vi-VN')} VND</p>
                                    <p><strong>Trạng thái:</strong> {booking.status}</p>
                                    <button
                                        onClick={() => handleCancel(booking.bookingId)}
                                        className="cancel-btn"
                                        disabled={loading || booking.status !== 'đã_đặt'}
                                    >
                                        {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BookingCancel;