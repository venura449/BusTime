import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Locator1Page from './pages/Locator1Page';
import Locator2Page from './pages/Locator2Page';

/**
 * Main App component with routing
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/locator1" element={<Locator1Page />} />
            <Route path="/locator2" element={<Locator2Page />} />
          </Routes>
        </main>

        <footer>
          <p>ThingSpeak Tracker &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
