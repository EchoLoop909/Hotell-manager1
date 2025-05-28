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
