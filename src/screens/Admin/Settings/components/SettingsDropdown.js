import React, { useMemo, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import { styles } from './SettingsDropdown.styles';

export default function SettingsDropdown({ options = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find(option => option.key === value) || options[0],
    [options, value],
  );

  function handleSelect(option) {
    setOpen(false);

    onChange?.(option.key);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Settings Section</Text>

      <Pressable
        onPress={() => setOpen(previous => !previous)}
        style={({ pressed }) => [
          styles.selectButton,

          pressed && styles.buttonPressed,

          open && styles.selectButtonOpen,
        ]}
      >
        <Text style={styles.selectedText}>
          {selectedOption?.label || 'Select'}
        </Text>

        <Text style={[styles.chevron, open && styles.chevronOpen]}>▾</Text>
      </Pressable>

      {open ? (
        <View style={styles.dropdown}>
          {options.map((option, index) => {
            const selected = option.key === value;

            const isLast = index === options.length - 1;

            return (
              <Pressable
                key={option.key}
                onPress={() => handleSelect(option)}
                style={({ pressed }) => [
                  styles.option,

                  selected && styles.optionSelected,

                  !isLast && styles.optionDivider,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,

                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>

                {selected ? <Text style={styles.checkMark}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
