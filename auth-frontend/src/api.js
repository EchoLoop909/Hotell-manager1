// src/api.js
import axios from 'axios';

const token = localStorage.getItem('access_token');

const api = axios.create({
  baseURL: 'http://localhost:8888/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export const fetchRoomTypes = () => api.get('/roomType/search');
export const createRoomType = (roomTypeDto) => api.post('/roomType/create', roomTypeDto);
export const updateRoomType = (id, roomTypeDto) => api.put(`/roomType/update/${id}`, roomTypeDto);
export const deleteRoomType = (id) => api.delete(`/roomType/delete/${id}`);
