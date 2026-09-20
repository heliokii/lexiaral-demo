import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Art, Icon } from "../Art";
import { AnimatedLexi } from "../components/AnimatedLexi";
import { useLearning } from "../state/LearningProvider";
import {
  Body,
  Card,
  Encouragement,
  Screen,
  Title,
  colors,
} from "../components/ui";
import { CONTENT } from "../content";

export function HomeTile({ title, icon, backgroundColor, onPress }) {
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

  const defaultSubtitle = state.pupilName
    ? "I’m Lexi. Ready to learn?"
    : "Ready to learn?";  
  const [lexiSpeechText, setLexiSpeechText] = useState(defaultSubtitle);

  useEffect(() => {
    setLexiSpeechText(defaultSubtitle);
  }, [state.pupilName]);

  return (
    <Screen testID="screen-home">
      <View testID="home-brand-row" style={styles.brandRow}>
        <View style={{ gap: 1 }}>
          <Text testID="home-brand-title" style={styles.smallBrand}>
            LEXIARAL
          </Text>
        </View>

        <Pressable
          testID="home-learner-chip"
          accessibilityRole="button"
          accessibilityLabel="Learner profile: tap to edit"
          onPress={() => navigation.navigate("Welcome")}
          style={styles.learnerChip}
        >
          <Icon name="medal" size={14} color={colors.primary} />
          <Text testID="home-learner-name" style={styles.learnerChipText}>
            {state.pupilName ? state.pupilName : "Set Pupil"}
          </Text>
        </Pressable>
      </View>

      <View
        testID="home-hero-card"
        style={[styles.hero, stacked && styles.heroStacked]}
      >
        <View style={{ width: stacked ? "50%" : "44%", alignItems: "center", justifyContent: "center" }}>
          <AnimatedLexi
            name={
              state.lifetimeStars >= 9
                ? "owl_excited"
                : state.lifetimeStars >= 3
                  ? "owl_happy"
                  : "owl-reading"
            }
            height={stacked ? 125 : 140}
            pupilName={state.pupilName}
            onSpeak={(spokenText) => setLexiSpeechText(spokenText)}
          />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Title
            testID="home-hero-title"
            style={[styles.heroTitle, stacked && styles.center]}
          >
            {state.pupilName ? `Hi, ${state.pupilName}!` : "Hi, I’m Lexi!"}
          </Title>

          <Body
            testID="home-hero-subtitle"
            style={[
              styles.heroText,
              stacked && styles.center,
              lexiSpeechText !== defaultSubtitle && {
                color: colors.darkPurple,
                fontFamily: "Nunito_700Bold",
              },
            ]}
          >
            {lexiSpeechText}
          </Body>
        </View>
      </View>

      <View testID="home-main-actions" style={styles.mainActionRow}>
        <Pressable
          testID="home-learn-card"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Learn: Word Flashcards"
          onPress={() => navigation.navigate("Review")}
          style={({ pressed }) => [
            styles.mainActionCard,
            styles.learnCard,
            pressed && { opacity: 0.88 },
          ]}
        >
          <View style={styles.mainActionIconWrap}>
            <Icon name="cards" size={30} color="#7548C7" />
          </View>
          <View style={{ gap: 2, alignItems: "center" }}>
            <Text style={styles.mainActionTitle}>LEARN</Text>
          </View>
          <View style={styles.actionPillLearn}>
            <Text style={styles.actionPillTextLearn}>Study {CONTENT.words?.length || 50} Words</Text>
          </View>
        </Pressable>

        <Pressable
          testID="home-play-card"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Play: 3 Learning Levels"
          onPress={() => navigation.navigate("Levels")}
          style={({ pressed }) => [
            styles.mainActionCard,
            styles.playCard,
            pressed && { opacity: 0.88 },
          ]}
        >
          <View style={styles.mainActionIconWrapPlay}>
            <Icon name="book" size={30} color="#24865E" />
          </View>
          <View style={{ gap: 2, alignItems: "center" }}>
            <Text style={styles.mainActionTitle}>PLAY</Text>
          </View>
          <View style={styles.actionPillPlay}>
            <Text style={styles.actionPillTextPlay}>3 Levels Game</Text>
          </View>
        </Pressable>
      </View>

      <Card testID="home-stats-card" style={styles.statsCard}>
        <Pressable
          testID="home-stats-stars"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`You have ${state.lifetimeStars} stars. Tap to view learning progress.`}
          onPress={() => navigation.navigate("Progress")}
          style={({ pressed }) => [
            styles.statItem,
            pressed && styles.statItemPressed,
          ]}
        >
          <View style={styles.statIconBadgeStar}>
            <Icon name="star" color="#D98A09" size={28} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{state.lifetimeStars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
            <Text style={styles.statActionHint}>Tap to view</Text>
          </View>
        </Pressable>

        <View style={styles.statDivider} />

        <Pressable
          testID="home-stats-badges"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`You have ${state.badges.length} badges. Tap to view badge collection.`}
          onPress={() => navigation.navigate("Badges")}
          style={({ pressed }) => [
            styles.statItem,
            pressed && styles.statItemPressed,
          ]}
        >
          <View style={styles.statIconBadgeTrophy}>
            <Icon name="badge" color="#C73E58" size={28} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{state.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
            <Text style={styles.statActionHint}>Tap to view</Text>
          </View>
        </Pressable>
      </Card>

      <Encouragement testID="home-encouragement" />

      <Pressable
        testID="home-about-btn"
        accessible
        accessibilityRole="button"
        accessibilityLabel="About LEXIARAL information"
        onPress={() => navigation.navigate("About")}
        style={({ pressed }) => [
          styles.aboutBtn,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        ]}
      >
        <Icon name="info" size={16} color="#7E68A6" />
        <Text style={styles.aboutBtnText}>About LEXIARAL</Text>
        <Icon name="arrow" size={13} color="#9C89BF" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallBrand: {
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    letterSpacing: 1.1,
    color: "#9783C1",
  },
  learnerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2D5F5",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  learnerChipText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: colors.primary,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  heroStacked: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroText: {
    fontSize: 16,
    lineHeight: 22,
  },
  mainActionRow: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 4,
  },
  mainActionCard: {
    flex: 1,
    minHeight: 138,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  learnCard: {
    backgroundColor: "#FAF7FF",
    borderColor: "#D4C2F8",
  },
  playCard: {
    backgroundColor: "#F2FCF7",
    borderColor: "#BAEAD4",
  },
  mainActionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAE1FC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  mainActionIconWrapPlay: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#D7F5E7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  mainActionTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 20,
    letterSpacing: 0.5,
    color: colors.text,
  },
  mainActionSub: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: colors.muted,
  },
  actionPillLearn: {
    backgroundColor: "#EDE5FD",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D9C8FA",
  },
  actionPillTextLearn: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    color: "#6536BC",
  },
  actionPillPlay: {
    backgroundColor: "#DEFAEC",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#B0ECCB",
  },
  actionPillTextPlay: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    color: "#1B734E",
  },
  homeTile: {
    flex: 1,
    minHeight: 145,
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#9C80A6",
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tileTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    textAlign: "center",
    color: colors.text,
  },
  tileArrow: {
    position: "absolute",
    right: 9,
    bottom: 21,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#DECFFC",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginVertical: 2,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 14,
  },
  statItemPressed: {
    backgroundColor: "rgba(108, 71, 199, 0.08)",
    transform: [{ scale: 0.97 }],
  },
  statIconBadgeStar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF7DB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE299",
  },
  statIconBadgeTrophy: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF0F3",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFC2D1",
  },
  statContent: {
    alignItems: "flex-start",
  },
  statNumber: {
    fontFamily: "Nunito_900Black",
    fontSize: 26,
    lineHeight: 30,
    color: colors.text,
  },
  statLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: colors.text,
  },
  statActionHint: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11.5,
    color: "#8E7BAE",
    marginTop: 1,
  },
  statDivider: {
    height: 52,
    width: 1.5,
    backgroundColor: "#EAE3F1",
    marginHorizontal: 4,
  },
  aboutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#DECFFC",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginTop: 22,
    marginBottom: 16,
  },
  aboutBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#6B5299",
  },
});

export default HomeScreen;
