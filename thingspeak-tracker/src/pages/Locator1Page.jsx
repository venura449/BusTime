import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import DataDisplay from '../components/DataDisplay';
import ThingSpeakService from '../services/ThingSpeakService';
import { formatETA } from '../utils/formatUtils';

/**
 * Page component for Locator 1
 */
const Locator1Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  eta: data.eta
                }
              ].filter(Boolean)}
            />
            <DataDisplay locators={[data].filter(Boolean)} />
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
