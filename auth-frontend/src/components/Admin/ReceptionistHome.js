// src/components/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ReceptionistHome.css';

const Home = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
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

  const authAPI = axios.create({
    baseURL: 'http://localhost:8888/api/v1/auth',
    headers: { 'Content-Type': 'application/json' }
  });

  const empAPI = axios.create({
    baseURL: 'http://localhost:8888/api/v1/employees',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
    }
  });

  const normalizeEmployees = data =>
    data.map(emp => ({
      ...emp,
      employeeRole: emp.employeeRole || emp.employee_role || ''
    }));

  useEffect(() => {
    if (!isQuanLy) {
      setMessage('Bạn không có quyền truy cập trang này');
      setTimeout(() => navigate('/'), 1000);
    }
  }, [isQuanLy, navigate]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await empAPI.get('/getAll', { params: {} });
      const data = normalizeEmployees(res.data);
      setEmployees(data);
      setSearchPerformed(false);
      setSearchResults([]);
    } catch (err) {
      setMessage('Lỗi khi lấy danh sách: ' + (err.response?.data || err.message));
    }
  }, [empAPI]);

  useEffect(() => {
    if (isQuanLy) fetchEmployees();
  }, [fetchEmployees, isQuanLy]);

  const handleCreateOrUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const payload = {
      name: employeeForm.name,
      email: employeeForm.email,
      password: employeeForm.password,
      employee_role: employeeForm.employeeRole
    };
    try {
      if (editingEmployeeId) {
        await empAPI.put(`/update?id=${editingEmployeeId}`, payload);
        setMessage('Cập nhật nhân viên thành công');
        setEditingEmployeeId(null);
      } else {
        await empAPI.post('', payload);
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

  const handleDelete = async id => {
    if (!id) {
      alert('ID không hợp lệ!');
      return;
    }
    if (!window.confirm('Xác nhận xóa?')) return;

    setLoading(true);
    setMessage('');
    try {
      await empAPI.delete(`/delete?id=${id}`);
      setMessage('Xóa thành công');
      if (searchPerformed) {
        await handleSearch(null, true);
      } else {
        fetchEmployees();
      }
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = emp => {
    setEditingEmployeeId(emp.id);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      password: '',
      employeeRole: emp.employeeRole || 'LE_TAN'
    });
  };

  const handleSearch = async (e, isInternal = false) => {
    if (e) e.preventDefault();
    if (!isInternal) {
      setLoading(true);
      setMessage('');
    }
    try {
      const res = await empAPI.get('/search', { params: searchForm });
      const data = normalizeEmployees(res.data);
      setSearchResults(data);
      setSearchPerformed(true);
      setMessage('Tìm kiếm thành công');
    } catch (err) {
      setMessage('Lỗi tìm kiếm: ' + (err.response?.data || err.message));
    } finally {
      if (!isInternal) setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await authAPI.post('/logout', { refreshToken });
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      navigate('/');
    }
  };

  if (!isQuanLy) {
    return <p className={`message error`}>{message}</p>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">Hotel Management</div>
        <ul className="navbar-menu">
          <li><NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý nhân viên</NavLink></li>
          <li><NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý khách hàng</NavLink></li>
          <li><NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý phòng</NavLink></li>
          <li><NavLink to="/room-types" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý kiểu phòng</NavLink></li>
          <li><NavLink to="/invoices" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý hóa đơn</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quản lý dịch vụ</NavLink></li>
        </ul>
        <div className="navbar-user">
          <span>Xin chào, {userName} ({userRole})</span>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>Đăng xuất</button>
        </div>
      </nav>

      <div className="container">
        <h2>Quản lý nhân viên</h2>
        {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
        {loading && <div className="loader"></div>}

        {/* Form tạo/cập nhật */}
        <form onSubmit={handleCreateOrUpdate} className="form" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
          <div className="form-group">
            <label htmlFor="name">Họ tên <span className="required">*</span></label>
            <input
              id="name"
              name="name"
              placeholder="Họ tên"
              value={employeeForm.name}
              onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={employeeForm.email}
              onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu {editingEmployeeId ? '' : <span className="required">*</span>}</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={employeeForm.password}
              onChange={e => setEmployeeForm({ ...employeeForm, password: e.target.value })}
              required={!editingEmployeeId}
            />
          </div>
          <div className="form-group">
            <label htmlFor="employeeRole">Vai trò</label>
            <select
              id="employeeRole"
              name="employeeRole"
              value={employeeForm.employeeRole}
              onChange={e => setEmployeeForm({ ...employeeForm, employeeRole: e.target.value })}
            >
              <option value="LE_TAN">Lễ tân</option>
              <option value="QUAN_LY">Quản lý</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editingEmployeeId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>

        {/* Bảng danh sách nhân viên */}
        <table className="table table-striped table-hover" style={{ maxWidth: '900px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(searchPerformed ? searchResults : employees).map(emp => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.employeeRole}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(emp)}
                    disabled={loading}
                    title="Chỉnh sửa"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(emp.id)}
                    disabled={loading}
                    title="Xóa"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {(searchPerformed && searchResults.length === 0) && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Không tìm thấy nhân viên phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
