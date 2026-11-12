// src/screens/OrgSelect.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getOrg, setOrg, apiOrg } from '../api/client';

const BG = '#0F172A',
  CARD = '#0B1220',
  TEXT = '#E2E8F0',
  MUTED = '#94A3B8',
  BORDER = '#334155',
  ACTION = '#22C55E';

const RESOLVE_PATH = '/api/org/resolve';

export default function OrgSelect() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  // যদি আগেই org সেট করা থাকে, তাহলে আর OrgSelect দেখাবে না
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const org = await getOrg();
      if (!cancelled && org?.base_url) {
        navigation?.reset?.({ index: 0, routes: [{ name: 'Login' }] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation]);

  async function onContinue() {
    const orgCode = code.trim();
    if (!orgCode) {
      Alert.alert(
        'Invalid',
        'Please provide Organization code (emxple: ABC123)',
      );
      return;
    }

    try {
      setBusy(true);

      const res = await apiOrg(RESOLVE_PATH, orgCode);

      //   let data = null;
      //   try {
      //     data = await res.json();
      //   } catch {}

      //   if (!res.ok) {
      //     throw new Error((data && data.message) || `HTTP ${res.status}`);
      //   }

      //   if (!data?.base_url)
      //     throw new Error('base_url missing from resolver response');

      if (res.length == 0) {
        Alert.alert('Invalid', 'There are no Organization set.');
        return;
      }

      await setOrg({
        code: res.code || v,
        name: res.name || 'Organization',
        logo_url: res.logo_url || null,
        base_url: res.base_url,
      });

      navigation?.reset?.({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to resolve organization');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BG,
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 22 }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 64, height: 64, marginBottom: 10 }}
        />
        <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
          Select Organization
        </Text>
        <Text style={{ color: MUTED, marginTop: 6 }}>
          Enter your organization code to continue
        </Text>
      </View>

      <View
        style={{
          backgroundColor: CARD,
          borderWidth: 1,
          borderColor: BORDER,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Text style={{ color: MUTED, marginBottom: 8 }}>Organization Code</Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="e.g. ABC123"
          placeholderTextColor="#64748B"
          style={{
            borderWidth: 1,
            borderColor: BORDER,
            borderRadius: 10,
            padding: 12,
            color: TEXT,
            backgroundColor: BG,
            marginBottom: 12,
          }}
        />

        <Pressable
          onPress={onContinue}
          disabled={busy}
          style={({ pressed }) => ({
            backgroundColor: busy ? '#1F2937' : ACTION,
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            opacity: pressed ? 0.92 : 1,
          })}
        >
          {busy ? (
            <ActivityIndicator color={BG} />
          ) : (
            <Text style={{ color: BG, fontWeight: '700' }}>Continue</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
