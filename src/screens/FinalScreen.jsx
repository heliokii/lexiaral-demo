import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { LEVELS, performance } from "../content";
import { Art, Icon } from "../Art";
import { speak } from "../audio";
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

  return (
    <Screen testID="screen-final">
      <View testID="final-confetti-container" style={{ position: "relative" }}>
        <Confetti />

        <View testID="final-celebration-hero" style={[styles.celebration, compact && styles.heroStacked]}>
          <View style={{ width: compact ? "65%" : "48%" }}>
            <Art name={allCompleted ? "owl_excited" : "owl_cheering"} height={210} />
          </View>

          <View style={{ flex: 1, gap: 7 }}>
            <Title testID="final-hero-title" style={[styles.heroTitle, compact && styles.center]}>
              {allCompleted ? "Amazing\nWork!" : "Keep\nGrowing!"}
            </Title>

            <Body testID="final-hero-subtitle" style={{ fontSize: 16, lineHeight: 23 }}>
              {allCompleted
                ? "You completed all three levels!"
                : "Your word adventure is underway."}
            </Body>
          </View>
        </View>
      </View>

      <Card testID="final-results-card">
        {LEVELS.map((level, index) => {
          const result = attempts[index];
          const color = ["#4ECD9F", "#967CE3", "#F1A0AF"][index];

          return (
            <View key={level.id} testID={`final-result-row-${level.id}`} style={styles.resultRow}>
              <Icon
                name="star"
                size={25}
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

        <Text style={styles.caption}>
          Latest completed attempt in each level.
        </Text>
      </Card>

      <Card testID="final-master-badge-card" style={{ alignItems: "center" }}>
        <Art name={master ? "medal" : "owl_thinking"} height={170} />

        <Title style={styles.center}>
          {master ? "Vocabulary Master" : "A Little More Every Day"}
        </Title>

        <Body style={{ fontSize: 16 }}>
          {master
            ? "Badge earned!"
            : "Finish all three levels to earn this badge."}
        </Body>
      </Card>

      {total > 0 && (
        <View testID="final-overall-summary" style={{ alignItems: "center", gap: 6 }}>
          <Title style={{ fontSize: 22 }}>{performance(score, total)}</Title>
          <Body style={{ fontSize: 17 }}>
            {allCompleted ? "Overall score" : "Completed-level subtotal"}:{" "}
            {score}/{total} stars
          </Body>
        </View>
      )}

      <View style={compact ? { gap: 12 } : styles.actionRow}>
        <Button
          testID="final-review-words-btn"
          title="Review Words"
          icon="book"
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

      <Button
        testID="final-play-again-btn"
        title="Play again"
        secondary
        onPress={() => navigation.navigate("Levels")}
      />

      <Button
        testID="final-hear-feedback-btn"
        title="Hear my feedback"
        icon="sound"
        secondary
        onPress={() =>
          speak(
            total
              ? `${performance(score, total)} You earned ${score} stars in your latest completed activities.`
              : "Let’s start your word adventure!",
            "en-US",
            true,
          )
        }
      />
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
  caption: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
});

export default FinalScreen;
