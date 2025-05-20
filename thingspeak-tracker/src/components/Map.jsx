import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCurrentLocation, calculateDistance, formatDistance } from '../utils/locationUtils';

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
 * @param {Object} props.userLocation - User's current location (optional)
 * @param {boolean} props.showFixedMarker - Whether to show the fixed marker (optional)
 * @param {boolean} props.showUserLocation - Whether to show the user's location marker (optional)
 */
const Map = ({ locators, userLocation, showFixedMarker, showUserLocation = true }) => {
  // State for user's current location
  const [currentLocation, setCurrentLocation] = useState(userLocation || null);

  // Ensure locators is an array
  const locatorsArray = Array.isArray(locators) ? locators : [];

  // Log the locators for debugging
  console.log('Locators received:', locatorsArray);
  console.log('User location:', currentLocation);

  // Get user's location if not provided
  useEffect(() => {
    if (!currentLocation && navigator.geolocation) {
      getCurrentLocation()
        .then(location => {
          console.log('Got user location:', location);
          setCurrentLocation(location);
        })
        .catch(error => {
          console.error('Error getting user location:', error);
        });
    }
  }, [currentLocation]);

  // Find a valid position for the map center (use the first valid locator)
  const validLocator = locatorsArray.find(loc =>
    loc && !isNaN(loc.latitude) && loc.latitude !== null && loc.latitude !== undefined &&
    !isNaN(loc.longitude) && loc.longitude !== null && loc.longitude !== undefined
  );

  // Default position if no valid coordinates are provided
  const defaultPosition = [0, 0];
  const position = validLocator ? [validLocator.latitude, validLocator.longitude] :
                  (currentLocation ? [currentLocation.latitude, currentLocation.longitude] : defaultPosition);
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

  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
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

        {/* Render user's current location marker if available and showUserLocation is true */}
        {showUserLocation && currentLocation && (
          <Marker
            key="user-location"
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={greenIcon}
          >
            <Popup>
              <div>
                <h3>Your Location</h3>
                <p>Latitude: {currentLocation.latitude}</p>
                <p>Longitude: {currentLocation.longitude}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render fixed marker if showFixedMarker is true */}
        {showFixedMarker && (
          <Marker
            key="fixed-location"
            position={[6.9717553, 79.9167633]}
            icon={orangeIcon}
          >
            <Popup>
              <div>
                <h3>Fixed Location</h3>
                <p>Latitude: 6.9717553</p>
                <p>Longitude: 79.9167633</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render locator markers */}
        {locatorsArray.map((locator, index) => {
          if (!locator) return null;

          const isValidLat = !isNaN(locator.latitude) && locator.latitude !== null && locator.latitude !== undefined;
          const isValidLng = !isNaN(locator.longitude) && locator.longitude !== null && locator.longitude !== undefined;

          if (!isValidLat || !isValidLng) return null;

          // Calculate distance from user to locator if user location is available
          let distance = null;
          if (currentLocation) {
            distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              locator.latitude,
              locator.longitude
            );
          }

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
                  {distance !== null && <p>Distance from you: {formatDistance(distance)}</p>}
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
