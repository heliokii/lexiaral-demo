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
  blue: '#8065CE',
  purple: '#9C83EB',
  darkPurple: '#7056BE',
  background: '#F2EEFD',
  text: '#343546',
  muted: '#77748B',
  green: '#249C77',
  mint: '#D7F2E9',
  paleGreen: '#E2F6EB',
  pink: '#FADBE5',
  yellow: '#FFF0C8',
  orange: '#956322',
  paleOrange: '#FFF0D7',
  border: '#E7E0F3',
};

const NAV_ROUTES = ['Home', 'Levels', 'Progress', 'Badges', 'Review', 'About'];

const tabs = [
  { route: 'Home', label: 'Home', icon: 'home' },
  { route: 'Review', label: 'Learn', icon: 'cards' },
  { route: 'Levels', label: 'Play', icon: 'book' },
  { route: 'Progress', label: 'Progress', icon: 'chart' },
  { route: 'Badges', label: 'Badges', icon: 'badge' },
];

function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();

  const active =
    route.name === 'About'
      ? 'Home'
      : route.name;

  const openTab = (destination) => {
    if (destination === route.name) return;

    // Keep a predictable stack instead of accumulating tab screens.
    navigation.reset({
      index: destination === 'Home' ? 0 : 1,
      routes:
        destination === 'Home'
          ? [{ name: 'Home' }]
          : [{ name: 'Home' }, { name: destination }],
    });
  };

  return (
    <View style={styles.navigation}>
      {tabs.map((tab) => {
        const selected = active === tab.route;

        return (
          <Pressable
            key={tab.route}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => openTab(tab.route)}
            style={styles.tab}
          >
            <Icon
              name={tab.icon}
              color={selected ? colors.blue : '#ABA9B8'}
              size={24}
            />

            <Text
              style={[
                styles.tabLabel,
                selected && { color: colors.blue },
              ]}
            >
              {tab.label}
            </Text>

            {selected && <View style={styles.tabDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Layout used by all screens.
 * Assessment screens intentionally omit the bottom tabs.
 */
export function Screen({ children, scrollRef }) {
  const { busy, error } = useLearning();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const hasTabs = NAV_ROUTES.includes(route.name);
  const hasNativeHeader = ['Activity', 'Results'].includes(route.name);

  return (
    <View style={styles.screen}>
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
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: hasNativeHeader ? 16 : insets.top + 12,
            paddingBottom: 26,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {CONTENT.status === 'demo' && (
          <View style={styles.demoPill}>
            <Text style={styles.demoText}>DEMO · Not yet ARAL-verified</Text>
          </View>
        )}

        {busy && (
          <Text accessibilityLiveRegion="polite" style={styles.saving}>
            Saving your progress…
          </Text>
        )}

        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}

        {children}
      </ScrollView>

      {hasTabs ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: Math.max(insets.bottom, 10),
            paddingTop: 6,
          }}
        >
          <BottomNavigation />
        </View>
      ) : (
        <View style={{ height: insets.bottom }} />
      )}
    </View>
  );
}

export function Title({ children, style }) {
  return (
    <Text accessibilityRole="header" style={[styles.title, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...props }) {
  return (
    <Text style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
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
}) {
  const background =
    secondary
      ? 'rgba(255,255,255,.9)'
      : tone === 'mint'
        ? '#4CCFA1'
        : colors.purple;

  return (
    <Pressable
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
          opacity: 0.85,
          transform: [{ scale: 0.985 }],
        },
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          color={secondary ? colors.blue : 'white'}
          size={25}
        />
      )}

      <Text
        style={[
          styles.buttonText,
          secondary && { color: colors.blue },
        ]}
      >
        {title}
      </Text>

      {arrow && (
        <Icon
          name="arrow"
          color={secondary ? colors.blue : 'white'}
          size={20}
        />
      )}
    </Pressable>
  );
}

export function ProgressBar({ value, label, color = colors.purple }) {
  const safeValue = Math.max(0, Math.min(1, value));

  return (
    <View
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

export function Encouragement() {
  return (
    <Text style={styles.encouragement}>
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
  navigation: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,.91)',
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#807098',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 12,
    elevation: 3,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: 'Nunito_700Bold',
    color: '#8D8A9B',
    fontSize: 11,
  },
  tabDot: {
    height: 4,
    width: 4,
    backgroundColor: colors.blue,
    borderRadius: 2,
  },
  encouragement: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#9B85C6',
    fontSize: 18,
    textAlign: 'center',
    transform: [{ rotate: '-5deg' }],
    paddingVertical: 12,
  },
});