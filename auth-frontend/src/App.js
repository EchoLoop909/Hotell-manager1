// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import Home from './components/Home';
// import ReceptionistHome from './components/Admin/ReceptionistHome';
// import RoomManagement from './components/Admin/RoomManagement';
// import InvoiceManagement from './components/Admin/InvoiceManagement';
// import ServiceManagement from './components/Admin/ServiceManagement';
// import './styles.css';
//
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const userRole = localStorage.getItem('user_role');
//     if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
//         return <Navigate to="/" replace />;
//     }
//     return children;
// };
//
// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<Login />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route
//                     path="/home"
//                     element={
//                         <ProtectedRoute allowedRoles={['QUAN_LY']}>
//                             <Home />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/receptionist"
//                     element={
//                         <ProtectedRoute allowedRoles={['LE_TAN']}>
//                             <ReceptionistHome />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/employees"
//                     element={
//                         <ProtectedRoute allowedRoles={['LE_TAN', 'QUAN_LY']}>
//                             <ReceptionistHome />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/rooms"
//                     element={
//                         <ProtectedRoute allowedRoles={['QUAN_LY']}>
//                             <RoomManagement />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/invoices"
//                     element={
//                         <ProtectedRoute allowedRoles={['QUAN_LY']}>
//                             <InvoiceManagement />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/services"
//                     element={
//                         <ProtectedRoute allowedRoles={['QUAN_LY']}>
//                             <ServiceManagement />
//                         </ProtectedRoute>
//                     }
//                 />
//             </Routes>
//         </Router>
//     );
// };
//
// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ReceptionistHome from './components/Admin/ReceptionistHome';
import CustomerManagement from './components/Admin/CustomerManagement';
import RoomManagement from './components/Admin/RoomManagement';
import InvoiceManagement from './components/Admin/InvoiceManagement';
import ServiceManagement from './components/Admin/ServiceManagement';
import './styles.css';

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
                            <ReceptionistHome />
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
                    path="/rooms"
                    element={
                        <ProtectedRoute allowedRoles={['QUAN_LY']}>
                            <RoomManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/invoices"
                    element={
                        <ProtectedRoute allowedRoles={['QUAN_LY']}>
                            <InvoiceManagement />
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