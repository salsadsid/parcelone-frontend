import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateParcelMutation } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Loader2, MapPin, User, Package, CreditCard, ArrowRight, Info, Truck } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion';

const BookParcelPage = () => {
    const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            paymentMode: 'prepaid',
            parcelType: '',
            pickupAddress: '',
            deliveryAddress: '',
            receiverName: '',
            receiverPhone: '',
            cost: ''
        }
    });
    const navigate = useNavigate();

    // Watch form values for the summary card
    const formValues = useWatch({ control });

    // Pricing Logic
    const BASE_PRICE = 15;
    const KM_RATE = 2;
    const [isManualPrice, setIsManualPrice] = useState(false);

    const calculateEstimatedDistance = (addr1, addr2) => {
        if (!addr1 || !addr2) return 0;
        // Simple deterministic heuristic for demo purposes
        return (addr1.length + addr2.length) % 15 + 5;
    };

    useEffect(() => {
        if (!isManualPrice && formValues.pickupAddress && formValues.deliveryAddress) {
            const distance = calculateEstimatedDistance(formValues.pickupAddress, formValues.deliveryAddress);
            const estimatedCost = BASE_PRICE + (distance * KM_RATE);
            setValue('cost', estimatedCost.toString());
        }
    }, [formValues.pickupAddress, formValues.deliveryAddress, isManualPrice, setValue]);

    const onSubmit = async (data) => {
        try {
            await createParcel(data).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to book parcel:', err);
            alert(err?.data?.message || 'Failed to book parcel');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-background/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Book a New Shipment</h1>
                    <p className="text-muted-foreground mt-2">Fill in the details below to schedule your delivery.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 space-y-6"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Pickup & Delivery Section */}
                            <Card className="border-primary/10 shadow-sm overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MapPin size={20} />
                                        <CardTitle className="text-lg">Route Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pickupAddress">Pickup Address</Label>
                                            <div className="relative">
                                                <Input
                                                    id="pickupAddress"
                                                    placeholder="Enter full pickup location"
                                                    {...register('pickupAddress', { required: 'Pickup address is required' })}
                                                    className="pl-9 bg-background/50"
                                                />
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                            </div>
                                            {errors.pickupAddress && <span className="text-xs text-destructive">{errors.pickupAddress.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="deliveryAddress">Delivery Address</Label>
                                            <div className="relative">
                                                <Input
                                                    id="deliveryAddress"
                                                    placeholder="Enter destination address"
                                                    {...register('deliveryAddress', { required: 'Delivery address is required' })}
                                                    className="pl-9 bg-background/50"
                                                />
                                                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                            </div>
                                            {errors.deliveryAddress && <span className="text-xs text-destructive">{errors.deliveryAddress.message}</span>}
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>

                            {/* Receiver Details Section */}
                            <Card className="border-primary/10 shadow-sm overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <User size={20} />
                                        <CardTitle className="text-lg">Receiver Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="receiverName">Receiver Name</Label>
                                            <Input
                                                id="receiverName"
                                                placeholder="Full name"
                                                {...register('receiverName', { required: 'Receiver name is required' })}
                                                className="bg-background/50"
                                            />
                                            {errors.receiverName && <span className="text-xs text-destructive">{errors.receiverName.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="receiverPhone">Receiver Phone</Label>
                                            <Input
                                                id="receiverPhone"
                                                placeholder="+1 (555) 000-0000"
                                                {...register('receiverPhone', { required: 'Receiver phone is required' })}
                                                className="bg-background/50"
                                            />
                                            {errors.receiverPhone && <span className="text-xs text-destructive">{errors.receiverPhone.message}</span>}
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>

                            {/* Parcel Details Section */}
                            <Card className="border-primary/10 shadow-sm overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Package size={20} />
                                        <CardTitle className="text-lg">Parcel & Payment</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="parcelType">Parcel Type</Label>
                                            <Input
                                                id="parcelType"
                                                placeholder="e.g., Box, Document"
                                                {...register('parcelType', { required: 'Parcel type is required' })}
                                                className="bg-background/50"
                                            />
                                            {errors.parcelType && <span className="text-xs text-destructive">{errors.parcelType.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cost">Estimated Cost ($)</Label>
                                            <Input
                                                id="cost"
                                                type="number"
                                                placeholder="0.00"
                                                {...register('cost', { required: 'Cost is required' })}
                                                className="bg-background/50"
                                            />
                                            {errors.cost && <span className="text-xs text-destructive">{errors.cost.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Payment Mode</Label>
                                            <Controller
                                                name="paymentMode"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-background/50">
                                                            <SelectValue placeholder="Select mode" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="prepaid">Prepaid</SelectItem>
                                                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between pt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
                                    Back to Dashboard
                                </Button>
                                <Button type="submit" size="lg" disabled={isCreating} className="px-8 shadow-lg shadow-primary/20 gap-2">
                                    {isCreating ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                        <>
                                            Confirm Booking
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 shadow-xl bg-primary/5 backdrop-blur-sm sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Info size={20} className="text-primary" />
                                    Booking Summary
                                </CardTitle>
                                <CardDescription>Review your shipment details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                            <div className="w-0.5 h-10 bg-border border-dashed border-l" />
                                            <div className="w-3 h-3 rounded-full bg-secondary" />
                                        </div>
                                        <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Pickup</p>
                                                <p className="text-sm font-medium truncate">{formValues.pickupAddress || 'Not specified'}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Delivery</p>
                                                <p className="text-sm font-medium truncate">{formValues.deliveryAddress || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-primary/10 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Receiver</p>
                                            <p className="text-sm font-semibold truncate">{formValues.receiverName || '---'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Type</p>
                                            <p className="text-sm font-semibold truncate">{formValues.parcelType || '---'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-primary/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Payment Mode</span>
                                            <span className="text-sm font-bold capitalize text-primary">{formValues.paymentMode}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <div className="flex flex-col">
                                                <span>Total Cost</span>
                                                {!isManualPrice && formValues.pickupAddress && formValues.deliveryAddress && (
                                                    <span className="text-[10px] text-muted-foreground font-normal">Estimated Median Cost</span>
                                                )}
                                            </div>
                                            <span className="text-primary">${formValues.cost || '0.00'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-background/50 border border-primary/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Truck size={20} />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold">Fastest Route</p>
                                        <p className="text-muted-foreground">Estimated delivery: 2-3 days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Card */}
                        <div className="p-6 rounded-3xl bg-zinc-900 text-white space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
                            <h4 className="font-bold relative z-10">Need Help?</h4>
                            <p className="text-xs text-zinc-400 relative z-10">Our support team is available 24/7 to assist with your booking.</p>
                            <Button variant="outline" size="sm" className="w-full border-white/20 hover:bg-white/10 text-white relative z-10">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookParcelPage;
