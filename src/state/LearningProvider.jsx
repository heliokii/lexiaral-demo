import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CONTENT, validateContent } from '../content';
import { configureAudio, initAudio, setBgmUserVolume } from '../audio';
import { Art } from '../Art';
import {
  initialState,
  reduceState,
  validateSavedState,
} from './engine';
import { LearningContext, useLearning } from './LearningContext';

export { useLearning };

const colors = {
  primary: '#6C47C7',
  darkPurple: '#4A2F8A',
  muted: '#766D88',
};

// Isolate progress for each content revision.
const STORAGE_KEY = `LEXIARAL:progress:v1:${CONTENT.id}`;

export function LearningProvider({ children }) {
  const stateRef = useRef(null);
  const writeInProgress = useRef(false);

  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoadError('');

    try {
      validateContent();
      // Non-blocking background audio asset resolution
      initAudio().catch((err) => console.warn('[Audio] Background initAudio warning:', err));

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const restored = raw
        ? validateSavedState(JSON.parse(raw))
        : initialState();

      stateRef.current = restored;
      configureAudio(restored.audioEnabled);
      setBgmUserVolume(restored.bgmVolume);
      setState(restored);
    } catch (err) {
      setLoadError(
        err.message || 'Progress could not be loaded. Please try again.'
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dispatch = useCallback(async (action) => {
    if (!stateRef.current) return null;

    const previous = stateRef.current;
    const next = reduceState(previous, action);

    if (next === previous) return null;

    // 1. Instant optimistic state update for 0ms latency UI response
    stateRef.current = next;
    configureAudio(next.audioEnabled);
    setState(next);
    setError('');

    // 2. Asynchronous background persistence (non-blocking)
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        setError(
          'Your change was not saved. Check device storage, then tap the button again.'
        );
      }
    })();

    return next;
  }, []);

  if (!state) {
    if (loadError) {
      return (
        <View style={styles.errorContainer}>
          <Art name="owl_thinking" width={130} height={130} />

          <Text style={styles.brandTitle}>LEXIARAL</Text>

          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to Load Progress</Text>
            <Text style={styles.errorText}>{loadError}</Text>

            <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
              <Pressable
                onPress={load}
                style={styles.retryBtn}
              >
                <Text style={styles.retryBtnText}>TRY LOADING AGAIN</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                  } catch {}
                  const fresh = initialState();
                  stateRef.current = fresh;
                  configureAudio(fresh.audioEnabled);
                  setBgmUserVolume(fresh.bgmVolume);
                  setState(fresh);
                }}
                style={styles.freshBtn}
              >
                <Text style={styles.freshBtnText}>START FRESH</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.loadingContainer}>
        <Art name="owl-reading" width={160} height={176} />
        <Text style={styles.brandTitle}>LEXIARAL</Text>
        <Text style={styles.tagline}>Learn Words. Play. Grow.</Text>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  return (
    <LearningContext.Provider value={{ state, dispatch, busy, error }}>
      {children}
    </LearningContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2EEFD',
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2EEFD',
    gap: 14,
  },
  brandTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 34,
    letterSpacing: 1.5,
    color: colors.darkPurple,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
  },
  errorCard: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#DECFFC',
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#5E4399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  errorTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    textAlign: 'center',
    color: colors.darkPurple,
  },
  errorText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.muted,
  },
  retryBtn: {
    minHeight: 50,
    backgroundColor: colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  },
  freshBtn: {
    minHeight: 46,
    backgroundColor: 'rgba(255,255,255,.94)',
    borderWidth: 1,
    borderColor: '#E5DEF2',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  freshBtnText: {
    color: colors.primary,
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
  },
});