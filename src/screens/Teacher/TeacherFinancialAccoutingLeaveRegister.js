import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {api} from '../../api/client';
import styles from './TeacherFinancialAccoutingLeaveRegister.styles';

const BASE = '/api/plugins/financial-accounting/hr/self-service/leave';
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const displayDate = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? `${v.slice(8,10)}-${v.slice(5,7)}-${v.slice(0,4)}` : (v || '—');
const arrayItems = (res, key = 'items') => Array.isArray(res?.[key]) ? res[key] : [];
const readable = v => v === null || v === undefined || v === '' ? '—' : String(v);
const SESSIONS = [{value:'full_day', label:'Full day'}, {value:'first_half', label:'First half'}, {value:'second_half', label:'Second half'}];

function Panel({title, subtitle, children}) {
  return <View style={styles.panel}><Text style={styles.panelTitle}>{title}</Text>{!!subtitle && <Text style={styles.panelSubtitle}>{subtitle}</Text>}{children}</View>;
}
function Empty({children}) {return <Text style={styles.empty}>{children}</Text>;}
function Row({label, value}) {return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{readable(value)}</Text></View>;}

export default function TeacherFinancialAccoutingLeaveRegister() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [policyId, setPolicyId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startSession, setStartSession] = useState('full_day');
  const [endSession, setEndSession] = useState('full_day');
  const [reason, setReason] = useState('');
  const [picker, setPicker] = useState(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const results = await Promise.allSettled([
        api('/api/me'),
        api(`${BASE}/options`),
        api(`${BASE}/balances`),
        api(`${BASE}/requests`),
      ]);
      const failed = [];
      const names = ['account', 'leave policies', 'balances', 'requests'];
      results.forEach((result, index) => {
        if (result.status === 'rejected' || result.value?.ok === false) {
          failed.push(names[index]);
          const e = result.status === 'rejected' ? result.reason : result.value;
          console.log('[MY LEAVE]', names[index], {status:e?.status, message:e?.message});
          return;
        }
        const response = result.value;
        if (index === 0) setMe(response);
        if (index === 1) {
          const list = arrayItems(response, 'policies');
          setPolicies(list);
          setPolicyId(previous => list.some(p => String(p.id) === String(previous)) ? previous : null);
        }
        if (index === 2) setBalances(arrayItems(response));
        if (index === 3) setRequests(arrayItems(response));
      });
      if (failed.length) setError('Some leave information could not be loaded. Pull down to retry.');
    } catch(e) {
      console.log('[MY LEAVE] Unexpected load failure', e);
      setError('Unable to load leave information. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {load();}, [load]));
  const policy = useMemo(() => policies.find(p => String(p.id) === String(policyId)), [policies, policyId]);
  const chosenDate = picker === 'start' ? startDate : endDate;
  const onPickDate = day => {
    if (picker === 'start') {
      setStartDate(day.dateString);
      if (endDate && endDate < day.dateString) setEndDate('');
    } else if (picker === 'end') setEndDate(day.dateString);
    setPicker(null);
  };
  const canSubmit = policies.length > 0 && policyId !== null && !!startDate && !!endDate && !!reason.trim() && endDate >= startDate;
  const pendingCount = requests.filter(item => ['pending', 'submitted', 'awaiting_approval', 'in_review'].includes(String(item?.status || '').toLowerCase())).length;

  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" alwaysBounceVertical refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={['#3B82F6']} tintColor="#60A5FA" />}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>FINANCIAL ACCOUNTING</Text>
        <Text style={styles.heroTitle}>Leave self-service</Text>
        <Text style={styles.heroDescription}>Leave submissions stay scoped to your account while approvals and balance consumption continue through the same audited HR workflow.</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statText}><Text style={styles.statBold}>Requests: {requests.length}</Text>  {pendingCount} pending approvals.</Text></View>
          <View style={styles.stat}><Text style={styles.statText}><Text style={styles.statBold}>Policies: {policies.length}</Text>  {balances.length ? `${balances.length} leave balance records.` : 'No active leave balances.'}</Text></View>
        </View>
      </View>

      {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => load(true)}><Text style={styles.retry}>Retry</Text></Pressable></View>}
      {loading ? <View style={styles.loading}><ActivityIndicator size="large" color="#60A5FA"/><Text style={styles.muted}>Loading leave data...</Text></View> : <>
        <Panel title="Apply for leave" subtitle="Only policies currently available to your employee profile appear here.">
          <Text style={styles.label}>Policy</Text>
          <Pressable style={[styles.inputButton, !policies.length && styles.disabled]} disabled={!policies.length} onPress={() => setPicker('policy')}>
            <Text style={[styles.inputButtonText, !policy && styles.placeholder]}>{policy?.name || policy?.title || policy?.label || (policies.length ? 'Select leave policy' : 'No leave policies available')}</Text><MaterialCommunityIcons name="chevron-down" color="#AFC0D8" size={22}/>
          </Pressable>
          <View style={styles.twoColumns}>
            <View style={styles.column}><Text style={styles.label}>Start date</Text><Pressable style={styles.inputButton} onPress={() => setPicker('start')}><Text style={[styles.inputButtonText, !startDate && styles.placeholder]}>{startDate ? displayDate(startDate) : 'Select date'}</Text><MaterialCommunityIcons name="calendar-month" color="#AFC0D8" size={19}/></Pressable></View>
            <View style={styles.column}><Text style={styles.label}>End date</Text><Pressable style={styles.inputButton} onPress={() => setPicker('end')}><Text style={[styles.inputButtonText, !endDate && styles.placeholder]}>{endDate ? displayDate(endDate) : 'Select date'}</Text><MaterialCommunityIcons name="calendar-month" color="#AFC0D8" size={19}/></Pressable></View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}><Text style={styles.label}>Start session</Text><Pressable style={styles.inputButton} onPress={() => setPicker('startSession')}><Text style={styles.inputButtonText}>{SESSIONS.find(x=>x.value === startSession)?.label}</Text><MaterialCommunityIcons name="chevron-down" color="#AFC0D8" size={18}/></Pressable></View>
            <View style={styles.column}><Text style={styles.label}>End session</Text><Pressable style={styles.inputButton} onPress={() => setPicker('endSession')}><Text style={styles.inputButtonText}>{SESSIONS.find(x=>x.value === endSession)?.label}</Text><MaterialCommunityIcons name="chevron-down" color="#AFC0D8" size={18}/></Pressable></View>
          </View>
          <Text style={styles.label}>Reason</Text>
          <TextInput value={reason} onChangeText={setReason} style={styles.textarea} placeholder="Reason for leave" placeholderTextColor="#8194B0" multiline textAlignVertical="top"/>
          <Pressable style={[styles.button, !canSubmit && styles.disabled]} disabled={!canSubmit} onPress={() => Alert.alert('Submission unavailable', 'The leave request POST API has not been connected yet.')}><Text style={styles.buttonText}>Submit leave request</Text></Pressable>
          {!policies.length && <Text style={styles.helper}>No leave policy is currently available for your account.</Text>}
        </Panel>
        <Panel title="Balances" subtitle="Available balance is computed from policy allowance, ledger postings, approved leave, and pending reservations.">
          {!balances.length ? <Empty>No balance data available.</Empty> : balances.map((item, index) => <View key={String(item?.id ?? index)} style={styles.dataCard}>
            <Text style={styles.dataTitle}>{item?.policy_name || item?.leave_policy_name || item?.name || 'Leave balance'}</Text>
            {Object.entries(item).filter(([key, value]) => !['id', 'policy_name', 'leave_policy_name', 'name', 'metadata'].includes(key) && (typeof value === 'string' || typeof value === 'number')).map(([key, value]) => <Row key={key} label={key.replace(/_/g, ' ')} value={value}/>)}
          </View>)}
        </Panel>
        <Panel title="Request status" subtitle="Review coverage breakdown, approval trail, and final decision notes for your requests.">
          {!requests.length ? <Empty>No leave requests yet.</Empty> : requests.map((item, index) => <View key={String(item?.id ?? index)} style={styles.dataCard}>
            <Text style={styles.dataTitle}>{item?.policy_name || item?.leave_policy_name || item?.subject || `Leave request #${item?.id ?? index+1}`}</Text>
            <Row label="Status" value={item?.status}/>
            <Row label="Start" value={displayDate(item?.start_date || item?.date_from)}/>
            <Row label="End" value={displayDate(item?.end_date || item?.date_to)}/>
            {!!item?.reason && <Row label="Reason" value={item.reason}/>}
            {!!item?.decision_notes && <Row label="Decision notes" value={item.decision_notes}/>}
          </View>)}
        </Panel>
      </>}
    </ScrollView>
    <Modal visible={!!picker} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
      <View style={styles.modalBackdrop}><View style={styles.modalCard}>
        <View style={styles.modalHeader}><Text style={styles.modalTitle}>{picker === 'policy' ? 'Select policy' : picker === 'startSession' || picker === 'endSession' ? 'Select session' : 'Select date'}</Text><Pressable onPress={() => setPicker(null)}><MaterialCommunityIcons name="close" size={23} color="#E2E8F0" /></Pressable></View>
        {(picker === 'start' || picker === 'end') ? <Calendar current={chosenDate || ymd(new Date())} minDate={picker === 'end' && startDate ? startDate : undefined} onDayPress={onPickDate} markedDates={chosenDate ? {[chosenDate]:{selected:true, selectedColor:'#2563EB'}} : {}} theme={{calendarBackground:'#102844', monthTextColor:'#F8FAFC', dayTextColor:'#E2E8F0', textDisabledColor:'#64748B', todayTextColor:'#60A5FA', selectedDayTextColor:'#FFFFFF', arrowColor:'#60A5FA', textSectionTitleColor:'#AFC0D8'}}/> :
        <ScrollView style={{maxHeight:350}}>{(picker === 'policy' ? policies : SESSIONS).map((item, index) => {
          const value = picker === 'policy' ? item.id : item.value;
          const label = picker === 'policy' ? (item.name || item.title || item.label || `Policy ${item.id ?? index+1}`) : item.label;
          const selected = picker === 'policy' ? String(policyId) === String(value) : (picker === 'startSession' ? startSession : endSession) === value;
          return <Pressable key={String(value ?? index)} style={styles.option} onPress={() => {if (picker === 'policy') setPolicyId(value); else if (picker === 'startSession') setStartSession(value); else setEndSession(value); setPicker(null);}}><Text style={styles.optionText}>{label}</Text><MaterialCommunityIcons name={selected ? 'check-circle' : 'circle-outline'} size={21} color={selected ? '#60A5FA' : '#8194B0'} /></Pressable>;
        })}</ScrollView>}
      </View></View>
    </Modal>
  </View>;
}
