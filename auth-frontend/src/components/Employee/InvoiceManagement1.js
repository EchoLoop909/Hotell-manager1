// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
//
// const InvoiceManagement1 = () => {
//     const [invoices, setInvoices] = useState([]);
//     const [form, setForm] = useState({
//         bookingId: '',
//         serviceId: '',
//         paymentMethod: 'VNPay',
//         status: 'chưa_thanh_toán',
//         paymentDate: ''
//     });
//     const [editingId, setEditingId] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//
//     const navigate = useNavigate();
//     const userRole = localStorage.getItem('user_role');
//     const isQuanLy = userRole === 'LE_TAN';
//
//     const token = localStorage.getItem('access_token') || '';
//     const api = axios.create({
//         baseURL: 'http://localhost:8888/api/v1/invoices',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         }
//     });
//
//     const loadInvoices = async () => {
//         setLoading(true);
//         try {
//             const res = await api.get();
//             setInvoices(res.data);
//             setMessage('');
//         } catch (err) {
//             setMessage('Lỗi tải hóa đơn. Vui lòng đăng nhập lại.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         if (isQuanLy) {
//             loadInvoices();
//         } else {
//             setMessage('Bạn không có quyền truy cập trang này');
//             setTimeout(() => navigate('/'), 1000);
//         }
//     }, [isQuanLy, navigate]);
//
//     const handleChange = e => {
//         const { name, value } = e.target;
//         setForm(f => ({ ...f, [name]: value }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         try {
//             const payload = {
//                 bookingId: Number(form.bookingId),
//                 serviceId: Number(form.serviceId),
//                 paymentMethod: form.paymentMethod,
//                 status: form.status,
//                 paymentDate: form.paymentDate || null,
//             };
//             if (editingId == null) {
//                 await api.post('/create', payload);
//                 setMessage('Tạo hóa đơn thành công');
//             } else {
//                 await api.put(`/${editingId}`, payload);
//                 setMessage('Cập nhật hóa đơn thành công');
//             }
//             setForm({ bookingId: '', serviceId: '', paymentMethod: 'VNPay', status: 'chưa_thanh_toán', paymentDate: '' });
//             setEditingId(null);
//             loadInvoices();
//         } catch {
//             setMessage(editingId == null ? 'Lỗi tạo hóa đơn' : 'Lỗi cập nhật hóa đơn');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleEdit = (inv) => {
//         setEditingId(inv.invoiceId);
//         setForm({
//             bookingId: inv.bookingId.toString(),
//             serviceId: inv.serviceId.toString(),
//             paymentMethod: inv.paymentMethod,
//             status: inv.status,
//             paymentDate: inv.paymentDate ? inv.paymentDate.substring(0,16) : ''
//         });
//         setMessage('');
//     };
//
//     const handleDelete = async (id) => {
//         if (!window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) return;
//         setLoading(true);
//         setMessage('');
//         try {
//             await api.delete(`/${id}`);
//             setMessage('Xóa hóa đơn thành công');
//             loadInvoices();
//         } catch {
//             setMessage('Lỗi xóa hóa đơn');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleExportPdf = async (id) => {
//         setLoading(true);
//         setMessage('');
//         try {
//             const exportApi = axios.create({
//                 baseURL: 'http://localhost:8888/api/v1/invoices',
//                 headers: { Authorization: `Bearer ${token}` },
//                 responseType: 'blob'
//             });
//
//             const response = await exportApi.get(`/export/${id}`);
//
//             const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `invoice_${id}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(url);
//
//             setMessage('Xuất hóa đơn thành công');
//         } catch (err) {
//             setMessage('Lỗi xuất hóa đơn');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (!isQuanLy) {
//         return <p>{message}</p>;
//     }
//
//     return (
//         <>
//             <section>
//                 <header>
//                     <h1>Quản lý Hóa Đơn</h1>
//                 </header>
//
//                 {message && (
//                     <p>{message}</p>
//                 )}
//                 {loading && <div>Loading...</div>}
//
//                 <section>
//                     <form onSubmit={handleSubmit}>
//                         <div>
//                             <label htmlFor="bookingId">Booking ID <span>*</span></label>
//                             <input
//                                 id="bookingId"
//                                 name="bookingId"
//                                 type="number"
//                                 placeholder="Booking ID"
//                                 value={form.bookingId}
//                                 onChange={handleChange}
//                                 required
//                                 min={1}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="serviceId">Service ID <span>*</span></label>
//                             <input
//                                 id="serviceId"
//                                 name="serviceId"
//                                 type="number"
//                                 placeholder="Service ID"
//                                 value={form.serviceId}
//                                 onChange={handleChange}
//                                 required
//                                 min={1}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="paymentMethod">Phương thức thanh toán</label>
//                             <select
//                                 id="paymentMethod"
//                                 name="paymentMethod"
//                                 value={form.paymentMethod}
//                                 onChange={handleChange}
//                             >
//                                 <option value="VNPay">VNPay</option>
//                                 <option value="Visa">Visa</option>
//                                 <option value="tại_quầy">Tại quầy</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label htmlFor="status">Trạng thái</label>
//                             <select
//                                 id="status"
//                                 name="status"
//                                 value={form.status}
//                                 onChange={handleChange}
//                             >
//                                 <option value="chưa_thanh_toán">Chưa thanh toán</option>
//                                 <option value="đã_thanh_toán">Đã thanh toán</option>
//                                 <option value="đã_hủy">Đã hủy</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label htmlFor="paymentDate">Ngày thanh toán</label>
//                             <input
//                                 id="paymentDate"
//                                 name="paymentDate"
//                                 type="datetime-local"
//                                 value={form.paymentDate}
//                                 onChange={handleChange}
//                             />
//                         </div>
//
//                         <button type="submit" disabled={loading}>
//                             {editingId == null ? 'Tạo mới' : 'Cập nhật'}
//                         </button>
//                         {editingId != null && (
//                             <button type="button" onClick={() => {
//                                 setEditingId(null);
//                                 setForm({ bookingId: '', serviceId: '', paymentMethod: 'VNPay', status: 'chưa_thanh_toán', paymentDate: '' });
//                                 setMessage('');
//                             }} disabled={loading}>
//                                 Hủy
//                             </button>
//                         )}
//                     </form>
//                 </section>
//
//                 <section>
//                     <table>
//                         <thead>
//                         <tr>
//                             <th>Booking ID</th>
//                             <th>Service ID</th>
//                             <th>Phương thức thanh toán</th>
//                             <th>Trạng thái</th>
//                             <th>Ngày thanh toán</th>
//                             <th>Tổng tiền</th>
//                             <th>Hành động</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {invoices.length === 0 ? (
//                             <tr>
//                                 <td colSpan="7" style={{ textAlign: 'center' }}>Không có hóa đơn nào</td>
//                             </tr>
//                         ) : (
//                             invoices.map(inv => (
//                                 <tr key={inv.invoiceId}>
//                                     <td>{inv.bookingId}</td>
//                                     <td>{inv.serviceId}</td>
//                                     <td>{inv.paymentMethod}</td>
//                                     <td>{inv.status}</td>
//                                     <td>{inv.paymentDate ? new Date(inv.paymentDate).toLocaleString() : ''}</td>
//                                     <td>{inv.totalAmount != null
//                                         ? inv.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
//                                         : ''}</td>
//                                     <td>
//                                         <button
//                                             onClick={() => handleEdit(inv)}
//                                             disabled={loading}
//                                         >
//                                             Sửa
//                                         </button>{' '}
//                                         <button
//                                             onClick={() => handleExportPdf(inv.invoiceId)}
//                                             disabled={loading}
//                                         >
//                                             Xuất
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                         </tbody>
//                     </table>
//                 </section>
//             </section>
//         </>
//     );
// };
//
// export default InvoiceManagement1;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import '../../styles/invoice-management.css';

const InvoiceManagement1 = () => {
    const [invoices, setInvoices] = useState([]);
    const [form, setForm] = useState({
        bookingId: '',
        serviceId: '',
        paymentMethod: 'VNPay',
        status: 'chưa_thanh_toán',
        paymentDate: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const userName = localStorage.getItem('user_name') || 'Lễ tân';
    const userRole = localStorage.getItem('user_role');
    const isQuanLy = userRole === 'LE_TAN';

    const token = localStorage.getItem('access_token') || '';
    const api = axios.create({
        baseURL: 'http://localhost:8888/api/v1/invoices',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.get();
            setInvoices(res.data);
            setMessage('');
        } catch (err) {
            setMessage('Lỗi tải hóa đơn. Vui lòng đăng nhập lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isQuanLy) {
            loadInvoices();
        } else {
            setMessage('Bạn không có quyền truy cập trang này');
            setTimeout(() => navigate('/'), 1000);
        }
    }, [isQuanLy, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const payload = {
                bookingId: Number(form.bookingId),
                serviceId: Number(form.serviceId),
                paymentMethod: form.paymentMethod,
                status: form.status,
                paymentDate: form.paymentDate || null,
            };
            if (editingId == null) {
                await api.post('/create', payload);
                setMessage('Tạo hóa đơn thành công');
            } else {
                await api.put(`/${editingId}`, payload);
                setMessage('Cập nhật hóa đơn thành công');
            }
            setForm({ bookingId: '', serviceId: '', paymentMethod: 'VNPay', status: 'chưa_thanh_toán', paymentDate: '' });
            setEditingId(null);
            loadInvoices();
        } catch {
            setMessage(editingId == null ? 'Lỗi tạo hóa đơn' : 'Lỗi cập nhật hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (inv) => {
        setEditingId(inv.invoiceId);
        setForm({
            bookingId: inv.bookingId.toString(),
            serviceId: inv.serviceId.toString(),
            paymentMethod: inv.paymentMethod,
            status: inv.status,
            paymentDate: inv.paymentDate ? inv.paymentDate.substring(0,16) : ''
        });
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) return;
        setLoading(true);
        setMessage('');
        try {
            await api.delete(`/${id}`);
            setMessage('Xóa hóa đơn thành công');
            loadInvoices();
        } catch {
            setMessage('Lỗi xóa hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async (id) => {
        setLoading(true);
        setMessage('');
        try {
            const exportApi = axios.create({
                baseURL: 'http://localhost:8888/api/v1/invoices',
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const response = await exportApi.get(`/export/${id}`);

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setMessage('Xuất hóa đơn thành công');
        } catch (err) {
            setMessage('Lỗi xuất hóa đơn');
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

    if (!isQuanLy) {
        return <p className="error-message">{message}</p>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">Hotel Management - Quản lý hóa đơn</div>
                <ul className="nav-list">
                    <li>
                        <NavLink
                            to="/receptionist/search-room"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Tìm kiếm phòng trống
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/book"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/cancel-booking"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Hủy đặt phòng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/invoices"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Xem hóa đơn
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/customer"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Thông tin khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/receptionist/employeeUpdate"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
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

            <main className="invoice-management-container">
                <h1 className="title">Quản lý Hóa Đơn</h1>

                {message && <p className={message.includes('thành công') ? 'success-message' : 'error-message'}>{message}</p>}
                {loading && <div className="loading">Đang tải...</div>}

                <section className="form-section">
                    <form onSubmit={handleSubmit} className="invoice-form">
                        <div className="form-group">
                            <label htmlFor="bookingId">Booking ID <span className="required">*</span></label>
                            <input
                                id="bookingId"
                                name="bookingId"
                                type="number"
                                placeholder="Booking ID"
                                value={form.bookingId}
                                onChange={handleChange}
                                className="form-input"
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="serviceId">Service ID <span className="required">*</span></label>
                            <input
                                id="serviceId"
                                name="serviceId"
                                type="number"
                                placeholder="Service ID"
                                value={form.serviceId}
                                onChange={handleChange}
                                className="form-input"
                                required
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentMethod">Phương thức thanh toán</label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="VNPay">VNPay</option>
                                <option value="Visa">Visa</option>
                                <option value="tại_quầy">Tại quầy</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Trạng thái</label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="chưa_thanh_toán">Chưa thanh toán</option>
                                <option value="đã_thanh_toán">Đã thanh toán</option>
                                <option value="đã_hủy">Đã hủy</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentDate">Ngày thanh toán</label>
                            <input
                                id="paymentDate"
                                name="paymentDate"
                                type="datetime-local"
                                value={form.paymentDate}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {editingId == null ? 'Tạo mới' : 'Cập nhật'}
                            </button>
                            {editingId != null && (
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({ bookingId: '', serviceId: '', paymentMethod: 'VNPay', status: 'chưa_thanh_toán', paymentDate: '' });
                                        setMessage('');
                                    }}
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="table-section">
                    <table className="invoice-table">
                        <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Service ID</th>
                            <th>Phương thức thanh toán</th>
                            <th>Trạng thái</th>
                            <th>Ngày thanh toán</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">Không có hóa đơn nào</td>
                            </tr>
                        ) : (
                            invoices.map(inv => (
                                <tr key={inv.invoiceId}>
                                    <td>{inv.bookingId}</td>
                                    <td>{inv.serviceId}</td>
                                    <td>{inv.paymentMethod}</td>
                                    <td>{inv.status}</td>
                                    <td>{inv.paymentDate ? new Date(inv.paymentDate).toLocaleString() : ''}</td>
                                    <td>
                                        {inv.totalAmount != null
                                            ? inv.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                            : ''}
                                    </td>
                                    <td className="action-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(inv)}
                                            disabled={loading}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(inv.invoiceId)}
                                            disabled={loading}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="export-btn"
                                            onClick={() => handleExportPdf(inv.invoiceId)}
                                            disabled={loading}
                                        >
                                            Xuất
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default InvoiceManagement1;