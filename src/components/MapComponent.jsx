import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '1rem'
};

const defaultCenter = {
    lat: 23.77,
    lng: 90.39
};

const mapOptions = {
    fullscreenControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    gestureHandling: 'greedy', // Better for mobile scrolling
};

function MapComponent({ location, destination, pickup, isAgent, onError }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);

    console.log('MapComponent render:', { location, pickup, destination, isLoaded, isAgent });

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Geocode pickup address if location is missing
    useEffect(() => {
        if (isLoaded && !location && pickup && !pickupLocation) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: pickup }, (results, status) => {
                if (status === 'OK') {
                    const latLng = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    console.log('Geocoded pickup:', latLng);
                    setPickupLocation(latLng);
                } else {
                    console.error('Geocode pickup failed: ' + status);
                    if (onError) onError('Unable to locate pickup address on map');
                }
            });
        }
    }, [isLoaded, location, pickup, pickupLocation]);

    // Geocode destination address
    useEffect(() => {
        if (isLoaded && destination && !destinationLocation) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: destination }, (results, status) => {
                if (status === 'OK') {
                    const latLng = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    setDestinationLocation(latLng);
                } else {
                    console.error('Geocode destination failed: ' + status);
                    if (onError) onError('Unable to locate delivery address on map');
                }
            });
        }
    }, [isLoaded, destination, destinationLocation]);

    // Fit bounds to include displayLocation and destinationLocation
    useEffect(() => {
        if (map && (location || pickupLocation) && destinationLocation) {
            const bounds = new window.google.maps.LatLngBounds();
            const start = location || pickupLocation;

            bounds.extend(start);
            bounds.extend(destinationLocation);

            map.fitBounds(bounds);
        } else if (map && (location || pickupLocation)) {
            map.panTo(location || pickupLocation);
        }
    }, [map, location, pickupLocation, destinationLocation]);

    useEffect(() => {
        if (isLoaded && isAgent && (location || pickupLocation) && destination) {
            const directionsService = new window.google.maps.DirectionsService();
            const origin = location || pickupLocation;

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
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
    }, [isLoaded, isAgent, location, pickupLocation, destination]);

    if (!isLoaded) return <div>Loading Map...</div>;

    const displayLocation = location || pickupLocation;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={displayLocation || defaultCenter}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {/* Show marker for current location or pickup */}
            {displayLocation && <MarkerF position={displayLocation} label={location ? "Current" : "Pickup"} />}

            {/* Show marker for destination */}
            {destinationLocation && <MarkerF position={destinationLocation} label="Dest" />}

            {/* Show directions if agent and response available */}
            {isAgent && directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
            )}
        </GoogleMap>
    );
}

export default React.memo(MapComponent);
