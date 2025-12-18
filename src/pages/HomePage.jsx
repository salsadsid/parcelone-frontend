import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Globe, Clock, Package, MapPin } from 'lucide-react';



const HomePage = () => {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                <div className="container px-4 md:px-6 mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Next-Gen Logistics <br /> for a Fast-Paced World
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-[600px] mx-auto"
                    >
                        Experience real-time tracking, secure deliveries, and global reach with ParcelOne. The smartest way to move your packages.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <Link to="/login">
                            <Button size="lg" className="h-12 px-8 text-lg">Get Started</Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Track Parcel</Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose ParcelOne?</h2>
                    <p className="text-muted-foreground">We deliver more than just packages; we deliver peace of mind.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Truck className="w-10 h-10 text-primary" />}
                        title="Real-Time Tracking"
                        description="Monitor your shipments in real-time with our advanced GPS tracking system. Know exactly where your package is."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-10 h-10 text-primary" />}
                        title="Secure Delivery"
                        description="Your parcels are safe with us. We use tamper-proof packaging and verified delivery agents."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Globe className="w-10 h-10 text-primary" />}
                        title="Global Reach"
                        description="Sending across town or across the globe? We have the network to get it there fast and affordable."
                        delay={0.6}
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-muted/50 py-16">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatCard number="1M+" label="Parcels Delivered" />
                        <StatCard number="50k+" label="Happy Customers" />
                        <StatCard number="100+" label="Cities Covered" />
                        <StatCard number="24/7" label="Support" />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
                    <p className="text-muted-foreground">Simple steps to get your package moving.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <StepCard number="1" icon={<Package />} title="Book" description="Schedule a pickup online in seconds." />
                    <StepCard number="2" icon={<Truck />} title="Pickup" description="Our agent collects the parcel from your door." />
                    <StepCard number="3" icon={<MapPin />} title="Track" description="Watch your parcel move in real-time." />
                    <StepCard number="4" icon={<ShieldCheck />} title="Delivered" description="Safe delivery to the destination." />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
    >
        <div className="mb-4 bg-primary/10 w-fit p-3 rounded-lg">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

const StatCard = ({ number, label }) => (
    <div className="space-y-2">
        <h3 className="text-4xl font-bold text-primary">{number}</h3>
        <p className="text-muted-foreground font-medium">{label}</p>
    </div>
);

const StepCard = ({ number, icon, title, description }) => (
    <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10">
            {number}
        </div>
        <div className="bg-card p-6 rounded-lg border w-full h-full hover:border-primary/50 transition-colors">
            <div className="mb-3 flex justify-center text-muted-foreground">{icon}</div>
            <h4 className="font-bold mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default HomePage;
