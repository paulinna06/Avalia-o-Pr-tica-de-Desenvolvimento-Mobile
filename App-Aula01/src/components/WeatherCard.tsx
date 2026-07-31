// src/components/WeatherCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types';
import { describeWeatherCode } from '../services/weatherApi';
import { colors, radius, spacing } from '../theme/colors';

export default function WeatherCard({ weather }: { weather: WeatherData }) {
  const { label, icon } = describeWeatherCode(weather.weatherCode);

  return (
    <View style={styles.card}>
      <Text style={styles.city}>
        {weather.city}, {weather.country}
      </Text>

      <Ionicons
        name={icon as any}
        size={90}
        color={colors.white}
        style={{ marginVertical: spacing.md }}
      />

      <Text style={styles.temperature}>{weather.temperature}°C</Text>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Ionicons name="thermometer-outline" size={20} color={colors.white} />
          <Text style={styles.detailText}>Sensação: {weather.feelsLike}°C</Text>
        </View>
        <View style={styles.detailBox}>
          <Ionicons name="water-outline" size={20} color={colors.white} />
          <Text style={styles.detailText}>Umidade: {weather.humidity}%</Text>
        </View>
        <View style={styles.detailBox}>
          <Ionicons name="speedometer-outline" size={20} color={colors.white} />
          <Text style={styles.detailText}>Vento: {weather.windSpeed} km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  city: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  temperature: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '700',
  },
  label: {
    color: colors.textLight,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.sm,
  },
  detailBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    color: colors.white,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});