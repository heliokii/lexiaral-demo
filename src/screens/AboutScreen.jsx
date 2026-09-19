import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Art, Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import { Body, Button, Card, Screen, Title, VolumeSlider, colors } from "../components/ui";

export function AboutScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();

  const handleResetData = () => {
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
  };

  const currentThreshold = state.masteryThreshold || 0;

  const thresholdExplanation =
    currentThreshold === 0
      ? "Demo Mode: All levels and activities are instantly unlocked for testing."
      : currentThreshold === 75
        ? "DepEd Standard: Pupils need 75% score on Level 1 to unlock Level 2."
        : "Thesis Benchmark: Pupils need 80% mastery score on Level 1 to unlock Level 2.";

  return (
    <Screen testID="screen-about">
      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.mascotGlow}>
          <Art name="owl_happy" width={130} height={130} />
        </View>
        <Title testID="about-screen-title" style={styles.heroTitle}>
          LEXIARAL
        </Title>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Grade 3 ARAL Literacy · Demo Edition</Text>
        </View>
        <Body style={styles.heroDescription}>
          Interactive vocabulary learning with visual reinforcement and spoken audio
          designed for Grade 3 pupils under the ARAL literacy program.
        </Body>
      </View>

      {/* 1. App Audio Preferences */}
      <Card testID="about-sound-settings-card" style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.headerIconWrap, { backgroundColor: "#F3EFFC" }]}>
            <Icon name="sound" size={18} color={colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <Pressable
          testID="about-sound-toggle-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            state.audioEnabled ? "Turn audio off" : "Turn audio on"
          }
          disabled={busy}
          onPress={() =>
            dispatch({
              type: "SET_AUDIO",
              enabled: !state.audioEnabled,
            })
          }
          style={({ pressed }) => [
            styles.settingRow,
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.settingLabel}>Spoken Audio & Sound</Text>
            <Text style={styles.settingSub}>
              Word pronunciation and audio narration
            </Text>
          </View>

          {/* Toggle Switch */}
          <View
            style={[
              styles.switchTrack,
              state.audioEnabled ? styles.switchTrackOn : styles.switchTrackOff,
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                state.audioEnabled ? styles.switchThumbOn : styles.switchThumbOff,
              ]}
            />
            <Text
              style={[
                styles.switchText,
                state.audioEnabled ? styles.switchTextOn : styles.switchTextOff,
              ]}
            >
              {state.audioEnabled ? "ON" : "OFF"}
            </Text>
          </View>
        </Pressable>

        {state.audioEnabled && (
          <VolumeSlider
            label="Background Music Volume"
            value={state.bgmVolume}
            onChange={(val) =>
              dispatch({
                type: "SET_BGM_VOLUME",
                volume: val,
              })
            }
          />
        )}

        <View style={styles.hintBox}>

          <Icon name="info" size={15} color={colors.muted} />
          <Text style={styles.hintText}>
            Friendly female instructional voice (light, cheerful tone) · Works fully offline.
          </Text>
        </View>
      </Card>

      {/* 2. Researcher & Teacher Controls */}
      <Card
        testID="about-researcher-tools-card"
        style={styles.sectionCard}
      >
        <View style={styles.cardHeaderRow}>
          <View style={[styles.headerIconWrap, { backgroundColor: "#EDF7F2" }]}>
            <Icon name="cards" size={18} color={colors.green} />
          </View>
          <Text style={styles.sectionTitle}>Researcher & Teacher Tools</Text>
        </View>

        {/* Current Participant Row */}
        <View style={styles.participantContainer}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.participantLabel}>Current Participant</Text>
            <Text testID="about-participant-name" style={styles.participantName}>
              {state.pupilName || "Learner (Anonymous)"}
            </Text>
          </View>

          <Button
            testID="about-reset-pupil-data-btn"
            title="Reset Data"
            secondary
            disabled={busy}
            onPress={handleResetData}
            style={styles.resetBtn}
          />
        </View>

        {/* Passing Threshold Segmented Control */}
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdLabel}>Mastery Passing Threshold</Text>

          <View testID="about-threshold-btn-row" style={styles.thresholdTrack}>
            {[
              { label: "0% Demo", value: 0 },
              { label: "75% DepEd", value: 75 },
              { label: "80% Thesis", value: 80 },
            ].map((option) => {
              const active = currentThreshold === option.value;
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
                    styles.segmentBtn,
                    active && styles.segmentBtnActive,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                    style={[
                      styles.segmentBtnText,
                      active && styles.segmentBtnTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.thresholdNoteBox}>
            <Text style={styles.thresholdNoteText}>{thresholdExplanation}</Text>
          </View>
        </View>
      </Card>

      {/* 3. App Information & Privacy */}
      <Card testID="about-progress-info-card" style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.headerIconWrap, { backgroundColor: "#FFF8E7" }]}>
            <Icon name="badge" size={18} color="#D99B00" />
          </View>
          <Text style={styles.sectionTitle}>App Information & Privacy</Text>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIconWrap, { backgroundColor: "#EDF7F2" }]}>
              <Icon name="shield" size={16} color={colors.green} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.featureHeading}>100% On-Device & Private</Text>
              <Text style={styles.featureBody}>
                Scores, stars, and badges are saved strictly on this device. No pupil accounts, logins, or remote data collection.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIconWrap, { backgroundColor: "#F3EFFC" }]}>
              <Icon name="book" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.featureHeading}>Grade 3 ARAL Alignment</Text>
              <Text style={styles.featureBody}>
                Structured for the Academic Recovery and Accessible Learning initiative, supporting early English reading.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIconWrap, { backgroundColor: "#FFF2F5" }]}>
              <Icon name="check" size={16} color={colors.coral} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.featureHeading}>Teacher & Classroom Guidance</Text>
              <Text style={styles.featureBody}>
                Educators may review vocabulary lists, test pronunciation, and adjust unlock thresholds before evaluation.
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  mascotGlow: {
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: "Nunito_900Black",
    color: colors.darkPurple,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  versionBadge: {
    backgroundColor: "#EAE2FB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: colors.primary,
  },
  heroDescription: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    paddingHorizontal: 10,
    maxWidth: 460,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#EAE2FB",
    padding: 16,
    gap: 14,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    color: colors.darkPurple,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#FAF8FF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFE8FA",
  },
  settingLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14.5,
    color: colors.text,
  },
  settingSub: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: colors.muted,
  },
  switchTrack: {
    width: 58,
    height: 32,
    borderRadius: 16,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  switchTrackOn: {
    backgroundColor: "#20A464",
    justifyContent: "flex-end",
  },
  switchTrackOff: {
    backgroundColor: "#DDD6EB",
    justifyContent: "flex-start",
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  switchThumbOn: {
    marginRight: 0,
  },
  switchThumbOff: {
    marginLeft: 0,
  },
  switchText: {
    position: "absolute",
    fontFamily: "Nunito_900Black",
    fontSize: 10,
  },
  switchTextOn: {
    left: 8,
    color: "#FFFFFF",
  },
  switchTextOff: {
    right: 8,
    color: "#7E7192",
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8F6FD",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  hintText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAF8FF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFE8FA",
    gap: 12,
  },
  participantLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11.5,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  participantName: {
    fontFamily: "Nunito_900Black",
    fontSize: 17,
    color: colors.primary,
  },
  resetBtn: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  thresholdContainer: {
    gap: 8,
  },
  thresholdLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.darkPurple,
  },
  thresholdTrack: {
    flexDirection: "row",
    backgroundColor: "#F0EBF8",
    padding: 3,
    borderRadius: 14,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 38,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#7548C7",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: colors.muted,
  },
  segmentBtnTextActive: {
    fontFamily: "Nunito_800ExtraBold",
    color: colors.primary,
  },
  thresholdNoteBox: {
    backgroundColor: "#FAF8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  thresholdNoteText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  featureList: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  featureHeading: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13.5,
    color: colors.text,
  },
  featureBody: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
});

export default AboutScreen;
