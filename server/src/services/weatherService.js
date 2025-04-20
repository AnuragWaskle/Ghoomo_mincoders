const axios = require('axios');
const config = require('../config/env');

// Create an axios instance for OpenWeatherMap API
const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: config.OPEN_WEATHER_MAP_API_KEY,
    units: 'metric' // Use metric units (Celsius)
  }
});

/**
 * Get current weather for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Current weather data
 */
const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await weatherClient.get('/weather', {
      params: {
        lat,
        lon
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting current weather:', error);
    throw new Error('Failed to get current weather');
  }
};

/**
 * Get weather forecast for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Number of days (max 7)
 * @returns {Promise<Object>} - Weather forecast data
 */
const getWeatherForecast = async (lat, lon, days = 5) => {
  try {
    const response = await weatherClient.get('/forecast', {
      params: {
        lat,
        lon,
        cnt: days * 8 // 8 forecasts per day (every 3 hours)
      }
    });
    
    // Process the response to get a daily forecast
    const dailyForecasts = processDailyForecasts(response.data);
    
    return {
      city: response.data.city,
      dailyForecasts
    };
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    throw new Error('Failed to get weather forecast');
  }
};

/**
 * Process 3-hour forecasts into daily forecasts
 * @param {Object} forecastData - Raw forecast data
 * @returns {Array} - Processed daily forecasts
 */
const processDailyForecasts = (forecastData) => {
  const dailyForecasts = {};
  
  // Group forecasts by day
  forecastData.list.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        date: day,
        temperatures: [],
        weatherIcons: [],
        descriptions: [],
        wind: [],
        humidity: [],
        rain: [],
        timestamps: []
      };
    }
    
    dailyForecasts[day].temperatures.push(forecast.main.temp);
    dailyForecasts[day].weatherIcons.push(forecast.weather[0].icon);
    dailyForecasts[day].descriptions.push(forecast.weather[0].description);
    dailyForecasts[day].wind.push(forecast.wind.speed);
    dailyForecasts[day].humidity.push(forecast.main.humidity);
    dailyForecasts[day].rain.push(forecast.rain ? forecast.rain['3h'] || 0 : 0);
    dailyForecasts[day].timestamps.push(date.toISOString());
  });
  
  // Calculate daily summaries
  return Object.values(dailyForecasts).map(day => {
    const mostCommonWeather = getMostCommonItem(day.descriptions);
    const mostCommonIcon = getMostCommonItem(day.weatherIcons);
    
    return {
      date: day.date,
      maxTemp: Math.max(...day.temperatures),
      minTemp: Math.min(...day.temperatures),
      avgTemp: average(day.temperatures),
      weatherDescription: mostCommonWeather,
      weatherIcon: mostCommonIcon,
      avgWind: average(day.wind),
      avgHumidity: average(day.humidity),
      totalRain: day.rain.reduce((sum, val) => sum + val, 0),
      timestamps: day.timestamps
    };
  });
};

/**
 * Calculate average of an array of numbers
 * @param {Array<number>} arr - Array of numbers
 * @returns {number} - Average value
 */
const average = (arr) => {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

/**
 * Get the most common item in an array
 * @param {Array} arr - Array of items
 * @returns {*} - Most common item
 */
const getMostCommonItem = (arr) => {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast
};