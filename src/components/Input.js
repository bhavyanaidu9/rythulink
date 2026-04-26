import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const Input = ({ label, value, onChangeText, placeholder, keyboardType, prefix, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    minHeight: 56, // Large touch target
  },
  prefix: {
    fontSize: 18,
    color: colors.text,
    marginRight: 8,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: colors.text,
    height: '100%',
  },
});

export default Input;
