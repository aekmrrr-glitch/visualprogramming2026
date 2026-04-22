import type { WeatherResponse, DailyWeather } from '../types/weather.types';
import { mockWeatherData } from './mockData';

const API_KEY = '6ad1d850c1e547f23cd3eb3c8ce17748';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const USE_MOCK = false;

export async function fetchWeatherByCoords(lat: number, lon: number, cityName: string): Promise<WeatherResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...mockWeatherData,
      city: { ...mockWeatherData.city, name: cityName, country: 'RU' }
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=40&units=metric&appid=${API_KEY}&lang=ru`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    
    const data = await response.json();
    return transformForecastResponse(data, cityName);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchWeatherForecast(city: string): Promise<WeatherResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...mockWeatherData,
      city: { ...mockWeatherData.city, name: city, country: 'RU' }
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&cnt=40&units=metric&appid=${API_KEY}&lang=ru`
    );
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const data = await response.json();
    return transformForecastResponse(data, city);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function transformForecastResponse(apiData: any, cityName: string): WeatherResponse {
  const daysMap = new Map<string, DailyWeather>();
  const timezoneOffset = apiData.city?.timezone || 25200;

  apiData.list.forEach((forecastItem: any) => {
    const localTimestamp = forecastItem.dt + timezoneOffset;
    const forecastDate = new Date(localTimestamp * 1000);
    const dateStr = forecastDate.toDateString();
    
    if (!daysMap.has(dateStr)) {
      daysMap.set(dateStr, {
        dt: forecastItem.dt,
        temp: {
          day: forecastItem.main.temp,
          min: forecastItem.main.temp_min,
          max: forecastItem.main.temp_max,
          night: forecastItem.main.temp,
          eve: forecastItem.main.temp,
          morn: forecastItem.main.temp,
        },
        feels_like: {
          day: forecastItem.main.feels_like,
          min: forecastItem.main.temp_min,
          max: forecastItem.main.temp_max,
          night: forecastItem.main.feels_like,
          eve: forecastItem.main.feels_like,
          morn: forecastItem.main.feels_like,
        },
        pressure: forecastItem.main.pressure,
        humidity: forecastItem.main.humidity,
        weather: forecastItem.weather,
        wind_speed: forecastItem.wind.speed,
        wind_deg: forecastItem.wind.deg,
        clouds: forecastItem.clouds.all,
        pop: forecastItem.pop,
        rain: forecastItem.rain?.['3h'],
      });
    } else {
      const existingDay = daysMap.get(dateStr)!;
      existingDay.temp.min = Math.min(existingDay.temp.min, forecastItem.main.temp_min);
      existingDay.temp.max = Math.max(existingDay.temp.max, forecastItem.main.temp_max);
      
      const hour = forecastDate.getHours();
      if (hour >= 12 && hour <= 15) {
        existingDay.temp.day = forecastItem.main.temp;
        existingDay.weather = forecastItem.weather;
      }
    }
  });

  const sortedList = Array.from(daysMap.values())
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 5);

  return {
    cod: "200",
    city: {
      id: apiData.city?.id || 0,
      name: cityName,
      country: apiData.city?.country || "RU",
      timezone: apiData.city?.timezone || 0
    },
    list: sortedList
  };
}