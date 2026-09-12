import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LEVELS, QUESTIONS } from "../content";
import { Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { BADGES, bestAttempt, latestAttempt } from "../state/engine";
import {
  Body,
  Card,
  ProgressBar,
  Screen,
  Title,
  colors,
} from "../components/ui";

export function ProgressScreen({ navigation }) {
  const { state } = useLearning();

  const recentAttempts = [...(state.history || [])].reverse().slice(0, 5);

  return (
    <Screen testID="screen-progress">
      <View testID="progress-header" style={{ gap: 4 }}>
        <Title testID="progress-title">My Learning Progress</Title>
        <Body
          testID="progress-subtitle"
          style={{ fontSize: 15, color: colors.muted }}
        >
          Track your stars, mastered words, and activity history.
        </Body>
      </View>

      {/* 1. Unified 4-metric Stat Grid */}
      <View testID="progress-stats-grid" style={styles.statsGrid}>
        <View style={[styles.statTile, { borderColor: "#F7DEAE" }]}>
          <View style={[styles.statIconWrap, { backgroundColor: "#FFF7DB" }]}>
            <Icon name="star" size={22} color="#D98A09" />
          </View>
          <Text style={styles.statValue}>{state.lifetimeStars}</Text>
          <Text style={styles.statLabel}>Total Stars</Text>
        </View>

        <View style={[styles.statTile, { borderColor: "#BDE6D2" }]}>
          <View style={[styles.statIconWrap, { backgroundColor: "#EAF8F1" }]}>
            <Icon name="book" size={22} color="#20A464" />
          </View>
          <Text style={styles.statValue}>{state.learnedWordIds.length}</Text>
          <Text style={styles.statLabel}>Words Mastered</Text>
        </View>

        <View style={[styles.statTile, { borderColor: "#DECFFC" }]}>
          <View style={[styles.statIconWrap, { backgroundColor: "#F3EFFC" }]}>
            <Icon name="cards" size={22} color="#6C47C7" />
          </View>
          <Text style={styles.statValue}>{state.history.length}</Text>
          <Text style={styles.statLabel}>Activities Done</Text>
        </View>

        <View style={[styles.statTile, { borderColor: "#F7C9D3" }]}>
          <View style={[styles.statIconWrap, { backgroundColor: "#FFF0F3" }]}>
            <Icon name="badge" size={22} color="#E85A71" />
          </View>
          <Text style={styles.statValue}>
            {state.badges.length}/{BADGES.length}
          </Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>

      {/* 2. Consolidated Level Progress Card */}
      <Card testID="progress-levels-summary-card" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Level Progress</Text>

        <View style={{ gap: 14 }}>
          {LEVELS.map((level, idx) => {
            const latest = latestAttempt(state, level.id);
            const best = bestAttempt(state, level.id);
            const unlocked = state.unlocked?.includes(level.id);

            const active =
              state.session?.level === level.id &&
              state.session.phase !== "done"
                ? state.session
                : null;

            const progress = active
              ? active.answers.length / (QUESTIONS[level.id]?.length || 1)
              : latest
                ? 1
                : 0;

            const levelColor =
              ["#20A464", "#7E57C2", "#E85A71"][idx] || colors.primary;

            return (
              <View key={level.id} style={styles.levelRow}>
                <View style={styles.levelRowHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={[
                        styles.levelDot,
                        { backgroundColor: unlocked ? levelColor : "#C7C0D4" },
                      ]}
                    />
                    <Text style={styles.levelName}>
                      Level {level.id}: {level.name}
                    </Text>
                  </View>

                  <Text style={styles.levelScore}>
                    {best
                      ? `${best.score}/${best.total} stars`
                      : unlocked
                        ? "Ready to play"
                        : "Locked"}
                  </Text>
                </View>

                <ProgressBar
                  testID={`progress-bar-level-${level.id}`}
                  value={progress}
                  label={`${level.name} completion`}
                  color={levelColor}
                />
              </View>
            );
          })}
        </View>
      </Card>

      {/* 3. Recent Activities (Compact History Log) */}
      <Card testID="progress-recent-activities-card" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Activity History</Text>

        {!recentAttempts.length ? (
          <Body
            style={{
              color: colors.muted,
              fontSize: 14,
              textAlign: "center",
              paddingVertical: 10,
            }}
          >
            No activities completed yet. Play a level to start tracking your
            history!
          </Body>
        ) : (
          <View style={{ gap: 8 }}>
            {recentAttempts.map((attempt) => {
              const levelObj = LEVELS.find((l) => l.id === attempt.level);
              return (
                <Pressable
                  key={attempt.id}
                  testID={`progress-attempt-row-${attempt.id}`}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Level ${attempt.level} ${levelObj?.name || ""} score: ${attempt.score} of ${attempt.total} stars. Tap to view details.`}
                  onPress={() =>
                    navigation.navigate("Results", { id: attempt.id })
                  }
                  style={({ pressed }) => [
                    styles.attemptRow,
                    pressed && { opacity: 0.75, backgroundColor: "#F9F6FE" },
                  ]}
                >
                  <View style={styles.attemptIconWrap}>
                    <Icon name="star" size={18} color="#D98A09" />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.attemptTitle}>
                      Level {attempt.level}: {levelObj?.name || "Activity"}
                    </Text>
                    <Text style={styles.attemptTime}>
                      {new Date(attempt.completedAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text style={styles.attemptScoreText}>
                      {attempt.score}/{attempt.total}
                    </Text>
                    <Icon name="arrow" size={14} color="#9C89BF" />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginVertical: 4,
  },
  statTile: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Nunito_900Black",
    fontSize: 22,
    color: colors.darkPurple,
  },
  statLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#DECFFC",
    padding: 16,
    gap: 12,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 17,
    color: colors.darkPurple,
    letterSpacing: 0.2,
  },
  levelRow: {
    gap: 6,
  },
  levelRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  levelName: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.text,
  },
  levelScore: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12.5,
    color: colors.muted,
  },
  attemptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: "#FBF9FE",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFEBF8",
  },
  attemptIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF7DB",
    alignItems: "center",
    justifyContent: "center",
  },
  attemptTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13.5,
    color: colors.text,
  },
  attemptTime: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
    color: colors.muted,
  },
  attemptScoreText: {
    fontFamily: "Nunito_900Black",
    fontSize: 14,
    color: "#B57D18",
  },
});

export default ProgressScreen;
