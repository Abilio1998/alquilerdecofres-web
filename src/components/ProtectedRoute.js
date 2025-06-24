// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();
  
   if (loading) return <div>Cargando...</div>; // O un spinner si prefieres
  
  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
