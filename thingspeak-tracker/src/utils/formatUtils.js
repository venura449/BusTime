/**
 * Formats ETA value from minutes to hours and minutes when value is greater than 60
 * @param {string|number} etaMinutes - ETA value in minutes
 * @returns {string} - Formatted ETA string
 */
export const formatETA = (etaMinutes) => {
  // Handle non-numeric or invalid values
  if (etaMinutes === null || etaMinutes === undefined || etaMinutes === '' || isNaN(etaMinutes)) {
    return 'Unknown';
  }

  // Convert to number if it's a string
  const minutes = parseInt(etaMinutes, 10);
  
  // If less than or equal to 60 minutes, return as is
  if (minutes <= 60) {
    return `${minutes} min`;
  }
  
  // Convert to hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Format the output
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMinutes} min`;
  }
};
