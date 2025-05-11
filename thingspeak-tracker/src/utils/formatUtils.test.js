import { formatETA } from './formatUtils';

// Test cases for formatETA function
describe('formatETA', () => {
  test('should return "Unknown" for null, undefined, or empty values', () => {
    expect(formatETA(null)).toBe('Unknown');
    expect(formatETA(undefined)).toBe('Unknown');
    expect(formatETA('')).toBe('Unknown');
    expect(formatETA('invalid')).toBe('Unknown');
  });

  test('should return minutes for values <= 60', () => {
    expect(formatETA('30')).toBe('30 min');
    expect(formatETA(45)).toBe('45 min');
    expect(formatETA('60')).toBe('60 min');
  });

  test('should convert to hours and minutes for values > 60', () => {
    expect(formatETA('90')).toBe('1 hr 30 min');
    expect(formatETA(120)).toBe('2 hr');
    expect(formatETA('150')).toBe('2 hr 30 min');
    expect(formatETA(180)).toBe('3 hr');
    expect(formatETA('195')).toBe('3 hr 15 min');
  });
});
