import React, { useState } from 'react';
import axios from 'axios';

const CancelBooking = () => {
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleCancel = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!bookingId) {
            setError('Vui lòng nhập ID booking');
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

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Hủy đặt phòng</h2>
            <form onSubmit={handleCancel}>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="bookingId" style={{ display: 'block', marginBottom: 6 }}>
                        Nhập ID booking cần hủy
                    </label>
                    <input
                        type="number"
                        id="bookingId"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        style={{ width: '100%', padding: 8, fontSize: 16 }}
                        placeholder="ID booking"
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '8px 16px', fontSize: 16 }}>
                    {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
                </button>
            </form>

            {message && <p style={{ marginTop: 20, color: 'green' }}>{message}</p>}
            {error && <p style={{ marginTop: 20, color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CancelBooking;
