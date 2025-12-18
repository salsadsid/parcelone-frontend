import { useGetParcelsQuery, useUpdateParcelStatusMutation } from '@/features/auth/parcelApiSlice';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assigned Parcels</h2>
            <div className="grid gap-4">
                {parcels?.map((parcel) => (
                    <Card key={parcel._id}>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">Pickup: {parcel.pickupAddress}</p>
                                    <p className="font-semibold">Deliver: {parcel.deliveryAddress}</p>
                                    <p className="text-sm text-gray-500">Receiver: {parcel.receiverName} ({parcel.receiverPhone})</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs ${parcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        parcel.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {parcel.status.toUpperCase()}
                                    </span>
                                    <Link to={`/parcels/${parcel._id}`}>
                                        <Button size="sm" variant="outline" className="ml-2">View Route</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {['picked_up', 'in_transit', 'delivered', 'failed'].map((status) => (
                                    <Button
                                        key={status}
                                        size="sm"
                                        variant={parcel.status === status ? "default" : "outline"}
                                        onClick={() => handleStatusUpdate(parcel._id, status)}
                                    >
                                        {status.replace('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {parcels?.length === 0 && <p>No assigned parcels.</p>}
            </div>
        </div >
    );
};

export default AgentDashboard;
