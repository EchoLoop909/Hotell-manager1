import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CustomerDashboard from './components/CustomerDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import ReceptionistSearchRoom from './components/Employee/ReceptionistSearchRoom';
import BookingForm from './components/Employee/BookingForm';
import ReceptionistHome from './components/Admin/ReceptionistHome';
import CustomerManagement from './components/Admin/CustomerManagement';
import RoomManagement from './components/Admin/RoomManagement';
import InvoiceManagement from './components/Admin/InvoiceManagement';
import ServiceManagement from './components/Admin/ServiceManagement';
import RoomTypeManagement from './components/Admin/RoomTypeManagement';
import InvoiceManagement1 from './components/Employee/InvoiceManagement1';
import CancelBooking from "./components/Employee/CancelBooking";
import CustomerManagementEmployee from "./components/Employee/CustomerManagementEmployee";
import EmployeeUpdate from "./components/Employee/EmployeeUpdate";
import SearchRoom from "./components/Custommer/SearchRoom";
import BookingRoom from "./components/Custommer/BookingRoom";
import CustomerUpdate from "./components/Custommer/CustomerUpdate";
import Invoice from "./components/Custommer/Invoice";
import BookingCancel from "./components/Custommer/BookingCancel";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('user_role');
  if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY']}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute allowedRoles={['LE_TAN']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
          <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                                  path="/customer/profile"
                                  element={
                                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                      <CustomerUpdate />
                                    </ProtectedRoute>
                                  }
                                />
          <Route
              path="/customer/invoices"
              element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                      <Invoice />
                  </ProtectedRoute>
              }
          />
          <Route
          path="/customer/cancelbooking"
          element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <BookingCancel />
              </ProtectedRoute>
          }
      />
          <Route
              path="/receptionist/cancel-booking"
              element={
                <ProtectedRoute allowedRoles={['LE_TAN']}>
                  <CancelBooking />
                </ProtectedRoute>
              }
              />
              <Route
                            path="/customer/book"
                            element={
                              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                <BookingRoom />
                              </ProtectedRoute>
                            }
                            />
              <Route
                            path="/Customer/SearchRoom"
                            element={
                              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                <SearchRoom />
                              </ProtectedRoute>
                            }
                            />
        <Route
          path="/receptionist/search-room"
          element={
            <ProtectedRoute allowedRoles={['LE_TAN']}>
              <ReceptionistSearchRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/book"
          element={
            <ProtectedRoute allowedRoles={['LE_TAN']}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY']}>
              <RoomManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room-types"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY']}>
              <RoomTypeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['LE_TAN', 'QUAN_LY']}>
              <ReceptionistHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY']}>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY','LE_TAN']}>
              <InvoiceManagement />
            </ProtectedRoute>
          }
        />
          <Route
              path="/receptionist/invoices"
              element={
                  <ProtectedRoute allowedRoles={['LE_TAN']}>
                      <InvoiceManagement1 />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/receptionist/custommer"
              element={
                  <ProtectedRoute allowedRoles={['LE_TAN']}>
                      <CustomerManagementEmployee />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/receptionist/employeeUpdate"
              element={
                  <ProtectedRoute allowedRoles={['LE_TAN']}>
                      <EmployeeUpdate />
                  </ProtectedRoute>
              }
          />
        <Route
          path="/services"
          element={
            <ProtectedRoute allowedRoles={['QUAN_LY']}>
              <ServiceManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;