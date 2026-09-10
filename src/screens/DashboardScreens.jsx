import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  CONTENT,
  LEVELS,
  QUESTIONS,
  WORDS,
  performance,
} from '../content';
import { Art, Icon } from '../Art';
import { speak } from '../audio';
import { useLearning } from '../state/LearningProvider';
import {
  BADGES,
  bestAttempt,
  latestAttempt,
} from '../state/engine';
import {
  Body,
  Button,
  Card,
  Encouragement,
  ProgressBar,
  Screen,
  Title,
  colors,
} from '../components/ui';
import { ReviewFlashcard } from '../components/learning';

export function WelcomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.welcome}>
        <Text style={styles.brand}>LEXIARAL</Text>
        <Art name="owl-reading" height={280} />
        <Title style={styles.center}>Learn Words. Play. Grow.</Title>
        <Body style={styles.center}>
          Your little word adventure starts here.
        </Body>

        <Button
          title="Let’s start!"
          icon="book"
          arrow
          onPress={() => navigation.replace('Home')}
        />
      </View>
    </Screen>
  );
}

function HomeTile({ title, icon, backgroundColor, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.homeTile,
        { backgroundColor },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Icon name={icon} size={42} />
      <Text style={styles.tileTitle}>{title}</Text>
      <View style={styles.tileArrow}>
        <Icon name="arrow" size={17} color="#81768E" />
      </View>
    </Pressable>
  );
}

export function HomeScreen({ navigation }) {
  const { state } = useLearning();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 350 || fontScale > 1.3;

  return (
    <Screen>
      <View style={styles.brandRow}>
        <Text style={styles.smallBrand}>LEXIARAL</Text>
        <Text style={styles.tagline}>Small words.{'\n'}Big dreams.</Text>
      </View>

      <View style={[styles.hero, stacked && styles.heroStacked]}>
        <View style={{ width: stacked ? '65%' : '48%' }}>
          <Art name="owl-reading" height={205} />
        </View>

        <View style={{ flex: 1, gap: 7 }}>
          <Title style={[styles.heroTitle, stacked && styles.center]}>
            Hi, I’m Lexi!
          </Title>

          <Body style={[styles.heroText, stacked && styles.center]}>
            Ready to learn new words today?
          </Body>
        </View>
      </View>

      <Button
        title="Start Learning"
        icon="book"
        arrow
        onPress={() => navigation.navigate('Levels')}
      />

      {state.session && state.session.phase !== 'done' && (
        <Button
          title="Resume my activity"
          secondary
          onPress={() => navigation.navigate('Activity')}
        />
      )}

      <View style={styles.homeTiles}>
        <HomeTile
          title={'Vocabulary\nReview'}
          icon="cards"
          backgroundColor="#FAD7E3"
          onPress={() => navigation.navigate('Review')}
        />

        <HomeTile
          title="My Progress"
          icon="chart"
          backgroundColor="#D5F2E8"
          onPress={() => navigation.navigate('Progress')}
        />
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.stat}>
          <Icon name="star" color="#F5C75F" size={29} />
          <Text style={styles.statNumber}>{state.lifetimeStars}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Icon name="badge" color="#F1A3BE" size={29} />
          <Text style={styles.statNumber}>{state.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </Card>

      <Encouragement />

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('About')}
        style={{ alignSelf: 'center', padding: 12 }}
      >
        <Text style={styles.aboutLink}>About LEXIARAL</Text>
      </Pressable>
    </Screen>
  );
}

export function ReviewScreen() {
  const { state } = useLearning();
  const words = state.encounteredWordIds.map((id) => WORDS[id]);

  return (
    <Screen>
      <Title>My Word Collection</Title>
      <Body>Turn a card. Say the word. Try it in a sentence!</Body>

      {!words.length && (
        <Card>
          <Art name="owl-reading" height={150} />
          <Body style={styles.center}>
            Play your first vocabulary activity to collect review cards.
          </Body>
        </Card>
      )}

      {words.map((word) => (
        <ReviewFlashcard key={word.id} word={word} />
      ))}
    </Screen>
  );
}

export function ProgressScreen({ navigation }) {
  const { state } = useLearning();

  return (
    <Screen>
      <Title>Look How You’re Growing!</Title>
      <Body>A little practice makes a big difference.</Body>

      <Card>
        <View style={styles.progressHero}>
          <Art name="owl-cheering" width={112} height={120} />

          <View style={{ flex: 1, gap: 7 }}>
            <Text style={styles.progressNumber}>
              {state.lifetimeStars} stars
            </Text>
            <Body style={{ fontSize: 16 }}>
              {state.learnedWordIds.length} words answered correctly
            </Body>
          </View>
        </View>

        <Body style={styles.caption}>
          A word is counted after one correct answer—not as a verified
          mastery measure.
        </Body>
      </Card>

      {LEVELS.map((level) => {
        const latest = latestAttempt(state, level.id);
        const best = bestAttempt(state, level.id);

        const active =
          state.session?.level === level.id &&
          state.session.phase !== 'done'
            ? state.session
            : null;

        const progress = active
          ? active.answers.length / QUESTIONS[level.id].length
          : latest
            ? 1
            : 0;

        return (
          <Card key={level.id}>
            <Title style={{ fontSize: 22 }}>{level.name}</Title>

            <ProgressBar
              value={progress}
              label={`${level.name} activity completion`}
              color={['#52CDA4', '#9B81E3', '#F0A0B1'][level.id - 1]}
            />

            <Body style={{ fontSize: 17 }}>
              {active
                ? `${active.answers.length}/${QUESTIONS[level.id].length} questions answered`
                : latest
                  ? 'Activity completed'
                  : state.unlocked.includes(level.id)
                    ? 'Ready to begin'
                    : 'Not unlocked yet'}
            </Body>

            <Body style={{ fontSize: 17 }}>
              Latest: {latest ? `${latest.score}/${latest.total}` : '—'}
              {'  ·  '}
              Best: {best ? `${best.score}/${best.total}` : '—'}
            </Body>
          </Card>
        );
      })}

      <Card>
        <Body>Words practiced: {state.encounteredWordIds.length}</Body>
        <Body>Questions answered: {state.answeredActivities}</Body>
        <Body>Completed activities: {state.history.length}</Body>
        <Body>Badges earned: {state.badges.length}/{BADGES.length}</Body>
      </Card>

      <Button
        title="See overall results"
        icon="chart"
        onPress={() => navigation.navigate('Final')}
      />

      <Title style={{ fontSize: 23 }}>Recent Activities</Title>

      {!state.history.length && <Body>Your results will appear here.</Body>}

      {[...state.history].reverse().slice(0, 10).map((attempt) => (
        <Card key={attempt.id}>
          <Body>
            Level {attempt.level} · {attempt.score}/{attempt.total} stars
          </Body>
          <Body style={styles.caption}>
            {new Date(attempt.completedAt).toLocaleString()}
          </Body>
          <Button
            title="View result"
            secondary
            onPress={() =>
              navigation.navigate('Results', { id: attempt.id })
            }
          />
        </Card>
      ))}
    </Screen>
  );
}

export function BadgeList() {
  const { state } = useLearning();

  return BADGES.map((badge) => {
    const earned = state.badges.includes(badge.id);

    return (
      <Card key={badge.id} style={styles.badgeRow}>
        <View style={{ opacity: earned ? 1 : 0.3 }}>
          <Art name="medal" width={78} height={86} />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Title style={{ fontSize: 20, lineHeight: 25 }}>
            {badge.title}
          </Title>
          <Body style={styles.caption}>{badge.description}</Body>
          <Text style={styles.badgeStatus}>
            {earned ? 'Badge earned!' : 'Keep learning to unlock'}
          </Text>
        </View>
      </Card>
    );
  });
}

export function BadgesScreen() {
  return (
    <Screen>
      <Title>My Little Achievements</Title>
      <Body>Every step is worth celebrating.</Body>
      <BadgeList />
    </Screen>
  );
}

function Confetti() {
  const pieces = [
    [7, 18, '#9EDCCA', -24],
    [19, 60, '#F5C1D0', 25],
    [32, 10, '#F4D477', -18],
    [49, 43, '#F6BCC9', 12],
    [65, 9, '#C4B1EF', 30],
    [81, 58, '#F3D780', -30],
    [94, 20, '#A9DBC9', 15],
    [9, 170, '#D2BEF0', 22],
    [88, 177, '#F4B9CF', -18],
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map(([left, top, color, rotation], index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top,
            width: 7,
            height: 13,
            borderRadius: 3,
            backgroundColor: color,
            transform: [{ rotate: `${rotation}deg` }],
          }}
        />
      ))}
    </View>
  );
}

export function FinalScreen({ navigation }) {
  const { state } = useLearning();
  const { width, fontScale } = useWindowDimensions();

  const attempts = LEVELS.map((level) => latestAttempt(state, level.id));
  const completed = attempts.filter(Boolean);
  const allCompleted = completed.length === 3;

  const score = completed.reduce((sum, attempt) => sum + attempt.score, 0);
  const total = completed.reduce((sum, attempt) => sum + attempt.total, 0);

  const master = state.badges.includes('vocabulary-master');
  const compact = width < 350 || fontScale > 1.3;

  return (
    <Screen>
      <View style={{ position: 'relative' }}>
        <Confetti />

        <View style={[styles.celebration, compact && styles.heroStacked]}>
          <View style={{ width: compact ? '65%' : '48%' }}>
            <Art name="owl-cheering" height={210} />
          </View>

          <View style={{ flex: 1, gap: 7 }}>
            <Title style={[styles.heroTitle, compact && styles.center]}>
              {allCompleted ? 'Amazing\nWork!' : 'Keep\nGrowing!'}
            </Title>

            <Body style={{ fontSize: 16, lineHeight: 23 }}>
              {allCompleted
                ? 'You completed all three levels!'
                : 'Your word adventure is underway.'}
            </Body>
          </View>
        </View>
      </View>

      <Card>
        {LEVELS.map((level, index) => {
          const result = attempts[index];
          const color = ['#4ECD9F', '#967CE3', '#F1A0AF'][index];

          return (
            <View key={level.id} style={styles.resultRow}>
              <Icon
                name="star"
                size={25}
                color={['#F5CA61', '#F2AEC1', '#85CDE7'][index]}
              />

              <Text style={styles.resultLabel}>{level.name}</Text>

              <View style={{ flex: 1 }}>
                <ProgressBar
                  value={result ? result.score / result.total : 0}
                  color={color}
                  label={`${level.name} score`}
                />
              </View>

              <Text style={styles.resultValue}>
                {result ? `${result.score}/${result.total}` : '—'}
              </Text>
            </View>
          );
        })}

        <Text style={styles.caption}>
          Latest completed attempt in each level.
        </Text>
      </Card>

      <Card style={{ alignItems: 'center' }}>
        <Art name={master ? 'medal' : 'owl-reading'} height={170} />

        <Title style={styles.center}>
          {master ? 'Vocabulary Master' : 'A Little More Every Day'}
        </Title>

        <Body style={{ fontSize: 16 }}>
          {master ? 'Badge earned!' : 'Finish all three levels to earn this badge.'}
        </Body>
      </Card>

      {total > 0 && (
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Title style={{ fontSize: 22 }}>{performance(score, total)}</Title>
          <Body style={{ fontSize: 17 }}>
            {allCompleted ? 'Overall score' : 'Completed-level subtotal'}:
            {' '}{score}/{total} stars
          </Body>
        </View>
      )}

      <View style={compact ? { gap: 12 } : styles.actionRow}>
        <Button
          title="Review Words"
          icon="book"
          style={compact ? undefined : { flex: 1 }}
          onPress={() => navigation.navigate('Review')}
        />
        <Button
          title="Home"
          icon="home"
          tone="mint"
          style={compact ? undefined : { flex: 1 }}
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
          }
        />
      </View>

      <Button
        title="Play again"
        secondary
        onPress={() => navigation.navigate('Levels')}
      />

      <Button
        title="Hear my feedback"
        icon="sound"
        secondary
        onPress={() =>
          speak(
            total
              ? `${performance(score, total)} You earned ${score} stars in your latest completed activities.`
              : 'Let’s start your word adventure!',
            'en-US',
            true
          )
        }
      />
    </Screen>
  );
}

export function AboutScreen() {
  const { state, dispatch, busy } = useLearning();

  return (
    <Screen>
      <Title>Meet LEXIARAL</Title>
      <Art name="owl-reading" height={175} />
      <Body style={styles.center}>Learn Words. Play. Grow.</Body>

      <Card>
        <Title style={{ fontSize: 22 }}>Learning with Lexi</Title>
        <Body>
          Practice vocabulary with pictures, sentences, and short stories.
          Learn on your own or with a teacher.
        </Body>
        <Body>
          This content pack is a demonstration. Its vocabulary and story
          have not been verified as official Grade 3 ARAL material.
        </Body>
      </Card>

      <Card>
        <Title style={{ fontSize: 22 }}>Sound</Title>
        <Body>
          Audio uses your device’s English speech voice. An offline voice
          must be installed for speech without internet.
        </Body>
        <Button
          title={state.audioEnabled ? 'Turn sound off' : 'Turn sound on'}
          icon="sound"
          disabled={busy}
          onPress={() =>
            dispatch({
              type: 'SET_AUDIO',
              enabled: !state.audioEnabled,
            })
          }
        />
      </Card>

      <Card>
        <Title style={{ fontSize: 22 }}>Your progress</Title>
        <Body>
          One learner’s progress is saved on this device. No account or
          learner name is requested. The app does not upload scores.
        </Body>
        <Body>
          Uninstalling the app or clearing its storage may remove progress.
          This version does not separate pupils on a shared device.
        </Body>
      </Card>

      <Card>
        <Title style={{ fontSize: 22 }}>For adults</Title>
        <Body>
          Teachers must review vocabulary, images, passages, pronunciation,
          and unlocking rules before pupil or research use.
        </Body>
        <Body>
          Badges celebrate completed activities; they are not validated
          measures of vocabulary mastery.
        </Body>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  welcome: {
    flex: 1,
    justifyContent: 'center',
    gap: 22,
    paddingBottom: 30,
  },
  brand: {
    fontFamily: 'Nunito_900Black',
    fontSize: 39,
    letterSpacing: 1,
    color: colors.darkPurple,
    textAlign: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallBrand: {
    fontFamily: 'Nunito_900Black',
    fontSize: 16,
    letterSpacing: 1.1,
    color: '#9783C1',
  },
  tagline: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
    color: '#AA99C5',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroStacked: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 35,
  },
  heroText: {
    fontSize: 18,
    lineHeight: 25,
  },
  homeTiles: {
    flexDirection: 'row',
    gap: 13,
  },
  homeTile: {
    flex: 1,
    minHeight: 145,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#9C80A6',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tileTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    textAlign: 'center',
    color: colors.text,
  },
  tileArrow: {
    position: 'absolute',
    right: 9,
    bottom: 21,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 8,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  statNumber: {
    fontFamily: 'Nunito_900Black',
    fontSize: 21,
    color: colors.text,
  },
  statLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: '#EAE3F1',
  },
  aboutLink: {
    fontFamily: 'Nunito_700Bold',
    color: '#8E7BAE',
    fontSize: 14,
  },
  progressHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressNumber: {
    fontFamily: 'Nunito_900Black',
    fontSize: 27,
    color: colors.darkPurple,
  },
  caption: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  badgeStatus: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#9A7BC7',
  },
  celebration: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    gap: 7,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 40,
  },
  resultLabel: {
    width: 66,
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: colors.text,
  },
  resultValue: {
    minWidth: 44,
    fontFamily: 'Nunito_900Black',
    fontSize: 17,
    textAlign: 'right',
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});