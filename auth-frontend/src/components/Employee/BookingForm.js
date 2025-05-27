// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getRoomTypes, searchRooms } from '../../api';
// import axios from 'axios';
// import '../../styles/styles.css';
//
// const BookingForm = () => {
//   const navigate = useNavigate();
//   // State for room search
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [roomTypeId, setRoomTypeId] = useState('');
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [selectedRoomId, setSelectedRoomId] = useState('');
//   const [searchError, setSearchError] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);
//
//   // State for customer
//   const [customerId, setCustomerId] = useState('');
//   const [newCustomer, setNewCustomer] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//   });
//   const [useExistingCustomer, setUseExistingCustomer] = useState(true);
//   const [customers, setCustomers] = useState([]);
//   const [customerError, setCustomerError] = useState('');
//
//   // State for payment
//   const [paymentMethod, setPaymentMethod] = useState('counter');
//   const [paymentError, setPaymentError] = useState('');
//
//   // State for booking
//   const [employeeId, setEmployeeId] = useState(1); // Assume logged-in employee ID
//   const [bookingError, setBookingError] = useState('');
//   const [bookingSuccess, setBookingSuccess] = useState('');
//   const [bookingLoading, setBookingLoading] = useState(false);
//
//   // Fetch room types and customers on mount
//   useEffect(() => {
//     const fetchRoomTypes = async () => {
//       try {
//         const response = await getRoomTypes();
//         setRoomTypes(response);
//       } catch (err) {
//         setSearchError('Không thể tải danh sách loại phòng');
//       }
//     };
//
//     const fetchCustomers = async () => {
//       try {
//         const response = await axios.get('/api/v1/customers');
//         setCustomers(response.data);
//       } catch (err) {
//         setCustomerError('Không thể tải danh sách khách hàng');
//       }
//     };
//
//     fetchRoomTypes();
//     fetchCustomers();
//   }, []);
//
//   // Search for available rooms
//   const handleSearchRooms = async (e) => {
//     e.preventDefault();
//     setSearchError('');
//     setAvailableRooms([]);
//     setSelectedRoomId('');
//     setSearchLoading(true);
//
//     if (!checkIn || !checkOut) {
//       setSearchError('Vui lòng nhập ngày check-in và check-out');
//       setSearchLoading(false);
//       return;
//     }
//
//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);
//     if (checkOutDate <= checkInDate) {
//       setSearchError('Ngày check-out phải sau ngày check-in');
//       setSearchLoading(false);
//       return;
//     }
//
//     try {
//       const data = await searchRooms(checkIn, checkOut, roomTypeId || null);
//       if (data.length === 0) {
//         setSearchError('Không tìm thấy phòng trống phù hợp');
//       } else {
//         setAvailableRooms(data);
//       }
//     } catch (err) {
//       setSearchError(err.message || 'Lỗi khi tìm kiếm phòng');
//     } finally {
//       setSearchLoading(false);
//     }
//   };
//
//   // Handle customer input change
//   const handleNewCustomerChange = (e) => {
//     setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
//   };
//
//   // Validate and submit booking
//   const handleSubmitBooking = async (e) => {
//     e.preventDefault();
//     setBookingError('');
//     setBookingSuccess('');
//     setPaymentError('');
//     setBookingLoading(true);
//
//     // Validate room selection
//     if (!selectedRoomId) {
//       setBookingError('Vui lòng chọn một phòng');
//       setBookingLoading(false);
//       return;
//     }
//
//     // Validate customer
//     let finalCustomerId = customerId;
//     if (useExistingCustomer) {
//       if (!customerId) {
//         setCustomerError('Vui lòng chọn khách hàng');
//         setBookingLoading(false);
//         return;
//       }
//     } else {
//       const { fullName, email, phone } = newCustomer;
//       if (!fullName || !email || !phone) {
//         setCustomerError('Vui lòng nhập đầy đủ thông tin khách hàng');
//         setBookingLoading(false);
//         return;
//       }
//
//       // Create new customer
//       try {
//         const response = await axios.post('/api/customers', {
//           fullName,
//           email,
//           phone,
//         });
//         finalCustomerId = response.data.customerId;
//       } catch (err) {
//         setCustomerError(err.response?.data || 'Lỗi khi tạo khách hàng mới');
//         setBookingLoading(false);
//         return;
//       }
//     }
//
//     // Mock payment processing
//     if (paymentMethod === 'vnpay' || paymentMethod === 'visa') {
//       try {
//         // Simulate payment API call
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
//         const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo
//         if (!paymentSuccess) {
//           throw new Error('Thanh toán thất bại');
//         }
//       } catch (err) {
//         setPaymentError('Thanh toán thất bại. Vui lòng thử lại.');
//         setBookingLoading(false);
//         return;
//       }
//     }
//
//     // Create booking
//     const bookingDto = {
//       checkIn,
//       checkOut,
//       status: 'đã_xác_nhận',
//       customerId: finalCustomerId,
//       employeeId,
//       roomId: parseInt(selectedRoomId),
//     };
//
//     try {
//       const response = await axios.post('/api/bookings/bookingRoom', bookingDto);
//       setBookingSuccess(response.data);
//
//       // Simulate email sending
//       console.log(`Gửi email xác nhận đến ${useExistingCustomer ? customers.find(c => c.customerId === parseInt(customerId))?.email : newCustomer.email}`);
//
//       // Simulate syncing with Booking.com/Agoda
//       console.log('Đồng bộ với Booking.com/Agoda');
//
//       // Reset form
//       setCheckIn('');
//       setCheckOut('');
//       setRoomTypeId('');
//       setAvailableRooms([]);
//       setSelectedRoomId('');
//       setCustomerId('');
//       setNewCustomer({ fullName: '', email: '', phone: '' });
//       setPaymentMethod('counter');
//     } catch (err) {
//       setBookingError(err.response?.data || 'Lỗi khi tạo đặt phòng');
//     } finally {
//       setBookingLoading(false);
//     }
//   };
//
//   return (
//     <div className="booking-container">
//       <h1 className="booking-title">Đặt phòng</h1>
//
//       {/* Room Search Section */}
//       <section className="booking-section">
//         <h2 className="section-title">Tìm kiếm phòng trống</h2>
//         <form onSubmit={handleSearchRooms} className="search-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Ngày check-in</label>
//               <input
//                 type="date"
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Ngày check-out</label>
//               <input
//                 type="date"
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Loại phòng</label>
//               <select
//                 value={roomTypeId}
//                 onChange={(e) => setRoomTypeId(e.target.value)}
//                 className="form-input"
//               >
//                 <option value="">Tất cả</option>
//                 {roomTypes.map((type) => (
//                   <option key={type.typeId} value={type.typeId}>
//                     {type.name} (Sức chứa: {type.capacity})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <button type="submit" className="search-button" disabled={searchLoading}>
//             {searchLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm phòng'}
//           </button>
//         </form>
//         {searchError && <div className="error-message">{searchError}</div>}
//         {availableRooms.length > 0 && (
//           <div className="results-table">
//             <h3 className="section-title">Phòng trống</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Chọn</th>
//                   <th>Mã phòng</th>
//                   <th>Loại phòng</th>
//                   <th>Giá (VNĐ/đêm)</th>
//                   <th>Trạng thái</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {availableRooms.map((room) => (
//                   <tr key={room.roomId}>
//                     <td>
//                       <input
//                         type="radio"
//                         name="room"
//                         value={room.roomId}
//                         checked={selectedRoomId === room.roomId.toString()}
//                         onChange={(e) => setSelectedRoomId(e.target.value)}
//                       />
//                     </td>
//                     <td>{room.sku}</td>
//                     <td>{roomTypes.find((type) => type.typeId === room.typeId)?.name || 'N/A'}</td>
//                     <td>{room.price.toLocaleString('vi-VN')}</td>
//                     <td>{room.status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//
//       {/* Customer Section */}
//       <section className="booking-section">
//         <h2 className="section-title">Thông tin khách hàng</h2>
//         <div className="form-group">
//           <label>
//             <input
//               type="checkbox"
//               checked={useExistingCustomer}
//               onChange={() => setUseExistingCustomer(!useExistingCustomer)}
//             />
//             Sử dụng khách hàng hiện có
//           </label>
//         </div>
//         {useExistingCustomer ? (
//           <div className="form-group">
//             <label>Chọn khách hàng</label>
//             <select
//               value={customerId}
//               onChange={(e) => setCustomerId(e.target.value)}
//               className="form-input"
//             >
//               <option value="">Chọn khách hàng</option>
//               {customers.map((customer) => (
//                 <option key={customer.customerId} value={customer.customerId}>
//                   {customer.fullName} ({customer.email})
//                 </option>
//               ))}
//             </select>
//           </div>
//         ) : (
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Họ và tên</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={newCustomer.fullName}
//                 onChange={handleNewCustomerChange}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={newCustomer.email}
//                 onChange={handleNewCustomerChange}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Số điện thoại</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={newCustomer.phone}
//                 onChange={handleNewCustomerChange}
//                 className="form-input"
//                 required
//               />
//             </div>
//           </div>
//         )}
//         {customerError && <div className="error-message">{customerError}</div>}
//       </section>
//
//       {/* Payment Section */}
//       <section className="booking-section">
//         <h2 className="section-title">Phương thức thanh toán</h2>
//         <div className="form-group">
//           <label>Chọn phương thức</label>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             className="form-input"
//           >
//             <option value="counter">Thanh toán tại quầy</option>
//             <option value="vnpay">VNPay</option>
//             <option value="visa">Visa</option>
//           </select>
//         </div>
//         {paymentError && <div className="error-message">{paymentError}</div>}
//       </section>
//
//       {/* Submit Booking */}
//       <button
//         onClick={handleSubmitBooking}
//         className="booking-button"
//         disabled={bookingLoading}
//       >
//         {bookingLoading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
//       </button>
//       {bookingError && <div className="error-message">{bookingError}</div>}
//       {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}
//     </div>
//   );
// };
//
// export default BookingForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomTypes, searchRooms } from '../../api';
import axios from 'axios';
import '../../styles/styles.css';

const BookingForm = () => {
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
  const [employeeId, setEmployeeId] = useState(1); // giả định đang đăng nhập
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
        const response = await axios.post('/api/v1/customers/add', {
          fullName,
          email,
          phone,
        });
        const addedCustomer = await axios.get('/api/v1/customers');
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
      setBookingSuccess(response.data);
      console.log(`Gửi email xác nhận đến ${useExistingCustomer ? customers.find(c => c.customerId === parseInt(customerId))?.email : newCustomer.email}`);
      console.log('Đồng bộ với Booking.com/Agoda');

      // Reset form
      setCheckIn('');
      setCheckOut('');
      setRoomTypeId('');
      setAvailableRooms([]);
      setSelectedRoomId('');
      setCustomerId('');
      setNewCustomer({ fullName: '', email: '', phone: '' });
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
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Ngày check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Loại phòng</label>
                <select value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} className="form-input">
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
                          <input type="radio" name="room" value={room.roomId} checked={selectedRoomId === room.roomId.toString()} onChange={(e) => setSelectedRoomId(e.target.value)} />
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
        <section className="booking-section">
          <h2 className="section-title">Thông tin khách hàng</h2>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={useExistingCustomer} onChange={() => setUseExistingCustomer(!useExistingCustomer)} />
              Sử dụng khách hàng hiện có
            </label>
          </div>
          {useExistingCustomer ? (
              <div className="form-group">
                <label>Chọn khách hàng</label>
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input">
                  <option value="">Chọn khách hàng</option>
                  {customers.map((customer) => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.fullName} ({customer.email})
                      </option>
                  ))}
                </select>
              </div>
          ) : (
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" name="fullName" value={newCustomer.fullName} onChange={handleNewCustomerChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={newCustomer.email} onChange={handleNewCustomerChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" name="phone" value={newCustomer.phone} onChange={handleNewCustomerChange} className="form-input" required />
                </div>
              </div>
          )}
          {customerError && <div className="error-message">{customerError}</div>}
        </section>

        {/* Thanh toán */}
        <section className="booking-section">
          <h2 className="section-title">Phương thức thanh toán</h2>
          <div className="form-group">
            <label>Chọn phương thức</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="form-input">
              <option value="counter">Thanh toán tại quầy</option>
              <option value="vnpay">VNPay</option>
              <option value="visa">Visa</option>
            </select>
          </div>
          {paymentError && <div className="error-message">{paymentError}</div>}
        </section>

        {/* Gửi */}
        <button onClick={handleSubmitBooking} className="booking-button" disabled={bookingLoading}>
          {bookingLoading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
        </button>
        {bookingError && <div className="error-message">{bookingError}</div>}
        {bookingSuccess && <div className="success-message">{bookingSuccess}</div>}
      </div>
  );
};

export default BookingForm;
