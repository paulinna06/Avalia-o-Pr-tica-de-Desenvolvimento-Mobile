// src/components/Input.tsx
import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

type InputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
};

export default function Input({ icon, isPassword, ...rest }: InputProps) {
  const [secure, setSecure] = useState(!!isPassword);

  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={colors.textLight}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={colors.textLight}
        style={styles.input}
        secureTextEntry={secure}
        autoCapitalize="none"
        {...rest}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.icon}>
          <Ionicons
            name={secure ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 52,
  },
  icon: {
    marginHorizontal: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
  },
});