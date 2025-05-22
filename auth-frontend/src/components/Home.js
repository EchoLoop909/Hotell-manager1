import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Home = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    employeeRole: 'LE_TAN'
  });
  const [searchForm, setSearchForm] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');
  const userRole = localStorage.getItem('user_role');
  const isQuanLy = userRole === 'QUAN_LY';

  const API = axios.create({
    baseURL: 'http://localhost:9999/api/v1/employees',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
    }
  });

  // Redirect nếu không phải quản lý
  useEffect(() => {
    if (!isQuanLy) {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [isQuanLy, navigate]);

  // Lấy danh sách nhân viên
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await API.get('/getAll');
      setEmployees(res.data);
    } catch (err) {
      setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data || err.message));
    }
  }, [API]);

  useEffect(() => {
    if (isQuanLy) fetchEmployees();
  }, [fetchEmployees, isQuanLy]);

  // Tạo hoặc cập nhật nhân viên
  const handleCreateOrUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingEmployeeId) {
        await API.put(`/update?id=${editingEmployeeId}`, employeeForm);
        setMessage('Cập nhật nhân viên thành công');
        setEditingEmployeeId(null);
      } else {
        await API.post('', employeeForm);
        setMessage('Tạo nhân viên thành công');
      }
      fetchEmployees();
      setEmployeeForm({ name: '', email: '', password: '', employeeRole: 'LE_TAN' });
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Xóa nhân viên
  const handleDelete = async id => {
    if (!window.confirm('Xác nhận xóa?')) return;
    setLoading(true);
    setMessage('');
    try {
      await API.delete(`/delete?id=${id}`);
      setMessage('Xóa thành công');
      fetchEmployees();
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Chuyển form sang sửa
  const handleEdit = emp => {
    setEditingEmployeeId(emp.employeeId);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      password: '',
      employeeRole: emp.employeeRole
    });
  };

  // Tìm kiếm
  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await API.get('/search', { params: searchForm });
      setEmployees(res.data);
      setMessage('Tìm kiếm thành công');
    } catch (err) {
      setMessage('Lỗi tìm kiếm: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await API.post('/auth/logout', { refreshToken });
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      navigate('/');
    }
  };

  if (!isQuanLy) {
    return <p className="message error">{message}</p>;
  }

  return (
    <div className="home-container">
      <h2>Quản lý nhân viên</h2>
      <p>Xin chào, {userName} ({userRole})</p>
      <button onClick={handleLogout} disabled={loading}>Đăng xuất</button>
      {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
      {loading && <div className="loader"></div>}

      {/* Form Create / Update */}
      <form onSubmit={handleCreateOrUpdate} className="employee-form">
        <input
          name="name"
          placeholder="Họ tên"
          value={employeeForm.name}
          onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={employeeForm.email}
          onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={employeeForm.password}
          onChange={e => setEmployeeForm({ ...employeeForm, password: e.target.value })}
          required={!editingEmployeeId}
        />
        <select
          name="employeeRole"
          value={employeeForm.employeeRole}
          onChange={e => setEmployeeForm({ ...employeeForm, employeeRole: e.target.value })}
        >
          <option value="LE_TAN">Lễ tân</option>
          <option value="QUAN_LY">Quản lý</option>
        </select>
        <button type="submit" disabled={loading}>
          {editingEmployeeId ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </form>

      {/* Form Search */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          name="name"
          placeholder="Tên"
          value={searchForm.name}
          onChange={e => setSearchForm({ ...searchForm, name: e.target.value })}
        />
        <input
          name="email"
          placeholder="Email"
          value={searchForm.email}
          onChange={e => setSearchForm({ ...searchForm, email: e.target.value })}
        />
        <input
          name="role"
          placeholder="Vai trò"
          value={searchForm.role}
          onChange={e => setSearchForm({ ...searchForm, role: e.target.value })}
        />
        <button type="submit" disabled={loading}>Tìm kiếm</button>
      </form>

      {/* Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeId}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.employeeRole}</td>
              <td>
                <button onClick={() => handleEdit(emp)} disabled={loading}>Sửa</button>
                <button onClick={() => handleDelete(emp.employeeId)} disabled={loading}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
