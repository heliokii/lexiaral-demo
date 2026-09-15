import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Art } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { BADGES } from "../state/engine";
import { Body, Card, Screen, Title, colors } from "../components/ui";

export function BadgeList() {
  const { state } = useLearning();

  return BADGES.map((badge) => {
    const earned = state.badges.includes(badge.id);

    return (
      <Card key={badge.id} testID={`badge-card-${badge.id}`} style={styles.badgeRow}>
        <View testID={`badge-icon-${badge.id}`} style={{ opacity: earned ? 1 : 0.3 }}>
          <Art name="medal" width={78} height={86} />
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <Title testID={`badge-title-${badge.id}`} style={{ fontSize: 20, lineHeight: 25 }}>{badge.title}</Title>
          <Body testID={`badge-desc-${badge.id}`} style={styles.caption}>{badge.description}</Body>
          <Text testID={`badge-status-${badge.id}`} style={styles.badgeStatus}>
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
  caption: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  badgeStatus: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#9A7BC7",
  },
});

export default BadgesScreen;
