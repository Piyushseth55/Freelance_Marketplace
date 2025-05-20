import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const isClient = isAuthenticated && user?.role === 'client';

  return isClient ? <Outlet /> : <Navigate to="/login" />;
};

export default ClientRoutes;
