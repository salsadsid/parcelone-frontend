import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523
};

function MapComponent({ location, destination, isAgent }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        if (location) {
            bounds.extend(location);
        }
        if (destination) {
            // Geocode destination string to lat/lng if needed, or assume destination is lat/lng object
            // For simplicity, we'll assume destination is passed as coordinates for now or handle string later
            // If destination is a string address, we'd need Geocoding service.
            // For this MVP, let's assume we might need to fetch coordinates for address.
        }
        map.fitBounds(bounds);
        setMap(map);
    }, [location, destination]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    React.useEffect(() => {
        if (isLoaded && isAgent && location && destination) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: location,
                    destination: destination, // Address string works here
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirectionsResponse(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [isLoaded, isAgent, location, destination]);

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={location || defaultCenter}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {/* Show marker for current location */}
            {location && <Marker position={location} />}

            {/* Show directions if agent and response available */}
            {isAgent && directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
            )}
        </GoogleMap>
    );
}

export default React.memo(MapComponent);
