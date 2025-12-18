import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Globe, Clock, Package, MapPin } from 'lucide-react';



const HomePage = () => {
    return (
        <div className="space-y-0 pb-0 overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 md:py-40 overflow-hidden">
                {/* Complex Background Gradients */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                </div>

                <div className="container px-4 md:px-6 mx-auto text-center space-y-8 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Trusted by 50,000+ customers
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                            Next-Gen Logistics <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                                for a Fast-Paced World
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed"
                    >
                        Experience real-time tracking, secure deliveries, and global reach with ParcelOne. The smartest, most colorful way to move your packages.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
                    >
                        <Link to="/login">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Get Started Now
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold backdrop-blur-sm border-primary/20 hover:bg-primary/5">
                                Track Your Parcel
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-primary/[0.02] dark:bg-primary/[0.01] border-y border-primary/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight">Why Choose ParcelOne?</h2>
                        <p className="text-lg text-muted-foreground">We combine cutting-edge technology with world-class service to deliver excellence.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Truck className="w-10 h-10" />}
                            title="Real-Time Tracking"
                            description="Monitor your shipments in real-time with our advanced GPS tracking system. Know exactly where your package is."
                            delay={0.2}
                            color="primary"
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-10 h-10" />}
                            title="Secure Delivery"
                            description="Your parcels are safe with us. We use tamper-proof packaging and verified delivery agents."
                            delay={0.4}
                            color="secondary"
                        />
                        <FeatureCard
                            icon={<Globe className="w-10 h-10" />}
                            title="Global Reach"
                            description="Sending across town or across the globe? We have the network to get it there fast and affordable."
                            delay={0.6}
                            color="accent"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section - Vibrant Gradient */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatCard number="1M+" label="Parcels Delivered" />
                        <StatCard number="50k+" label="Happy Customers" />
                        <StatCard number="100+" label="Cities Covered" />
                        <StatCard number="24/7" label="Support" />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight">How It Works</h2>
                        <p className="text-lg text-muted-foreground">Simple, transparent, and efficient steps to get your package moving.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        <StepCard number="1" icon={<Package />} title="Book" description="Schedule a pickup online in seconds." />
                        <StepCard number="2" icon={<Truck />} title="Pickup" description="Our agent collects the parcel from your door." />
                        <StepCard number="3" icon={<MapPin />} title="Track" description="Watch your parcel move in real-time." />
                        <StepCard number="4" icon={<ShieldCheck />} title="Delivered" description="Safe delivery to the destination." />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 container px-4 md:px-6 mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-12 md:p-20 text-center space-y-8 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 space-y-6"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to ship your first parcel?</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Join thousands of satisfied users and experience the future of logistics today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link to="/register">
                                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-zinc-900 hover:bg-zinc-200">
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/20 hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay, color }) => {
    const colorClasses = {
        primary: "text-primary bg-primary/10 border-primary/20",
        secondary: "text-secondary bg-secondary/10 border-secondary/20",
        accent: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group bg-card p-8 rounded-3xl shadow-sm border border-muted hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    );
};

const StatCard = ({ number, label }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="space-y-2"
    >
        <h3 className="text-5xl font-extrabold text-white">{number}</h3>
        <p className="text-white/70 font-semibold uppercase tracking-wider text-sm">{label}</p>
    </motion.div>
);

const StepCard = ({ number, icon, title, description }) => (
    <div className="relative flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold z-10 shadow-lg shadow-primary/20">
            {number}
        </div>
        <div className="bg-card p-8 rounded-3xl border border-muted w-full h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
            <div className="mb-4 flex justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(icon, { size: 32 })}
            </div>
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default HomePage;
