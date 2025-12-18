import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

const GuestRoute = () => {
    const user = useSelector(selectCurrentUser);

    return (
        !user
            ? <Outlet />
            : <Navigate to="/dashboard" replace />
    );
};

export default GuestRoute;
