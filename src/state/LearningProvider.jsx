import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CONTENT, validateContent } from '../content';
import { configureAudio } from '../audio';
import {
  initialState,
  reduceState,
  validateSavedState,
} from './engine';

const LearningContext = createContext(null);

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

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const restored = raw
        ? validateSavedState(JSON.parse(raw))
        : initialState();

      stateRef.current = restored;
      configureAudio(restored.audioEnabled);
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
    if (writeInProgress.current || !stateRef.current) return null;

    const previous = stateRef.current;
    const next = reduceState(previous, action);

    if (next === previous) return null;

    writeInProgress.current = true;
    setBusy(true);
    setError('');

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      stateRef.current = next;
      configureAudio(next.audioEnabled);
      setState(next);

      return next;
    } catch {
      setError(
        'Your change was not saved. Check device storage, then tap the button again.'
      );
      return null;
    } finally {
      writeInProgress.current = false;
      setBusy(false);
    }
  }, []);

  if (!state) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 28,
          backgroundColor: '#F4F8FF',
          gap: 20,
        }}
      >
        <Text style={{ fontSize: 38, fontWeight: '900', color: '#17437B' }}>
          LEXIARAL
        </Text>

        <Text style={{ fontSize: 21 }}>Learn Words. Play. Grow.</Text>

        {loadError ? (
          <>
            <Text accessibilityRole="alert" style={{ fontSize: 18 }}>
              {loadError}
            </Text>

            <Text
              accessibilityRole="button"
              onPress={load}
              style={{
                padding: 20,
                backgroundColor: '#17437B',
                color: 'white',
                fontSize: 20,
                borderRadius: 16,
              }}
            >
              TRY LOADING AGAIN
            </Text>

            <Text
              accessibilityRole="button"
              onPress={async () => {
                await AsyncStorage.removeItem(STORAGE_KEY);
                const fresh = initialState();
                stateRef.current = fresh;
                configureAudio(fresh.audioEnabled);
                setState(fresh);
              }}
              style={{
                padding: 16,
                backgroundColor: '#EBE4FA',
                color: '#6241A4',
                fontSize: 17,
                borderRadius: 16,
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              START FRESH
            </Text>
          </>
        ) : (
          <ActivityIndicator size="large" color="#17437B" />
        )}
      </View>
    );
  }

  return (
    <LearningContext.Provider value={{ state, dispatch, busy, error }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error('useLearning must be used inside LearningProvider.');
  }

  return context;
}