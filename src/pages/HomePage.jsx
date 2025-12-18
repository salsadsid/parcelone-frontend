import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import CustomerDashboard from '@/components/CustomerDashboard';
import AgentDashboard from '@/components/AgentDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const HomePage = () => {
    const user = useSelector(selectCurrentUser);

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
        <>
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
        </>
    );
};

export default HomePage;
