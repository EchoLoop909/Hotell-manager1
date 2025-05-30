import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [customerId, setCustomerId] = useState(null);

    const token = localStorage.getItem('access_token') || '';

    useEffect(() => {
        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            return;
        }

        axios.get('http://localhost:8888/api/v1/customers/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const custId = res.data.customerId || res.data.id;
                if (!custId) {
                    setMessage('Không xác định được ID khách hàng');
                    return;
                }
                setCustomerId(custId);
                setMessage('');
            })
            .catch(() => {
                setMessage('Lấy thông tin khách hàng thất bại, vui lòng đăng nhập lại');
            });
    }, [token]);

    useEffect(() => {
        if (!customerId) return;

        setLoading(true);
        axios.get(`http://localhost:8888/api/v1/invoices/customer/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setInvoices(res.data);
                setMessage('');
            })
            .catch(() => {
                setMessage('Lấy hóa đơn thất bại');
            })
            .finally(() => setLoading(false));
    }, [customerId, token]);

    if (message) return <p>{message}</p>;
    if (loading) return <p>Đang tải hóa đơn...</p>;

    return (
        <div>
            <h2>Danh sách hóa đơn của bạn</h2>
            {invoices.length === 0 ? (
                <p>Bạn chưa có hóa đơn nào.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Mã hóa đơn</th>
                        <th>Mã phòng</th>
                        <th>Kiểu phòng</th>
                        <th>Tên dịch vụ</th>
                        <th>Tổng tiền</th>
                        <th>Phương thức thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Ngày thanh toán</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.invoiceId}>
                            <td>{inv.invoiceId}</td>
                            <td>{inv.roomSku || '-'}</td>
                            <td>{inv.roomTypeName || '-'}</td>
                            <td>{inv.serviceName || '-'}</td>
                            <td>
                                {inv.totalAmount
                                    ? inv.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    : '-'}
                            </td>
                            <td>{inv.paymentMethod || '-'}</td>
                            <td>{inv.status || '-'}</td>
                            <td>
                                {inv.paymentDate ? new Date(inv.paymentDate).toLocaleString('vi-VN') : '-'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Invoice;

// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../../styles/invoice.css';
//
// const Invoice = () => {
//     const [invoices, setInvoices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [customerId, setCustomerId] = useState(null);
//
//     const navigate = useNavigate();
//     const token = localStorage.getItem('access_token') || '';
//     const userName = localStorage.getItem('user_name') || 'Khách hàng';
//     const userRole = localStorage.getItem('user_role') || 'CUSTOMER';
//
//     useEffect(() => {
//         if (!token) {
//             setMessage('Bạn chưa đăng nhập');
//             return;
//         }
//
//         axios.get('http://localhost:8888/api/v1/customers/me', {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(res => {
//                 const custId = res.data.customerId || res.data.id;
//                 if (!custId) {
//                     setMessage('Không xác định được ID khách hàng');
//                     return;
//                 }
//                 setCustomerId(custId);
//                 setMessage('');
//             })
//             .catch(() => {
//                 setMessage('Lấy thông tin khách hàng thất bại, vui lòng đăng nhập lại');
//             });
//     }, [token]);
//
//     useEffect(() => {
//         if (!customerId) return;
//
//         setLoading(true);
//         axios.get(`http://localhost:8888/api/v1/invoices/customer/${customerId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(res => {
//                 setInvoices(res.data);
//                 setMessage('');
//             })
//             .catch(() => {
//                 setMessage('Lấy hóa đơn thất bại');
//             })
//             .finally(() => setLoading(false));
//     }, [customerId, token]);
//
//     const handleLogout = () => {
//         const refreshToken = localStorage.getItem('refresh_token');
//         axios
//             .post(
//                 'http://localhost:8888/api/v1/auth/logout',
//                 { refreshToken },
//                 { headers: { 'Content-Type': 'application/json' } }
//             )
//             .catch(() => {})
//             .finally(() => {
//                 localStorage.clear();
//                 navigate('/login');
//             });
//     };
//
//     return (
//         <div className="dashboard-wrapper">
//             <nav className="navbar">
//                 <div className="navbar-brand">Hotel Management - Hóa đơn</div>
//                 <ul className="nav-list">
//                     <li>
//                         <NavLink
//                             to="/customer/searchRoom"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Tìm kiếm phòng trống
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/customer/book"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Đặt phòng
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/customer/cancelbooking"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Hủy đặt phòng
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/customer/invoices"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Xem và thanh toán hóa đơn
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/customer/profile"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Cập nhật thông tin cá nhân
//                         </NavLink>
//                     </li>
//                     <li>
//                         <NavLink
//                             to="/customer"
//                             className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
//                         >
//                             Quay lại Dashboard
//                         </NavLink>
//                     </li>
//                 </ul>
//                 <div className="navbar-user">
//                     <span>Xin chào, {userName}</span>
//                     <button className="logout-btn" onClick={handleLogout}>
//                         Đăng xuất
//                     </button>
//                 </div>
//             </nav>
//
//             <main className="invoice-container">
//                 <h1 className="title">Danh sách hóa đơn của bạn</h1>
//
//                 {message && <div className="error-message">{message}</div>}
//                 {loading && <div className="loading">Đang tải...</div>}
//
//                 {invoices.length === 0 && !message && !loading ? (
//                     <p className="no-data">Bạn chưa có quyền hóa đơn nào.</p>
//                 ) : (
//                     <div className="table-container">
//                         <table className="invoice-table">
//                             <thead>
//                             <tr>
//                                 <th>Mã hóa đơn</th>
//                                 <th>Mã phòng</th>
//                                 <th>Kiểu phòng</th>
//                                 <th>Tên dịch vụ</th>
//                                 <th>Tổng tiền</th>
//                                 <th>Phương thức thanh toán</th>
//                                 <th>Trạng thái</th>
//                                 <th>Ngày thanh toán</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {invoices.map((row) => (
//                                 <tr key={row.id}>
//                                     <td>{row.id || '-'}</td>
//                                     <td>{row.data?.room_id || '-'}</td>
//                                     <td>{row.data?.room_type_id || '-'}</td>
//                                     <td>{row.data?.service_id || '-'}</td>
//                                     <td>
//                                         {row.data?.total_price
//                                             ? row.data.total_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
//                                             : '-'}
//                                     </td>
//                                     <td>{row.data?.method || '-'}</td>
//                                     <td>{row.data?.status || '-'}</td>
//                                     <td>
//                                         {row.data?.payment_date ? new Date(row.data.payment_date).toLocaleString('vi-VN') : '-'}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };
//
// export default Invoice;