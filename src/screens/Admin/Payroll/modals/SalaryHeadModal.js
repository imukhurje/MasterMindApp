import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './SalaryHeadModal.styles';

const TYPE_OPTIONS = [
  {
    value: 'earning',
    label: 'Earning',
  },
  {
    value: 'deduction',
    label: 'Deduction',
  },
];

const CALCULATION_OPTIONS = [
  {
    value: 'fixed',
    label: 'Fixed amount',
  },
  {
    value: 'percentage',
    label: 'Percentage',
  },
  {
    value: 'advance',
    label: 'Advance',
  },
];

function getOptionLabel(options, value, fallback = '-') {
  return options.find(item => item.value === value)?.label || fallback;
}

export default function SalaryHeadModal({
  visible,
  mode = 'add',
  head = null,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [code, setCode] = useState('');

  const [name, setName] = useState('');

  const [kind, setKind] = useState('earning');

  const [calculationMode, setCalculationMode] = useState('fixed');

  const [defaultValue, setDefaultValue] = useState('');

  const [openDropdown, setOpenDropdown] = useState(null);

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCode(String(head?.code || ''));

    setName(String(head?.name || ''));

    setKind(String(head?.kind || 'earning'));

    setCalculationMode(String(head?.calculation_mode || 'fixed'));

    setDefaultValue(
      String(head?.metadata?.default_value ?? head?.default_value ?? ''),
    );

    setOpenDropdown(null);
  }, [visible, head]);

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onSubmit?.({
      code: code.trim(),

      name: trimmedName,

      kind,

      calculation_mode: calculationMode,

      /*
       * These are the fields confirmed
       * by the backend request payload.
       */
      unit_label: '',

      default_rate: '',

      default_value: defaultValue.trim(),

      percentage_basis_head_ids: Array.isArray(
        head?.metadata?.percentage_basis_head_ids,
      )
        ? head.metadata.percentage_basis_head_ids
        : [],
    });
  }

  function renderDropdown({ type, value, options, onChange }) {
    const open = openDropdown === type;

    return (
      <View>
        <Pressable
          disabled={submitting}
          onPress={() => setOpenDropdown(open ? null : type)}
          style={styles.selectButton}
        >
          <Text style={styles.selectText}>
            {getOptionLabel(options, value)}
          </Text>

          <MaterialCommunityIcons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#DCE7F5"
          />
        </Pressable>

        {open && (
          <View style={styles.dropdownMenu}>
            {options.map(item => {
              const selected = item.value === value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    onChange(item.value);

                    setOpenDropdown(null);
                  }}
                  style={[
                    styles.dropdownOption,

                    selected && styles.dropdownOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,

                      selected && styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {selected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#60A5FA"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!submitting) {
          onClose?.();
        }
      }}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEdit
                ? `Edit ${head?.name || 'Salary Head'}`
                : 'Add salary head'}
            </Text>

            <Pressable
              disabled={submitting}
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.label}>Code</Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            editable={!isEdit && !submitting}
            placeholder="e.g. BONUS"
            placeholderTextColor="#718096"
            autoCapitalize="characters"
            style={[styles.input, isEdit && styles.readOnlyInput]}
          />

          <Text style={styles.label}>Name</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            editable={!submitting}
            placeholder="Salary head name"
            placeholderTextColor="#718096"
            style={styles.input}
          />

          <Text style={styles.label}>Type</Text>

          {renderDropdown({
            type: 'type',
            value: kind,
            options: TYPE_OPTIONS,
            onChange: setKind,
          })}

          <Text style={styles.label}>Calculation</Text>

          {renderDropdown({
            type: 'calculation',
            value: calculationMode,
            options: CALCULATION_OPTIONS,
            onChange: setCalculationMode,
          })}

          <Text style={styles.label}>Default value (optional)</Text>

          <TextInput
            value={defaultValue}
            onChangeText={setDefaultValue}
            editable={!submitting}
            placeholder="Value"
            placeholderTextColor="#718096"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Pressable
            disabled={submitting || !code.trim() || !name.trim()}
            onPress={handleSave}
            style={[
              styles.saveButton,

              (submitting || !code.trim() || !name.trim()) &&
                styles.disabledButton,
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons
                name="content-save-outline"
                size={18}
                color="#FFFFFF"
              />
            )}

            <Text style={styles.saveButtonText}>
              {submitting ? 'Saving...' : 'Save head'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
