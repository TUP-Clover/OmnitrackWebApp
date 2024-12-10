import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to /Monitor
    if (!loading && user) {
      navigate("/Monitor");
    }
  }, [user, loading, navigate]);

  return user ? null : children;  // Render the route if user is not logged in
};

export default PublicRoute;
