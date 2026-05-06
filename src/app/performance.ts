import Performance from 'react-native-performance';

// Initialize performance monitoring
// Note: react-native-performance doesn't require explicit initialization in most cases
// It automatically starts measuring when imported

/**
 * Measure the time taken to execute a function
 * @param name - Name of the measurement
 * @param fn - Function to execute and measure
 * @returns Promise that resolves with the result of the function
 */
export const measureAsync = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = Date.now();
  try {
    const result = await fn();
    const end = Date.now();
    Performance.mark(`${name}:end`, { startTime: end });
    Performance.measure(name, `${name}:start`, `${name}:end`);
    return result;
  } catch (error) {
    const end = Date.now();
    Performance.mark(`${name}:error`, { startTime: end });
    throw error;
  }
};

/**
 * Mark a point in time for performance measurement
 * @param name - Name of the mark
 */
export const mark = (name: string) => {
  Performance.mark(name);
};

/**
 * Measure the time between two marks
 * @param name - Name of the measure
 * @param startMark - Name of the start mark
 * @param endMark - Name of the end mark
 */
export const measure = (name: string, startMark: string, endMark: string) => {
  Performance.measure(name, startMark, endMark);
};

/**
 * Get all performance entries
 * @returns Array of performance entries
 */
export const getEntries = () => {
  return Performance.getEntriesByType('measure');
};

/**
 * Clear all performance entries
 */
export const clearEntries = () => {
  Performance.clearMeasures();
};

export default {
  measureAsync,
  mark,
  measure,
  getEntries,
  clearEntries
};