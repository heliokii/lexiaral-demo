import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  QUESTIONS,
  UNLOCK_PERCENT,
  WORDS,
  answerLabel,
  performance,
} from "../content";
import { Art, Icon } from "../Art";
import { AnimatedLexi } from "../components/AnimatedLexi";
import { playTapSfx, playVictoryFanfare, speak, stopAudio } from "../audio";
import { useLearning } from "../state/LearningProvider";
import { isLevelUnlocked } from "../state/engine";
import { Body, Button, Card, Screen, Title, colors } from "../components/ui";
import { ConfettiCelebration } from "../components/ConfettiCelebration";
import { WordPicture } from "../components/learning";
import { newSessionAction } from "./ActivityScreen";

function ActionTile({
  icon,
  label,
  onPress,
  active = false,
  disabled = false,
  accessibilityLabel,
  testID,
}) {
  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      disabled={disabled}
      onPress={() => {
        playTapSfx();
        if (onPress) onPress();
      }}
      style={({ pressed }) => [
        {
          flex: 1,
          maxWidth: 112,
          minHeight: 68,
          paddingVertical: 10,
          paddingHorizontal: 8,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderBottomWidth: 4,
          backgroundColor: active ? "#EDE4FB" : "rgba(255, 255, 255, 0.96)",
          borderColor: active ? "#8F72D8" : "#DCD0F8",
          borderBottomColor: active ? "#7A5EC8" : "#C6B5EC",
          shadowColor: "#5E4399",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 2,
          gap: 4,
        },
        disabled && { opacity: 0.45 },
        pressed &&
          !disabled && {
            transform: [{ translateY: 2 }, { scale: 0.96 }],
            shadowOpacity: 0.04,
          },
      ]}
    >
      <Icon
        name={icon}
        size={24}
        color={active ? "#593FA6" : "#7056BE"}
      />
      <Text
        style={{
          fontFamily: "Nunito_800ExtraBold",
          fontSize: 13,
          color: active ? "#593FA6" : "#6852A3",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ResultsScreen({ navigation, route }) {
  const { state, dispatch, busy } = useLearning();
  const [showAnswers, setShowAnswers] = useState(false);

  const attempt = state.history.find((item) => item.id === route.params?.id);

  useEffect(() => {
    if (attempt) {
      let isMounted = true;
      playVictoryFanfare(() => {
        if (!isMounted) return;
        speak(
          `${performance(attempt.score, attempt.total)} You earned ${attempt.score} stars out of ${attempt.total}.`,
        );
      });
      return () => {
        isMounted = false;
        stopAudio();
      };
    }
  }, [attempt?.id]);

  if (!attempt) {
    return (
      <Screen>
        <Title>No result found</Title>
        <Button
          title="MY PROGRESS"
          onPress={() => navigation.replace("Progress")}
        />
      </Screen>
    );
  }

  const questions = attempt.questions || QUESTIONS[attempt.level];

  const startLevel = async (level) => {
    const next = await dispatch(newSessionAction(level));

    if (next) navigation.replace("Activity");
  };

  const categoryResult = (category) => {
    const answers = attempt.answers.filter(
      (_, index) => (questions?.[index]?.category || "vocabulary") === category,
    );

    return `${answers.filter((answer) => answer.correct).length}/${answers.length}`;
  };

  const nextLevel = attempt.level + 1;
  const isNextUnlocked = nextLevel <= 3 && isLevelUnlocked(state, nextLevel);
  const isPassing =
    attempt.total > 0 &&
    attempt.score / attempt.total >=
      (state.masteryThreshold != null
        ? state.masteryThreshold
        : UNLOCK_PERCENT) /
        100;

  const starCount = [1, 2, 3].filter(
    (starIndex) =>
      attempt.total > 0 && attempt.score >= (attempt.total / 3) * starIndex,
  ).length;

  const resultMascotPose =
    starCount === 3
      ? "owl_excited"
      : starCount === 2
        ? "owl_cheering"
        : starCount === 1
          ? "owl_happy"
          : "owl_thinking";

  return (
    <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <ConfettiCelebration />
      <Screen testID="screen-results">
        <View
          testID="results-summary-header"
          style={{ alignItems: "center", gap: 6, paddingTop: 6 }}
        >
          <AnimatedLexi name={resultMascotPose} height={160} />
          <Title
            testID="results-performance-title"
            style={{
              fontSize: 28,
              color: colors.darkPurple,
              textAlign: "center",
            }}
          >
            {performance(attempt.score, attempt.total)}
          </Title>
          <Body
            testID="results-level-complete-text"
            style={{ fontSize: 16, color: colors.muted, textAlign: "center" }}
          >
            Level {attempt.level} Complete
          </Body>
        </View>

        <Card
          testID="results-stars-card"
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 22,
            paddingHorizontal: 16,
            borderRadius: 24,
            borderColor: "#DECFFC",
            borderWidth: 1.5,
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            shadowColor: "#5E4399",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
            gap: 12,
          }}
        >
          <View
            testID="results-stars-row"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              paddingVertical: 6,
            }}
          >
            {[1, 2, 3].map((starIndex) => {
              const starFilled =
                attempt.total > 0 &&
                attempt.score >= (attempt.total / 3) * starIndex;
              const isMiddle = starIndex === 2;
              return (
                <View
                  key={starIndex}
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    isMiddle
                      ? { transform: [{ translateY: -8 }] }
                      : { transform: [{ translateY: 2 }] },
                  ]}
                >
                  <Icon
                    name="star"
                    size={isMiddle ? 58 : 46}
                    color={starFilled ? "#FFB800" : "#DCD5ED"}
                  />
                </View>
              );
            })}
          </View>

          {attempt.level === 3 && (
            <View
              testID="results-level3-breakdown"
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#EDE6F8",
                paddingTop: 10,
                gap: 4,
              }}
            >
              <Body style={{ fontSize: 14, textAlign: "center" }}>
                Vocabulary: {categoryResult("vocabulary")}
              </Body>
              <Body style={{ fontSize: 14, textAlign: "center" }}>
                Comprehension: {categoryResult("comprehension")}
              </Body>
            </View>
          )}
        </Card>

        {/* Dominant Primary Action (Hick's Law: 1 Clear Next Step) */}
        {attempt.level === 3 ? (
          <Button
            testID="results-primary-action-btn"
            title="VIEW FINAL AWARDS"
            icon="award"
            tone="mint"
            arrow
            onPress={() => navigation.navigate("Final")}
            style={{ minHeight: 56 }}
          />
        ) : isNextUnlocked ? (
          <Button
            testID="results-primary-action-btn"
            title={`CONTINUE TO LEVEL ${nextLevel}`}
            icon="play"
            arrow
            disabled={busy}
            onPress={() => startLevel(nextLevel)}
            style={{ minHeight: 56 }}
          />
        ) : (
          <Button
            testID="results-primary-action-btn"
            title="TRY AGAIN FOR MASTERY"
            icon="replay"
            arrow
            disabled={busy}
            onPress={() => startLevel(attempt.level)}
            style={{ minHeight: 56 }}
          />
        )}

        {/* Secondary Auxiliary Action Tiles (Arcade Game Style with Text) */}
        <View
          testID="results-actions-container"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            paddingVertical: 4,
          }}
        >
          {/* Levels Menu */}
          <ActionTile
            testID="results-back-to-levels-btn"
            icon="grid"
            label="Levels"
            accessibilityLabel="Back to Levels"
            onPress={() => navigation.navigate("Levels")}
          />

          {/* Review Answers Checklist */}
          <ActionTile
            testID="results-toggle-answers-btn"
            icon="checklist"
            label={showAnswers ? "Hide" : "Review"}
            active={showAnswers}
            accessibilityLabel={showAnswers ? "Hide Answers" : "Review Answers"}
            onPress={() => setShowAnswers((value) => !value)}
          />

          {/* Replay / Try Again */}
          <ActionTile
            testID="results-try-again-btn"
            icon="replay"
            label="Retry"
            disabled={busy}
            accessibilityLabel="Try Again"
            onPress={() => startLevel(attempt.level)}
          />
        </View>

        {showAnswers &&
          attempt.answers.map((answer, index) => {
            const question =
              questions?.[index] || QUESTIONS[attempt.level]?.[index];
            if (!question) return null;
            const isMatching =
              question.type === "matching" ||
              question.id === "easy-matching-all" ||
              answer.choiceId === "all_matched";
            const chosen = question.choices?.find(
              (choice) => choice.id === answer.choiceId,
            );
            const yourAnswerText = isMatching
              ? (answer.correct ? "All 6 word-picture pairs matched" : "Partial matching")
              : (chosen?.label || "No answer");
            const correctAnswerText = isMatching
              ? "Match all 6 word-picture pairs correctly"
              : answerLabel(question);

            const targetWord = question.wordId ? WORDS[question.wordId] : null;
            const hasThumbnail = Boolean(
              targetWord &&
                (question.type === "pictureToWord" ||
                  question.type === "wordToPicture" ||
                  question.type === "pictureSentence")
            );

            return (
              <Card
                key={question.id}
                testID={`results-answer-card-${index}`}
                style={[
                  styles.reviewCard,
                  {
                    borderColor: answer.correct ? "#79D9A8" : "#F7A8B4",
                    backgroundColor: answer.correct ? "#FAFCFA" : "#FFF9F9",
                  },
                ]}
              >
                {/* Header row: Question index + Status pill + Audio button */}
                <View style={styles.reviewHeaderRow}>
                  <View style={styles.reviewIndexBadge}>
                    <Text style={styles.reviewIndexText}>
                      Question {index + 1}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {(targetWord?.word || question.prompt) && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Hear question"
                        onPress={() =>
                          speak(
                            targetWord?.word || question.prompt.replace("____", "blank"),
                            "en-US",
                            true
                          )
                        }
                        style={({ pressed }) => [
                          styles.reviewSpeakerBtn,
                          pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
                        ]}
                      >
                        <Icon name="sound" size={15} color={colors.primary} />
                      </Pressable>
                    )}

                    <View
                      style={[
                        styles.reviewStatusPill,
                        {
                          backgroundColor: answer.correct ? "#E8F8F0" : "#FDECEE",
                        },
                      ]}
                    >
                      <Icon
                        name={answer.correct ? "check" : "close"}
                        size={13}
                        color={answer.correct ? "#1E8D5B" : "#C0392B"}
                      />
                      <Text
                        style={[
                          styles.reviewStatusText,
                          {
                            color: answer.correct ? "#1E8D5B" : "#C0392B",
                          },
                        ]}
                      >
                        {answer.correct ? "Correct" : "Incorrect"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Question body with optional thumbnail */}
                <View style={styles.reviewBodyRow}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.reviewPromptText}>
                      {question.prompt}
                    </Text>
                  </View>

                  {hasThumbnail && (
                    <View style={styles.reviewThumbnailWrap}>
                      <WordPicture word={targetWord} height={46} />
                    </View>
                  )}
                </View>

                {/* Structured Answer Comparison Pills */}
                <View style={{ gap: 6 }}>
                  <View
                    style={[
                      styles.answerPill,
                      answer.correct ? styles.answerPillCorrect : styles.answerPillWrong,
                    ]}
                  >
                    <Icon
                      name={answer.correct ? "check" : "close"}
                      size={14}
                      color={answer.correct ? "#1E8D5B" : "#C0392B"}
                    />
                    <Text
                      style={[
                        styles.answerPillText,
                        { color: answer.correct ? "#1E8D5B" : "#C0392B" },
                      ]}
                    >
                      Your answer:{" "}
                      <Text style={{ fontFamily: "Nunito_900Black" }}>
                        {yourAnswerText}
                      </Text>
                    </Text>
                  </View>

                  {!answer.correct && (
                    <View style={[styles.answerPill, styles.answerPillCorrect]}>
                      <Icon name="check" size={14} color="#1E8D5B" />
                      <Text style={[styles.answerPillText, { color: "#1E8D5B" }]}>
                        Correct answer:{" "}
                        <Text style={{ fontFamily: "Nunito_900Black" }}>
                          {correctAnswerText}
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>

                {/* Teacher Tip / Explanation Callout */}
                {(question.explanation || targetWord?.definition) && (
                  <View style={styles.reviewCallout}>
                    <Icon name="star" size={14} color="#B57D18" />
                    <Text style={styles.reviewCalloutText}>
                      {question.explanation || targetWord?.definition}
                    </Text>
                  </View>
                )}
              </Card>
            );
          })}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: "#8C77B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewIndexBadge: {
    backgroundColor: "#F2ECFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  reviewIndexText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: colors.primary,
  },
  reviewSpeakerBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F4EEFD",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E1D4FA",
  },
  reviewStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  reviewStatusText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12.5,
  },
  reviewBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  reviewPromptText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    textAlign: "left",
  },
  reviewThumbnailWrap: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2D7F5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  answerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  answerPillCorrect: {
    backgroundColor: "#EBF9F1",
    borderColor: "#A9E8C7",
  },
  answerPillWrong: {
    backgroundColor: "#FDF0F2",
    borderColor: "#F8B7C1",
  },
  answerPillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13.5,
    lineHeight: 18,
    flexShrink: 1,
  },
  reviewCallout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FBF7ED",
    borderWidth: 1,
    borderColor: "#F5E3B8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 2,
  },
  reviewCalloutText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
    color: "#6B501B",
    flex: 1,
    textAlign: "left",
  },
});

export default ResultsScreen;
