import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataDisplay from '../components/DataDisplay';
import ThingSpeakService from '../services/ThingSpeakService';
import { formatETA } from '../utils/formatUtils';
import { getCurrentLocation, calculateDistance, calculateETA, formatDistance } from '../utils/locationUtils';

/**
 * Page component for Locator 2
 */
const Locator2Page = () => {
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

        // Fetch data for locator 2 (from channel 2957092)
        const locator2Data = await ThingSpeakService.fetchChannelData('locator2', 1);

        // Process locator 2 data
        if (locator2Data && locator2Data.feeds && locator2Data.feeds.length > 0) {
          const latestFeed2 = locator2Data.feeds[0];

          // Parse the data for second GPS locator
          // Note: For channel 2957092, the data is in fields 5-8, not 1-4
          const lat2 = parseFloat(latestFeed2.field5);
          const lon2 = parseFloat(latestFeed2.field6);
          const speed2 = parseFloat(latestFeed2.field7);

          // Create base data object
          const parsedData2 = {
            id: 'locator2',
            name: 'Locator 2',
            latitude: isNaN(lat2) ? null : lat2, // field5 has latitude for second locator
            longitude: isNaN(lon2) ? null : lon2, // field6 has longitude for second locator
            speed: isNaN(speed2) ? null : speed2, // field7 has speed for second locator
            eta: formatETA(latestFeed2.field8), // field8 has ETA for second locator
            rawEta: latestFeed2.field8 || 'Unknown', // Store the raw ETA value
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

          // Log the raw feed data for debugging
          console.log('Raw locator 2 feed data:', latestFeed2);
          console.log('Field values:', {
            field1: latestFeed2.field1,
            field2: latestFeed2.field2,
            field3: latestFeed2.field3,
            field4: latestFeed2.field4,
            field5: latestFeed2.field5,
            field6: latestFeed2.field6,
            field7: latestFeed2.field7,
            field8: latestFeed2.field8
          });
          console.log('Parsed locator 2 data:', parsedData2);

          // Check if the coordinates are valid numbers
          const isValidLocator2 = parsedData2.latitude !== null && parsedData2.longitude !== null;
          console.log('Locator 2 valid:', isValidLocator2);

          setData(parsedData2);
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
      <h1>Locator 2</h1>

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
        <p>Data from ThingSpeak Channel ID: 2957092</p>
      </div>
    </div>
  );
};

export default Locator2Page;
