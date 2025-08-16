import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo === undefined) return null; // optional loading spinner

  if (!userInfo) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/dashboard" replace />; // redirect if role not allowed
  }

  return <Outlet />;
};

export default PrivateRoute;
