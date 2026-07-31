// src/types/index.ts

export type User = {
  name: string;
  email: string;
  password: string; // Em produção, NUNCA salve senha em texto puro. Ver README.
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

export type WeatherData = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  city: string;
  country: string;
};