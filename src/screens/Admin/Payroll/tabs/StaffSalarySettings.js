import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from '../modals/DatePickerModal';

import styles from './StaffSalarySettings.styles';

const PAGE_SIZE = 8;

function getTodayIso() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return 'Select date';
  }

  const [year, month, day] = String(value).slice(0, 10).split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
}

function normalizeDate(value) {
  return value ? String(value).slice(0, 10) : '';
}

function getHeadLabel(head) {
  if (!head) {
    return 'Select salary component';
  }

  const calculation =
    head.calculation_mode === 'percentage'
      ? 'percentage'
      : head.calculation_mode === 'fixed'
      ? 'fixed'
      : head.calculation_mode || '';

  return calculation ? `${head.name} (${calculation})` : head.name;
}

function createLineFromSetting(line) {
  return {
    key: `${Date.now()}-${Math.random()}`,

    payroll_head_id:
      Number(line?.payroll_head_id) || Number(line?.payroll_head?.id) || null,

    amount:
      line?.amount !== null && line?.amount !== undefined
        ? String(line.amount)
        : '',
  };
}

function getDefaultLine(heads) {
  const basicSalary =
    heads.find(
      item =>
        item?.is_active !== false &&
        String(item?.code || '')
          .trim()
          .toUpperCase() === 'BASIC_SALARY',
    ) ||
    heads.find(
      item => item?.is_active !== false && item?.calculation_mode !== 'advance',
    );

  return {
    key: `${Date.now()}-${Math.random()}`,
    payroll_head_id: basicSalary?.id || null,
    amount: '',
  };
}

export default function StaffSalarySettings({
  staff = [],
  settings = [],
  heads = [],
  saving = false,
  onSaveSetting,
}) {
  const { width } = useWindowDimensions();

  const isWide = width >= 760;

  const normalizedStaff = useMemo(
    () => (Array.isArray(staff) ? staff : []),
    [staff],
  );

  const normalizedSettings = useMemo(
    () => (Array.isArray(settings) ? settings : []),
    [settings],
  );

  /*
   * Advance is not manually added here because
   * advance deductions come from outstanding
   * staff advances.
   */
  const selectableHeads = useMemo(
    () =>
      (Array.isArray(heads) ? heads : []).filter(
        item =>
          item?.is_active !== false && item?.calculation_mode !== 'advance',
      ),
    [heads],
  );

  const staffWithSettings = useMemo(() => {
    return new Set(normalizedSettings.map(item => Number(item?.user_id)));
  }, [normalizedSettings]);

  /*
   * Show staff without salary settings first.
   * This matches the management screen behaviour.
   */
  const orderedStaff = useMemo(() => {
    return [
      ...normalizedStaff.filter(
        item => !staffWithSettings.has(Number(item.id)),
      ),

      ...normalizedStaff.filter(item => staffWithSettings.has(Number(item.id))),
    ];
  }, [normalizedStaff, staffWithSettings]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const [isNewDraft, setIsNewDraft] = useState(false);

  const [effectiveFrom, setEffectiveFrom] = useState('');

  const [isActive, setIsActive] = useState(true);

  const [componentLines, setComponentLines] = useState([]);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [pickerLineIndex, setPickerLineIndex] = useState(null);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orderedStaff;
    }

    return orderedStaff.filter(item =>
      [item?.name, item?.email, item?.designation, item?.role]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [orderedStaff, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / PAGE_SIZE));

  const paginatedStaff = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredStaff.slice(start, start + PAGE_SIZE);
  }, [filteredStaff, page]);

  const selectedStaff = useMemo(
    () =>
      normalizedStaff.find(
        item => Number(item.id) === Number(selectedStaffId),
      ) || null,
    [normalizedStaff, selectedStaffId],
  );

  const selectedStaffSettings = useMemo(() => {
    return normalizedSettings
      .filter(item => Number(item?.user_id) === Number(selectedStaffId))
      .sort((a, b) => {
        const dateCompare = String(b?.effective_from || '').localeCompare(
          String(a?.effective_from || ''),
        );

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return Number(b?.id || 0) - Number(a?.id || 0);
      });
  }, [normalizedSettings, selectedStaffId]);

  const currentSetting = selectedStaffSettings[0] || null;

  const previousSettings = currentSetting ? selectedStaffSettings.slice(1) : [];

  useEffect(() => {
    if (selectedStaffId || orderedStaff.length === 0) {
      return;
    }

    setSelectedStaffId(orderedStaff[0].id);
  }, [orderedStaff, selectedStaffId]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (!selectedStaffId) {
      return;
    }

    setIsNewDraft(false);

    if (currentSetting) {
      setEffectiveFrom(normalizeDate(currentSetting.effective_from));

      setIsActive(currentSetting.is_active !== false);

      const lines = Array.isArray(currentSetting.lines)
        ? currentSetting.lines.map(createLineFromSetting)
        : [];

      setComponentLines(
        lines.length ? lines : [getDefaultLine(selectableHeads)],
      );

      return;
    }

    createNewDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStaffId, currentSetting?.id]);

  function createNewDraft() {
    setIsNewDraft(true);

    setEffectiveFrom(getTodayIso());

    setIsActive(true);

    setComponentLines([getDefaultLine(selectableHeads)]);
  }

  function selectStaff(id) {
    setSelectedStaffId(id);
  }

  function addComponentLine() {
    setComponentLines(current => [
      ...current,
      {
        key: `${Date.now()}-${Math.random()}`,
        payroll_head_id: null,
        amount: '',
      },
    ]);
  }

  function removeComponentLine(index) {
    setComponentLines(current => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);

      return next.length ? next : [getDefaultLine(selectableHeads)];
    });
  }

  function updateLineAmount(index, value) {
    setComponentLines(current =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              amount: value,
            }
          : item,
      ),
    );
  }

  function selectHeadForLine(headId) {
    if (pickerLineIndex === null) {
      return;
    }

    setComponentLines(current =>
      current.map((item, index) =>
        index === pickerLineIndex
          ? {
              ...item,
              payroll_head_id: Number(headId),
            }
          : item,
      ),
    );

    setPickerLineIndex(null);
  }

  async function handleSave() {
    if (saving || !selectedStaff?.id) {
      return;
    }

    if (!effectiveFrom) {
      return;
    }

    const validLines = componentLines.filter(
      line => line.payroll_head_id && String(line.amount ?? '').trim() !== '',
    );

    if (validLines.length === 0) {
      return;
    }

    const savedSetting = await onSaveSetting?.({
      userId: Number(selectedStaff.id),

      effectiveFrom,

      isActive,

      lines: validLines.map((line, index) => ({
        payroll_head_id: Number(line.payroll_head_id),

        amount: String(line.amount).trim(),

        sort_order: index,
      })),
    });

    if (savedSetting?.id) {
      setIsNewDraft(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Settings</Text>

      <Text style={styles.sectionDescription}>
        Maintain salary heads and direct staff salary settings. Advance
        deductions are calculated from outstanding staff advances only.
      </Text>

      <View style={[styles.workspace, isWide && styles.workspaceWide]}>
        {/* Employee panel */}

        <View
          style={[styles.employeePanel, isWide && styles.employeePanelWide]}
        >
          <Text style={styles.panelTitle}>Search employees</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Name, designation, or role"
            placeholderTextColor="#718096"
            style={styles.searchInput}
          />

          <View style={styles.staffList}>
            {paginatedStaff.map(item => {
              const selected = Number(item.id) === Number(selectedStaffId);

              const configured = staffWithSettings.has(Number(item.id));

              return (
                <Pressable
                  key={String(item.id)}
                  onPress={() => selectStaff(item.id)}
                  style={[
                    styles.staffCard,

                    selected && styles.staffCardSelected,
                  ]}
                >
                  <View style={styles.staffNameRow}>
                    <Text numberOfLines={1} style={styles.staffName}>
                      {item.name}
                    </Text>

                    <MaterialCommunityIcons
                      name={
                        configured
                          ? 'check-circle-outline'
                          : 'alert-circle-outline'
                      }
                      size={19}
                      color={configured ? '#34D399' : '#FBBF24'}
                    />
                  </View>

                  <Text style={styles.staffRole}>
                    {item.designation || item.role || '-'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.pagination}>
            <Pressable
              disabled={page <= 1}
              onPress={() => setPage(current => Math.max(1, current - 1))}
              style={[styles.pageButton, page <= 1 && styles.disabledButton]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={18}
                color="#DCE7F5"
              />
            </Pressable>

            <Text style={styles.pageText}>
              {page}/{totalPages}
            </Text>

            <Pressable
              disabled={page >= totalPages}
              onPress={() =>
                setPage(current => Math.min(totalPages, current + 1))
              }
              style={[
                styles.pageButton,

                page >= totalPages && styles.disabledButton,
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#DCE7F5"
              />
            </Pressable>
          </View>
        </View>

        {/* Salary setting panel */}

        <View style={styles.settingPanel}>
          <View style={styles.settingHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.panelTitle}>Direct staff salary setting</Text>

              {!!selectedStaff && (
                <Text style={styles.employeeSummary}>
                  {selectedStaff.name}
                  {selectedStaff.email ? ` (${selectedStaff.email})` : ''}
                </Text>
              )}
            </View>

            <Pressable onPress={createNewDraft} style={styles.newSettingButton}>
              <MaterialCommunityIcons name="plus" size={17} color="#F8FAFC" />

              <Text style={styles.newSettingText}>New Salary Setting</Text>
            </Pressable>
          </View>

          {(isNewDraft || !currentSetting) && (
            <View style={styles.draftNotice}>
              <MaterialCommunityIcons
                name="alert-outline"
                size={18}
                color="#FBBF24"
              />

              <Text style={styles.draftNoticeText}>
                DRAFT — add an effective date and complete at least one salary
                component before saving.
              </Text>
            </View>
          )}

          <Text style={styles.label}>Effective from</Text>

          <Pressable
            onPress={() => setCalendarVisible(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateButtonText}>
              {formatDisplayDate(effectiveFrom)}
            </Text>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={19}
              color="#DCE7F5"
            />
          </Pressable>

          <Text style={styles.helperText}>
            This is the date from which this salary setting applies to
            salary-month calculations. It is not the employee's joining date.
          </Text>

          <Pressable
            onPress={() => setIsActive(current => !current)}
            style={styles.checkboxRow}
          >
            <MaterialCommunityIcons
              name={isActive ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={21}
              color={isActive ? '#60A5FA' : '#94A3B8'}
            />

            <Text style={styles.checkboxText}>Active setting</Text>
          </Pressable>

          <View style={styles.lineList}>
            {componentLines.map((line, index) => {
              const selectedHead = selectableHeads.find(
                item => Number(item.id) === Number(line.payroll_head_id),
              );

              return (
                <View key={line.key} style={styles.componentLine}>
                  <Pressable
                    onPress={() => setPickerLineIndex(index)}
                    style={styles.headSelector}
                  >
                    <Text numberOfLines={1} style={styles.headSelectorText}>
                      {getHeadLabel(selectedHead)}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={19}
                      color="#DCE7F5"
                    />
                  </Pressable>

                  <TextInput
                    value={line.amount}
                    onChangeText={value => updateLineAmount(index, value)}
                    keyboardType="decimal-pad"
                    placeholder="Value"
                    placeholderTextColor="#718096"
                    style={styles.amountInput}
                  />

                  <Pressable
                    onPress={() => removeComponentLine(index)}
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={17}
                      color="#FCA5A5"
                    />

                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Pressable onPress={addComponentLine} style={styles.addLineButton}>
            <MaterialCommunityIcons name="plus" size={18} color="#F1F5F9" />

            <Text style={styles.addLineText}>Add component line</Text>
          </Pressable>

          <Pressable
            disabled={saving}
            onPress={handleSave}
            style={[styles.saveButton, saving && styles.disabledButton]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons
                name="content-save-outline"
                size={18}
                color="#FFFFFF"
              />
            )}

            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save setting'}
            </Text>
          </Pressable>

          {previousSettings.length > 0 && (
            <View style={styles.previousSection}>
              <Text style={styles.previousTitle}>Previous salary settings</Text>

              {previousSettings.map(item => (
                <View key={String(item.id)} style={styles.previousCard}>
                  <View style={styles.previousHeader}>
                    <Text style={styles.previousDate}>
                      Effective from {formatDisplayDate(item.effective_from)}
                    </Text>

                    <Text style={styles.previousStatus}>
                      {item.is_active === false ? 'Inactive' : 'Active'}
                    </Text>
                  </View>

                  <View style={styles.previousLines}>
                    {(Array.isArray(item.lines) ? item.lines : []).map(line => (
                      <Text
                        key={String(line.id)}
                        style={styles.previousLineText}
                      >
                        {line?.payroll_head?.name || 'Component'}: {line.amount}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <DatePickerModal
        visible={calendarVisible}
        title="Effective From"
        subtitle="Select salary setting effective date"
        selectedDate={effectiveFrom}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          if (day?.dateString) {
            setEffectiveFrom(day.dateString);
          }

          setCalendarVisible(false);
        }}
      />

      <Modal
        visible={pickerLineIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerLineIndex(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select salary component</Text>

              <Pressable
                onPress={() => setPickerLineIndex(null)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView style={styles.pickerScroll}>
              {selectableHeads.map(head => (
                <Pressable
                  key={String(head.id)}
                  onPress={() => selectHeadForLine(head.id)}
                  style={styles.pickerOption}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.pickerOptionTitle}>{head.name}</Text>

                    <Text style={styles.pickerOptionSub}>
                      {head.code} · {head.kind} · {head.calculation_mode}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#94A3B8"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
