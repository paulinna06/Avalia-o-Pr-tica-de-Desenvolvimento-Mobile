// src/services/weatherApi.ts
// API utilizada: Open-Meteo (https://open-meteo.com) — gratuita e sem necessidade de API key.
import { GeoResult, WeatherData } from '../types';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Busca coordenadas de uma cidade pelo nome
export async function searchCity(cityName: string): Promise<GeoResult[]> {
  const url = `${GEO_URL}?name=${encodeURIComponent(
    cityName
  )}&count=5&language=pt&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Não foi possível buscar a cidade.');
  }

  const data = await response.json();
  return data.results ?? [];
}

// Busca o clima atual a partir de latitude/longitude
export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  cityName: string,
  country: string
): Promise<WeatherData> {
  const url =
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `weather_code,wind_speed_10m,is_day&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Não foi possível obter o clima.');
  }

  const data = await response.json();
  const current = data.current;

  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    city: cityName,
    country: country,
  };
}

// Mapeia o "weather code" do Open-Meteo para uma descrição e ícone
export function describeWeatherCode(code: number): { label: string; icon: string } {
  const map: Record<number, { label: string; icon: string }> = {
    0: { label: 'Céu limpo', icon: 'sunny' },
    1: { label: 'Predominantemente limpo', icon: 'partly-sunny' },
    2: { label: 'Parcialmente nublado', icon: 'partly-sunny' },
    3: { label: 'Nublado', icon: 'cloud' },
    45: { label: 'Neblina', icon: 'cloud' },
    48: { label: 'Neblina com geada', icon: 'cloud' },
    51: { label: 'Garoa leve', icon: 'rainy' },
    53: { label: 'Garoa moderada', icon: 'rainy' },
    55: { label: 'Garoa intensa', icon: 'rainy' },
    61: { label: 'Chuva leve', icon: 'rainy' },
    63: { label: 'Chuva moderada', icon: 'rainy' },
    65: { label: 'Chuva forte', icon: 'rainy' },
    71: { label: 'Neve leve', icon: 'snow' },
    73: { label: 'Neve moderada', icon: 'snow' },
    75: { label: 'Neve forte', icon: 'snow' },
    80: { label: 'Pancadas de chuva leves', icon: 'rainy' },
    81: { label: 'Pancadas de chuva moderadas', icon: 'rainy' },
    82: { label: 'Pancadas de chuva fortes', icon: 'rainy' },
    95: { label: 'Trovoada', icon: 'thunderstorm' },
    96: { label: 'Trovoada com granizo leve', icon: 'thunderstorm' },
    99: { label: 'Trovoada com granizo forte', icon: 'thunderstorm' },
  };

  return map[code] ?? { label: 'Condição desconhecida', icon: 'help-circle' };
}