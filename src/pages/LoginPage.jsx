import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/features/auth/authApiSlice';
import { setCredentials } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Package, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const userData = await login(data).unwrap();
            dispatch(setCredentials({ ...userData, user: userData }));
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to login:', err);
            alert(err?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 relative overflow-hidden bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -left-20 -top-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Left Side - Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-2">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4"
                        >
                            <Package size={32} />
                        </motion.div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Welcome back
                        </h2>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Card className="border shadow-2xl bg-card/50 backdrop-blur-xl">
                        <CardContent className="pt-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register('email', { required: 'Email is required' })}
                                        className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                    />
                                    {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password', { required: 'Password is required' })}
                                        className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all"
                                    />
                                    {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
                                </div>
                                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            Sign in
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t border-muted/20 py-6">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">Create an account</Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            {/* Right Side - Visual Content */}
            <div className="hidden lg:flex flex-col relative bg-zinc-950 overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />

                <div className="relative z-10 max-w-lg text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Truck size={20} />
                            </div>
                            <h4 className="font-bold">Fast Delivery</h4>
                            <p className="text-xs text-zinc-400">Lightning fast shipping across all major cities.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <ShieldCheck size={20} />
                            </div>
                            <h4 className="font-bold">Secure</h4>
                            <p className="text-xs text-zinc-400">Your parcels are protected with end-to-end security.</p>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-extrabold tracking-tight">
                            The Future of <br />
                            <span className="text-primary">Logistics is Here.</span>
                        </h3>
                        <p className="text-zinc-400 text-lg">
                            Join thousands of businesses and individuals who trust ParcelOne for their daily shipping needs.
                        </p>
                    </div>

                    <div className="pt-8 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <Package size={40} />
                        <Truck size={40} />
                        <ShieldCheck size={40} />
                    </div>
                </div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
        </div>
    );
};

export default LoginPage;
