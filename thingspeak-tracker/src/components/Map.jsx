import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

/**
 * Map component to display location data for multiple GPS locators
 * @param {Object} props - Component props
 * @param {Array} props.locators - Array of locator objects with coordinates and data
 */
const Map = ({ locators }) => {
  // Ensure locators is an array
  const locatorsArray = Array.isArray(locators) ? locators : [];

  // Log the locators for debugging
  console.log('Locators received:', locatorsArray);

  // Find a valid position for the map center (use the first valid locator)
  const validLocator = locatorsArray.find(loc =>
    loc && !isNaN(loc.latitude) && loc.latitude !== null && loc.latitude !== undefined &&
    !isNaN(loc.longitude) && loc.longitude !== null && loc.longitude !== undefined
  );

  // Default position if no valid coordinates are provided
  const defaultPosition = [0, 0];
  const position = validLocator ? [validLocator.latitude, validLocator.longitude] : defaultPosition;
  const zoom = 13;

  // Log for debugging
  console.log('Map locators:', locators);

  // Create custom marker icons for different locators
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locatorsArray.map((locator, index) => {
          if (!locator) return null;

          const isValidLat = !isNaN(locator.latitude) && locator.latitude !== null && locator.latitude !== undefined;
          const isValidLng = !isNaN(locator.longitude) && locator.longitude !== null && locator.longitude !== undefined;

          if (!isValidLat || !isValidLng) return null;

          return (
            <Marker
              key={locator.id || index}
              position={[locator.latitude, locator.longitude]}
              icon={index === 0 ? blueIcon : redIcon}
            >
              <Popup>
                <div>
                  <h3>{locator.name || `Locator ${index + 1}`}</h3>
                  <p>Latitude: {locator.latitude}</p>
                  <p>Longitude: {locator.longitude}</p>
                  {locator.speed !== undefined && locator.speed !== null && <p>Speed: {locator.speed} km/h</p>}
                  {locator.eta && <p>ETA: {locator.eta}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
