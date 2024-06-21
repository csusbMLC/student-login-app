export const timeStamp = () => {
  return Number(Date.now());
};

export const elapsedTime = (start, end) => {
  const totalSeconds = (end - start) / 1000;
  return totalSeconds;
};
