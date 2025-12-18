import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import CustomerDashboard from '@/components/CustomerDashboard';
import AgentDashboard from '@/components/AgentDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const DashboardPage = () => {
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
        <div>
            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;
