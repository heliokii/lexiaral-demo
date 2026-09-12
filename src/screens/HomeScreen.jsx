import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Art, Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import {
  Body,
  Button,
  Card,
  Encouragement,
  Screen,
  Title,
  colors,
} from "../components/ui";

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

  return (
    <Screen testID="screen-home">
      <View testID="home-brand-row" style={styles.brandRow}>
        <View style={{ gap: 1 }}>
          <Text testID="home-brand-title" style={styles.smallBrand}>LEXIARAL</Text>
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

      <View testID="home-hero-card" style={[styles.hero, stacked && styles.heroStacked]}>
        <View style={{ width: stacked ? "55%" : "44%" }}>
          <Art name="owl-reading" height={stacked ? 140 : 155} />
        </View>

        <View style={{ flex: 1, gap: 5 }}>
          <Title testID="home-hero-title" style={[styles.heroTitle, stacked && styles.center]}>
            {state.pupilName ? `Hi, ${state.pupilName}!` : "Hi, I’m Lexi!"}
          </Title>

          <Body testID="home-hero-subtitle" style={[styles.heroText, stacked && styles.center]}>
            {state.pupilName
              ? "I’m Lexi. Ready to learn new words today?"
              : "Ready to learn new words today?"}
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
            <Icon name="cards" size={34} color="#7548C7" />
          </View>
          <View style={{ gap: 2, alignItems: "center" }}>
            <Text style={styles.mainActionTitle}>LEARN</Text>
            <Text style={styles.mainActionSub}>Word Flashcards</Text>
          </View>
          <View style={styles.actionPillLearn}>
            <Text style={styles.actionPillTextLearn}>Study 20 Words</Text>
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
            <Icon name="book" size={34} color="#24865E" />
          </View>
          <View style={{ gap: 2, alignItems: "center" }}>
            <Text style={styles.mainActionTitle}>PLAY</Text>
            <Text style={styles.mainActionSub}>3 Game Levels</Text>
          </View>
          <View style={styles.actionPillPlay}>
            <Text style={styles.actionPillTextPlay}>Easy · Avg · Diff</Text>
          </View>
        </Pressable>
      </View>

      {state.session && state.session.phase !== "done" && (
        <Button
          testID="home-resume-button"
          title="Resume active level"
          icon="arrow"
          secondary
          onPress={() => navigation.navigate("Activity")}
        />
      )}

      <Pressable
        testID="home-progress-tile"
        accessible
        accessibilityRole="button"
        accessibilityLabel="My Progress Dashboard"
        onPress={() => navigation.navigate("Progress")}
        style={({ pressed }) => [
          styles.progressTile,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Icon name="chart" size={26} color="#458971" />
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={styles.progressTileTitle}>My Learning Progress</Text>
          <Text style={styles.progressTileSub}>
            View scores, stars, and level history
          </Text>
        </View>
        <Icon name="arrow" size={16} color="#7F948B" />
      </Pressable>

      <Card testID="home-stats-card" style={styles.statsCard}>
        <View testID="home-stats-stars" style={styles.stat}>
          <Icon name="star" color="#F5C75F" size={29} />
          <Text style={styles.statNumber}>{state.lifetimeStars}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>

        <View style={styles.statDivider} />

        <View testID="home-stats-badges" style={styles.stat}>
          <Icon name="badge" color="#F1A3BE" size={29} />
          <Text style={styles.statNumber}>{state.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </Card>

      <Encouragement testID="home-encouragement" />

      <Pressable
        testID="home-about-link"
        accessibilityRole="button"
        onPress={() => navigation.navigate("About")}
        style={{ alignSelf: "center", padding: 12 }}
      >
        <Text style={styles.aboutLink}>About LEXIARAL</Text>
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
    gap: 4,
  },
  heroStacked: {
    flexDirection: "column",
    alignItems: "center",
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
  mainActionRow: {
    flexDirection: "row",
    gap: 14,
  },
  mainActionCard: {
    flex: 1,
    minHeight: 154,
    borderRadius: 22,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
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
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#EAE1FC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  mainActionIconWrapPlay: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#D7F5E7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  mainActionTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 22,
    letterSpacing: 0.5,
    color: colors.text,
  },
  mainActionSub: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: colors.muted,
  },
  actionPillLearn: {
    backgroundColor: "#EDE5FD",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D9C8FA",
  },
  actionPillTextLearn: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#6536BC",
  },
  actionPillPlay: {
    backgroundColor: "#DEFAEC",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#B0ECCB",
  },
  actionPillTextPlay: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#1B734E",
  },
  progressTile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F3FBF7",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#CCEFE0",
    gap: 14,
    shadowColor: "#80BCA3",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  progressTileTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: colors.text,
  },
  progressTileSub: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: "#5C7C6F",
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
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 8,
  },
  stat: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  statNumber: {
    fontFamily: "Nunito_900Black",
    fontSize: 21,
    color: colors.text,
  },
  statLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: colors.text,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: "#EAE3F1",
  },
  aboutLink: {
    fontFamily: "Nunito_700Bold",
    color: "#8E7BAE",
    fontSize: 14,
  },
});

export default HomeScreen;
