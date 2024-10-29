import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Load Leaflet CSS for styling
import L from 'leaflet';
import { useRouter } from 'next/router';

// Helper function to calculate the distance between two coordinates
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const lat1 = coords1[0];
    const lon1 = coords1[1];
    const lat2 = coords2[0];
    const lon2 = coords2[1];

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const LokasiMerchant = ({ getMylocation, zoom, merchants, DataOrder, setDataOrder }) => {
    const router = useRouter();
    const [myLocation, setMyLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLocation = () => {
            if (typeof window !== 'undefined' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;

                        setMyLocation([latitude, longitude]);
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        fetchLocation();

        // Set up an interval to fetch location every 10 seconds
        const intervalId = setInterval(fetchLocation, 10000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (myLocation && getMylocation) {
            getMylocation(myLocation);
        }
    }, [myLocation]);

    const handleSubmit = async (merchantId) => {
        try {
            setLoading(true);

            if (!myLocation) {
                console.error('User location is not available');
                setLoading(false);
                return;
            }

            const updatedDataOrder = {
                ...DataOrder,
                myLocation: {
                    latitude: myLocation[0],
                    longitude: myLocation[1],
                },
                merchantId,
            };

            await setDataOrder(updatedDataOrder);

            router.push("/beneficiaries/order-merchant?step=2");
        } catch (error) {
            console.error('Error updating DataOrder:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!myLocation) return null; // Wait until the user's location is obtained

    return (
        <div style={{ height: '200px', width: '100%', maxWidth: '500px', margin: 'auto' }}>
            <MapContainer center={myLocation} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {myLocation && (
                    <Marker
                        position={myLocation}
                        icon={L.icon({
                            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            tooltipAnchor: [16, -28],
                            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                            shadowSize: [41, 41],
                        })}
                    >
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
                {merchants.map((merchant) => {
                    const lat = parseFloat(merchant.latitude);
                    const lng = parseFloat(merchant.longitude);

                    if (isNaN(lat) || isNaN(lng)) {
                        return null; // Skip this merchant if coordinates are invalid
                    }

                    const distance = haversineDistance(myLocation, [lat, lng]);

                    return (
                        <Marker
                            key={merchant.id}
                            position={[lat, lng]}
                            icon={L.icon({
                                iconUrl: "/icon/merchantLocation.png",
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                tooltipAnchor: [16, -28],
                                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                                shadowSize: [41, 41],
                            })}
                        >
                            <Popup>
                                <div >
                                    {merchant.merchant_name}<br />
                                    Distance: {distance.toFixed(2)} km
                                </div>
                                <button className="btn btn-sm bg-primary w-full items-center rounded-lg hover:bg-blue-500 hover:font-bold" onClick={() => handleSubmit(merchant.id)}>Pilih</button>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LokasiMerchant;
