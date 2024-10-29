import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MarkerMap = ({ position }) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && mapRef.current && position) {
      mapRef.current.setView(position, 13);
    }
  }, [isClient, position]);

  if (!isClient) {
    return null;
  }

  // Create a custom marker icon
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="rounded-xl">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "320px", width: "320px", borderRadius: "8px" }}
        whenReady={() => {
          if (mapRef.current && position) {
            mapRef.current.setView(position, 13);
          }
        }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MarkerMap;
