import { calculateDistance, calculateETA, formatDistance } from './locationUtils';

// Mock the getCurrentLocation function since it uses browser APIs
jest.mock('./locationUtils', () => {
  const originalModule = jest.requireActual('./locationUtils');
  return {
    ...originalModule,
    getCurrentLocation: jest.fn(() => Promise.resolve({ latitude: 40.7128, longitude: -74.0060 }))
  };
});

describe('calculateDistance', () => {
  test('should calculate distance between two points correctly', () => {
    // New York to Los Angeles (approximate)
    const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
    // Should be around 3935 km, but we'll allow some margin of error
    expect(distance).toBeGreaterThan(3900);
    expect(distance).toBeLessThan(4000);
  });

  test('should return null for invalid inputs', () => {
    expect(calculateDistance(null, -74.0060, 34.0522, -118.2437)).toBeNull();
    expect(calculateDistance(40.7128, null, 34.0522, -118.2437)).toBeNull();
    expect(calculateDistance(40.7128, -74.0060, null, -118.2437)).toBeNull();
    expect(calculateDistance(40.7128, -74.0060, 34.0522, null)).toBeNull();
    expect(calculateDistance(undefined, -74.0060, 34.0522, -118.2437)).toBeNull();
    expect(calculateDistance('invalid', -74.0060, 34.0522, -118.2437)).toBeNull();
  });

  test('should return 0 for same coordinates', () => {
    const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
    expect(distance).toBeCloseTo(0, 5);
  });
});

describe('calculateETA', () => {
  test('should calculate ETA correctly based on distance and speed', () => {
    // 100 km at 50 km/h should take 2 hours = 120 minutes
    expect(calculateETA(100, 50)).toBe(120);
    
    // 60 km at 60 km/h should take 1 hour = 60 minutes
    expect(calculateETA(60, 60)).toBe(60);
    
    // 10 km at 30 km/h should take 20 minutes
    expect(calculateETA(10, 30)).toBe(20);
  });

  test('should return null for invalid inputs', () => {
    expect(calculateETA(null, 50)).toBeNull();
    expect(calculateETA(100, null)).toBeNull();
    expect(calculateETA(undefined, 50)).toBeNull();
    expect(calculateETA(100, undefined)).toBeNull();
    expect(calculateETA('invalid', 50)).toBeNull();
    expect(calculateETA(100, 'invalid')).toBeNull();
    expect(calculateETA(100, 0)).toBeNull(); // Division by zero
  });
});

describe('formatDistance', () => {
  test('should format distance in kilometers correctly', () => {
    expect(formatDistance(10)).toBe('10.0 km');
    expect(formatDistance(1.5)).toBe('1.5 km');
    expect(formatDistance(100.123)).toBe('100.1 km');
  });

  test('should format distance in meters for values less than 1 km', () => {
    expect(formatDistance(0.5)).toBe('500 m');
    expect(formatDistance(0.1)).toBe('100 m');
    expect(formatDistance(0.01)).toBe('10 m');
  });

  test('should return "Unknown" for invalid inputs', () => {
    expect(formatDistance(null)).toBe('Unknown');
    expect(formatDistance(undefined)).toBe('Unknown');
    expect(formatDistance('invalid')).toBe('Unknown');
    expect(formatDistance(NaN)).toBe('Unknown');
  });
});
