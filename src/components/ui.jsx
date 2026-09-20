import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import assets from '../assets.generated';
import { CONTENT } from '../content';
import { Icon } from '../Art';
import { playTapSfx, stopAudio } from '../audio';
import { useLearning } from '../state/LearningProvider';

export const colors = {
  primary: '#6C47C7',
  blue: '#6C47C7',
  purple: '#7E57C2',
  darkPurple: '#4A2F8A',
  background: '#F3EFFC',
  text: '#2D2738',
  muted: '#766D88',
  green: '#20A464',
  mint: '#E4F8EE',
  paleGreen: '#EAF8F1',
  pink: '#F582AE',
  yellow: '#F5A623',
  paleYellow: '#FFF7DB',
  coral: '#E85A71',
  paleCoral: '#FFF0F3',
  orange: '#E07A22',
  paleOrange: '#FFF3E8',
  border: '#E5DEF2',
  cardBg: '#FFFFFF',
};

export const fonts = {
  vocab: Platform.select({
    web: '"Century Gothic", "Tw Cen MT", "Apple Gothic", "Nunito_900Black", sans-serif',
    default: 'Nunito_900Black',
  }),
  reading: Platform.select({
    web: '"Century Gothic", "Tw Cen MT", "Apple Gothic", "Nunito_700Bold", sans-serif',
    default: 'Nunito_700Bold',
  }),
  ui: 'Nunito_800ExtraBold',
};

/**
 * Layout used by all screens.
 * Clean, distraction-free screen container without redundant bottom tabs.
 * Supports sticky bottomSlot to eliminate scroll dependency for feedback and next actions.
 */
export function Screen({
  children,
  scrollRef,
  bottomSlot,
  scrollEnabled = true,
  hideBack = false,
  onBack,
  testID,
}) {
  const { busy, error } = useLearning();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const isSubScreen = !['Home', 'Welcome', 'Activity', 'Results'].includes(route.name);
  const hasNativeHeader = ['Activity', 'Results'].includes(route.name);
  const showPersistentBack = isSubScreen && !hideBack;

  return (
    <View
      testID={testID || `screen-${route.name.toLowerCase()}`}
      style={styles.screen}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <SvgXml
          xml={assets.landscape}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
        />
      </View>

      {showPersistentBack && (
        <View
          style={[
            styles.persistentHeaderBar,
            { paddingTop: Math.max(insets.top, 8) },
          ]}
        >
          <Pressable
            testID="screen-back-btn"
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              playTapSfx();
              stopAudio();
              if (onBack) {
                onBack();
              } else {
                navigation.navigate('Home');
              }
            }}
            style={({ pressed }) => [
              styles.screenBackBtn,
              pressed && { opacity: 0.65, transform: [{ scale: 0.94 }] },
            ]}
          >
            <Icon
              name="arrowLeft"
              size={20}
              color="#8065CE"
            />
          </Pressable>
          <HeaderAudioToggle />
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: hasNativeHeader
              ? 10
              : showPersistentBack
                ? 8
                : Math.max(insets.top + 8, 14),
            paddingBottom: bottomSlot ? 16 : Math.max(insets.bottom + 20, 28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {CONTENT.status === 'demo' && (
          <View testID="demo-status-pill" style={styles.demoPill}>
            <Text style={styles.demoText}>DEMO · Not yet ARAL-verified</Text>
          </View>
        )}

        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}

        {children}
      </ScrollView>

      {bottomSlot && (
        <View
          testID="bottom-slot-container"
          style={[
            styles.bottomSlotWrapper,
            {
              paddingBottom: Math.max(insets.bottom + 8, 16),
            },
          ]}
        >
          {bottomSlot}
        </View>
      )}
    </View>
  );
}

export function Title({ children, style, testID }) {
  return (
    <Text
      testID={testID}
      accessibilityRole="header"
      style={[styles.title, style]}
    >
      {children}
    </Text>
  );
}

export function Body({ children, style, testID, ...props }) {
  return (
    <Text testID={testID} style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function Card({ children, style, testID }) {
  return (
    <View testID={testID || "ui-card"} style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
  accessibilityLabel,
  icon,
  arrow = false,
  tone = 'purple',
  style,
  testID,
}) {
  const background = secondary
    ? 'rgba(255,255,255,.94)'
    : tone === 'mint' || tone === 'green'
      ? colors.green
      : tone === 'coral'
        ? colors.coral
        : tone === 'amber'
          ? colors.yellow
          : colors.primary;

  const textColor = secondary ? colors.primary : '#FFFFFF';

  const handlePress = (e) => {
    playTapSfx();
    if (onPress) onPress(e);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background },
        secondary && styles.secondaryButton,
        style,
        disabled && { opacity: 0.45 },
        pressed && !disabled && {
          opacity: 0.88,
          transform: [{ scale: 0.985 }],
        },
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          color={secondary ? colors.primary : '#FFFFFF'}
          size={22}
        />
      )}

      <Text
        style={[
          styles.buttonText,
          { color: textColor },
        ]}
      >
        {title}
      </Text>

      {arrow && (
        <Icon
          name="arrow"
          color={secondary ? colors.primary : '#FFFFFF'}
          size={20}
        />
      )}
    </Pressable>
  );
}

export function HeaderAudioToggle() {
  const { state, dispatch, busy } = useLearning();
  if (!state) return null;
  const isMuted = !state.audioEnabled;

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={isMuted ? 'Unmute sound' : 'Mute sound'}
      disabled={busy}
      onPress={() => {
        playTapSfx();
        stopAudio();
        dispatch({ type: 'SET_AUDIO', enabled: isMuted });
      }}
      style={({ pressed }) => [
        styles.headerAudioBtn,
        isMuted && styles.headerAudioBtnMuted,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon
        name={isMuted ? 'mute' : 'sound'}
        size={20}
        color={isMuted ? '#8A7F9D' : '#7056BE'}
      />
    </Pressable>
  );
}

export function ActivityHeader({ title, onBack }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.activityHeader,
        { paddingTop: Math.max(insets.top + 6, 12) },
      ]}
    >
      <Pressable
        testID="activity-back-btn"
        accessible
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => {
          playTapSfx();
          if (onBack) onBack();
        }}
        style={({ pressed }) => [
          styles.activityBackBtn,
          pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
        ]}
      >
        <Icon name="arrowLeft" size={18} color="#8065CE" />
      </Pressable>

      <Text style={styles.activityHeaderTitle}>{title}</Text>

      <HeaderAudioToggle />
    </View>
  );
}

export function ProgressBar({ value, label, color = colors.purple, testID }) {
  const safeValue = Math.max(0, Math.min(1, value));

  return (
    <View
      testID={testID || "progress-bar"}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(safeValue * 100),
      }}
      style={styles.track}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${safeValue * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function Encouragement({ testID }) {
  return (
    <Text testID={testID || "encouragement-text"} style={styles.encouragement}>
      You can do it!
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    flexGrow: 1,
  },
  demoPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  demoText: {
    fontFamily: 'Nunito_700Bold',
    color: '#7E708D',
    fontSize: 11,
  },
  saving: {
    color: colors.blue,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  error: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: '#7D491B',
    backgroundColor: colors.paleOrange,
    padding: 14,
    borderRadius: 16,
  },
  title: {
    fontFamily: 'Nunito_900Black',
    fontSize: 28,
    lineHeight: 34,
    color: colors.darkPurple,
  },
  body: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 19,
    lineHeight: 28,
    color: colors.text,
  },
  card: {
    padding: 18,
    backgroundColor: 'rgba(255,255,255,.88)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.92)',
    gap: 12,
    shadowColor: '#8B79B1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  button: {
    minHeight: 60,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9075D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0.04,
  },
  buttonText: {
    flexShrink: 1,
    color: 'white',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    textAlign: 'center',
  },
  track: {
    height: 10,
    backgroundColor: '#E7E1F4',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  screenBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1.5,
    borderColor: '#D4C6F4',
    shadowColor: '#7E65B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  persistentHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    zIndex: 10,
  },
  encouragement: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#9B85C6',
    fontSize: 17,
    textAlign: 'center',
    transform: [{ rotate: '-4deg' }],
    paddingVertical: 4,
  },
  bottomSlotWrapper: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAE9FC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  activityBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activityHeaderTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: '#3E3B50',
    textAlign: 'center',
    flex: 1,
  },
  headerAudioBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: '#DED6F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAudioBtnMuted: {
    backgroundColor: '#F3EFF8',
    borderColor: '#DDD6E8',
  },
});