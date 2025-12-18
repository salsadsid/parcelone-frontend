import { useParams } from 'react-router-dom';
import { useGetParcelsQuery, useUpdateLocationMutation } from '@/features/auth/parcelApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ParcelDetailsPage = () => {
    const { id } = useParams();
    const { data: parcels } = useGetParcelsQuery();
    const parcel = parcels?.find(p => p._id === id);
    const user = useSelector(selectCurrentUser);
    const [updateLocation] = useUpdateLocationMutation();

    const [currentLocation, setCurrentLocation] = useState(parcel?.currentLocation || null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        if (parcel?.currentLocation) {
            setCurrentLocation(parcel.currentLocation);
        }
    }, [parcel]);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.on('parcelLocationUpdated', (data) => {
            if (data.parcelId === id) {
                setCurrentLocation(data.location);
            }
        });

        return () => socket.close();
    }, [id]);

    const simulateTracking = () => {
        setIsTracking(true);
        // Simulate movement from pickup to delivery (simplified)
        // In a real app, this would come from the agent's device GPS
        let lat = 40.7128; // Example start
        let lng = -74.0060;

        const interval = setInterval(() => {
            lat += 0.001;
            lng += 0.001;
            const newLocation = { lat, lng };
            setCurrentLocation(newLocation);
            updateLocation({ id, location: newLocation });
        }, 3000);

        return () => clearInterval(interval);
    };

    if (!parcel) return <div>Loading...</div>;

    const isAgent = user.role === 'agent';

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-bold">Parcel Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <MapComponent
                        location={currentLocation}
                        destination={parcel.deliveryAddress} // Assuming address string works or geocoded
                        isAgent={isAgent}
                    />
                </div>
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Details</h3>
                        <p><strong>Status:</strong> {parcel.status}</p>
                        <p><strong>Pickup:</strong> {parcel.pickupAddress}</p>
                        <p><strong>Delivery:</strong> {parcel.deliveryAddress}</p>
                    </div>

                    {isAgent && (
                        <Button onClick={simulateTracking} disabled={isTracking}>
                            {isTracking ? 'Tracking Active' : 'Start Delivery Tracking'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParcelDetailsPage;
