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
        <div>
            <h2>Hủy đặt phòng</h2>
            <form onSubmit={handleCancel}>
                <div>
                    <label htmlFor="bookingId">Nhập ID booking cần hủy</label>
                    <input
                        type="number"
                        id="bookingId"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="ID booking"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Đang hủy...' : 'Hủy đặt phòng'}
                </button>
            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default CancelBooking;
