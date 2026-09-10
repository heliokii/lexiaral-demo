import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Art, Icon } from '../Art';
import { LEVELS, UNLOCK_PERCENT } from '../content';
import { useLearning } from '../state/LearningProvider';
import { latestAttempt } from '../state/engine';
import {
  Body,
  Button,
  Encouragement,
  Screen,
  Title,
  colors,
} from '../components/ui';

export default function LevelsScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();

  async function start(level) {
    const levelObj = LEVELS.find((l) => l.id === level);
    const next = await dispatch({
      type: 'START',
      level,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      at: new Date().toISOString(),
    });

    if (next) {
      navigation.navigate('Activity', {
        title: `${levelObj?.name || ''} Level`,
      });
    }
  }

  function requestStart(level) {
    if (state.session && state.session.phase !== 'done') {
      Alert.alert(
        'Start a new activity?',
        'Your unfinished activity will be replaced. Saved stars and completed results will stay.',
        [
          { text: 'Keep my activity', style: 'cancel' },
          { text: 'Start new', onPress: () => start(level) },
        ]
      );
      return;
    }

    start(level);
  }

  return (
    <Screen>
      <View>
        <Title>Choose Your Level</Title>
        <Body style={styles.subtitle}>
          Keep learning and build your vocabulary!
        </Body>
      </View>

      {state.session && state.session.phase !== 'done' && (
        <Button
          title="Continue my activity"
          icon="book"
          arrow
          disabled={busy}
          onPress={() => {
            const currentLevel = LEVELS.find((l) => l.id === state.session?.level);
            navigation.navigate('Activity', {
              title: `${currentLevel?.name || ''} Level`,
            });
          }}
        />
      )}

      {LEVELS.map((level) => {
        const unlocked = state.unlocked.includes(level.id);
        const result = latestAttempt(state, level.id);

        const active =
          state.session?.level === level.id &&
          state.session.phase !== 'done';

        const statusLabel = !unlocked
          ? '🔒 Locked'
          : active
            ? '📊 In Progress'
            : result
              ? '✔ Completed'
              : '✔ Unlocked';

        const statusStyle = !unlocked
          ? styles.lockedStatus
          : active
            ? styles.inProgressStatus
            : styles.unlockedStatus;

        const textColor = !unlocked
          ? '#85818D'
          : active
            ? '#D45B45'
            : '#3B9B74';

        return (
          <Pressable
            key={level.id}
            accessibilityRole="button"
            accessibilityLabel={`Level ${level.id}, ${level.name}. ${statusLabel}.`}
            accessibilityState={{ disabled: !unlocked || busy }}
            disabled={!unlocked || busy}
            onPress={() => requestStart(level.id)}
            style={({ pressed }) => [
              styles.levelCard,
              !unlocked && styles.lockedCard,
              pressed && { transform: [{ scale: 0.985 }] },
            ]}
          >
            <View style={[styles.status, statusStyle]}>
              <Text
                style={[
                  styles.statusText,
                  { color: textColor },
                ]}
              >
                {statusLabel}
              </Text>
            </View>

            <View style={[styles.owl, !unlocked && { opacity: 0.42 }]}>
              <Art
                name={
                  !unlocked
                    ? 'owl-thinking'
                    : level.id === 1
                      ? 'owl-cheering'
                      : 'owl-reading'
                }
                height={128}
              />
            </View>

            <View style={styles.levelText}>
              <Text style={styles.levelTitle}>
                Level {level.id}: {level.name}
              </Text>

              <Text style={styles.description}>{level.title}</Text>

              <View style={styles.score}>
                <Icon
                  name="star"
                  size={20}
                  color={result || unlocked ? '#F3C55C' : '#DDD7E8'}
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    result && result.total > 0 && result.score / result.total >= 0.5
                      ? '#F3C55C'
                      : '#DDD7E8'
                  }
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    result && result.total > 0 && result.score / result.total >= 0.8
                      ? '#F3C55C'
                      : '#DDD7E8'
                  }
                />
                {result && (
                  <Text style={styles.scoreText}>
                    {result.score}/{result.total} stars
                  </Text>
                )}
                {!result && unlocked && (
                  <Text style={styles.small}>Ready when you are!</Text>
                )}
                {!unlocked && (
                  <Text style={styles.small}>
                    {UNLOCK_PERCENT === 0
                      ? `Complete ${level.id === 2 ? 'Easy' : 'Average'} to unlock`
                      : `Earn ${UNLOCK_PERCENT}% in previous level`}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.chevron}>
              <Icon
                name={unlocked ? 'arrow' : 'lock'}
                size={18}
                color={unlocked ? colors.blue : '#9A95A7'}
              />
            </View>
          </Pressable>
        );
      })}

      <Encouragement />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    color: colors.muted,
  },
  levelCard: {
    minHeight: 170,
    backgroundColor: 'rgba(255,255,255,.9)',
    borderRadius: 25,
    padding: 14,
    paddingTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    shadowColor: '#8E7BA9',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  lockedCard: {
    backgroundColor: 'rgba(238,235,244,.85)',
  },
  owl: {
    width: '35%',
  },
  levelText: {
    flex: 1,
    gap: 7,
  },
  levelTitle: {
    fontFamily: 'Nunito_900Black',
    fontSize: 19,
    color: colors.darkPurple,
  },
  description: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.text,
  },
  small: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#8D7040',
  },
  status: {
    position: 'absolute',
    right: 12,
    top: 10,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  unlockedStatus: {
    backgroundColor: '#E4F6ED',
  },
  inProgressStatus: {
    backgroundColor: '#FFEAE5',
  },
  lockedStatus: {
    backgroundColor: '#E5E1EB',
  },
  statusText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#469B7D',
  },
  chevron: {
    height: 31,
    width: 27,
    borderRadius: 12,
    backgroundColor: '#EEE8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});