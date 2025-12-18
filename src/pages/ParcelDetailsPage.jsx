import { useParams } from 'react-router-dom';
import { useGetParcelsQuery, useUpdateLocationMutation } from '@/features/auth/parcelApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Loading from '@/components/Loading';

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

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socket.on('parcelLocationUpdated', (data) => {
            console.log('Socket event received:', data);
            if (data.parcelId === id) {
                console.log('Updating location:', data.location);
                setCurrentLocation(data.location);
            }
        });

        return () => socket.close();
    }, [id]);

    const simulateTracking = async () => {
        setIsTracking(true);
        // Simulate movement from pickup to delivery (simplified)
        // In a real app, this would come from the agent's device GPS
        let lat = 40.7128; // Example start
        let lng = -74.0060;

        // Initial update
        try {
            const initialLocation = { lat, lng };
            console.log('Sending initial location:', initialLocation);
            await updateLocation({ id, location: initialLocation }).unwrap();
            setCurrentLocation(initialLocation);
        } catch (err) {
            console.error('Failed to update location:', err);
        }

        const interval = setInterval(async () => {
            lat += 0.001;
            lng += 0.001;
            const newLocation = { lat, lng };
            console.log('Sending location update:', newLocation);
            try {
                await updateLocation({ id, location: newLocation }).unwrap();
                setCurrentLocation(newLocation);
            } catch (err) {
                console.error('Failed to update location:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    };

    if (!parcel) return <Loading />;

    const isAgent = user.role === 'agent';

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Parcel Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                    {!currentLocation && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                        Waiting for location updates...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <MapComponent
                        location={currentLocation}
                        destination={parcel.deliveryAddress}
                        pickup={parcel.pickupAddress}
                        isAgent={isAgent}
                    />
                </div>
                <div className="space-y-4">
                    <div className="bg-card text-card-foreground p-4 rounded-lg shadow border">
                        <h3 className="font-semibold mb-2">Details</h3>
                        <p><strong>Status:</strong> {parcel.status}</p>
                        <p><strong>Pickup:</strong> {parcel.pickupAddress}</p>
                        <p><strong>Delivery:</strong> {parcel.deliveryAddress}</p>
                        <p className="text-xs text-muted-foreground mt-2">ID: {parcel._id}</p>
                    </div>

                    {isAgent && (
                        <Button onClick={simulateTracking} disabled={isTracking}>
                            {isTracking ? 'Tracking Active...' : 'Start Delivery Tracking'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParcelDetailsPage;
