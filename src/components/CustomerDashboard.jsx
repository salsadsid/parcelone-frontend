import { Link } from 'react-router-dom';
import { useGetParcelsQuery } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PackagePlus, MapPin, Box, DollarSign, Truck, Package } from 'lucide-react';
import Loading from '@/components/Loading';

const CustomerDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();

    if (isLoading) return <Loading fullScreen={false} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">My Parcels</h2>
                <Link to="/book-parcel">
                    <Button className="gap-2">
                        <PackagePlus className="w-4 h-4" />
                        Book New Parcel
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {parcels?.map((parcel) => (
                    <Card key={parcel._id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Tracking ID</p>
                                    <p className="font-mono text-sm">{parcel._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${parcel.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' :
                                    parcel.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' :
                                        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900'
                                    }`}>
                                    {parcel.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">To</p>
                                        <p className="text-sm font-medium">{parcel.receiverName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{parcel.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Box className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Type</p>
                                        <p className="text-sm">{parcel.parcelType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cost</p>
                                        <p className="text-sm font-medium">${parcel.cost} ({parcel.paymentMode})</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Link to={`/parcels/${parcel._id}`} className="w-full">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Truck className="w-4 h-4" />
                                        Track Shipment
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {parcels?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No parcels found. Book your first parcel today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
