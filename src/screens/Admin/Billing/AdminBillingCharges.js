import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminBillingCharges.styles';

import AdminBillingStudentCharges from './AdminBillingStudentCharges';

const CHARGE_TABS = [
  {
    key: 'common',
    label: 'Common Charges',
  },
  {
    key: 'student',
    label: 'Per Student Charges',
  },
];

const CYCLE_OPTIONS = [
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Annual',
    value: 'annual',
  },
];

const ANNUAL_MONTH_OPTIONS = [
  {
    label: '—',
    value: null,
  },
  {
    label: 'January',
    value: 1,
  },
  {
    label: 'February',
    value: 2,
  },
  {
    label: 'March',
    value: 3,
  },
  {
    label: 'April',
    value: 4,
  },
  {
    label: 'May',
    value: 5,
  },
  {
    label: 'June',
    value: 6,
  },
  {
    label: 'July',
    value: 7,
  },
  {
    label: 'August',
    value: 8,
  },
  {
    label: 'September',
    value: 9,
  },
  {
    label: 'October',
    value: 10,
  },
  {
    label: 'November',
    value: 11,
  },
  {
    label: 'December',
    value: 12,
  },
];

const APPLIES_TO_OPTIONS = [
  {
    label: 'All students',
    value: 'all',
  },
  {
    label: 'Specific classes',
    value: 'classes',
  },
];

const ACTIVE_OPTIONS = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

function formatMoney(value) {
  const amount = Number(value || 0);

  return `₹${amount.toFixed(2)}`;
}

function formatCycle(value) {
  const cycle = String(value || '')
    .trim()
    .toLowerCase();

  if (!cycle) {
    return '—';
  }

  return cycle.charAt(0).toUpperCase() + cycle.slice(1);
}

function formatClass(item) {
  const directLabel = String(item?.label || '').trim();

  if (directLabel) {
    return directLabel;
  }

  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  if (!name) {
    return '';
  }

  return section ? `${name} (${section})` : name;
}

export default function AdminBillingCharges({ classGroups = [] }) {
  const [activeChargeTab, setActiveChargeTab] = useState('common');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [charges, setCharges] = useState([]);

  const [addChargeModalVisible, setAddChargeModalVisible] = useState(false);

  const [chargeName, setChargeName] = useState('');

  const [chargeAmount, setChargeAmount] = useState('');

  const [chargeCycle, setChargeCycle] = useState('monthly');

  const [annualMonth, setAnnualMonth] = useState(null);

  const [appliesTo, setAppliesTo] = useState('all');

  const [selectedClassIds, setSelectedClassIds] = useState([]);

  const [classSearch, setClassSearch] = useState('');

  const [classPickerOpen, setClassPickerOpen] = useState(false);

  const [chargeActive, setChargeActive] = useState(true);

  const [savingCharge, setSavingCharge] = useState(false);

  const [editingCharge, setEditingCharge] = useState(null);

  const [deletingChargeId, setDeletingChargeId] = useState(null);

  const loadCharges = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api('/api/billing/v2/charges');

      setCharges(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log('Billing charges load error:', error);

      Alert.alert('Charges', error?.message || 'Could not load charges.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadCharges();
  }, [loadCharges]);

  const handleAddCharge = useCallback(() => {
    setEditingCharge(null);
    setChargeName('');
    setChargeAmount('');

    setChargeCycle('monthly');
    setAnnualMonth(null);

    setAppliesTo('all');

    setSelectedClassIds([]);
    setClassSearch('');
    setClassPickerOpen(false);

    setChargeActive(true);

    setAddChargeModalVisible(true);
  }, []);

  const handleCloseAddCharge = useCallback(() => {
    if (savingCharge) {
      return;
    }

    setAddChargeModalVisible(false);

    setEditingCharge(null);

    setClassPickerOpen(false);
    setClassSearch('');
  }, [savingCharge]);

  const handleEditCharge = useCallback(item => {
    const classIds = Array.isArray(item?.class_group_ids)
      ? item.class_group_ids.map(Number).filter(Number.isFinite)
      : [];

    setEditingCharge(item);

    setChargeName(String(item?.name || ''));

    setChargeAmount(
      item?.amount !== null && item?.amount !== undefined
        ? String(item.amount)
        : '',
    );

    const cycle =
      String(item?.cycle || 'monthly')
        .trim()
        .toLowerCase() === 'annual'
        ? 'annual'
        : 'monthly';

    setChargeCycle(cycle);

    setAnnualMonth(
      cycle === 'annual' && item?.annual_month
        ? Number(item.annual_month)
        : null,
    );

    setSelectedClassIds(classIds);

    setAppliesTo(classIds.length > 0 ? 'classes' : 'all');

    setChargeActive(item?.active === true);

    setClassSearch('');
    setClassPickerOpen(false);

    setAddChargeModalVisible(true);
  }, []);

  const handleDeleteCharge = useCallback(
    item => {
      const chargeId = Number(item?.id);

      if (!Number.isFinite(chargeId)) {
        Alert.alert('Delete Charge', 'A valid charge ID is required.');

        return;
      }

      Alert.alert('Delete Charge', 'Delete this charge?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (deletingChargeId) {
              return;
            }

            try {
              setDeletingChargeId(chargeId);

              await api(
                `/api/billing/v2/charges/${encodeURIComponent(chargeId)}`,
                {
                  method: 'DELETE',
                },
              );

              await loadCharges({
                refresh: true,
              });

              Alert.alert('Charge Deleted', 'Charge deleted successfully.');
            } catch (error) {
              console.log('Delete charge error:', error);

              Alert.alert(
                'Delete Charge',
                error?.message || 'Could not delete the charge.',
              );
            } finally {
              setDeletingChargeId(null);
            }
          },
        },
      ]);
    },
    [deletingChargeId, loadCharges],
  );

  const commonCharges = useMemo(() => charges, [charges]);

  const classOptions = useMemo(() => {
    return classGroups.map(item => {
      const name = String(item?.name || '').trim();

      const section = String(item?.section || '').trim();

      return {
        id: Number(item?.id),

        label: section ? `${name} (${section})` : name,
      };
    });
  }, [classGroups]);

  const filteredClassOptions = useMemo(() => {
    const query = String(classSearch || '')
      .trim()
      .toLowerCase();

    if (!query) {
      return classOptions;
    }

    return classOptions.filter(item =>
      String(item?.label || '')
        .toLowerCase()
        .includes(query),
    );
  }, [classOptions, classSearch]);

  const selectedClasses = useMemo(() => {
    return selectedClassIds
      .map(id => classOptions.find(item => Number(item?.id) === Number(id)))
      .filter(Boolean);
  }, [selectedClassIds, classOptions]);

  const handleCycleChange = useCallback(value => {
    setChargeCycle(value);

    /*
     * Annual month is only applicable
     * when the cycle is annual.
     */
    if (value !== 'annual') {
      setAnnualMonth(null);
    }
  }, []);

  const handleAppliesToChange = useCallback(value => {
    setAppliesTo(value);

    /*
     * Class selection is not needed
     * when the charge applies to all students.
     */
    if (value === 'all') {
      setSelectedClassIds([]);
      setClassSearch('');
      setClassPickerOpen(false);
    }
  }, []);

  const toggleChargeClass = useCallback(classId => {
    const id = Number(classId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedClassIds(current => {
      if (current.includes(id)) {
        return current.filter(itemId => itemId !== id);
      }

      return [...current, id];
    });
  }, []);

  const handleSaveCharge = useCallback(async () => {
    const name = String(chargeName || '').trim();

    const amount = Number(chargeAmount);

    if (!name) {
      Alert.alert(
        editingCharge ? 'Edit Charge' : 'Add Charge',
        'Charge name is required.',
      );

      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert(
        editingCharge ? 'Edit Charge' : 'Add Charge',
        'Enter a valid amount.',
      );

      return;
    }

    if (chargeCycle === 'annual' && !annualMonth) {
      Alert.alert(
        editingCharge ? 'Edit Charge' : 'Add Charge',
        'Select an annual month.',
      );

      return;
    }

    if (appliesTo === 'classes' && selectedClassIds.length === 0) {
      Alert.alert(
        editingCharge ? 'Edit Charge' : 'Add Charge',
        'Select at least one class.',
      );

      return;
    }

    if (savingCharge) {
      return;
    }

    const editingChargeId = Number(editingCharge?.id);

    const isEditing = Number.isFinite(editingChargeId);

    try {
      setSavingCharge(true);

      const payload = {
        name,

        amount,

        cycle: chargeCycle,

        annual_month: chargeCycle === 'annual' ? Number(annualMonth) : null,

        active: chargeActive === true,

        class_group_ids:
          appliesTo === 'classes' ? selectedClassIds.map(Number) : [],
      };

      const endpoint = isEditing
        ? `/api/billing/v2/charges/${encodeURIComponent(editingChargeId)}`
        : '/api/billing/v2/charges';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await api(endpoint, {
        method,

        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error(
          isEditing
            ? 'Updated charge ID was not returned.'
            : 'Charge ID was not returned.',
        );
      }

      /*
       * Close the modal.
       */
      setAddChargeModalVisible(false);

      /*
       * Reset edit/create state.
       */
      setEditingCharge(null);

      setChargeName('');
      setChargeAmount('');

      setChargeCycle('monthly');
      setAnnualMonth(null);

      setAppliesTo('all');

      setSelectedClassIds([]);

      setClassSearch('');
      setClassPickerOpen(false);

      setChargeActive(true);

      /*
       * Refresh the charges list.
       */
      await loadCharges({
        refresh: true,
      });

      Alert.alert(
        isEditing ? 'Charge Updated' : 'Charge Created',
        isEditing
          ? 'Charge updated successfully.'
          : 'Charge created successfully.',
      );
    } catch (error) {
      console.log(
        editingCharge ? 'Update charge error:' : 'Create charge error:',
        error,
      );

      Alert.alert(
        editingCharge ? 'Edit Charge' : 'Add Charge',
        error?.message ||
          (editingCharge
            ? 'Could not update the charge.'
            : 'Could not create the charge.'),
      );
    } finally {
      setSavingCharge(false);
    }
  }, [
    editingCharge,
    chargeName,
    chargeAmount,
    chargeCycle,
    annualMonth,
    appliesTo,
    selectedClassIds,
    chargeActive,
    savingCharge,
    loadCharges,
  ]);

  const renderCharge = useCallback(
    ({ item }) => {
      const classes = Array.isArray(item?.classes) ? item.classes : [];

      const classText = classes.map(formatClass).filter(Boolean).join(', ');

      const appliesTo =
        classText ||
        (Array.isArray(item?.class_group_ids) && item.class_group_ids.length > 0
          ? `${item.class_group_ids.length} selected ${
              item.class_group_ids.length === 1 ? 'class' : 'classes'
            }`
          : 'All students');

      const cycleText = formatCycle(item?.cycle);

      const isActive = item?.active === true;

      return (
        <View style={styles.chargeCard}>
          <View style={styles.chargeMainRow}>
            <View style={styles.chargeInfo}>
              <Text style={styles.chargeName}>{item?.name || 'Charge'}</Text>

              <Text style={styles.chargeMeta}>
                {cycleText} · {appliesTo}
              </Text>
            </View>

            <View style={styles.amountBadge}>
              <Text style={styles.amountBadgeText}>
                {formatMoney(item?.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.chargeFooter}>
            <View
              style={[
                styles.statusBadge,

                isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,

                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => handleEditCharge(item)}
                style={({ pressed }) => [
                  styles.editButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={deletingChargeId === Number(item?.id)}
                onPress={() => handleDeleteCharge(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  deletingChargeId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    deletingChargeId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingChargeId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [handleEditCharge, handleDeleteCharge],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading charges...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.chargeTabs}>
        {CHARGE_TABS.map(tab => {
          const active = tab.key === activeChargeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveChargeTab(tab.key)}
              style={({ pressed }) => [
                styles.chargeTab,

                active && styles.chargeTabActive,

                pressed && styles.controlPressed,
              ]}
            >
              <Text
                style={[
                  styles.chargeTabText,

                  active && styles.chargeTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeChargeTab === 'common' ? (
        <FlatList
          data={commonCharges}
          keyExtractor={item => String(item?.id)}
          renderItem={renderCharge}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadCharges({
                  refresh: true,
                })
              }
              tintColor="#67D1F0"
            />
          }
          ListHeaderComponent={
            <>
              <View style={styles.sectionDivider} />

              <View style={styles.headerRow}>
                <Text style={styles.description}>
                  Configure recurring charges that apply to all students or
                  selected classes (amounts are GST-inclusive).
                </Text>

                <Pressable
                  onPress={handleAddCharge}
                  style={({ pressed }) => [
                    styles.addButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.addButtonText}>Add Charge</Text>
                </Pressable>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="cash-plus"
                size={38}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No common charges</Text>

              <Text style={styles.emptyText}>
                No recurring common charges have been configured.
              </Text>
            </View>
          }
        />
      ) : (
        <AdminBillingStudentCharges />
      )}

      <Modal
        visible={addChargeModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseAddCharge}
      >
        <View style={styles.chargeModalBackdrop}>
          <View style={styles.chargeModal}>
            <View style={styles.chargeModalHeader}>
              <Text style={styles.chargeModalTitle}>
                {editingCharge ? 'Edit Charge' : 'Add Charge'}
              </Text>

              <Pressable
                disabled={savingCharge}
                onPress={handleCloseAddCharge}
                style={({ pressed }) => [
                  styles.chargeModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.chargeModalContent}
            >
              <Text style={styles.chargeFieldLabel}>Charge Name</Text>

              <TextInput
                value={chargeName}
                onChangeText={setChargeName}
                placeholder="e.g., Monthly Tuition"
                placeholderTextColor="#718096"
                style={styles.chargeInput}
              />

              <Text style={styles.chargeFieldLabel}>Amount (₹)</Text>

              <TextInput
                value={chargeAmount}
                onChangeText={value =>
                  setChargeAmount(value.replace(/[^0-9.]/g, ''))
                }
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.chargeInput}
              />

              <Text style={styles.chargeFieldLabel}>Cycle</Text>

              <Dropdown
                style={styles.chargeDropdown}
                containerStyle={styles.chargeDropdownContainer}
                selectedTextStyle={styles.chargeDropdownSelectedText}
                itemTextStyle={styles.chargeDropdownItemText}
                placeholderStyle={styles.chargeDropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={CYCLE_OPTIONS}
                labelField="label"
                valueField="value"
                value={chargeCycle}
                onChange={item => handleCycleChange(item?.value)}
              />

              <Text style={styles.chargeFieldLabel}>Annual Month</Text>

              <Dropdown
                disable={chargeCycle !== 'annual'}
                style={[
                  styles.chargeDropdown,

                  chargeCycle !== 'annual' && styles.chargeFieldDisabled,
                ]}
                containerStyle={styles.chargeDropdownContainer}
                selectedTextStyle={styles.chargeDropdownSelectedText}
                itemTextStyle={styles.chargeDropdownItemText}
                placeholderStyle={styles.chargeDropdownPlaceholder}
                activeColor="#173B60"
                iconColor={chargeCycle === 'annual' ? '#DCE7F5' : '#64748B'}
                data={ANNUAL_MONTH_OPTIONS}
                labelField="label"
                valueField="value"
                value={annualMonth}
                placeholder="—"
                onChange={item => setAnnualMonth(item?.value ?? null)}
              />

              <Text style={styles.chargeFieldLabel}>Applies To</Text>

              <Dropdown
                style={styles.chargeDropdown}
                containerStyle={styles.chargeDropdownContainer}
                selectedTextStyle={styles.chargeDropdownSelectedText}
                itemTextStyle={styles.chargeDropdownItemText}
                placeholderStyle={styles.chargeDropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={APPLIES_TO_OPTIONS}
                labelField="label"
                valueField="value"
                value={appliesTo}
                onChange={item => handleAppliesToChange(item?.value)}
              />

              <Text style={styles.chargeFieldLabel}>Classes</Text>

              <Pressable
                disabled={appliesTo !== 'classes'}
                onPress={() => setClassPickerOpen(current => !current)}
                style={[
                  styles.chargeClassField,

                  appliesTo !== 'classes' && styles.chargeFieldDisabled,
                ]}
              >
                <View style={styles.chargeClassFieldContent}>
                  {selectedClasses.length > 0 ? (
                    <View style={styles.selectedChargeClasses}>
                      {selectedClasses.map(item => (
                        <View
                          key={String(item.id)}
                          style={styles.chargeClassChip}
                        >
                          <Text style={styles.chargeClassChipText}>
                            {item.label}
                          </Text>

                          <Pressable
                            hitSlop={6}
                            onPress={() => toggleChargeClass(item.id)}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              size={14}
                              color="#DCE7F5"
                            />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.chargeClassPlaceholder}>
                      {appliesTo === 'classes'
                        ? 'Search class...'
                        : 'Not required for all students'}
                    </Text>
                  )}
                </View>

                <MaterialCommunityIcons
                  name={classPickerOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={appliesTo === 'classes' ? '#AFC0D8' : '#64748B'}
                />
              </Pressable>

              {appliesTo === 'classes' && classPickerOpen ? (
                <View style={styles.chargeClassPicker}>
                  <View style={styles.chargeClassSearchBox}>
                    <MaterialCommunityIcons
                      name="magnify"
                      size={18}
                      color="#94A3B8"
                    />

                    <TextInput
                      value={classSearch}
                      onChangeText={setClassSearch}
                      placeholder="Search class..."
                      placeholderTextColor="#718096"
                      style={styles.chargeClassSearchInput}
                    />
                  </View>

                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    style={styles.chargeClassOptions}
                  >
                    {filteredClassOptions.map(item => {
                      const selected = selectedClassIds.includes(item.id);

                      return (
                        <Pressable
                          key={String(item.id)}
                          onPress={() => toggleChargeClass(item.id)}
                          style={({ pressed }) => [
                            styles.chargeClassOption,

                            selected && styles.chargeClassOptionSelected,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <Text style={styles.chargeClassOptionText}>
                            {item.label}
                          </Text>

                          {selected ? (
                            <MaterialCommunityIcons
                              name="check"
                              size={18}
                              color="#93C5FD"
                            />
                          ) : null}
                        </Pressable>
                      );
                    })}

                    {filteredClassOptions.length === 0 ? (
                      <Text style={styles.chargeClassEmpty}>
                        No classes found.
                      </Text>
                    ) : null}
                  </ScrollView>
                </View>
              ) : null}

              <Text style={styles.chargeFieldLabel}>Active</Text>

              <Dropdown
                style={styles.chargeDropdown}
                containerStyle={styles.chargeDropdownContainer}
                selectedTextStyle={styles.chargeDropdownSelectedText}
                itemTextStyle={styles.chargeDropdownItemText}
                placeholderStyle={styles.chargeDropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={ACTIVE_OPTIONS}
                labelField="label"
                valueField="value"
                value={chargeActive}
                onChange={item => setChargeActive(item?.value === true)}
              />

              <View style={styles.chargeModalActions}>
                <Pressable
                  disabled={savingCharge}
                  onPress={handleCloseAddCharge}
                  style={({ pressed }) => [
                    styles.chargeCancelButton,

                    savingCharge && styles.controlDisabled,

                    pressed && !savingCharge && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.chargeCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={savingCharge}
                  onPress={handleSaveCharge}
                  style={({ pressed }) => [
                    styles.chargeSaveButton,

                    savingCharge && styles.controlDisabled,

                    pressed && !savingCharge && styles.controlPressed,
                  ]}
                >
                  {savingCharge ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.chargeSaveText}>
                      {editingCharge ? 'Save' : 'Create'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
