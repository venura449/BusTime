import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component with links to locator pages
 */
const HomePage = () => {
  return (
    <div className="home-page">
      <h1>ThingSpeak Tracker</h1>
      <p className="description">
        Track multiple GPS locators with data from ThingSpeak channels.
      </p>
      
      <div className="locator-links">
        <div className="locator-card">
          <h2>Locator 1</h2>
          <p>Channel ID: 2957345</p>
          <p>Displays latitude, longitude, speed, and ETA information.</p>
          <Link to="/locator1" className="view-button">View Locator 1</Link>
        </div>
        
        <div className="locator-card">
          <h2>Locator 2</h2>
          <p>Channel ID: 2957092</p>
          <p>Displays latitude, longitude, speed, and ETA information.</p>
          <Link to="/locator2" className="view-button">View Locator 2</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
