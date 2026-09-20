import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { BADGES } from "../state/engine";
import { Body, Card, Screen, Title, colors } from "../components/ui";

const BADGE_CONFIG = {
  "first-word": {
    icon: "star",
    color: "#E69500",
    bg: "#FFF9E6",
    border: "#FAD88A",
  },
  "word-explorer": {
    icon: "cards",
    color: "#20A464",
    bg: "#EDF9F2",
    border: "#BCEAD0",
  },
  "sentence-builder": {
    icon: "badge",
    color: "#1E88E5",
    bg: "#EBF5FE",
    border: "#B6DCFC",
  },
  "story-reader": {
    icon: "book",
    color: "#774DC9",
    bg: "#F5EFFD",
    border: "#D8BEF7",
  },
  "vocabulary-master": {
    icon: "award",
    color: "#D94826",
    bg: "#FEF0EC",
    border: "#FBBCAE",
  },
};

export function BadgeList() {
  const { state } = useLearning();

  return BADGES.map((badge) => {
    const earned = state.badges.includes(badge.id);
    const cfg = BADGE_CONFIG[badge.id] || {
      icon: "badge",
      color: "#774DC9",
      bg: "#F5EFFD",
      border: "#D8BEF7",
    };

    return (
      <Card key={badge.id} testID={`badge-card-${badge.id}`} style={styles.badgeRow}>
        <View
          testID={`badge-icon-${badge.id}`}
          style={[
            styles.badgeMedallion,
            {
              backgroundColor: earned ? cfg.bg : "#F3F0F7",
              borderColor: earned ? cfg.border : "#E3DEEB",
              opacity: earned ? 1 : 0.45,
            },
          ]}
        >
          <Icon
            name={cfg.icon}
            size={32}
            color={earned ? cfg.color : "#9A93A6"}
          />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Title testID={`badge-title-${badge.id}`} style={{ fontSize: 20, lineHeight: 25 }}>{badge.title}</Title>
          <Body testID={`badge-desc-${badge.id}`} style={styles.caption}>{badge.description}</Body>
          <Text
            testID={`badge-status-${badge.id}`}
            style={[
              styles.badgeStatus,
              earned && styles.badgeStatusEarned,
            ]}
          >
            {earned ? "Badge earned!" : "Keep learning to unlock"}
          </Text>
        </View>
      </Card>
    );
  });
}

export function BadgesScreen() {
  return (
    <Screen testID="screen-badges">
      <Title testID="badges-screen-title">My Little Achievements</Title>
      <Body testID="badges-screen-subtitle">Every step is worth celebrating.</Body>
      <BadgeList />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  badgeMedallion: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#7A61A6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  caption: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  badgeStatus: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#8D829E",
  },
  badgeStatusEarned: {
    color: "#1C8A54",
  },
});

export default BadgesScreen;

