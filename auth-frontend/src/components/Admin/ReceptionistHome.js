import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    return <p>{message}</p>;
  }

  return (
      <>
        <style>{`
          nav {
            background-color: #004080;
            color: white;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          nav ul {
            list-style: none;
            display: flex;
            gap: 1rem;
            margin: 0;
            padding: 0;
          }

          nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
          }

          nav ul li a:hover {
            text-decoration: underline;
          }

          nav button {
            background-color: #ff4d4d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }

          h2 {
            margin-top: 1rem;
          }

          form div {
            margin-bottom: 1rem;
          }

          input, select {
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.25rem;
            box-sizing: border-box;
          }

          button[type="submit"] {
            background-color: #007bff;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            cursor: pointer;
          }

          table {
            width: 80%;
            border-collapse: collapse;
            margin: 1rem auto;
          }

          table, th, td {
            border: 1px solid #ccc;
          }

          th, td {
            padding: 0.75rem;
            text-align: left;
          }

          td button {
            margin-right: 0.5rem;
          }

          p {
            margin: 1rem 0;
          }
        `}</style>
        <nav>
          <div>Hotel Management</div>
          <ul>
            <li><NavLink to="/employees">Quản lý nhân viên</NavLink></li>
            <li><NavLink to="/customers">Quản lý khách hàng</NavLink></li>
            <li><NavLink to="/rooms">Quản lý phòng</NavLink></li>
            <li><NavLink to="/room-types">Quản lý kiểu phòng</NavLink></li>
            <li><NavLink to="/invoices">Quản lý hóa đơn</NavLink></li>
            <li><NavLink to="/services">Quản lý dịch vụ</NavLink></li>
          </ul>
          <div>
            <span>Xin chào, {userName} ({userRole})</span>
            <button onClick={handleLogout} disabled={loading}>Đăng xuất</button>
          </div>
        </nav>

        <div style={{ padding: '1rem' }}>
          <h2>Quản lý nhân viên</h2>
          {message && <p>{message}</p>}
          {loading && <p>Đang tải...</p>}

          <form onSubmit={handleCreateOrUpdate} style={{ maxWidth: '600px', marginBottom: '2rem' }}>
            <div>
              <label>Họ tên *</label>
              <input
                  name="name"
                  placeholder="Họ tên"
                  value={employeeForm.name}
                  onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  required
              />
            </div>
            <div>
              <label>Email *</label>
              <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={employeeForm.email}
                  onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  required
              />
            </div>
            <div>
              <label>Mật khẩu {editingEmployeeId ? '' : '*'}</label>
              <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={employeeForm.password}
                  onChange={e => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  required={!editingEmployeeId}
              />
            </div>
            <div>
              <label>Vai trò</label>
              <select
                  name="employeeRole"
                  value={employeeForm.employeeRole}
                  onChange={e => setEmployeeForm({ ...employeeForm, employeeRole: e.target.value })}
              >
                <option value="LE_TAN">Lễ tân</option>
                <option value="QUAN_LY">Quản lý</option>
              </select>
            </div>
            <div>
              <button type="submit" disabled={loading}>
                {editingEmployeeId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>

          <table>
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
                    <button onClick={() => handleEdit(emp)} disabled={loading}>Chỉnh sửa</button>
                    <button onClick={() => handleDelete(emp.id)} disabled={loading}>Xóa</button>
                  </td>
                </tr>
            ))}
            {searchPerformed && searchResults.length === 0 && (
                <tr>
                  <td colSpan="5">Không tìm thấy nhân viên phù hợp</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </>
  );
};

export default Home;
