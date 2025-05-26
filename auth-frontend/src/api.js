import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8888/api/v1', // Cổng 8080
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào mỗi yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hàm thử lại yêu cầu API
const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const searchRooms = async (checkIn, checkOut, roomTypeId) => {
  try {
    const response = await withRetry(() =>
      api.get('/rooms/search', {
        params: {
          checkIn,
          checkOut,
          roomTypeId: roomTypeId || null,
        },
      })
    );
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Không thể kết nối tới server. Vui lòng kiểm tra backend.');
    }
    if (error.response?.status === 401) {
      throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
    }
    throw error.response?.data || 'Lỗi khi tìm kiếm phòng';
  }
};

export const getRoomTypes = async () => {
  try {
    const response = await withRetry(() => api.get('/roomType/getall'));
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Không thể kết nối tới server. Vui lòng kiểm tra backend.');
    }
    if (error.response?.status === 401) {
      throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
    }
    throw error.response?.data || 'Lỗi khi lấy danh sách loại phòng';
  }
};

export const fetchRoomTypes = () => api.get('/roomType/search');
export const createRoomType = (roomTypeDto) => api.post('/roomType/create', roomTypeDto);
export const updateRoomType = (id, roomTypeDto) => api.put(`/roomType/update/${id}`, roomTypeDto);
export const deleteRoomType = (id) => api.delete(`/roomType/delete/${id}`);