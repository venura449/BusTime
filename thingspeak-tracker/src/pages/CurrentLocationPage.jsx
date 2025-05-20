import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataDisplay from '../components/DataDisplay';
import ThingSpeakService from '../services/ThingSpeakService';
import { formatETA } from '../utils/formatUtils';
import { getCurrentLocation, calculateDistance, calculateETA, formatDistance } from '../utils/locationUtils';

/**
 * Page component for Current Location
 * Shows user's current location and calculates distance and ETA to both locators
 */
const CurrentLocationPage = () => {
  const [locator1Data, setLocator1Data] = useState(null);
  const [locator2Data, setLocator2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Effect to get user's location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        console.log('Got user location:', location);
        setUserLocation(location);
        setLocationError(null);
      } catch (err) {
        console.error('Error getting user location:', err);
        setLocationError('Could not get your location. Please enable location services.');
      }
    };

    getLocation();

    // Set up interval to refresh user location every 30 seconds
    const locationIntervalId = setInterval(getLocation, 30000);

    return () => clearInterval(locationIntervalId);
  }, []);

  // Effect to fetch data from ThingSpeak for both locators
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data for locator 1 (from channel 2957345)
        const locator1Response = await ThingSpeakService.fetchChannelData('locator1', 1);

        // Fetch data for locator 2 (from channel 2957092)
        const locator2Response = await ThingSpeakService.fetchChannelData('locator2', 1);

        // Process locator 1 data
        if (locator1Response && locator1Response.feeds && locator1Response.feeds.length > 0) {
          const latestFeed1 = locator1Response.feeds[0];

          // Parse the data from the feed for first GPS locator
          const lat1 = parseFloat(latestFeed1.field1);
          const lon1 = parseFloat(latestFeed1.field2);
          const speed1 = parseFloat(latestFeed1.field3);

          // Create base data object for locator 1
          const parsedData1 = {
            id: 'locator1',
            name: 'Locator 1',
            latitude: isNaN(lat1) ? null : lat1,
            longitude: isNaN(lon1) ? null : lon1,
            speed: isNaN(speed1) ? null : speed1,
            eta: formatETA(latestFeed1.field4),
            rawEta: latestFeed1.field4 || 'Unknown',
            lastUpdate: latestFeed1.created_at
          };

          // Calculate distance and ETA if user location is available
          if (userLocation && parsedData1.latitude && parsedData1.longitude) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              parsedData1.latitude,
              parsedData1.longitude
            );

            parsedData1.distance = distance;

            // Calculate ETA based on current speed if available
            if (parsedData1.speed && parsedData1.speed > 0) {
              const calculatedEtaMinutes = calculateETA(distance, parsedData1.speed);
              parsedData1.calculatedEta = formatETA(calculatedEtaMinutes);
            }
          }

          setLocator1Data(parsedData1);
        }

        // Process locator 2 data
        if (locator2Response && locator2Response.feeds && locator2Response.feeds.length > 0) {
          const latestFeed2 = locator2Response.feeds[0];

          // Parse the data for second GPS locator
          const lat2 = parseFloat(latestFeed2.field5);
          const lon2 = parseFloat(latestFeed2.field6);
          const speed2 = parseFloat(latestFeed2.field7);

          // Create base data object for locator 2
          const parsedData2 = {
            id: 'locator2',
            name: 'Locator 2',
            latitude: isNaN(lat2) ? null : lat2,
            longitude: isNaN(lon2) ? null : lon2,
            speed: isNaN(speed2) ? null : speed2,
            eta: formatETA(latestFeed2.field8),
            rawEta: latestFeed2.field8 || 'Unknown',
            lastUpdate: latestFeed2.created_at
          };

          // Calculate distance and ETA if user location is available
          if (userLocation && parsedData2.latitude && parsedData2.longitude) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              parsedData2.latitude,
              parsedData2.longitude
            );

            parsedData2.distance = distance;

            // Calculate ETA based on current speed if available
            if (parsedData2.speed && parsedData2.speed > 0) {
              const calculatedEtaMinutes = calculateETA(distance, parsedData2.speed);
              parsedData2.calculatedEta = formatETA(calculatedEtaMinutes);
            }
          }

          setLocator2Data(parsedData2);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from ThingSpeak');
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userLocation]);

  // Combine locator data for display
  const locators = [];
  if (locator1Data) locators.push(locator1Data);
  if (locator2Data) locators.push(locator2Data);

  return (
    <div className="page-container">
      <h1>Your Current Location</h1>

      <div className="content">
        {loading && locators.length === 0 && <p className="loading">Loading data...</p>}
        {error && <p className="error">{error}</p>}
        {locationError && <p className="error">{locationError}</p>}

        {userLocation ? (
          <div className="location-info">
            <p className="current-location-display">
              Your current location: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            </p>
          </div>
        ) : (
          <p className="loading">Getting your location...</p>
        )}

        {locators.length > 0 && (
          <>
            <Map
              locators={locators.map(locator => ({
                id: locator.id,
                name: locator.name,
                latitude: locator.latitude,
                longitude: locator.longitude,
                speed: locator.speed,
                eta: locator.eta,
                distance: locator.distance,
                calculatedEta: locator.calculatedEta
              }))}
              userLocation={userLocation}
              showFixedMarker={false}
            />
            <DataDisplay
              locators={locators}
              userLocation={userLocation}
            />
          </>
        )}
      </div>

      <div className="channel-info">
        <p>Data from ThingSpeak Channels: 2957345 and 2957092</p>
      </div>
    </div>
  );
};

export default CurrentLocationPage;
