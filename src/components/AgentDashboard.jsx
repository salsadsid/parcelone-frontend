import { useGetParcelsQuery, useUpdateParcelStatusMutation } from '@/features/auth/parcelApiSlice';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Loading from '@/components/Loading';

const AgentDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();
    const [updateStatus] = useUpdateParcelStatusMutation();

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    if (isLoading) return <Loading fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Assigned Parcels</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {parcels?.map((parcel) => (
                    <Card key={parcel._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-mono text-muted-foreground">{parcel._id.slice(-8).toUpperCase()}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${parcel.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' :
                                        parcel.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' :
                                            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900'
                                        }`}>
                                        {parcel.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <Link to={`/parcels/${parcel._id}`}>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Route
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-3 border-t border-b py-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Pickup</p>
                                        <p className="text-sm font-medium truncate" title={parcel.pickupAddress}>{parcel.pickupAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Delivery</p>
                                        <p className="text-sm font-medium truncate" title={parcel.deliveryAddress}>{parcel.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Receiver</p>
                                    <p className="text-sm">{parcel.receiverName} • {parcel.receiverPhone}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {['picked_up', 'in_transit', 'delivered', 'failed'].map((status) => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={parcel.status === status ? "default" : "outline"}
                                            onClick={() => handleStatusUpdate(parcel._id, status)}
                                            className="flex-1 text-xs"
                                        >
                                            {status.replace('_', ' ')}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {parcels?.length === 0 && <p className="text-muted-foreground">No assigned parcels.</p>}
            </div>
        </div >
    );
};

export default AgentDashboard;
