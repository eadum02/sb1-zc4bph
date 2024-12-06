import { WeatherInfo } from '../types';

// Simulated weather data for demonstration
const weatherConditions = ['sunny', 'cloudy', 'rainy'] as const;
const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
} as const;

export const getCurrentWeather = async (): Promise<WeatherInfo> => {
  // Simulate API call with random weather
  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const randomTemp = Math.floor(Math.random() * (85 - 65) + 65);
  
  return {
    temperature: randomTemp,
    condition: randomCondition,
    icon: weatherIcons[randomCondition],
  };
};