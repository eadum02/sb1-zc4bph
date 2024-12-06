export const getProgressColor = (progress: number): string => {
  if (progress >= 90) return 'bg-green-600';
  if (progress >= 50) return 'bg-blue-600';
  if (progress >= 25) return 'bg-yellow-600';
  return 'bg-red-600';
};