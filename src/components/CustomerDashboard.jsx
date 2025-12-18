import { Link } from 'react-router-dom';
import { useGetParcelsQuery } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CustomerDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">My Parcels</h2>
                <Link to="/book-parcel">
                    <Button>Book New Parcel</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {parcels?.map((parcel) => (
                    <Card key={parcel._id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-foreground">To: {parcel.receiverName}</p>
                                <p className="text-sm text-muted-foreground">Status: {parcel.status}</p>
                                <p className="text-sm text-muted-foreground">Type: {parcel.parcelType}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-foreground">${parcel.cost}</p>
                                <p className="text-sm text-muted-foreground">{parcel.paymentMode.toUpperCase()}</p>
                                <Link to={`/parcels/${parcel._id}`}>
                                    <Button size="sm" variant="outline" className="mt-2">Track</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {parcels?.length === 0 && <p className="text-muted-foreground">No parcels found.</p>}
            </div>
        </div>
    );
};

export default CustomerDashboard;
