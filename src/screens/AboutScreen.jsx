import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Art } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { Body, Button, Card, Screen, Title, colors } from "../components/ui";

export function AboutScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();

  return (
    <Screen testID="screen-about">
      <Title testID="about-screen-title">Meet LEXIARAL</Title>
      <Art name="owl-reading" height={175} />
      <Body style={styles.center}>Learn Words. Play. Grow.</Body>

      <Card testID="about-lexi-intro-card">
        <Title style={{ fontSize: 22 }}>Learning with Lexi</Title>
        <Body>
          Practice vocabulary with pictures, sentences, and short stories. Learn
          on your own or with a teacher.
        </Body>
        <Body>
          This content pack is a demonstration. Its vocabulary and story have
          not been verified as official Grade 3 ARAL material.
        </Body>
      </Card>

      <Card testID="about-sound-settings-card">
        <Title style={{ fontSize: 22 }}>Sound</Title>
        <Body>
          Audio uses your device’s English speech voice. An offline voice must
          be installed for speech without internet.
        </Body>
        <Button
          testID="about-sound-toggle-btn"
          title={state.audioEnabled ? "Turn sound off" : "Turn sound on"}
          icon="sound"
          disabled={busy}
          onPress={() =>
            dispatch({
              type: "SET_AUDIO",
              enabled: !state.audioEnabled,
            })
          }
        />
      </Card>

      <Card
        testID="about-researcher-tools-card"
        style={{
          borderColor: "#D7CBF5",
          borderWidth: 1.5,
          backgroundColor: "rgba(251,249,255,0.96)",
        }}
      >
        <Title style={{ fontSize: 22, color: colors.darkPurple }}>
          Researcher & Teacher Tools
        </Title>
        <Body style={{ fontSize: 16 }}>
          Current Participant:{" "}
          <Text
            testID="about-participant-name"
            style={{ fontFamily: "Nunito_800ExtraBold", color: colors.primary }}
          >
            {state.pupilName || "Not Set"}
          </Text>
        </Body>
        <Body style={{ fontSize: 15 }}>
          When administering thesis tests with multiple Grade 3 pupils, use this
          tool to clear saved progress and start fresh for the next participant.
        </Body>
        <Button
          testID="about-reset-pupil-data-btn"
          title="Reset Data for Next Pupil"
          icon="cards"
          secondary
          disabled={busy}
          onPress={() => {
            if (typeof window !== "undefined" && window.confirm) {
              if (
                window.confirm(
                  "Reset learner progress? This will clear all saved stars, badges, and completed activities on this device so the next pupil begins with a fresh session.",
                )
              ) {
                dispatch({ type: "RESET_PROGRESS", nextPupilName: "" });
                navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
              }
              return;
            }
            Alert.alert(
              "Reset learner progress?",
              "This will clear all saved stars, badges, and completed activities on this device so the next pupil begins with a fresh session.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Reset All Data",
                  style: "destructive",
                  onPress: async () => {
                    await dispatch({
                      type: "RESET_PROGRESS",
                      nextPupilName: "",
                    });
                    Alert.alert(
                      "Progress Reset",
                      "All learner data has been cleared. You will now be redirected to set up the next pupil.",
                    );
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
                  },
                },
              ],
            );
          }}
          style={{ backgroundColor: "#F4EEFC", borderColor: "#D4C5F3" }}
        />

        <View
          style={{
            marginTop: 10,
            gap: 6,
            paddingTop: 12,
            borderTopWidth: 1,
            borderColor: "#EDE5F8",
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito_800ExtraBold",
              fontSize: 16,
              color: colors.darkPurple,
            }}
          >
            Mastery Passing Threshold:
          </Text>
          <Body style={{ fontSize: 14, color: colors.muted }}>
            Required score to unlock Level 2 and Level 3 during testing:
          </Body>
          <View testID="about-threshold-btn-row" style={styles.thresholdRow}>
            {[
              { label: "0% Demo", value: 0, desc: "All levels unlocked" },
              { label: "75% DepEd", value: 75, desc: "DepEd standard" },
              { label: "80% Thesis", value: 80, desc: "Mastery benchmark" },
            ].map((option) => {
              const active = (state.masteryThreshold || 0) === option.value;
              return (
                <Pressable
                  key={option.value}
                  testID={`about-threshold-btn-${option.value}`}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Set passing threshold to ${option.label}`}
                  disabled={busy}
                  onPress={() =>
                    dispatch({
                      type: "SET_MASTERY_THRESHOLD",
                      threshold: option.value,
                    })
                  }
                  style={[
                    styles.thresholdBtn,
                    active && styles.thresholdBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.thresholdBtnText,
                      active && styles.thresholdBtnTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.thresholdBtnSub,
                      active && styles.thresholdBtnSubActive,
                    ]}
                  >
                    {option.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      <Card testID="about-progress-info-card">
        <Title style={{ fontSize: 22 }}>Your progress</Title>
        <Body>
          One learner’s progress is saved on this device. No account or learner
          name is requested. The app does not upload scores.
        </Body>
        <Body>
          Uninstalling the app or clearing its storage may remove progress. This
          version does not separate pupils on a shared device.
        </Body>
      </Card>

      <Card testID="about-for-adults-card">
        <Title style={{ fontSize: 22 }}>For adults</Title>
        <Body>
          Teachers must review vocabulary, images, passages, pronunciation, and
          unlocking rules before pupil or research use.
        </Body>
        <Body>
          Badges celebrate completed activities; they are not validated measures
          of vocabulary mastery.
        </Body>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  thresholdRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  thresholdBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2D5F5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  thresholdBtnActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: "#F1ECFD",
  },
  thresholdBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: colors.text,
    textAlign: "center",
  },
  thresholdBtnTextActive: {
    color: colors.primary,
  },
  thresholdBtnSub: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 10,
    color: colors.muted,
    textAlign: "center",
  },
  thresholdBtnSubActive: {
    color: colors.primary,
  },
});

export default AboutScreen;
