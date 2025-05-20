import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FreeLancerRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const isFreelancer = isAuthenticated && user?.role === 'freelancer';

  return isFreelancer ? <Outlet /> : <Navigate to="/login" />;
};

export default FreeLancerRoutes;
