import { Link } from 'react-router-dom';
import { useGetParcelsQuery } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { PackagePlus, Package } from 'lucide-react';
import Loading from '@/components/Loading';
import ParcelCard from '@/components/ParcelCard';

const CustomerDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();

    if (isLoading) return <Loading fullScreen={false} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">My Parcels</h2>
                <Link to="/book-parcel">
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <PackagePlus className="w-4 h-4" />
                        Book New Parcel
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {parcels?.map((parcel) => (
                    <ParcelCard key={parcel._id} parcel={parcel} role="customer" />
                ))}
                {parcels?.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground font-medium">No parcels found. Book your first parcel today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
