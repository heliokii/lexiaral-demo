import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { LEVELS, QUESTIONS } from "../content";
import { Art, Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { BADGES, bestAttempt, latestAttempt } from "../state/engine";
import {
  Body,
  Button,
  Card,
  ProgressBar,
  Screen,
  Title,
  colors,
} from "../components/ui";

export function ProgressScreen({ navigation }) {
  const { state } = useLearning();

  return (
    <Screen testID="screen-progress">
      <Title testID="progress-title">Look How You’re Growing!</Title>
      <Body testID="progress-subtitle">A little practice makes a big difference.</Body>

      <Card testID="progress-researcher-card" style={styles.researcherPupilCard}>
        <View style={styles.pupilBadgeRow}>
          <View style={styles.pupilIconWrap}>
            <Icon name="medal" size={26} color="#7548C7" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text testID="progress-pupil-label" style={styles.pupilLabel}>RESEARCH PARTICIPANT</Text>
            <Title testID="progress-pupil-name" style={{ fontSize: 22, color: "#3A2758" }}>
              {state.pupilName || "Learner (Anonymous)"}
            </Title>
            <Body style={{ fontSize: 13, color: colors.muted }}>
              Rosario East Central School · Grade 3 ARAL Evaluation
            </Body>
          </View>
        </View>
      </Card>

      <Card testID="progress-hero-card">
        <View style={styles.progressHero}>
          <Art name="owl-cheering" width={112} height={120} />

          <View style={{ flex: 1, gap: 7 }}>
            <Text testID="progress-hero-stars" style={styles.progressNumber}>
              {state.lifetimeStars} stars
            </Text>
            <Body testID="progress-hero-words" style={{ fontSize: 16 }}>
              {state.learnedWordIds.length} words answered correctly
            </Body>
          </View>
        </View>

        <Body style={styles.caption}>
          A word is counted after one correct answer—not as a verified mastery
          measure.
        </Body>
      </Card>

      {LEVELS.map((level) => {
        const latest = latestAttempt(state, level.id);
        const best = bestAttempt(state, level.id);

        const active =
          state.session?.level === level.id && state.session.phase !== "done"
            ? state.session
            : null;

        const progress = active
          ? active.answers.length / QUESTIONS[level.id].length
          : latest
            ? 1
            : 0;

        return (
          <Card key={level.id} testID={`progress-level-card-${level.id}`}>
            <Title style={{ fontSize: 22 }}>{level.name}</Title>

            <ProgressBar
              testID={`progress-bar-level-${level.id}`}
              value={progress}
              label={`${level.name} activity completion`}
              color={["#52CDA4", "#9B81E3", "#F0A0B1"][level.id - 1]}
            />

            <Body style={{ fontSize: 17 }}>
              {active
                ? `${active.answers.length}/${QUESTIONS[level.id].length} questions answered`
                : latest
                  ? "Activity completed"
                  : state.unlocked.includes(level.id)
                    ? "Ready to begin"
                    : "Not unlocked yet"}
            </Body>

            <Body style={{ fontSize: 17 }}>
              Latest: {latest ? `${latest.score}/${latest.total}` : "—"}
              {"  ·  "}
              Best: {best ? `${best.score}/${best.total}` : "—"}
            </Body>
          </Card>
        );
      })}

      <Card testID="progress-stats-summary-card">
        <Body>Words practiced: {state.encounteredWordIds.length}</Body>
        <Body>Questions answered: {state.answeredActivities}</Body>
        <Body>Completed activities: {state.history.length}</Body>
        <Body>
          Badges earned: {state.badges.length}/{BADGES.length}
        </Body>
      </Card>

      <Button
        testID="progress-overall-results-btn"
        title="See overall results"
        icon="chart"
        onPress={() => navigation.navigate("Final")}
      />

      <Title testID="progress-recent-title" style={{ fontSize: 23 }}>Recent Activities</Title>

      {!state.history.length && <Body>Your results will appear here.</Body>}

      {[...state.history]
        .reverse()
        .slice(0, 10)
        .map((attempt) => (
          <Card key={attempt.id} testID={`progress-attempt-card-${attempt.id}`}>
            <Body>
              Level {attempt.level} · {attempt.score}/{attempt.total} stars
            </Body>
            <Body style={styles.caption}>
              {new Date(attempt.completedAt).toLocaleString()}
            </Body>
            <Button
              testID={`progress-view-attempt-${attempt.id}`}
              title="View result"
              secondary
              onPress={() => navigation.navigate("Results", { id: attempt.id })}
            />
          </Card>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  researcherPupilCard: {
    backgroundColor: "#F7F3FF",
    borderColor: "#DECFFC",
    borderWidth: 1.5,
    padding: 16,
  },
  pupilBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  pupilIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EBE0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  pupilLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#7548C7",
    letterSpacing: 0.8,
  },
  progressHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressNumber: {
    fontFamily: "Nunito_900Black",
    fontSize: 27,
    color: colors.darkPurple,
  },
  caption: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
});

export default ProgressScreen;
