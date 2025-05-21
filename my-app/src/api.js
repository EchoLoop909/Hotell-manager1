// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (registerData) => {
  try {
    const response = await API.post('/auth/register', registerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Đăng ký thất bại';
  }
};

export const authenticate = async (authData) => {
  try {
    const response = await API.post('/auth/authenticate', authData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đăng nhập thất bại';
  }
};

export const logout = async (refreshToken) => {
  try {
    const response = await API.post('/auth/logout', { refreshToken });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đăng xuất thất bại';
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await API.post('/room', roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Tạo phòng thất bại';
  }
};

export const getAllRooms = async () => {
  try {
    const response = await API.get('/room');
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lấy danh sách phòng thất bại';
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await API.get(`/room/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lấy thông tin phòng thất bại';
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await API.put(`/room/${id}`, roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Cập nhật phòng thất bại';
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await API.delete(`/room/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Xóa phòng thất bại';
  }
};

export const createRoomType = async (roomTypeData) => {
  try {
    const response = await API.post('/room-type', roomTypeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Tạo loại phòng thất bại';
  }
};

export const searchRoomTypes = async (params) => {
  try {
    const response = await API.get('/room-type/search', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Tìm kiếm loại phòng thất bại';
  }
};

export const updateRoomType = async (id, roomTypeData) => {
  try {
    const response = await API.put(`/room-type/${id}`, roomTypeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Cập nhật loại phòng thất bại';
  }
};

export const deleteRoomType = async (id) => {
  try {
    const response = await API.delete(`/room-type/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Xóa loại phòng thất bại';
  }
};