import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const roleRedirects: Record<string, string> = {
  HR: '/hr/dashboard',
  DIRECTOR: '/director/dashboard',
  SUPERADMIN: '/admin/dashboard',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirect = roleRedirects[user.role] || '/login';
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
