import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomTypes, searchRooms } from '../../api';
import axios from 'axios';
import '../../styles/styles.css';

const BookingRoom = () => {
  const navigate = useNavigate();

  // State cho tìm phòng
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // State khách hàng lấy từ API
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerError, setCustomerError] = useState('');

  // State thanh toán
  const [paymentMethod, setPaymentMethod] = useState('counter');
  const [paymentError, setPaymentError] = useState('');

  // State đặt phòng
  const [employeeId, setEmployeeId] = useState(1); // giả định đang đăng nhập nhân viên
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Lấy loại phòng + thông tin khách hàng hiện tại
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await getRoomTypes();
        setRoomTypes(response);
      } catch (err) {
        setSearchError('Không thể tải danh sách loại phòng');
      }
    };

    const fetchCurrentCustomer = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/v1/customers/me', { withCredentials: true });
        setCurrentCustomer(response.data);
      } catch (err) {
        setCustomerError('Không thể tải thông tin khách hàng hiện tại');
      }
    };

    fetchRoomTypes();
    fetchCurrentCustomer();
  }, []);

  // Tìm phòng trống
  const handleSearchRooms = async (e) => {
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

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
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

  // Xử lý đặt phòng
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setPaymentError('');
    setBookingLoading(true);
    setCustomerError('');

    if (!selectedRoomId) {
      setBookingError('Vui lòng chọn một phòng');
      setBookingLoading(false);
      return;
    }

    if (!currentCustomer || !currentCustomer.customerId) {
      setCustomerError('Không có thông tin khách hàng để đặt phòng');
      setBookingLoading(false);
      return;
    }

    // Thanh toán giả lập
    if (paymentMethod === 'vnpay' || paymentMethod === 'visa') {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const paymentSuccess = Math.random() > 0.2;
        if (!paymentSuccess) throw new Error('Thanh toán thất bại');
      } catch (err) {
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
      roomId: parseInt(selectedRoomId),
    };

    try {
      await axios.post('http://localhost:8888/api/bookings/bookingRoom', bookingDto);
      setBookingSuccess('Đặt phòng thành công!');

      console.log(`Gửi email xác nhận đến ${currentCustomer.email}`);
      console.log('Đồng bộ với Booking.com/Agoda');

      // Reset form tìm phòng
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
    <div className="booking-container">
      <h1 className="booking-title">Đặt phòng</h1>

      {/* Tìm phòng */}
      <section className="booking-section">
        <h2 className="section-title">Tìm kiếm phòng trống</h2>
        <form onSubmit={handleSearchRooms} className="search-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Ngày check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Ngày check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Loại phòng</label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className="form-input"
              >
                <option value="">Tất cả</option>
                {roomTypes.map((type) => (
                  <option key={type.typeId} value={type.typeId}>
                    {type.name} (Sức chứa: {type.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="search-button" disabled={searchLoading}>
            {searchLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm phòng'}
          </button>
        </form>
        {searchError && <div className="error-message">{searchError}</div>}
        {availableRooms.length > 0 && (
          <div className="results-table">
            <h3 className="section-title">Phòng trống</h3>
            <table>
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>Mã phòng</th>
                  <th>Loại phòng</th>
                  <th>Giá (VNĐ/đêm)</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {availableRooms.map((room) => (
                  <tr key={room.roomId}>
                    <td>
                      <input
                        type="radio"
                        name="room"
                        value={room.roomId}
                        checked={selectedRoomId === room.roomId.toString()}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                      />
                    </td>
                    <td>{room.sku}</td>
                    <td>{roomTypes.find((type) => type.typeId === room.typeId)?.name || 'N/A'}</td>
                    <td>{room.price.toLocaleString('vi-VN')}</td>
                    <td>{room.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Thông tin khách hàng hiện tại */}
      <section className="booking-section">
        <h2 className="section-title">Thông tin khách hàng</h2>
        {customerError && <div className="error-message">{customerError}</div>}
        {currentCustomer ? (
          <div className="customer-info">
            <p><strong>Họ và tên:</strong> {currentCustomer.fullName}</p>
            <p><strong>Email:</strong> {currentCustomer.email}</p>
            <p><strong>Số điện thoại:</strong> {currentCustomer.phone}</p>
          </div>
        ) : (
          !customerError && <p>Đang tải thông tin khách hàng...</p>
        )}
      </section>

      {/* Thanh toán */}
      <section className="booking-section">
        <h2 className="section-title">Phương thức thanh toán</h2>
        <div className="form-group">
          <label>Chọn phương thức</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-input"
          >
            <option value="counter">Thanh toán tại quầy</option>
            <option value="vnpay">VNPay</option>
            <option value="visa">Visa</option>
          </select>
        </div>
        {paymentError && <div className="error-message">{paymentError}</div>}
      </section>

      {/* Gửi */}
      <button
        onClick={handleSubmitBooking}
        className="booking-button"
        disabled={bookingLoading}
      >
        {bookingLoading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
      </button>
      {bookingError && <div className="error-message">{bookingError}</div>}
      {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}
    </div>
  );
};

export default BookingRoom;
