import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

const ProtectedRoute = () => {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-4 text-center">Memuat...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
