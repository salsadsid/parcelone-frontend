import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '@/features/auth/authSlice';

const HomePage = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-gray-900">ParcelOne</h1>
                <p className="text-xl text-gray-600">Courier Tracking & Parcel Management</p>

                {user ? (
                    <div className="space-y-4">
                        <p className="text-lg">Welcome back, <span className="font-semibold">{user.name}</span>!</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                        <Button onClick={() => dispatch(logOut())} variant="destructive">
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/login">
                            <Button size="lg">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="lg">Register</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
