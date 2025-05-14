import React from 'react';
import { formatDistance } from '../utils/locationUtils';

/**
 * Component to display data from ThingSpeak for multiple locators
 * @param {Object} props - Component props
 * @param {Array} props.locators - Array of locator data objects to display
 * @param {Object} props.userLocation - User's current location (optional)
 */
const DataDisplay = ({ locators, userLocation }) => {
  // Ensure locators is an array and filter out any null/undefined values
  const locatorsArray = Array.isArray(locators) ? locators.filter(Boolean) : [];

  // Log the locators for debugging
  console.log('DataDisplay locators:', locatorsArray);

  if (locatorsArray.length === 0) {
    return <div className="data-display">Loading data...</div>;
  }

  return (
    <div className="data-display">
      <h2>Tracking Data</h2>

      {locatorsArray.map((locator, index) => (
        <div key={locator.id || index} className="locator-section">
          <h3 className="locator-title">{locator.name || `Locator ${index + 1}`}</h3>
          <div className="data-grid">
            <div className="data-item">
              <h4>Location</h4>
              <p>Latitude: {locator.latitude !== undefined && locator.latitude !== null ? locator.latitude : 'N/A'}</p>
              <p>Longitude: {locator.longitude !== undefined && locator.longitude !== null ? locator.longitude : 'N/A'}</p>
            </div>
            <div className="data-item">
              <h4>Speed</h4>
              <p>{locator.speed !== undefined && locator.speed !== null ? `${locator.speed} km/h` : 'N/A'}</p>
            </div>
            <div className="data-item">
              <h4>ETA</h4>
              <p>{locator.eta || 'N/A'}</p>
            </div>
            <div className="data-item">
              <h4>Last Updated</h4>
              <p>{locator.lastUpdate ? new Date(locator.lastUpdate).toLocaleString() : 'N/A'}</p>
            </div>
            {userLocation && locator.distance !== undefined && (
              <div className="data-item">
                <h4>Distance from You</h4>
                <p>{formatDistance(locator.distance)}</p>
              </div>
            )}
            {userLocation && locator.calculatedEta !== undefined && (
              <div className="data-item">
                <h4>Calculated ETA</h4>
                <p>{locator.calculatedEta}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataDisplay;
