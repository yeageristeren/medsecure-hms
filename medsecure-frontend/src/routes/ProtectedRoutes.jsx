import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    
    // user.roles is a Set from your backend — convert safely
    const userRoles = Array.isArray(user.roles) 
        ? user.roles 
        : Array.from(user.roles);
    
    if (allowedRoles && !userRoles.some(r => allowedRoles.includes(r))) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
}

export default ProtectedRoute;