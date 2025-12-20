import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    Box,
    Scale,
    Maximize,
    DollarSign,
    Calendar,
    User,
    Truck,
    ChevronRight,
    Clock,
    Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ParcelCard = ({
    parcel,
    role = 'customer',
    onStatusUpdate,
    onAssignAgent,
    agents = [],
    isUpdating = false
}) => {
    const statusColors = {
        pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900',
        assigned: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900',
        picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900',
        in_transit: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900',
        delivered: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900',
        failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900',
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-5 border-b border-primary/5 flex justify-between items-start bg-muted/30">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tracking ID</span>
                                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold">
                                    {parcel._id.slice(-8).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar size={12} className="text-primary/60" />
                                {formatDate(parcel.createdAt)}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColors[parcel.status] || statusColors.pending}`}>
                            {parcel.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Route Info */}
                        <div className="relative flex gap-4">
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary to-secondary/40 border-dashed border-l" />
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-secondary/10" />
                            </div>
                            <div className="flex-1 space-y-4 min-w-0">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pickup</p>
                                    <p className="text-sm font-medium truncate leading-tight" title={parcel.pickupAddress}>
                                        {parcel.pickupAddress}
                                    </p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivery</p>
                                    <p className="text-sm font-medium truncate leading-tight" title={parcel.deliveryAddress}>
                                        {parcel.deliveryAddress}
                                    </p>
                                    {role !== 'customer' && (
                                        <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                                            <User size={12} />
                                            {parcel.receiverName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Parcel Details Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-muted/50 rounded-xl p-3 border border-primary/5 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Box size={14} className="text-primary/60" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Type & Weight</span>
                                </div>
                                <p className="text-sm font-bold capitalize">
                                    {parcel.parcelType} <span className="text-muted-foreground font-medium ml-1">({parcel.weight}kg)</span>
                                </p>
                            </div>
                            <div className="bg-muted/50 rounded-xl p-3 border border-primary/5 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <DollarSign size={14} className="text-primary/60" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Cost</span>
                                </div>
                                <p className="text-sm font-bold text-primary">
                                    ${parcel.cost.toFixed(2)}
                                    <span className="text-[10px] text-muted-foreground font-medium ml-1 uppercase">({parcel.paymentMode})</span>
                                </p>
                            </div>
                        </div>

                        {/* Dimensions (Conditional for Box) */}
                        {parcel.parcelType === 'box' && parcel.length && (
                            <div className="flex items-center gap-4 px-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Maximize size={14} className="text-primary/60" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Dimensions:</span>
                                </div>
                                <p className="text-xs font-semibold">
                                    {parcel.length}L × {parcel.width}W × {parcel.height}H <span className="text-muted-foreground font-normal">cm</span>
                                </p>
                            </div>
                        )}

                        {/* Role Specific Actions */}
                        <div className="pt-2">
                            {role === 'customer' && (parcel.status !== 'pending' && parcel.status !== 'assigned') && (
                                <Link to={`/parcels/${parcel._id}`} className="block">
                                    <Button className="w-full group bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                                        Track Shipment
                                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            )}

                            {role === 'agent' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock size={14} className={isUpdating ? "animate-spin" : ""} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {isUpdating ? "Updating Status..." : "Update Status"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['picked_up', 'in_transit', 'delivered', 'failed'].map((status) => (
                                            <Button
                                                key={status}
                                                size="sm"
                                                variant={parcel.status === status ? "default" : "outline"}
                                                disabled={isUpdating}
                                                onClick={() => onStatusUpdate(parcel._id, status)}
                                                className={`text-[10px] h-8 uppercase font-bold tracking-wider ${parcel.status === status ? 'bg-primary shadow-md' : 'hover:bg-primary/5'
                                                    }`}
                                            >
                                                {status.replace('_', ' ')}
                                            </Button>
                                        ))}
                                    </div>
                                    {(parcel.status === 'picked_up' || parcel.status === 'in_transit') && (
                                        <Link to={`/parcels/${parcel._id}`} className="block pt-1">
                                            <Button variant="secondary" size="sm" className="w-full text-xs font-bold gap-2" disabled={isUpdating}>
                                                <MapPin size={14} />
                                                View Route & Details
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {role === 'admin' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <User size={14} className={isUpdating ? "animate-spin" : ""} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {isUpdating ? "Assigning Agent..." : "Assign Delivery Agent"}
                                        </span>
                                    </div>
                                    <Select
                                        defaultValue={parcel.assignedAgent?._id || ""}
                                        onValueChange={(value) => onAssignAgent(parcel._id, value)}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-full h-10 bg-background/50 border-primary/10 focus:ring-primary/20">
                                            <SelectValue placeholder="Select Agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents?.map(agent => (
                                                <SelectItem key={agent._id} value={agent._id} className="text-sm">
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                                        <div className="flex items-center gap-1">
                                            <User size={10} />
                                            Sender: <span className="font-bold text-foreground">{parcel.sender?.name}</span>
                                        </div>
                                        <Link to={`/parcels/${parcel._id}`} className="text-primary hover:underline font-bold">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ParcelCard;
