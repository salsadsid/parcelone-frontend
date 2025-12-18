import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '@/features/auth/authSlice';
import { apiSlice } from '@/features/auth/authApiSlice';
import CustomerDashboard from '@/components/CustomerDashboard';
import AgentDashboard from '@/components/AgentDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import ThemeToggle from '@/components/ThemeToggle';

const HomePage = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const renderDashboard = () => {
        switch (user.role) {
            case 'admin':
                return <AdminDashboard />;
            case 'agent':
                return <AgentDashboard />;
            default:
                return <CustomerDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="bg-card shadow-sm p-4 border-b">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">ParcelOne</h1>
                    {user ? (
                        <div className="flex items-center gap-4">
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
                {user ? (
                    renderDashboard()
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-4xl font-bold text-foreground mb-4">Welcome to ParcelOne</h2>
                        <p className="text-xl text-muted-foreground mb-8">Efficient Courier Tracking & Parcel Management</p>
                        <div className="space-x-4">
                            <Link to="/login"><Button size="lg">Get Started</Button></Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
