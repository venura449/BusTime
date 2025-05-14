import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation component for the application
 */
const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">ThingSpeak Tracker</Link>
      </div>

      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/locator1' ? 'active' : ''}>
          <Link to="/locator1">Locator 1</Link>
        </li>
        <li className={location.pathname === '/locator2' ? 'active' : ''}>
          <Link to="/locator2">Locator 2</Link>
        </li>
        <li className={location.pathname === '/current-location' ? 'active' : ''}>
          <Link to="/current-location">Your Location</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
