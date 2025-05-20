import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataDisplay from '../components/DataDisplay';
import ThingSpeakService from '../services/ThingSpeakService';
import { formatETA } from '../utils/formatUtils';
import { getCurrentLocation, calculateDistance, calculateETA, formatDistance } from '../utils/locationUtils';

/**
 * Page component for Locator 1
 */
const Locator1Page = () => {
  const [data, setData] = useState(null);
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

    // Set up interval to refresh user location every 60 seconds
    const locationIntervalId = setInterval(getLocation, 60000);

    return () => clearInterval(locationIntervalId);
  }, []);

  useEffect(() => {
    // Function to fetch data from ThingSpeak
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data for locator 1 (from channel 2957345)
        const locator1Data = await ThingSpeakService.fetchChannelData('locator1', 1);

        // Process locator 1 data
        if (locator1Data && locator1Data.feeds && locator1Data.feeds.length > 0) {
          const latestFeed1 = locator1Data.feeds[0];

          // Parse the data from the feed for first GPS locator
          // Note: In ThingSpeak, fields are numbered starting from 1
          const lat1 = parseFloat(latestFeed1.field1);
          const lon1 = parseFloat(latestFeed1.field2);
          const speed1 = parseFloat(latestFeed1.field3);

          // Create base data object
          const parsedData1 = {
            id: 'locator1',
            name: 'Locator 1',
            latitude: isNaN(lat1) ? null : lat1, // field1 has latitude
            longitude: isNaN(lon1) ? null : lon1, // field2 has longitude
            speed: isNaN(speed1) ? null : speed1, // field3 has speed
            eta: formatETA(latestFeed1.field4), // field4 has ETA (formatted from minutes)
            rawEta: latestFeed1.field4 || 'Unknown', // Store the raw ETA value
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

          // Log the raw feed data for debugging
          console.log('Raw locator 1 feed data:', latestFeed1);
          console.log('Parsed locator 1 data:', parsedData1);

          // Check if the coordinates are valid numbers
          const isValidLocator1 = parsedData1.latitude !== null && parsedData1.longitude !== null;
          console.log('Locator 1 valid:', isValidLocator1);

          setData(parsedData1);
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
  }, []);

  return (
    <div className="page-container">
      <h1>Locator 1</h1>

      <div className="content">
        {loading && !data && <p className="loading">Loading data...</p>}
        {error && <p className="error">{error}</p>}
        {locationError && <p className="error">{locationError}</p>}

        {data && (
          <>
            <Map
              locators={[
                data && {
                  id: data.id,
                  name: data.name,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  speed: data.speed,
                  eta: data.eta,
                  distance: data.distance,
                  calculatedEta: data.calculatedEta
                }
              ].filter(Boolean)}
              userLocation={userLocation}
              showFixedMarker={true}
              showUserLocation={false}
            />
            <DataDisplay
              locators={[data].filter(Boolean)}
              userLocation={userLocation}
            />
          </>
        )}
      </div>

      <div className="channel-info">
        <p>Data from ThingSpeak Channel ID: 2957345</p>
      </div>
    </div>
  );
};

export default Locator1Page;
