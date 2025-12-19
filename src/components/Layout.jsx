import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '@/features/auth/authSlice';
import { apiSlice } from '@/features/auth/authApiSlice';
import ThemeToggle from '@/components/ThemeToggle';

const Layout = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="bg-card shadow-sm p-4 border-b">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className='flex items-center gap-2'>
                        <img src="parcelone_logo.png" alt="ParcelOne Logo" width={32} />
                        <h1 className="text-xl font-bold text-primary">ParcelOne</h1>
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <ThemeToggle />
                            <span className="text-sm text-muted-foreground">
                                {user.name} ({user.role})
                            </span>
                            <Button onClick={() => {
                                console.log('Logout clicked');
                                dispatch(apiSlice.util.resetApiState());
                                console.log('Reset API state dispatched');
                                dispatch(logOut());
                                console.log('Logout dispatched');
                                navigate('/login');
                            }} variant="destructive" size="sm">
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="space-x-4 flex items-center">
                            <ThemeToggle />
                            <Link to="/login"><Button variant="ghost">Login</Button></Link>
                            <Link to="/register"><Button>Register</Button></Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
