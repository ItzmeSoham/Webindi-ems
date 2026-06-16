import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loader from './components/ui/Loader';

// Pages
import Login from './pages/Login';
import HRDashboard from './pages/hr/Dashboard';
import Employees from './pages/hr/Employees';
import EmployeeDetail from './pages/hr/EmployeeDetail';
import Attendance from './pages/hr/Attendance';
import Leaves from './pages/hr/Leaves';
import Reports from './pages/hr/Reports';
import DirectorDashboard from './pages/director/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminLogs from './pages/admin/Logs';
import Settings from './pages/Settings';

const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  const routes: Record<string, string> = {
    HR: '/hr/dashboard', DIRECTOR: '/director/dashboard', SUPERADMIN: '/admin/dashboard',
  };
  return <Navigate to={routes[user.role] || '/login'} />;
};

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">404</h1>
      <p className="text-slate-400 mt-4">Page not found</p>
      <a href="/" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 transition-colors">Go Home</a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' },
              success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RootRedirect />} />

            {/* HR Routes */}
            <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['HR', 'SUPERADMIN']}><HRDashboard /></ProtectedRoute>} />
            <Route path="/hr/employees" element={<ProtectedRoute allowedRoles={['HR', 'SUPERADMIN']}><Employees /></ProtectedRoute>} />
            <Route path="/hr/employees/:id" element={<ProtectedRoute allowedRoles={['HR', 'DIRECTOR', 'SUPERADMIN']}><EmployeeDetail /></ProtectedRoute>} />
            <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={['HR', 'SUPERADMIN']}><Attendance /></ProtectedRoute>} />
            <Route path="/hr/leaves" element={<ProtectedRoute allowedRoles={['HR', 'SUPERADMIN']}><Leaves /></ProtectedRoute>} />
            <Route path="/hr/reports" element={<ProtectedRoute allowedRoles={['HR', 'SUPERADMIN']}><Reports /></ProtectedRoute>} />

            {/* Director Routes */}
            <Route path="/director/dashboard" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><DirectorDashboard /></ProtectedRoute>} />
            <Route path="/director/employees" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><Employees /></ProtectedRoute>} />
            <Route path="/director/employees/:id" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><EmployeeDetail /></ProtectedRoute>} />
            <Route path="/director/attendance" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><Attendance /></ProtectedRoute>} />
            <Route path="/director/leaves" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><Leaves /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminLogs /></ProtectedRoute>} />

            {/* Shared Routes */}
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['HR', 'DIRECTOR', 'SUPERADMIN']}><Settings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
