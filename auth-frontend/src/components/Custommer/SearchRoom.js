//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
//
//export default function SearchRoom() {
//  const navigate = useNavigate();
//  const [roomTypes, setRoomTypes] = useState([]);
//  const [form, setForm] = useState({ checkIn: '', checkOut: '', roomTypeId: '' });
//  const [searchResults, setSearchResults] = useState([]);
//  const [allRooms, setAllRooms] = useState([]);
//  const [error, setError] = useState(null);
//  const [loading, setLoading] = useState(false);
//
//  useEffect(() => {
//    axios.get('http://localhost:8888/api/v1/roomType/getall')
//        .then(res => setRoomTypes(res.data))
//        .catch(() => setError('Không tải được loại phòng'));
//
//    axios.get('http://localhost:8888/api/v1/rooms/getall')
//        .then(res => setAllRooms(res.data))
//        .catch(() => setError('Không tải được danh sách phòng'));
//  }, []);
//
//  const handleChange = (e) => {
//    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//    setError(null);
//  };
//
//  const handleSearch = (e) => {
//    e.preventDefault();
//    setError(null);
//    setSearchResults([]);
//
//    const { checkIn, checkOut, roomTypeId } = form;
//    if (!checkIn || !checkOut) {
//      setError('Vui lòng chọn ngày check-in và check-out');
//      return;
//    }
//    if (new Date(checkOut) <= new Date(checkIn)) {
//      setError('Ngày check-out phải sau ngày check-in');
//      return;
//    }
//
//    setLoading(true);
//    axios.get('http://localhost:8888/api/v1/rooms/search', {
//      params: { checkIn, checkOut, roomTypeId: roomTypeId || null }
//    })
//        .then(res => setSearchResults(res.data))
//        .catch(err => {
//          if (err.response?.status === 404) setError('Không có phòng phù hợp');
//          else setError('Lỗi hệ thống, vui lòng thử lại');
//        })
//        .finally(() => setLoading(false));
//  };
//
//  const handleBooking = (roomId) => {
//    navigate(`/customer/book?roomId=${roomId}&checkIn=${form.checkIn}&checkOut=${form.checkOut}`);
//  };
//
//  const getRoomTypeName = (typeId) => {
//    const type = roomTypes.find(rt => rt.typeId === typeId);
//    return type ? type.name : 'Không xác định';
//  };
//
//  const renderRoomTable = (rooms) => (
//      <table>
//        <thead>
//        <tr>
//          <th>Hình ảnh</th>
//          <th>Mã phòng</th>
//          <th>SKU</th>
//          <th>Loại phòng</th>
//          <th>Giá</th>
//          <th>Trạng thái</th>
//          <th></th>
//        </tr>
//        </thead>
//        <tbody>
//        {rooms.map(room => (
//            <tr key={room.roomId}>
//              <td>
//                <img
//                    src={room.imageUrl || 'https://via.placeholder.com/100'}
//                    alt="Phòng"
//                />
//              </td>
//              <td>{room.roomId}</td>
//              <td>{room.sku}</td>
//              <td>{getRoomTypeName(room.typeId)}</td>
//              <td>{room.price.toLocaleString()} VND</td>
//              <td>{room.status}</td>
//              <td>
//                <button onClick={() => handleBooking(room.roomId)}>
//                  Đặt phòng
//                </button>
//              </td>
//            </tr>
//        ))}
//        </tbody>
//      </table>
//  );
//
//  return (
//      <div>
//        <h2>Tra cứu phòng trống</h2>
//        <form onSubmit={handleSearch}>
//          <div>
//            <label>Check-in</label>
//            <input
//                type="date"
//                name="checkIn"
//                value={form.checkIn}
//                onChange={handleChange}
//            />
//          </div>
//          <div>
//            <label>Check-out</label>
//            <input
//                type="date"
//                name="checkOut"
//                value={form.checkOut}
//                onChange={handleChange}
//            />
//          </div>
//          <div>
//            <label>Loại phòng</label>
//            <select
//                name="roomTypeId"
//                value={form.roomTypeId}
//                onChange={handleChange}
//            >
//              <option value="">-- Tất cả --</option>
//              {roomTypes.map(rt => (
//                  <option key={rt.typeId} value={rt.typeId}>
//                    {rt.name} (Sức chứa: {rt.capacity}, Giá: {rt.defaultPrice.toLocaleString()} VND)
//                  </option>
//              ))}
//            </select>
//          </div>
//          <button type="submit" disabled={loading}>
//            {loading ? 'Đang tìm...' : 'Tìm phòng'}
//          </button>
//        </form>
//
//        {error && <div>{error}</div>}
//
//        {searchResults.length > 0 ? (
//            <>
//              <h3>Kết quả tìm kiếm:</h3>
//              {renderRoomTable(searchResults)}
//            </>
//        ) : (
//            <>
//              <h3>Tất cả các phòng hiện có:</h3>
//              {renderRoomTable(allRooms)}
//            </>
//        )}
//      </div>
//  );
//}


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/search-roomm.css';

export default function SearchRoom() {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', roomTypeId: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem('user_name') || 'Khách hàng';
  const userRole = localStorage.getItem('user_role') || 'CUSTOMER';

  useEffect(() => {
    axios.get('http://localhost:8888/api/v1/roomType/getall')
      .then(res => setRoomTypes(res.data))
      .catch(() => setError('Không tải được loại phòng'));

    axios.get('http://localhost:8888/api/v1/rooms/getall')
      .then(res => setAllRooms(res.data))
      .catch(() => setError('Không tải được danh sách phòng'));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);
    setSearchResults([]);

    const { checkIn, checkOut, roomTypeId } = form;
    if (!checkIn || !checkOut) {
      setError('Vui lòng chọn ngày check-in và check-out');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Ngày check-out phải sau ngày check-in');
      return;
    }

    setLoading(true);
    axios.get('http://localhost:8888/api/v1/rooms', {
      params: { checkIn, checkOut, roomTypeId: roomTypeId || '' }
    })
      .then(res => setSearchResults(res.data))
      .catch(err => {
        if (err.response?.data?.status === 400) setError('Không có phòng phù hợp');
        else setError('Lỗi hệ thống, vui lòng thử lại');
      })
      .finally(() => setLoading(false));
  };

  const handleBooking = (roomId) => {
    navigate(`/customer/book?roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(form.checkIn)}&checkOut=${encodeURIComponent(form.checkOut)}`);
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

  const getRoomTypeName = (typeId) => {
    const type = roomTypes.find(rt => rt.typeId === typeId);
    return type ? type.name : 'Không xác định';
  };

  const renderRoomTable = (rooms) => (
    <div className="table-container">
      <table className="room-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Mã phòng</th>
            <th>SKU</th>
            <th>Loại phòng</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.roomId}>
              <td>
                <img
                  src={room.imageUrl || 'https://via.placeholder.com/100'}
                  alt="Phòng"
                  className="room-image"
                />
              </td>
              <td>{room.roomId}</td>
              <td>{room.sku}</td>
              <td>{getRoomTypeName(room.typeId)}</td>
              <td>{room.price.toLocaleString('vi-VN')} VND</td>
              <td>{room.status}</td>
              <td>
                <button onClick={() => handleBooking(room.roomId)} className="book-btn">
                  Đặt phòng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">Hotel Management - Tìm kiếm phòng</div>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/customer/searchRoom"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Tìm kiếm phòng trống
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/book"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Đặt phòng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/cancelbooking"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Hủy đặt phòng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/invoices"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Xem và thanh toán hóa đơn
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Cập nhật thông tin cá nhân
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Quay lại Dashboard
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
        <h1 className="title">Tra cứu phòng trống</h1>

        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="checkIn">Check-in <span className="required">*</span></label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="checkOut">Check-out <span className="required">*</span></label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="roomTypeId">Loại phòng</label>
              <select
                id="roomTypeId"
                name="roomTypeId"
                value={form.roomTypeId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">-- Tất cả --</option>
                {roomTypes.map(rt => (
                  <option key={rt.typeId} value={rt.typeId}>
                    {rt.name} (Sức chứa: {rt.capacity}, Giá: {rt.defaultPrice.toLocaleString('vi-VN')} VND)
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Đang tìm...' : 'Tìm phòng'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="results-section">
          {searchResults.length > 0 ? (
            <>
              <h2 className="subtitle">Kết quả tìm kiếm</h2>
              {renderRoomTable(searchResults)}
            </>
          ) : (
            <>
              <h2 className="subtitle">Tất cả các phòng hiện có</h2>
              {renderRoomTable(allRooms)}
            </>
          )}
        </section>
      </main>
    </div>
  );
}