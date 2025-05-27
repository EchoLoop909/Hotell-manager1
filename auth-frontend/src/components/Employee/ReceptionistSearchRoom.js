import React, { useState, useEffect } from 'react';
import { searchRooms, getRoomTypes } from '../../api';

import '../../styles/styles.css'

const ReceptionistSearchRoom = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="search-container">
      <h1 className="search-title">Tìm kiếm phòng trống</h1>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Ngày check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input"
              required
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
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {rooms.length > 0 && (
        <div className="results-table">
          <table>
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
        </div>
      )}
    </div>
  );
};

export default ReceptionistSearchRoom;