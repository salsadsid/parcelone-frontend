import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '@/features/auth/authApiSlice';
import { setCredentials } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Package, UserPlus, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const RegisterPage = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const userData = await registerUser(data).unwrap();
            dispatch(setCredentials({ ...userData, user: userData }));
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to register:', err);
            alert(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 relative overflow-hidden bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -20, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Visual Content - Left Side for Register */}
            <div className="hidden lg:flex flex-col relative bg-zinc-950 overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent opacity-50" />

                <div className="relative z-10 max-w-lg text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <Globe size={20} />
                            </div>
                            <h4 className="font-bold">Global Reach</h4>
                            <p className="text-xs text-zinc-400">Connect with delivery networks worldwide.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <UserPlus size={20} />
                            </div>
                            <h4 className="font-bold">Easy Setup</h4>
                            <p className="text-xs text-zinc-400">Get started in minutes with our simple onboarding.</p>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-extrabold tracking-tight">
                            Start Your Journey <br />
                            <span className="text-secondary">With ParcelOne.</span>
                        </h3>
                        <p className="text-zinc-400 text-lg">
                            Create your account today and experience the most advanced parcel management system.
                        </p>
                    </div>
                </div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Right Side - Form */}
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
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 text-secondary mb-4"
                        >
                            <UserPlus size={32} />
                        </motion.div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Create an account
                        </h2>
                        <p className="text-muted-foreground">
                            Join our network and start shipping today
                        </p>
                    </div>

                    <Card className="border shadow-2xl bg-card/50 backdrop-blur-xl">
                        <CardContent className="pt-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        {...register('name', { required: 'Name is required' })}
                                        className="h-11 bg-background/50 border-muted-foreground/20 focus:border-secondary transition-all"
                                    />
                                    {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register('email', { required: 'Email is required' })}
                                        className="h-11 bg-background/50 border-muted-foreground/20 focus:border-secondary transition-all"
                                    />
                                    {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                        })}
                                        className="h-11 bg-background/50 border-muted-foreground/20 focus:border-secondary transition-all"
                                    />
                                    {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a...</Label>
                                    <Controller
                                        name="role"
                                        control={control}
                                        defaultValue="customer"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-11 bg-background/50 border-muted-foreground/20 focus:border-secondary transition-all">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="customer">Customer</SelectItem>
                                                    <SelectItem value="agent">Delivery Agent</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all gap-2 mt-2" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            Create account
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t border-muted/20 py-6">
                            <p className="text-sm text-muted-foreground">
                                Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline underline-offset-4">Sign in</Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
