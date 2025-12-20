import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '@/features/auth/authSlice';
import { apiSlice } from '@/features/auth/apiSlice';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(apiSlice.util.resetApiState());
        dispatch(apiSlice.util.invalidateTags(['User', 'Parcel', 'Metrics']));
        dispatch(logOut());
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className='flex items-center gap-2 group' onClick={() => setIsMenuOpen(false)}>
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <img src="parcelone_logo.png" alt="ParcelOne Logo" width={24} className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-primary tracking-tight">ParcelOne</h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost" className="gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <ThemeToggle />
                            <div className="h-4 w-[1px] bg-border mx-2" />
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-sm font-semibold leading-none">{user.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{user.role}</span>
                            </div>
                            <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <ThemeToggle />
                            <Link to="/login">
                                <Button variant="ghost" className="gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative z-50"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-card overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold leading-none">{user.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{user.role}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl">
                                                <LayoutDashboard className="w-5 h-5" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={handleLogout}
                                            variant="destructive"
                                            className="w-full justify-start gap-3 h-12 rounded-xl"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid gap-2">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl">
                                            <LogIn className="w-5 h-5" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full justify-start gap-3 h-12 rounded-xl">
                                            <UserPlus className="w-5 h-5" />
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
