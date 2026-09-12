import React from 'react';
import {
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
  vocab: '"Century Gothic", "Tw Cen MT", "Apple Gothic", "Nunito_900Black", sans-serif',
  reading: '"Century Gothic", "Tw Cen MT", "Apple Gothic", "Nunito_700Bold", sans-serif',
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
  testID,
}) {
  const { busy, error } = useLearning();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const isSubScreen = !['Home', 'Welcome', 'Activity', 'Results'].includes(route.name);
  const hasNativeHeader = ['Activity', 'Results'].includes(route.name);

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

      <ScrollView
        ref={scrollRef}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: hasNativeHeader ? 14 : insets.top + 10,
            paddingBottom: bottomSlot ? 14 : 26,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isSubScreen && (
          <Pressable
            testID="screen-back-btn"
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate('Home')
            }
            style={({ pressed }) => [
              styles.screenBackPill,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Icon
              name="arrowLeft"
              size={15}
              color={colors.primary}
            />
            <Text style={styles.screenBackPillText}>Back to Home</Text>
          </Pressable>
        )}

        {CONTENT.status === 'demo' && (
          <View testID="demo-status-pill" style={styles.demoPill}>
            <Text style={styles.demoText}>DEMO · Not yet ARAL-verified</Text>
          </View>
        )}

        {busy && (
          <Text accessibilityLiveRegion="polite" style={styles.saving}>
            Saving your progress...
          </Text>
        )}

        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}

        {children}
      </ScrollView>

      {bottomSlot ? (
        <View
          testID="bottom-slot-container"
          style={[
            styles.bottomSlotWrapper,
            {
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          {bottomSlot}
        </View>
      ) : (
        <View style={{ height: Math.max(insets.bottom, 12) }} />
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

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
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
          size={18}
        />
      )}
    </Pressable>
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
  screenBackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#DECFFC',
    shadowColor: '#8C77B0',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 4,
  },
  screenBackPillText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: colors.primary,
  },
  encouragement: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#9B85C6',
    fontSize: 18,
    textAlign: 'center',
    transform: [{ rotate: '-5deg' }],
    paddingVertical: 12,
  },
  bottomSlotWrapper: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});