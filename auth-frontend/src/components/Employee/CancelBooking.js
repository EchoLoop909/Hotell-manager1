// import React, { useState } from 'react';
// import axios from 'axios';
//
// const CancelBooking = () => {
//     const [bookingId, setBookingId] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [error, setError] = useState(null);
//
//     const handleCancel = async (e) => {
//         e.preventDefault();
//         setMessage(null);
//         setError(null);
//
//         if (!bookingId) {
//             setError('Vui lòng nhập ID booking');
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 'http://localhost:8888/api/bookings/CancelbookingRoom',
//                 null,
//                 { params: { id: bookingId } }
//             );
//
//             setMessage(res.data);
//             setBookingId('');
//         } catch (err) {
//             if (err.response && err.response.data) {
//                 setError(err.response.data);
//             } else {
//                 setError('Lỗi kết nối đến server');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div>
//             <h2>Hủy đặt phòng</h2>
//             <form onSubmit={handleCancel}>
//                 <div>
//                     <label htmlFor="bookingId">Nhập ID booking cần hủy</label>
//                     <input
//                         type="number"
//                         id="bookingId"
//                         value={bookingId}
//                         onChange={(e) => setBookingId(e.target.value)}
//                         placeholder="ID booking"
//                     />
//                 </div>
//
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
//                 </button>
//             </form>
//
//             {message && <p>{message}</p>}
//             {error && <p>{error}</p>}
//         </div>
//     );
// };
//
// export default CancelBooking;


import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../styles/cancel-booking.css';

const CancelBooking = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Lễ tân';
    const userRole = localStorage.getItem('user_role') || 'LE_TAN';
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleCancel = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!bookingId) {
            setError('Vui lòng nhập tên phòng cần hủy');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:8888/api/bookings/CancelbookingRoom',
                null,
                { params: { id: bookingId } }
            );

            setMessage(res.data);
            setBookingId('');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Lỗi kết nối đến server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Hủy đặt phòng</div>
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

            <main className="cancel-booking-container">
                <h1 className="title">Hủy đặt phòng</h1>
                <form onSubmit={handleCancel} className="cancel-form">
                    <div className="form-group">
                        <label htmlFor="bookingId">Nhập tên phòng cần hủy</label>
                        <input
                            type="number"
                            id="bookingId"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            placeholder="ID booking"
                            className="form-input"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
                    </button>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </main>
        </div>
    );
};

export default CancelBooking;