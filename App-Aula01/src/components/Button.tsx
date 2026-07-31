// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}: ButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  primary: {
    backgroundColor: colors.white,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '700',
  },
  textOutline: {
    color: colors.white,
  },
});