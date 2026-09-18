import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { LEVELS, performance } from "../content";
import { Art, Icon } from "../Art";
import { speak, stopAudio } from "../audio";
import { useLearning } from "../state/LearningProvider";
import { latestAttempt } from "../state/engine";
import {
  Body,
  Button,
  Card,
  ProgressBar,
  Screen,
  Title,
  colors,
} from "../components/ui";

export function Confetti() {
  const pieces = [
    [7, 18, "#9EDCCA", -24],
    [19, 60, "#F5C1D0", 25],
    [32, 10, "#F4D477", -18],
    [49, 43, "#F6BCC9", 12],
    [65, 9, "#C4B1EF", 30],
    [81, 58, "#F3D780", -30],
    [94, 20, "#A9DBC9", 15],
    [9, 170, "#D2BEF0", 22],
    [88, 177, "#F4B9CF", -18],
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map(([left, top, color, rotation], index) => (
        <View
          key={index}
          style={{
            position: "absolute",
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

  const master = state.badges.includes("vocabulary-master");
  const compact = width < 350 || fontScale > 1.3;

  const feedbackSpeech = total > 0
    ? `${performance(score, total)}! You earned ${score} stars in your completed activities.`
    : "Great work completing your activity! Keep exploring and practicing words!";

  React.useEffect(() => {
    speak(feedbackSpeech, "en-US", true);
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <Screen testID="screen-final">
      <View testID="final-confetti-container" style={{ position: "relative" }}>
        <Confetti />

        <View testID="final-celebration-hero" style={[styles.celebration, compact && styles.heroStacked]}>
          <View style={{ width: compact ? "65%" : "48%", alignItems: "center", justifyContent: "center" }}>
            <Art name={allCompleted ? "owl_excited" : "owl_cheering"} width={compact ? 170 : 200} height={compact ? 170 : 200} />
          </View>

          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Title testID="final-hero-title" style={[styles.heroTitle, compact && styles.center]}>
                {allCompleted ? "Amazing\nWork!" : "Keep\nGrowing!"}
              </Title>
              <Pressable
                testID="final-hear-feedback-btn"
                accessible
                accessibilityRole="button"
                accessibilityLabel="Hear feedback summary"
                onPress={() => speak(feedbackSpeech, "en-US", true)}
                style={({ pressed }) => [
                  styles.heroSpeakerBtn,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
                ]}
              >
                <Icon name="sound" size={18} color={colors.primary} />
              </Pressable>
            </View>

            <Body testID="final-hero-subtitle" style={{ fontSize: 16, lineHeight: 22 }}>
              {allCompleted
                ? "You completed all three levels!"
                : "Your word adventure is underway."}
            </Body>
          </View>
        </View>
      </View>

      <Card testID="final-results-card" style={{ gap: 12, padding: 18 }}>
        <View style={styles.resultsCardHeader}>
          <Title style={{ fontSize: 18, color: colors.darkPurple }}>Level Scores</Title>
          {total > 0 && (
            <View style={styles.subtotalPill}>
              <Icon name="star" size={14} color="#D88F0C" />
              <Text style={styles.subtotalPillText}>{score}/{total} stars</Text>
            </View>
          )}
        </View>

        {LEVELS.map((level, index) => {
          const result = attempts[index];
          const color = ["#4ECD9F", "#967CE3", "#F1A0AF"][index];

          return (
            <View key={level.id} testID={`final-result-row-${level.id}`} style={styles.resultRow}>
              <Icon
                name="star"
                size={22}
                color={["#F5CA61", "#F2AEC1", "#85CDE7"][index]}
              />

              <Text style={styles.resultLabel}>{level.name}</Text>

              <View style={{ flex: 1 }}>
                <ProgressBar
                  testID={`final-progress-level-${level.id}`}
                  value={result ? result.score / result.total : 0}
                  color={color}
                  label={`${level.name} score`}
                />
              </View>

              <Text testID={`final-score-value-${level.id}`} style={styles.resultValue}>
                {result ? `${result.score}/${result.total}` : "—"}
              </Text>
            </View>
          );
        })}

        <View style={styles.resultsSummaryFooter}>
          <Text style={styles.caption}>
            Latest completed attempt in each level.
          </Text>
          {total > 0 && (
            <Text testID="final-overall-summary" style={styles.performanceTag}>
              {performance(score, total)}
            </Text>
          )}
        </View>
      </Card>

      {/* Vocabulary Master Badge Status: Avoid redundant second owl when badge is not yet unlocked */}
      {master ? (
        <Card testID="final-master-badge-card" style={styles.masterBadgeCard}>
          <Art name="medal" width={100} height={100} />
          <View style={{ gap: 2, alignItems: "center" }}>
            <Title style={styles.center}>Vocabulary Master</Title>
            <Body style={{ fontSize: 15, color: "#238055" }}>Badge earned!</Body>
          </View>
        </Card>
      ) : (
        <View style={styles.badgeQuestRow}>
          <View style={styles.badgeQuestIcon}>
            <Icon name="medal" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.badgeQuestTitle}>Vocabulary Master Badge</Text>
            <Text style={styles.badgeQuestSub}>Finish all three levels to earn this special badge!</Text>
          </View>
        </View>
      )}

      {/* Streamlined, non-redundant primary actions */}
      <View style={{ gap: 12, marginTop: 6 }}>
        <Button
          testID="final-play-again-btn"
          title="PLAY AGAIN"
          tone="purple"
          arrow
          onPress={() => navigation.navigate("Levels")}
          style={{ minHeight: 56 }}
        />

        <View style={compact ? { gap: 10 } : styles.actionRow}>
          <Button
            testID="final-review-words-btn"
            title="Review Words"
            icon="book"
            secondary
            style={compact ? undefined : { flex: 1 }}
            onPress={() => navigation.navigate("Review")}
          />
          <Button
            testID="final-home-btn"
            title="Home"
            icon="home"
            tone="mint"
            style={compact ? undefined : { flex: 1 }}
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: "Home" }] })
            }
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  celebration: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    gap: 7,
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
  heroSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4EEFD",
    borderWidth: 1,
    borderColor: "#E1D4FA",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subtotalPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF5DA",
    borderWidth: 1,
    borderColor: "#F7DE9B",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subtotalPillText: {
    fontFamily: "Nunito_900Black",
    fontSize: 13,
    color: "#8D7040",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minHeight: 40,
  },
  resultLabel: {
    width: 66,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.text,
  },
  resultValue: {
    minWidth: 44,
    fontFamily: "Nunito_900Black",
    fontSize: 17,
    textAlign: "right",
    color: colors.text,
  },
  resultsSummaryFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#F0EBF9",
    paddingTop: 8,
    marginTop: 2,
  },
  caption: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    flex: 1,
  },
  performanceTag: {
    fontFamily: "Nunito_900Black",
    fontSize: 13.5,
    color: colors.primary,
  },
  masterBadgeCard: {
    alignItems: "center",
    padding: 18,
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#DECFFC",
  },
  badgeQuestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAF7FF",
    borderWidth: 1.5,
    borderColor: "#E6DBFC",
    borderRadius: 18,
    padding: 14,
  },
  badgeQuestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDE5FD",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeQuestTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: colors.darkPurple,
  },
  badgeQuestSub: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: colors.muted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
});

export default FinalScreen;
