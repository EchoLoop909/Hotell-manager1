import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

const InvoiceManagement = () => {
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
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';
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
    } catch {
      setMessage('Lỗi tải hóa đơn. Vui lòng đăng nhập lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQuanLy) loadInvoices();
    else {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [isQuanLy, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        bookingId: Number(form.bookingId),
        serviceId: Number(form.serviceId),
        paymentMethod: form.paymentMethod,
        status: form.status,
        paymentDate: form.paymentDate || null
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

  const handleEdit = inv => {
    setEditingId(inv.invoiceId);
    setForm({
      bookingId: inv.bookingId.toString(),
      serviceId: inv.serviceId.toString(),
      paymentMethod: inv.paymentMethod,
      status: inv.status,
      paymentDate: inv.paymentDate ? inv.paymentDate.substring(0, 16) : ''
    });
    setMessage('');
  };

  const handleDelete = async id => {
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

  const handleExportPdf = async id => {
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
    } catch {
      setMessage('Lỗi xuất hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const authAPI = axios.create({ baseURL: 'http://localhost:8888/api/v1/auth', headers: { 'Content-Type': 'application/json' } });
      const refreshToken = localStorage.getItem('refresh_token');
      await authAPI.post('/logout', { refreshToken });
    } catch {} finally {
      localStorage.clear();
      navigate('/');
    }
  };

  if (!isQuanLy) return <p className="message error">{message}</p>;

  return (
      <>
        <nav>
          <div>Hotel Management</div>
          <ul>
            <li><NavLink to="/employees">Quản lý nhân viên</NavLink></li>
            <li><NavLink to="/customers">Quản lý khách hàng</NavLink></li>
            <li><NavLink to="/rooms">Quản lý phòng</NavLink></li>
            <li><NavLink to="/room-types">Quản lý kiểu phòng</NavLink></li>
            <li><NavLink to="/invoices">Quản lý hóa đơn</NavLink></li>
            <li><NavLink to="/services">Quản lý dịch vụ</NavLink></li>
          </ul>
          <div>
            <span>Xin chào, <strong>{userName}</strong> ({userRole})</span>
            <button onClick={handleLogout} disabled={loading}>Đăng xuất</button>
          </div>
        </nav>

        <div className="component-container">
          <h2>Quản lý Hóa Đơn</h2>
          {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
          {loading && <div className="loading">Đang tải...</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Booking ID *</label>
              <input name="bookingId" type="number" value={form.bookingId} onChange={handleChange} required min={1} />
            </div>
            <div>
              <label>Service ID *</label>
              <input name="serviceId" type="number" value={form.serviceId} onChange={handleChange} required min={1} />
            </div>
            <div>
              <label>Phương thức thanh toán</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option value="VNPay">VNPay</option>
                <option value="Visa">Visa</option>
                <option value="tại_quầy">Tại quầy</option>
              </select>
            </div>
            <div>
              <label>Trạng thái</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="chưa_thanh_toán">Chưa thanh toán</option>
                <option value="đã_thanh_toán">Đã thanh toán</option>
                <option value="đã_hủy">Đã hủy</option>
              </select>
            </div>
            <div>
              <label>Ngày thanh toán</label>
              <input name="paymentDate" type="datetime-local" value={form.paymentDate} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>{editingId == null ? 'Tạo mới' : 'Cập nhật'}</button>
              {editingId != null && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ bookingId: '', serviceId: '', paymentMethod: 'VNPay', status: 'chưa_thanh_toán', paymentDate: '' }); setMessage(''); }} disabled={loading}>Hủy</button>
              )}
            </div>
          </form>

          <table>
            <thead>
            <tr>
              <th>Booking ID</th><th>Service ID</th><th>Phương thức thanh toán</th><th>Trạng thái</th><th>Ngày thanh toán</th><th>Tổng tiền</th><th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {invoices.length === 0 ? (
                <tr><td colSpan="7">Không có hóa đơn nào</td></tr>
            ) : (
                invoices.map(inv => (
                    <tr key={inv.invoiceId}>
                      <td>{inv.bookingId}</td>
                      <td>{inv.serviceId}</td>
                      <td>{inv.paymentMethod}</td>
                      <td>{inv.status}</td>
                      <td>{inv.paymentDate ? new Date(inv.paymentDate).toLocaleString() : ''}</td>
                      <td>{inv.totalAmount != null ? inv.totalAmount.toLocaleString('vi-VN',{style:'currency',currency:'VND'}) : ''}</td>
                      <td>
                        <button onClick={() => handleEdit(inv)} disabled={loading}>Sửa</button>
                        <button onClick={() => handleDelete(inv.invoiceId)} disabled={loading}>Xóa</button>
                        <button onClick={() => handleExportPdf(inv.invoiceId)} disabled={loading}>Xuất</button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        <style>{`
        nav { background-color: #333; color: #fff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
        nav ul { list-style: none; display: flex; gap: 10px; margin: 0; padding: 0; }
        nav ul li a { color: #fff; text-decoration: none; }
        nav ul li a.active { font-weight: bold; border-bottom: 2px solid #fff; }
        .component-container { max-width: 900px; margin: auto; padding: 20px; }
        h2 { margin-bottom: 10px; }
        form { display: grid; gap: 10px; margin-bottom: 20px; }
        form div { display: flex; flex-direction: column; }
        input, select { padding: 8px; font-size: 16px; }
        .form-actions { display: flex; gap: 10px; }
        button { padding: 8px 12px; font-size: 14px; cursor: pointer; }
        .loading { font-style: italic; }
        .message { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .message.success { background-color: #d4edda; color: #155724; }
        .message.error { background-color: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
      `}</style>
      </>
  );
};

export default InvoiceManagement;