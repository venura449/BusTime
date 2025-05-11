# ThingSpeak Tracker

A web application that fetches data from a ThingSpeak channel and displays location, speed, and ETA information.

## Features

- Displays latitude and longitude on an interactive map
- Shows speed and ETA information
- Automatically refreshes data every 30 seconds
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- Vite
- Leaflet (for maps)
- Axios (for API requests)
- ThingSpeak API

## ThingSpeak Channel Information

### Locator 1
- Channel ID: 2957345
- Read API Key: L9SQ6J9HH5MMLIHR
- Write API Key: 7KFNJ3NIP7NV47AD
- Field 1: Latitude
- Field 2: Longitude
- Field 3: Speed
- Field 4: ETA

### Locator 2
- Channel ID: 2957092
- Read API Key: I2XIVOUV8SAGEU8B
- Field 5: Latitude
- Field 6: Longitude
- Field 7: Speed
- Field 8: ETA

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd thingspeak-tracker
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Building for Production

To build the application for production, run:

```
npm run build
```

The built files will be in the `dist` directory.

## API Endpoints

The application uses the following ThingSpeak API endpoints:

### Locator 1
- Read Channel Feed: `https://api.thingspeak.com/channels/2957345/feeds.json?api_key=L9SQ6J9HH5MMLIHR&results=2`
- Read Channel Field: `https://api.thingspeak.com/channels/2957345/fields/1.json?api_key=L9SQ6J9HH5MMLIHR&results=2`
- Read Channel Status: `https://api.thingspeak.com/channels/2957345/status.json?api_key=L9SQ6J9HH5MMLIHR`
- Update Field: `https://api.thingspeak.com/update?api_key=7KFNJ3NIP7NV47AD&field1=0`

### Locator 2
- Read Channel Feed: `https://api.thingspeak.com/channels/2957092/feeds.json?api_key=I2XIVOUV8SAGEU8B&results=2`
- Read Channel Field: `https://api.thingspeak.com/channels/2957092/fields/1.json?api_key=I2XIVOUV8SAGEU8B&results=2`
- Read Channel Status: `https://api.thingspeak.com/channels/2957092/status.json?api_key=I2XIVOUV8SAGEU8B`

## License

This project is licensed under the MIT License.
