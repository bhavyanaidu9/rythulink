import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const OTPInput = ({ length = 6, value, onChange }) => {
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleChangeText = (text, index) => {
    // Ensure numeric input
    const cleanText = text.replace(/[^0-9]/g, '');
    
    // Create new array of values
    const newValues = value.split('');
    newValues[index] = cleanText.substring(cleanText.length - 1);
    
    const newValue = newValues.join('').padEnd(index + 1, ' ');
    onChange(newValue.trim());

    // Move to next input if there's a value and we're not at the end
    if (cleanText && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => inputs.current[index] = ref}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 24,
  },
  input: {
    width: 48,
    height: 56, // Large touch targets
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

export default OTPInput;
