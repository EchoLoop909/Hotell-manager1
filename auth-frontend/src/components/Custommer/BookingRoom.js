import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchRooms, getRoomTypes } from '../../api';

const BookingRoom = () => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerError, setCustomerError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('counter');
  const [paymentError, setPaymentError] = useState('');

  const [employeeId] = useState(1); // Giả định nhân viên đã đăng nhập
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setCustomerError('Bạn chưa đăng nhập');
      return;
    }

    const fetchRoomTypes = async () => {
      try {
        const types = await getRoomTypes();
        setRoomTypes(types);
      } catch {
        setSearchError('Không thể tải danh sách loại phòng');
      }
    };

    const fetchCurrentCustomer = async () => {
      try {
        const res = await axios.get('http://localhost:8888/api/v1/customers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentCustomer(res.data);
      } catch {
        setCustomerError('Không thể tải thông tin khách hàng');
      }
    };

    fetchRoomTypes();
    fetchCurrentCustomer();
  }, []);

  const handleSearchRooms = async e => {
    e.preventDefault();
    setSearchError('');
    setAvailableRooms([]);
    setSelectedRoomId('');
    setSearchLoading(true);

    if (!checkIn || !checkOut) {
      setSearchError('Vui lòng nhập ngày check-in và check-out');
      setSearchLoading(false);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setSearchError('Ngày check-out phải sau ngày check-in');
      setSearchLoading(false);
      return;
    }

    try {
      const data = await searchRooms(checkIn, checkOut, roomTypeId || null);
      if (data.length === 0) {
        setSearchError('Không tìm thấy phòng trống phù hợp');
      } else {
        setAvailableRooms(data);
      }
    } catch (err) {
      setSearchError(err.message || 'Lỗi khi tìm kiếm phòng');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmitBooking = async e => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setPaymentError('');
    setBookingLoading(true);

    if (!selectedRoomId) {
      setBookingError('Vui lòng chọn một phòng');
      setBookingLoading(false);
      return;
    }

    if (!currentCustomer?.customerId) {
      setCustomerError('Không có thông tin khách hàng để đặt phòng');
      setBookingLoading(false);
      return;
    }

    if (paymentMethod !== 'counter') {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (Math.random() < 0.2) throw new Error();
      } catch {
        setPaymentError('Thanh toán thất bại. Vui lòng thử lại.');
        setBookingLoading(false);
        return;
      }
    }

    const bookingDto = {
      checkIn,
      checkOut,
      status: 'đã_xác_nhận',
      customerId: currentCustomer.customerId,
      employeeId,
      roomId: Number(selectedRoomId),
    };

    try {
      await axios.post('http://localhost:8888/api/bookings/bookingRoom', bookingDto);
      setBookingSuccess('Đặt phòng thành công!');
      setCheckIn('');
      setCheckOut('');
      setRoomTypeId('');
      setAvailableRooms([]);
      setSelectedRoomId('');
      setPaymentMethod('counter');
    } catch (err) {
      setBookingError(err.response?.data || 'Lỗi khi tạo đặt phòng');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
      <div>
        <h1>Đặt phòng</h1>
        <form onSubmit={handleSearchRooms}>
          <div>
            <label>Check-in</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          </div>
          <div>
            <label>Check-out</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </div>
          <div>
            <label>Loại phòng</label>
            <select value={roomTypeId} onChange={e => setRoomTypeId(e.target.value)}>
              <option value="">Tất cả</option>
              {roomTypes.map(type => (
                  <option key={type.typeId} value={type.typeId}>
                    {type.name} (Sức chứa: {type.capacity})
                  </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={searchLoading}>
            {searchLoading ? 'Đang tìm...' : 'Tìm phòng'}
          </button>
          {searchError && <div>{searchError}</div>}
        </form>

        {availableRooms.length > 0 && (
            <div>
              <h2>Phòng trống</h2>
              <table>
                <thead>
                <tr>
                  <th>Chọn</th><th>Phòng</th><th>Loại</th><th>Giá</th><th>Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {availableRooms.map(room => (
                    <tr key={room.roomId}>
                      <td>
                        <input
                            type="radio"
                            name="room"
                            value={room.roomId}
                            checked={selectedRoomId === room.roomId.toString()}
                            onChange={e => setSelectedRoomId(e.target.value)}
                        />
                      </td>
                      <td>{room.sku}</td>
                      <td>{roomTypes.find(t => t.typeId === room.typeId)?.name || '-'}</td>
                      <td>{room.price.toLocaleString('vi-VN')}</td>
                      <td>{room.status}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        <section>
          <h2>Khách hàng</h2>
          {customerError && <div>{customerError}</div>}
          {currentCustomer ? (
              <div>
                <p>Họ tên: <strong>{currentCustomer.name}</strong></p>
                <p>Email: {currentCustomer.email}</p>
                <p>Số điện thoại: {currentCustomer.phone}</p>
              </div>
          ) : (!customerError && <p>Đang tải...</p>)}
        </section>

        <section>
          <div>
            <label>Thanh toán</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="counter">Tại quầy</option>
              <option value="vnpay">VNPay</option>
              <option value="visa">Visa</option>
            </select>
          </div>
          {paymentError && <div>{paymentError}</div>}
          <button onClick={handleSubmitBooking} disabled={bookingLoading}>
            {bookingLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
          {bookingError && <div>{bookingError}</div>}
          {bookingSuccess && <div>{bookingSuccess}</div>}
        </section>
      </div>
  );
};

export default BookingRoom;
