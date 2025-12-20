import { useParams, useNavigate } from 'react-router-dom';
import { useGetParcelsQuery, useUpdateLocationMutation } from '@/features/auth/parcelApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Loading from '@/components/Loading';
import {
    ChevronLeft,
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    Circle,
    Truck,
    Navigation,
    Box,
    Scale,
    Maximize,
    DollarSign,
    User,
    Phone,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const ParcelDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: parcels } = useGetParcelsQuery();
    const parcel = parcels?.find(p => p._id === id);
    const user = useSelector(selectCurrentUser);
    const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation();

    const [currentLocation, setCurrentLocation] = useState(parcel?.currentLocation || null);
    const [isTracking, setIsTracking] = useState(false);
    const [mapError, setMapError] = useState(null);

    useEffect(() => {
        if (parcel?.currentLocation) {
            setCurrentLocation(parcel.currentLocation);
        }
    }, [parcel]);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_PRODUCTION_URL
            ? import.meta.env.VITE_PRODUCTION_URL.replace('/api', '')
            : 'http://localhost:5000';
        const socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('parcelLocationUpdated', (data) => {
            if (data.parcelId === id) {
                setCurrentLocation(data.location);
            }
        });

        return () => socket.close();
    }, [id]);

    useEffect(() => {
        let watchId;
        const isAgent = user?.role === 'agent';

        console.log('Tracking Effect:', { isTracking, isAgent, hasGeolocation: "geolocation" in navigator });

        if (isTracking && isAgent) {
            if ("geolocation" in navigator) {
                console.log('Starting geolocation watch...');
                watchId = navigator.geolocation.watchPosition(
                    async (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        console.log('New position received:', newLocation);
                        try {
                            await updateLocation({ id, location: newLocation }).unwrap();
                            setCurrentLocation(newLocation);
                        } catch (err) {
                            console.error('Failed to update location on server:', err);
                        }
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        let errorMessage = 'Failed to get your current location.';
                        if (error.code === error.PERMISSION_DENIED) {
                            errorMessage = 'Location permission denied. Please enable it in your browser settings.';
                        } else if (error.code === error.TIMEOUT) {
                            errorMessage = 'Location request timed out. Retrying...';
                        }
                        setMapError(errorMessage);
                        // Don't set isTracking to false on timeout, let it retry
                        if (error.code !== error.TIMEOUT) {
                            setIsTracking(false);
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0, // Force fresh location
                        timeout: 10000 // Increase timeout to 10 seconds
                    }
                );
            } else {
                console.error('Geolocation not supported');
                setMapError('Geolocation is not supported by your browser');
                setIsTracking(false);
            }
        }

        return () => {
            if (watchId) {
                console.log('Stopping geolocation watch');
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isTracking, user?.role, id, updateLocation]); // Add user?.role to dependencies

    const startTracking = () => {
        if (!("geolocation" in navigator)) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }
        setIsTracking(true);
        toast.info('Starting location tracking...');
    };

    if (!parcel) return <Loading fullScreen={false} />;

    const isAgent = user.role === 'agent'; // Keep this definition for rendering logic

    const statusSteps = [
        { id: 'pending', label: 'Order Placed', icon: Clock },
        { id: 'assigned', label: 'Agent Assigned', icon: User },
        { id: 'picked_up', label: 'Picked Up', icon: Package },
        { id: 'in_transit', label: 'In Transit', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const currentStatusIndex = statusSteps.findIndex(step => step.id === parcel.status);

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
                {/* Header & Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Track Shipment</h2>
                            <p className="text-muted-foreground font-mono text-sm">ID: {parcel._id.toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest shadow-sm ${parcel.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' :
                            parcel.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' :
                                'bg-primary/10 text-primary border-primary/20'
                            }`}>
                            {parcel.status.replace('_', ' ')}
                        </span>
                        {isTracking && (
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-tighter border border-amber-200 dark:border-amber-900"
                            >
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                Live Tracking Active
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Map & Timeline */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Map Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-3xl overflow-hidden border border-primary/5 shadow-2xl bg-card aspect-[16/9] lg:aspect-auto lg:h-[500px]"
                        >
                            <AnimatePresence>
                                {mapError ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-20 bg-background/90 backdrop-blur-sm flex items-center justify-center p-8 text-center"
                                    >
                                        <div className="space-y-4 max-w-sm">
                                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                            </div>
                                            <h4 className="font-bold text-xl text-foreground">Map Unavailable</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {mapError}. Please verify the address details.
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setMapError(null)}
                                                className="mt-2"
                                            >
                                                Try Again
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : !currentLocation ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-background/60 backdrop-blur-md flex items-center justify-center p-6 text-center"
                                    >
                                        <div className="space-y-4 max-w-xs">
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                                <Navigation className="w-8 h-8 text-primary animate-bounce" />
                                            </div>
                                            <h4 className="font-bold text-lg">Waiting for Location</h4>
                                            <p className="text-sm text-muted-foreground">We'll show the live position as soon as the agent starts the delivery.</p>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                            {!mapError && (
                                <MapComponent
                                    location={currentLocation}
                                    destination={parcel.deliveryAddress}
                                    pickup={parcel.pickupAddress}
                                    isAgent={isAgent}
                                    onError={setMapError}
                                />
                            )}
                        </motion.div>

                        {/* Status Timeline */}
                        <Card className="rounded-3xl border-primary/5 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-primary/5 bg-muted/30">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Delivery Journey
                                </h3>
                            </div>
                            <CardContent className="p-8">
                                <div className="relative flex justify-between">
                                    {/* Connection Line */}
                                    <div className="absolute top-5 left-0 w-full h-0.5 bg-muted">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                                            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                        />
                                    </div>

                                    {statusSteps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isCompleted = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110'
                                                    : 'bg-muted text-muted-foreground'
                                                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-[8px] text-primary font-bold animate-pulse mt-0.5">CURRENT STATUS</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Parcel Info Card */}
                        <Card className="rounded-3xl border-primary/5 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-primary/5 bg-muted/30">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Shipment Details
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* Route Summary */}
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center gap-1 pt-1">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <div className="w-0.5 h-8 bg-dashed border-l border-primary/20" />
                                            <MapPin className="w-4 h-4 text-secondary" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">From</p>
                                                <p className="text-sm font-medium leading-tight">{parcel.pickupAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To</p>
                                                <p className="text-sm font-medium leading-tight">{parcel.deliveryAddress}</p>
                                                <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                                                    <User size={12} />
                                                    {parcel.receiverName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-2xl bg-muted/50 border border-primary/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Box size={12} className="text-primary/60" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Type</span>
                                        </div>
                                        <p className="text-xs font-bold capitalize">{parcel.parcelType}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-muted/50 border border-primary/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Scale size={12} className="text-primary/60" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Weight</span>
                                        </div>
                                        <p className="text-xs font-bold">{parcel.weight} kg</p>
                                    </div>
                                    {parcel.parcelType === 'box' && (
                                        <div className="col-span-2 p-3 rounded-2xl bg-muted/50 border border-primary/5 space-y-1">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Maximize size={12} className="text-primary/60" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">Dimensions</span>
                                            </div>
                                            <p className="text-xs font-bold">
                                                {parcel.length}L × {parcel.width}W × {parcel.height}H <span className="text-muted-foreground font-normal">cm</span>
                                            </p>
                                        </div>
                                    )}
                                    <div className="col-span-2 p-3 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <DollarSign size={12} className="text-primary/60" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Payment</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-primary">${parcel.cost.toFixed(2)}</p>
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground">{parcel.paymentMode}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info (For Agent/Admin) */}
                                {(isAgent || user.role === 'admin') && (
                                    <div className="pt-4 border-t border-primary/5 space-y-3">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Receiver Contact</p>
                                        <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-primary/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">{parcel.receiverName}</p>
                                                    <p className="text-[10px] text-muted-foreground">{parcel.receiverPhone}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Agent Actions */}
                        {isAgent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-3"
                            >
                                <Button
                                    onClick={startTracking}
                                    disabled={isTracking}
                                    className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 gap-2"
                                >
                                    {isTracking ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            >
                                                <Navigation size={18} />
                                            </motion.div>
                                            Tracking Active...
                                        </>
                                    ) : (
                                        <>
                                            <Navigation size={18} />
                                            Start Delivery Tracking
                                        </>
                                    )}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground px-4">
                                    Starting tracking will share your live location with the customer until the parcel is delivered.
                                </p>
                            </motion.div>
                        )}

                        {/* Help Card */}
                        <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white space-y-4 relative overflow-hidden border border-zinc-200 dark:border-transparent">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
                            <h4 className="font-bold relative z-10 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary" />
                                Need Help?
                            </h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 relative z-10">Issues with this shipment? Our support team is here to help you 24/7.</p>
                            <Button variant="outline" size="sm" className="w-full border-zinc-300 dark:border-white/20 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white relative z-10 font-bold">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelDetailsPage;
