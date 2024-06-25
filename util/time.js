/**
 * Returns the current timestamp.
 * @returns {number} The current timestamp.
 */
export const timeStamp = () => {
  return Number(Date.now());
};

/**
 * Calculates the elapsed time in seconds between two timestamps.
 * @param {number} start - The starting timestamp.
 * @param {number} end - The ending timestamp.
 * @returns {number} The elapsed time in seconds.
 */
export const elapsedTime = (start, end) => {
  const totalSeconds = (end - start) / 1000;
  return totalSeconds;
};
