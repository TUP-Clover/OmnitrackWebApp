// ProtectedRoute.jsx
import React, { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If loading or user is not authenticated, redirect to login
    if (!loading && !user) {
      navigate("/Login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <Loader/> // Optionally, return a loading state while waiting
  }

  return children;  // Render protected route if user is authenticated
};

export default ProtectedRoute;
