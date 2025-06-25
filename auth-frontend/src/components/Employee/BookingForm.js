

import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { getRoomTypes, searchRooms } from '../../api';
import axios from 'axios';
import '../../styles/booking.css';

const BookingForm = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Lễ tân';
  const userRole = localStorage.getItem('user_role') || 'LE_TAN';

  // State cho tìm phòng
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // State cho khách hàng
  const [customerId, setCustomerId] = useState('');
  const [newCustomer, setNewCustomer] = useState({ fullName: '', email: '', phone: '' });
  const [useExistingCustomer, setUseExistingCustomer] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerError, setCustomerError] = useState('');

  // State thanh toán
  const [paymentMethod, setPaymentMethod] = useState('counter');
  const [paymentError, setPaymentError] = useState('');

  // State đặt phòng
  const [employeeId, setEmployeeId] = useState(33); // giả định đang đăng nhập
  const [bookingError, setBookingError] = useState('');

  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await getRoomTypes();
        setRoomTypes(response);
      } catch (err) {
        setSearchError('Không thể tải danh sách loại phòng');
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/v1/customers');
        setCustomers(response.data);
      } catch (err) {
        setCustomerError('Không thể tải danh sách khách hàng');
      }
    };

    fetchRoomTypes();
    fetchCustomers();
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

  const handleNewCustomerChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Xử lý đặt phòng
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setPaymentError('');
    setBookingLoading(true);

    // Kiểm tra chọn phòng
    if (!selectedRoomId) {
      setBookingError('Vui lòng chọn một phòng');
      setBookingLoading(false);
      return;
    }

    let finalCustomerId = customerId;

    if (useExistingCustomer) {
      if (!customerId) {
        setCustomerError('Vui lòng chọn khách hàng');
        setBookingLoading(false);
        return;
      }
    } else {
      const { fullName, email, phone } = newCustomer;
      if (!fullName || !email || !phone) {
        setCustomerError('Vui lòng nhập đầy đủ thông tin khách hàng');
        setBookingLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:8888/api/v1/customers/add', {
          name: fullName, // sửa để khớp với Customer entity
          email,
          phone,
          password: 'default123' // thêm password mặc định vì Customer entity yêu cầu
        });
        const addedCustomer = await axios.get('http://localhost:8888/api/v1/customers');
        const createdCustomer = addedCustomer.data.find(c => c.email === email && c.phone === phone);
        finalCustomerId = createdCustomer?.customerId;
      } catch (err) {
        setCustomerError(err.response?.data || 'Lỗi khi tạo khách hàng mới');
        setBookingLoading(false);
        return;
      }
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
      customerId: finalCustomerId,
      employeeId,
      roomId: parseInt(selectedRoomId),
    };

    try {
      const response = await axios.post('http://localhost:8888/api/bookings/bookingRoom', bookingDto);
      setBookingSuccess('Đặt phòng thành công: ' + response.data);
      console.log(`Gửi email xác nhận đến ${useExistingCustomer ? customers.find(c => c.customerId === parseInt(customerId))?.email : newCustomer.email}`);
      console.log('Đồng bộ với Booking.com/Agoda');

      // Reset form
      setCheckIn('');
      setCheckOut('');
      setRoomTypeId('');
      setAvailableRooms([]);
      setSelectedRoomId('');
      setCustomerId('');
      setNewCustomer({ name: '', email: '', phone: '' });
      setPaymentMethod('counter');
    } catch (err) {
      setBookingError(err.message || 'Lỗi khi tạo đặt phòng');
    } finally {
      setBookingLoading(false);
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
          <div className="navbar-brand">Hotel Management - Đặt phòng</div>
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
                  className={({ isActive }) => (isActive ? 'nav-link' : 'active')}
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
            <span>Xinchào, userName ({userRole})</span>
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </nav>

        <main className="booking-container">
          <h1 className="title">Đặt phòng</h1>

          {/* Tìm phòng */}
          <section className="section">
            <h2>Tìm kiếm phòng trống</h2>
            <form onSubmit={handleSearchRooms} className="search-form">
              <div className="form-group">
                <label htmlFor="checkIn">Ngày check-in</label>
                <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                />
              </div>
              <div className="form-group">
                <label htmlFor="checkOut">Ngày check-out</label>
                <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roomType">Loại phòng</label>
                <select
                    id="roomTypeId"
                    value={roomTypeId}
                    onChange={(e) => setRoomTypeId(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {roomTypes.map((roomType) => (
                      <option key={roomType.typeId} value={roomType.typeId}>
                        {roomType.name} (Sức chứa: {roomType.capacity})
                      </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={searchLoading} className="search-btn">
                {searchLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm phòng'}
              </button>
            </form>
            {searchError && <div className="error-message">{searchError}</div>}
            {availableRooms.length > 0 && (
                <div className="rooms-table">
                  <h3>Phòng trống</h3>
                  <table className="table">
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

          {/* Khách hàng */}
          <section className="section">
            <h2>Thông tin khách hàng</h2>
            <div className="form-group">
              <label>
                <input
                    type="checkbox"
                    checked={useExistingCustomer}
                    onChange={() => setUseExistingCustomer(!useExistingCustomer)}
                />
                Sử dụng khách hàng hiện có
              </label>
            </div>
            {useExistingCustomer ? (
                <div className="form-group">
                  <label htmlFor="customer">Chọn khách hàng</label>
                  <select
                      id="customerId"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="">Chọn khách hàng</option>
                    {customers.map((customer) => (
                        <option key={customer.customerId} value={customer.customerId}>
                          {customer.name} ({customer.email})
                        </option>
                    ))}
                  </select>
                </div>
            ) : (
                <div>
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={newCustomer.fullName}
                        onChange={handleNewCustomerChange}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={newCustomer.email}
                        onChange={handleNewCustomerChange}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={newCustomer.phone}
                        onChange={handleNewCustomerChange}
                        required
                    />
                  </div>
                </div>
            )}
            {customerError && <div className="error-message">{customerError}</div>}
          </section>

          {/* Thanh toán */}
          <section className="section">
            <h2>Phương thức thanh toán</h2>
            <div className="form-group">
              <label htmlFor="paymentMethod">Chọn phương thức</label>
              <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="counter">Thanh toán tại quầy</option>
                <option value="vnpay">VNPay</option>
                <option value="visa">Visa</option>
              </select>
            </div>
            {paymentError && <div className="error-message">{paymentError}</div>}
          </section>

          <button
              onClick={handleSubmitBooking}
              disabled={bookingLoading}
              className="submit-btn"
          >
            {bookingLoading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
          </button>
          {bookingError && <div className="error-message">{bookingError}</div>}
          {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}
        </main>
      </div>
  );
};

export default BookingForm;