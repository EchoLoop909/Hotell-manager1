import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchRoom() {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', roomTypeId: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    axios.get('http://localhost:8888/api/v1/rooms/search', {
      params: { checkIn, checkOut, roomTypeId: roomTypeId || null }
    })
        .then(res => setSearchResults(res.data))
        .catch(err => {
          if (err.response?.status === 404) setError('Không có phòng phù hợp');
          else setError('Lỗi hệ thống, vui lòng thử lại');
        })
        .finally(() => setLoading(false));
  };

  const handleBooking = (roomId) => {
    navigate(`/customer/book?roomId=${roomId}&checkIn=${form.checkIn}&checkOut=${form.checkOut}`);
  };

  const getRoomTypeName = (typeId) => {
    const type = roomTypes.find(rt => rt.typeId === typeId);
    return type ? type.name : 'Không xác định';
  };

  const renderRoomTable = (rooms) => (
      <table>
        <thead>
        <tr>
          <th>Hình ảnh</th>
          <th>Mã phòng</th>
          <th>SKU</th>
          <th>Loại phòng</th>
          <th>Giá</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {rooms.map(room => (
            <tr key={room.roomId}>
              <td>
                <img
                    src={room.imageUrl || 'https://via.placeholder.com/100'}
                    alt="Phòng"
                />
              </td>
              <td>{room.roomId}</td>
              <td>{room.sku}</td>
              <td>{getRoomTypeName(room.typeId)}</td>
              <td>{room.price.toLocaleString()} VND</td>
              <td>{room.status}</td>
              <td>
                <button onClick={() => handleBooking(room.roomId)}>
                  Đặt phòng
                </button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>
  );

  return (
      <div>
        <h2>Tra cứu phòng trống</h2>
        <form onSubmit={handleSearch}>
          <div>
            <label>Check-in</label>
            <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
            />
          </div>
          <div>
            <label>Check-out</label>
            <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
            />
          </div>
          <div>
            <label>Loại phòng</label>
            <select
                name="roomTypeId"
                value={form.roomTypeId}
                onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {roomTypes.map(rt => (
                  <option key={rt.typeId} value={rt.typeId}>
                    {rt.name} (Sức chứa: {rt.capacity}, Giá: {rt.defaultPrice.toLocaleString()} VND)
                  </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tìm phòng'}
          </button>
        </form>

        {error && <div>{error}</div>}

        {searchResults.length > 0 ? (
            <>
              <h3>Kết quả tìm kiếm:</h3>
              {renderRoomTable(searchResults)}
            </>
        ) : (
            <>
              <h3>Tất cả các phòng hiện có:</h3>
              {renderRoomTable(allRooms)}
            </>
        )}
      </div>
  );
}
