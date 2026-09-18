import React, { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { setBgmFocusMode, stopAudio } from "../audio";

import { Art, Icon } from "../Art";
import { LEVELS, UNLOCK_PERCENT } from "../content";
import { useLearning } from "../state/LearningProvider";
import { isLevelUnlocked, latestAttempt } from "../state/engine";
import { Body, Encouragement, Screen, Title, colors } from "../components/ui";

export default function LevelsScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();

  // Enable soft BGM focus mode during play level selection
  useEffect(() => {
    setBgmFocusMode(true);
    return () => {
      setBgmFocusMode(false);
      stopAudio();
    };
  }, []);

  async function start(level) {
    const levelObj = LEVELS.find((l) => l.id === level);
    const next = await dispatch({
      type: "START",
      level,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      at: new Date().toISOString(),
    });

    if (next) {
      navigation.navigate("Activity", {
        title: `${levelObj?.name || ""} Level`,
      });
    }
  }

  function handleLevelPress(level) {
    const active =
      state.session?.level === level.id && state.session?.phase !== "done";

    // 1. If this level is already in progress, seamlessly resume immediately!
    if (active) {
      const levelObj = LEVELS.find((l) => l.id === level.id);
      navigation.navigate("Activity", {
        title: `${levelObj?.name || ""} Level`,
      });
      return;
    }

    // 2. If another level is in progress, confirm before replacing
    if (state.session && state.session.phase !== "done") {
      if (typeof window !== "undefined" && window.confirm) {
        if (
          window.confirm(
            "Start a new activity? Your unfinished activity will be replaced.",
          )
        ) {
          start(level.id);
        }
        return;
      }

      Alert.alert(
        "Start a new activity?",
        "Your unfinished activity will be replaced. Saved stars and completed results will stay.",
        [
          { text: "Keep my activity", style: "cancel" },
          { text: "Start new", onPress: () => start(level.id) },
        ],
      );
      return;
    }

    start(level.id);
  }

  return (
    <Screen testID="screen-levels">
      <View style={styles.contentWrapper}>
        <View testID="levels-header" style={styles.header}>
          <Title testID="levels-title" style={styles.title}>
            Choose Your Level
          </Title>
          <Body testID="levels-subtitle" style={styles.subtitle}>
            Keep learning and build your vocabulary!
          </Body>
        </View>

        <View testID="levels-list" style={styles.levelList}>
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(state, level.id);
          const result = latestAttempt(state, level.id);

          const active =
            state.session?.level === level.id && state.session.phase !== "done";

          const statusLabel = !unlocked
            ? "Locked"
            : active
              ? "In Progress"
              : result
                ? "Completed"
                : "Unlocked";

          const statusStyle = !unlocked
            ? styles.lockedStatus
            : active
              ? styles.inProgressStatus
              : result
                ? styles.completedStatus
                : styles.unlockedStatus;

          const textColor = !unlocked
            ? "#8A8596"
            : active
              ? "#D24B3B"
              : result
                ? "#1E8D5B"
                : colors.primary;

          return (
            <Pressable
              key={level.id}
              testID={`level-card-${level.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Level ${level.id}, ${level.name}. ${statusLabel}.`}
              accessibilityState={{ disabled: !unlocked || busy }}
              disabled={!unlocked || busy}
              onPress={() => handleLevelPress(level)}
              style={({ pressed }) => [
                styles.levelCard,
                active && styles.activeCard,
                !unlocked && styles.lockedCard,
                pressed && !busy && { transform: [{ scale: 0.985 }] },
              ]}
            >
              <View
                testID={`level-status-${level.id}`}
                style={[styles.status, statusStyle]}
              >
                <Text style={[styles.statusText, { color: textColor }]}>
                  {statusLabel}
                </Text>
              </View>

              <View style={[styles.owl, !unlocked && { opacity: 0.45 }]}>
                <Art
                  name={
                    !unlocked
                      ? "owl_sleeping"
                      : level.stars === 3
                        ? "owl_excited"
                        : level.stars === 2
                          ? "owl_cheering"
                          : level.stars === 1
                            ? "owl_happy"
                            : level.id === 1
                              ? "owl_reading"
                              : level.id === 2
                                ? "owl_thinking"
                                : "owl_excited"
                  }
                  width={96}
                  height={96}
                />
              </View>

              <View style={styles.levelText}>
                <Text
                  style={[
                    styles.levelTitle,
                    active && { color: colors.primary },
                  ]}
                >
                  Level {level.id}: {level.name}
                </Text>

                <Text style={styles.description}>{level.title}</Text>

                {active ? (
                  <View style={styles.resumeRow}>
                    <Text style={styles.resumeText}>Continue Activity</Text>
                    <Icon name="arrow" size={14} color={colors.primary} />
                  </View>
                ) : (
                  <View style={styles.score}>
                    <Icon
                      name="star"
                      size={18}
                      color={result || unlocked ? "#F5A623" : "#D9D3E6"}
                    />
                    <Icon
                      name="star"
                      size={18}
                      color={
                        result &&
                        result.total > 0 &&
                        result.score / result.total >= 0.5
                          ? "#F5A623"
                          : "#D9D3E6"
                      }
                    />
                    <Icon
                      name="star"
                      size={18}
                      color={
                        result &&
                        result.total > 0 &&
                        result.score / result.total >= 0.8
                          ? "#F5A623"
                          : "#D9D3E6"
                      }
                    />
                    {result && (
                      <Text style={styles.scoreText}>
                        {result.score}/{result.total} stars
                      </Text>
                    )}
                    
                    {!unlocked && (
                      <Text style={styles.small}>
                        {(state.masteryThreshold != null
                          ? state.masteryThreshold
                          : UNLOCK_PERCENT) === 0
                          ? `Complete ${level.id === 2 ? "Easy" : "Average"} to unlock`
                          : `Earn ${
                              state.masteryThreshold != null
                                ? state.masteryThreshold
                                : UNLOCK_PERCENT
                            }% in ${level.id === 2 ? "Easy" : "Average"}`}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={[styles.chevron, active && styles.chevronActive]}>
                <Icon
                  name={unlocked ? "arrow" : "lock"}
                  size={16}
                  color={
                    active ? "#FFFFFF" : unlocked ? colors.primary : "#9A95A7"
                  }
                />
              </View>
            </Pressable>
          );
        })}
        </View>

        <Encouragement />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: colors.darkPurple,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.muted,
  },
  levelList: {
    gap: 18,
  },
  levelCard: {
    minHeight: 172,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 22,
    paddingTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1.5,
    borderColor: "#ECE6F7",
    shadowColor: "#7C67A6",
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    position: "relative",
  },
  activeCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: "#FAF7FF",
    shadowOpacity: 0.14,
  },
  lockedCard: {
    backgroundColor: "rgba(240,237,246,.75)",
    borderColor: "#E7E2F0",
  },
  owl: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    flex: 1,
    gap: 5,
  },
  levelTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 22,
    lineHeight: 28,
    color: colors.darkPurple,
  },
  description: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  resumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  resumeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14.5,
    color: colors.primary,
  },
  small: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.muted,
  },
  score: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  scoreText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13.5,
    color: "#8D7040",
  },
  status: {
    position: "absolute",
    right: 14,
    top: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  unlockedStatus: {
    backgroundColor: "#EBF4FE",
  },
  inProgressStatus: {
    backgroundColor: "#FEEDEA",
  },
  completedStatus: {
    backgroundColor: "#E8F8F0",
  },
  lockedStatus: {
    backgroundColor: "#E9E4F0",
  },
  statusText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
  chevron: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#F0EBF9",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronActive: {
    backgroundColor: colors.primary,
  },
});
