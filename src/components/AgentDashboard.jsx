import { useGetParcelsQuery, useUpdateParcelStatusMutation } from '@/features/auth/parcelApiSlice';
import { useState } from 'react';
import Loading from '@/components/Loading';
import ParcelCard from '@/components/ParcelCard';
import { Package } from 'lucide-react';

import { toast } from 'sonner';

const AgentDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();
    const [updateStatus] = useUpdateParcelStatusMutation();

    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusUpdate = async (id, status) => {
        setUpdatingId(id);
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success('Status updated successfully!');
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) return <Loading fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Assigned Parcels</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {parcels?.map((parcel) => (
                    <ParcelCard
                        key={parcel._id}
                        parcel={parcel}
                        role="agent"
                        onStatusUpdate={handleStatusUpdate}
                        isUpdating={updatingId === parcel._id}
                    />
                ))}
                {parcels?.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground font-medium">No assigned parcels at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;
