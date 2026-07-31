// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import WeatherCard from '../components/WeatherCard';
import { getCurrentWeather, searchCity } from '../services/weatherApi';
import { GeoResult, WeatherData } from '../types';
import { colors, gradients, radius, spacing } from '../theme/colors';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setWeather(null);
    try {
      const cities = await searchCity(query.trim());
      if (cities.length === 0) {
        Alert.alert('Não encontrado', 'Nenhuma cidade encontrada com esse nome.');
      } else if (cities.length === 1) {
        await selectCity(cities[0]);
      } else {
        setResults(cities);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar a cidade. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  async function selectCity(city: GeoResult) {
    setLoading(true);
    setResults([]);
    try {
      const data = await getCurrentWeather(
        city.latitude,
        city.longitude,
        city.name,
        city.country
      );
      setWeather(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o clima dessa cidade.');
    } finally {
      setLoading(false);
    }
  }

  function confirmLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <LinearGradient colors={gradients.day} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.greetingSub}>Confira o clima de qualquer cidade</Text>
          </View>
          <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <Input
                icon="search-outline"
                placeholder="Buscar cidade (ex: Recife)"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
          </View>

          {loading && (
            <ActivityIndicator size="large" color={colors.white} style={{ marginTop: spacing.lg }} />
          )}

          {!loading && results.length > 0 && (
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Selecione a cidade:</Text>
              {results.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={styles.resultItem}
                  onPress={() => selectCity(city)}
                >
                  <Ionicons name="location-outline" size={18} color={colors.white} />
                  <Text style={styles.resultText}>
                    {city.name}
                    {city.admin1 ? `, ${city.admin1}` : ''} — {city.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!loading && weather && (
            <View style={{ marginTop: spacing.lg }}>
              <WeatherCard weather={weather} />
            </View>
          )}

          {!loading && !weather && results.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={64} color={colors.textLight} />
              <Text style={styles.emptyText}>
                Busque uma cidade para ver a previsão do tempo atual.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  greeting: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  greetingSub: {
    color: colors.textLight,
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.full,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  resultsBox: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  resultsTitle: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  resultText: {
    color: colors.white,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 14,
  },
});