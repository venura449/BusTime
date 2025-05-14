/**
 * Utility functions for location-related operations
 */

/**
 * Get the user's current location using the browser's Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} - Promise resolving to the user's coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Handle invalid inputs
  if (
    lat1 === null || lat1 === undefined || isNaN(lat1) ||
    lon1 === null || lon1 === undefined || isNaN(lon1) ||
    lat2 === null || lat2 === undefined || isNaN(lat2) ||
    lon2 === null || lon2 === undefined || isNaN(lon2)
  ) {
    return null;
  }

  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate ETA based on distance and speed
 * @param {number} distance - Distance in kilometers
 * @param {number} speed - Speed in km/h
 * @returns {number} - ETA in minutes
 */
export const calculateETA = (distance, speed) => {
  // Handle invalid inputs
  if (
    distance === null || distance === undefined || isNaN(distance) ||
    speed === null || speed === undefined || isNaN(speed) || speed === 0
  ) {
    return null;
  }
  
  // Calculate time in hours
  const timeInHours = distance / speed;
  
  // Convert to minutes
  const timeInMinutes = Math.round(timeInHours * 60);
  
  return timeInMinutes;
};

/**
 * Format distance value to a readable string
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined || isNaN(distance)) {
    return 'Unknown';
  }
  
  // If less than 1 km, show in meters
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    return `${meters} m`;
  }
  
  // Otherwise show in kilometers with 1 decimal place
  return `${distance.toFixed(1)} km`;
};
