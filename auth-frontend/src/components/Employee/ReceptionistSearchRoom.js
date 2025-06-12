// import React, { useState, useEffect } from 'react';
// import { searchRooms, getRoomTypes } from '../../api';
//
// const ReceptionistSearchRoom = () => {
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [roomTypeId, setRoomTypeId] = useState('');
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//
//   useEffect(() => {
//     const fetchRoomTypes = async () => {
//       setLoading(true);
//       try {
//         const data = await getRoomTypes();
//         setRoomTypes(data);
//       } catch (err) {
//         setError(err.message || 'Không thể tải danh sách loại phòng');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoomTypes();
//   }, []);
//
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setRooms([]);
//     setLoading(true);
//
//     if (!checkIn || !checkOut) {
//       setError('Vui lòng nhập cả ngày check-in và check-out');
//       setLoading(false);
//       return;
//     }
//
//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);
//     if (checkOutDate <= checkInDate) {
//       setError('Ngày check-out phải sau ngày check-in');
//       setLoading(false);
//       return;
//     }
//
//     try {
//       const data = await searchRooms(checkIn, checkOut, roomTypeId || null);
//       if (data.length === 0) {
//         setError('Không tìm thấy phòng trống phù hợp');
//       } else {
//         setRooms(data);
//       }
//     } catch (err) {
//       setError(err.message || 'Không tìm thấy phòng phù hợp');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//       <div>
//         <h1>Tìm kiếm phòng trống</h1>
//
//         <form onSubmit={handleSearch}>
//           <div>
//             <label>Ngày check-in</label>
//             <input
//                 type="date"
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 required
//             />
//           </div>
//           <div>
//             <label>Ngày check-out</label>
//             <input
//                 type="date"
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 required
//             />
//           </div>
//           <div>
//             <label>Loại phòng</label>
//             <select
//                 value={roomTypeId}
//                 onChange={(e) => setRoomTypeId(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               {roomTypes.map((type) => (
//                   <option key={type.typeId} value={type.typeId}>
//                     {type.name} (Sức chứa: {type.capacity})
//                   </option>
//               ))}
//             </select>
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
//           </button>
//         </form>
//
//         {error && <div>{error}</div>}
//
//         {rooms.length > 0 && (
//             <table>
//               <thead>
//               <tr>
//                 <th>Mã phòng</th>
//                 <th>Loại phòng</th>
//                 <th>Giá</th>
//                 <th>Trạng thái</th>
//               </tr>
//               </thead>
//               <tbody>
//               {rooms.map((room) => (
//                   <tr key={room.roomId}>
//                     <td>{room.sku}</td>
//                     <td>{roomTypes.find((type) => type.typeId === room.typeId)?.name || 'N/A'}</td>
//                     <td>{room.price.toLocaleString('vi-VN')} VNĐ</td>
//                     <td>{room.status}</td>
//                   </tr>
//               ))}
//               </tbody>
//             </table>
//         )}
//       </div>
//   );
// };
//
// export default ReceptionistSearchRoom;


import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { searchRooms, getRoomTypes } from '../../api';
import '../../styles/search-room.css';

const ReceptionistSearchRoom = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Lễ tân';
  const userRole = localStorage.getItem('user_role') || 'LE_TAN';

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoading(true);
      try {
        const data = await getRoomTypes();
        setRoomTypes(data);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách loại phòng');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setRooms([]);
    setLoading(true);

    if (!checkIn || !checkOut) {
      setError('Vui lòng nhập cả ngày check-in và check-out');
      setLoading(false);
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      setError('Ngày check-out phải sau ngày check-in');
      setLoading(false);
      return;
    }

    try {
      const data = await searchRooms(checkIn, checkOut, roomTypeId || null);
      if (data.length === 0) {
        setError('Không tìm thấy phòng trống phù hợp');
      } else {
        setRooms(data);
      }
    } catch (err) {
      setError(err.message || 'Không tìm thấy phòng phù hợp');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    fetch('http://localhost:8888/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
        .catch(() => {})
        .finally(() => {
          localStorage.clear();
          navigate('/login');
        });
  };

  return (
      <div className="dashboard-wrapper">
        <nav className="navbar">
          <div className="navbar-brand">Hotel Management - Tìm kiếm phòng trống</div>
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

        <main className="search-room-container">
          <h1 className="title">Tìm kiếm phòng trống</h1>

          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="checkIn">
                Ngày check-in <span className="required">*</span>
              </label>
              <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="form-input"
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="checkOut">
                Ngày check-out <span className="required">*</span>
              </label>
              <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="form-input"
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="roomTypeId">Loại phòng</label>
              <select
                  id="roomTypeId"
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
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading">Đang tải...</div>}

          {rooms.length > 0 && (
              <section className="table-section">
                <table className="room-table">
                  <thead>
                  <tr>
                    <th>Mã phòng</th>
                    <th>Loại phòng</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                  </tr>
                  </thead>
                  <tbody>
                  {rooms.map((room) => (
                      <tr key={room.roomId}>
                        <td>{room.sku}</td>
                        <td>{roomTypes.find((type) => type.typeId === room.typeId)?.name || 'N/A'}</td>
                        <td>{room.price.toLocaleString('vi-VN')} VNĐ</td>
                        <td>{room.status}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </section>
          )}
        </main>
      </div>
  );
};

export default ReceptionistSearchRoom;