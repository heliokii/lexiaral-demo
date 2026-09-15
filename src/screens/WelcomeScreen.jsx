import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { Art } from "../Art";
import { AnimatedLexi } from "../components/AnimatedLexi";
import { useLearning } from "../state/LearningProvider";
import { Body, Button, Card, Screen, Title, colors } from "../components/ui";
import { sanitizePupilInput } from "../utils/sanitizer";

export function WelcomeScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();
  const [pupilInput, setPupilInput] = useState(
    sanitizePupilInput(state?.pupilName || "", 20)
  );

  const handleInputChange = (text) => {
    const cleaned = sanitizePupilInput(text, 20);
    setPupilInput(cleaned);
  };

  const handleStart = async () => {
    const cleaned = sanitizePupilInput(pupilInput, 20).trim();
    const finalName = cleaned || "Learner";
    await dispatch({ type: "SET_PUPIL_NAME", name: finalName });
    navigation.replace("Home");
  };

  return (
    <Screen testID="screen-welcome">
      <View testID="welcome-content-container" style={styles.welcome}>
        <Text testID="welcome-brand-text" style={styles.brand}>LEXIARAL</Text>
        <AnimatedLexi name="owl-reading" height={200} />
        <Title testID="welcome-title" style={styles.center}>Learn Words. Play. Grow.</Title>
        <Body testID="welcome-subtitle" style={styles.center}>
          English Vocabulary Game for Grade 3 Learners
        </Body>

        <Card testID="welcome-pupil-card" style={styles.pupilCard}>
          <Text testID="welcome-pupil-label" style={styles.pupilInputLabel}>Learner / Pupil ID:</Text>
          <TextInput
            testID="welcome-pupil-input"
            value={pupilInput}
            onChangeText={handleInputChange}
            placeholder="e.g. Pupil 01, Alex, or Learner"
            placeholderTextColor="#9EA5B9"
            style={styles.pupilTextInput}
            maxLength={20}
            autoCapitalize="words"
          />
          <Body testID="welcome-pupil-hint" style={styles.pupilInputHint}>
            Used for tracking research pre-test and post-test scores.
          </Body>
        </Card>

        <Button
          testID="welcome-start-button"
          title="Let’s start!"
          icon="book"
          arrow
          disabled={busy}
          onPress={handleStart}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  welcome: {
    flex: 1,
    justifyContent: "center",
    gap: 22,
    paddingBottom: 30,
  },
  brand: {
    fontFamily: "Nunito_900Black",
    fontSize: 39,
    letterSpacing: 1,
    color: colors.darkPurple,
    textAlign: "center",
  },
  pupilCard: {
    width: "100%",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DCE7F5",
    gap: 8,
  },
  pupilInputLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: "#3A2758",
  },
  pupilTextInput: {
    minHeight: 48,
    backgroundColor: "#F4F7FC",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CCE0F5",
    paddingHorizontal: 16,
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#2F2544",
  },
  pupilInputHint: {
    fontSize: 13,
    color: colors.muted,
  },
});

export default WelcomeScreen;
