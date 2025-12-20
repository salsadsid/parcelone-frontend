import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto p-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
