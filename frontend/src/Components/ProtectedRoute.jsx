// ProtectedRoute.jsx
import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading, fetchSessionUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
        fetchSessionUser().then(() => {
            if (!user) navigate("/Login");
        });
    }
  }, [user, loading, navigate, fetchSessionUser]);

 return user ? children : null;  // Render protected route if user is authenticated
};

export default ProtectedRoute;
