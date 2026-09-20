import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTENT, STORIES, getFeedbackDetails } from "../content";
import { Art, Icon } from "../Art";
import {
  playErrorSfx,
  playSuccessSfx,
  setBgmFocusMode,
  speak,
  stopAudio,
} from "../audio";
import { useLearning } from "../state/LearningProvider";
import {
  currentAnswer,
  currentQuestion,
  sessionQuestions,
  sessionScore,
} from "../state/engine";
import {
  ActivityHeader,
  Body,
  Button,
  Card,
  ProgressBar,
  Screen,
  Title,
  colors,
  fonts,
} from "../components/ui";
import {
  AnswerChoices,
  FlashcardQuestionWidget,
  InteractiveStoryReaderWidget,
  MatchingPairsQuestionWidget,
  SentenceCompletionQuestionWidget,
} from "../components/learning";

export function newSessionAction(level) {
  return {
    type: "START",
    level,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    at: new Date().toISOString(),
  };
}

const INSTRUCTIONS = {
  1: "Look at the picture or word, then tap your answer.",
  2: "Read the sentence, then choose the missing word or meaning.",
  3: "Read the short story, then answer the questions.",
};

export function ActivityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, dispatch, busy } = useLearning();
  const session = state.session;

  const scrollRef = useRef(null);
  const [showStory, setShowStory] = useState(false);

  const slideAnim = useRef(new Animated.Value(320)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Enable soft BGM focus mode during interactive activities
  useEffect(() => {
    setBgmFocusMode(true);
    return () => {
      setBgmFocusMode(false);
      stopAudio();
    };
  }, []);

  useEffect(() => {
    setShowStory(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    return () => {
      stopAudio();
    };
  }, [session?.id, session?.index, session?.phase]);

  const question = currentQuestion(state);
  const answer = currentAnswer(state);
  const total = sessionQuestions(session).length;
  const isCorrect = Boolean(answer?.correct);
  const feedbackDetails = answer && question ? getFeedbackDetails(question, isCorrect) : null;

  // Animate bottom modal slide up whenever an answer is submitted
  useEffect(() => {
    if (answer) {
      slideAnim.setValue(320);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 48,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [answer?.choiceId]);

  if (!session) {
    return (
      <Screen>
        <ActivityHeader
          title="Activity"
          onBack={() => navigation.navigate("Home")}
        />
        <View style={{ flex: 1, justifyContent: "center", gap: 16, paddingVertical: 20 }}>
          <Title style={{ textAlign: "center" }}>Ready to learn?</Title>
          <Button
            title="CHOOSE A LEVEL"
            tone="purple"
            arrow
            onPress={() => navigation.replace("Levels")}
          />
        </View>
      </Screen>
    );
  }

  if (session.phase === "done") {
    return (
      <Screen>
        <ActivityHeader
          title={`Level ${session.level}`}
          onBack={() => navigation.navigate("Home")}
        />
        <View style={{ flex: 1, justifyContent: "center", gap: 16, paddingVertical: 20 }}>
          <Title style={{ textAlign: "center" }}>Activity complete!</Title>
          <Button
            title="SEE MY RESULT"
            tone="purple"
            arrow
            onPress={() => navigation.replace("Results", { id: session.id })}
          />
        </View>
      </Screen>
    );
  }

  if (session.phase === "instructions") {
    return (
      <Screen>
        <ActivityHeader
          title={`Level ${session.level}`}
          onBack={() => navigation.navigate("Home")}
        />

        <View
          testID="instructions-container"
          style={{
            flex: 1,
            justifyContent: "center",
            paddingVertical: 18,
            gap: 16,
          }}
        >
          <Card
            testID="instructions-card"
            style={{
              padding: 24,
              borderRadius: 24,
              borderColor: "#DCD0F8",
              borderWidth: 1.5,
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              alignItems: "center",
              gap: 14,
              shadowColor: "#5E4399",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
              position: "relative",
            }}
          >
            {/* Top-right absolute audio button */}
            <Pressable
              testID="instructions-hear-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Hear instructions"
              onPress={() =>
                speak(
                  `${INSTRUCTIONS[session.level]} Correct answers earn stars; mistakes help you learn!`,
                  "en-US",
                  true
                )
              }
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 18,
                  right: 18,
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#F4EEFD",
                  borderWidth: 1,
                  borderColor: "#E1D4FA",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#8C77B0",
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                },
                pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
              ]}
            >
              <Icon name="sound" size={19} color={colors.primary} />
            </Pressable>

            <View style={{ alignItems: "center", paddingVertical: 4 }}>
              <Art name="owl_thinking" height={108} width={108} />
            </View>

            <Title
              testID="instructions-title"
              style={{
                fontSize: 24,
                lineHeight: 30,
                color: colors.darkPurple,
                textAlign: "center",
              }}
            >
              How to Play
            </Title>

            <Text
              testID="instructions-text"
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: 17.5,
                lineHeight: 26,
                color: "#2C1B4D",
                textAlign: "center",
                paddingHorizontal: 8,
              }}
            >
              {INSTRUCTIONS[session.level]}
            </Text>

            <View
              style={{
                height: 1,
                width: "90%",
                backgroundColor: "#EFE8FC",
                marginVertical: 2,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#FFF8E7",
                borderWidth: 1,
                borderColor: "#F7DE9B",
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 7,
                alignSelf: "center",
              }}
            >
              <Icon name="star" size={16} color="#E59812" />
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 13.5,
                  lineHeight: 19,
                  color: "#7A5918",
                  textAlign: "center",
                }}
              >
                Correct answers earn stars; mistakes help you learn!
              </Text>
            </View>
          </Card>

          <Button
            testID="instructions-begin-btn"
            title={session.level === 3 ? "READ THE STORY" : "BEGIN"}
            tone="purple"
            arrow
            disabled={busy}
            onPress={async () => {
              stopAudio();
              await dispatch({ type: "BEGIN" });
            }}
            style={{ minHeight: 56, marginTop: 8 }}
          />
        </View>
      </Screen>
    );
  }

  if (session.phase === "story") {
    const activeStory =
      (STORIES || []).find(
        (s) => s.id === (session.storyId || state.selectedStoryId),
      ) || CONTENT.story;

    return (
      <Screen
        bottomSlot={
          <Button
            title="ANSWER QUESTIONS"
            tone="purple"
            arrow
            disabled={busy}
            onPress={async () => {
              stopAudio();
              await dispatch({ type: "READ_DONE" });
            }}
            style={{ minHeight: 54 }}
          />
        }
      >
        <ActivityHeader
          title={`Level ${session.level}`}
          onBack={() => navigation.navigate("Home")}
        />

        <View
          style={{
            paddingTop: 6,
            paddingBottom: 12,
          }}
        >
          <InteractiveStoryReaderWidget
            story={activeStory}
            onSelectStory={(storyId) =>
              dispatch({ type: "SELECT_STORY", storyId })
            }
          />
        </View>
      </Screen>
    );
  }

  const submitAnswer = async (choiceId) => {
    stopAudio();
    const correct = choiceId === question.answerId;

    // 1. Play zero-latency procedural SFX
    if (correct) {
      playSuccessSfx();
    } else {
      playErrorSfx();
    }

    const next = await dispatch({
      type: "ANSWER",
      questionId: question.id,
      choiceId,
      at: new Date().toISOString(),
    });

    // 2. Female voice speaks after 260ms (once SFX finishes)
    if (next) {
      const details = getFeedbackDetails(question, correct);
      setTimeout(() => {
        speak(details.fullSpeech, "en-US", true);
      }, 260);
    }
  };

  const nextQuestion = async () => {
    stopAudio();

    const next = await dispatch({
      type: "NEXT",
      questionId: question.id,
      at: new Date().toISOString(),
    });

    if (next?.session.phase === "done") {
      navigation.replace("Results", { id: next.session.id });
    }
  };

  const widgetProps = {
    question,
    selected: answer,
    disabled: busy,
    onAnswer: submitAnswer,
  };

  const levelTitle =
    session.level === 1
      ? "Easy Level"
      : session.level === 2
        ? "Average Level"
        : "Difficult Level";

  return (
    <View style={styles.container}>
      <ActivityHeader
        title={levelTitle}
        onBack={() => {
          stopAudio();
          navigation.navigate("Levels");
        }}
      />
      <Screen testID="screen-activity" scrollRef={scrollRef}>
        <View
          testID="activity-question-header"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Body
            testID="activity-question-index"
            style={{
              flex: 1,
              fontFamily: "Nunito_800ExtraBold",
              fontSize: 16,
            }}
          >
            Question {session.index + 1} of {total}
          </Body>

          <View
            testID="activity-star-counter"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#FFF5DA",
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Icon name="star" size={20} color="#F5A623" />
            <Body
              testID="activity-star-counter-text"
              style={{
                fontFamily: "Nunito_900Black",
                fontSize: 16,
                color: "#8D7040",
              }}
            >
              {sessionScore(session)}
            </Body>
          </View>
        </View>

        <ProgressBar
          testID="activity-progress-bar"
          value={session.answers.length / total}
          label="Questions answered"
        />

        <View style={styles.questionBodyWrapper}>
          {session.level === 1 && question.type === "matching" && (
            <MatchingPairsQuestionWidget {...widgetProps} />
          )}

          {session.level === 1 && question.type !== "matching" && (
            <FlashcardQuestionWidget {...widgetProps} />
          )}

          {session.level === 2 && (
            <SentenceCompletionQuestionWidget {...widgetProps} />
          )}

          {session.level === 3 && (
            <>
              {showStory && (
                <InteractiveStoryReaderWidget
                  story={
                    (STORIES || []).find(
                      (s) => s.id === (session.storyId || state.selectedStoryId),
                    ) || CONTENT.story
                  }
                  onSelectStory={(storyId) =>
                    dispatch({ type: "SELECT_STORY", storyId })
                  }
                />
              )}

              <Card style={styles.storyQuestionCard}>
                <View style={styles.storyQuestionHeaderRow}>
                  <Pressable
                    testID="level3-toggle-story-btn"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={
                      showStory ? "Hide story text" : "Read story again"
                    }
                    onPress={() => setShowStory((value) => !value)}
                    style={({ pressed }) => [
                      styles.storyBadgeBtn,
                      showStory && styles.storyBadgeBtnActive,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <Icon
                      name="book"
                      size={14}
                      color={showStory ? "#FFFFFF" : colors.primary}
                    />
                    <Text
                      style={[
                        styles.storyBadgeBtnText,
                        showStory && styles.storyBadgeBtnTextActive,
                      ]}
                    >
                      {showStory ? "Hide Story" : "Read Story"}
                    </Text>
                  </Pressable>

                  <Pressable
                    testID="level3-hear-question-btn"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel="Hear the question"
                    onPress={() => speak(question.prompt, "en-US", true)}
                    style={({ pressed }) => [
                      styles.questionSpeakerBtn,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.92 }] },
                    ]}
                  >
                    <Icon name="sound" size={18} color={colors.primary} />
                  </Pressable>
                </View>

                <Text style={styles.storyQuestionPromptText}>
                  {question.prompt}
                </Text>
              </Card>

              <AnswerChoices {...widgetProps} />
            </>
          )}
        </View>
      </Screen>

      {/* Full-screen backdrop and sliding Bottom Modal Sheet */}
      {answer && feedbackDetails && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          {/* Backdrop dimmer that blocks clicks to choices or background */}
          <Animated.View
            style={[styles.modalDimmer, { opacity: backdropAnim }]}
            pointerEvents="auto"
          />

          {/* Animated sliding bottom sheet */}
          <Animated.View
            testID="activity-feedback-tray"
            style={[
              styles.bottomSheet,
              {
                borderColor: isCorrect ? "#8FE3B6" : "#FFAFA7",
                transform: [{ translateY: slideAnim }],
                paddingBottom: Math.max(insets.bottom + 16, 24),
              },
            ]}
          >
            {/* Top-right absolute audio replay speaker */}
            <Pressable
              testID="activity-hear-feedback-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Hear feedback explanation"
              onPress={() => speak(feedbackDetails.fullSpeech, "en-US", true)}
              style={({ pressed }) => [
                styles.sheetSpeakerBtn,
                pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
              ]}
            >
              <Icon
                name="sound"
                size={19}
                color={isCorrect ? "#1A7B48" : "#C7384D"}
              />
            </Pressable>

            {/* Centered Large Mascot Owl Icon */}
            <View style={styles.sheetMascotWrap}>
              <Art
                name={isCorrect ? "owl_happy" : "owl_sad"}
                height={88}
                width={88}
              />
            </View>

            {/* Centered Status Title and Badge */}
            <View style={styles.statusBadgeGroup}>
              <View
                style={[
                  styles.statusIconCircle,
                  isCorrect ? styles.iconCircleCorrect : styles.iconCircleWrong,
                ]}
              >
                <Icon
                  name={isCorrect ? "check" : "close"}
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text
                style={[
                  styles.statusTitleText,
                  isCorrect ? styles.statusTitleCorrect : styles.statusTitleWrong,
                ]}
              >
                {feedbackDetails.title}
              </Text>
              {isCorrect && (
                <View style={styles.starPill}>
                  <Icon name="star" size={13} color="#D88F0C" />
                  <Text style={styles.starPillText}>+1</Text>
                </View>
              )}
            </View>

            {/* Centered Body Details */}
            <View style={styles.sheetBodyContent}>
              {feedbackDetails.correctLabel ? (
                feedbackDetails.isMatching ? (
                  <View style={styles.correctAnswerRow}>
                    <View
                      style={[
                        styles.correctAnswerChip,
                        styles.correctAnswerChipCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.correctAnswerChipText,
                          styles.correctAnswerChipTextCorrect,
                        ]}
                      >
                        All pairs matched!
                      </Text>
                    </View>
                  </View>
                ) : feedbackDetails.correctLabel.length > 24 ? (
                  <View style={styles.correctAnswerColLong}>
                    <Text
                      style={[
                        styles.correctAnswerLabelLong,
                        isCorrect && styles.correctAnswerLabelCorrect,
                      ]}
                    >
                      CORRECT ANSWER
                    </Text>
                    <View
                      style={[
                        styles.correctAnswerChip,
                        styles.correctAnswerCardLong,
                        isCorrect && styles.correctAnswerChipCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.correctAnswerChipText,
                          styles.correctAnswerChipTextLong,
                          isCorrect && styles.correctAnswerChipTextCorrect,
                        ]}
                      >
                        {feedbackDetails.correctLabel}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.correctAnswerRow}>
                    <Text
                      style={[
                        styles.correctAnswerLabel,
                        isCorrect && styles.correctAnswerLabelCorrect,
                      ]}
                    >
                      Correct answer:
                    </Text>
                    <View
                      style={[
                        styles.correctAnswerChip,
                        isCorrect && styles.correctAnswerChipCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.correctAnswerChipText,
                          isCorrect && styles.correctAnswerChipTextCorrect,
                        ]}
                      >
                        {feedbackDetails.correctLabel}
                      </Text>
                    </View>
                  </View>
                )
              ) : null}

              {feedbackDetails.explanation ? (
                <Text style={styles.sheetExplanationText}>
                  {feedbackDetails.explanation}
                </Text>
              ) : null}
            </View>

            {/* Bottom Primary Action Button */}
            <Button
              testID="activity-next-question-btn"
              title={session.index === total - 1 ? "SEE MY RESULT" : "NEXT QUESTION"}
              tone={isCorrect ? "mint" : "coral"}
              arrow
              disabled={busy}
              onPress={nextQuestion}
              style={{ minHeight: 54, borderRadius: 20, width: "100%" }}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalDimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18, 12, 32, 0.46)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  },
  bottomSheet: {
    width: "100%",
    maxWidth: 540,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#DECFFC",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 12,
    alignItems: "center",
    shadowColor: "#2C1B4D",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 16,
  },
  sheetMascotWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  statusIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleCorrect: {
    backgroundColor: "#20A464",
  },
  iconCircleWrong: {
    backgroundColor: "#E85A71",
  },
  statusTitleText: {
    fontFamily: "Nunito_900Black",
    fontSize: 20,
    letterSpacing: 0.2,
  },
  statusTitleCorrect: {
    color: "#166F42",
  },
  statusTitleWrong: {
    color: "#A4283A",
  },
  starPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF4D4",
    borderWidth: 1,
    borderColor: "#F2D38A",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  starPillText: {
    fontFamily: "Nunito_900Black",
    fontSize: 13,
    color: "#996205",
  },
  sheetSpeakerBtn: {
    position: "absolute",
    top: 16,
    right: 18,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4EEFD",
    borderWidth: 1,
    borderColor: "#E1D4FA",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBodyContent: {
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  correctAnswerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  correctAnswerColLong: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "100%",
    gap: 6,
  },
  correctAnswerLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#6B5E80",
  },
  correctAnswerLabelLong: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    letterSpacing: 0.8,
    color: "#7E6E96",
  },
  correctAnswerLabelCorrect: {
    color: "#187242",
  },
  correctAnswerChip: {
    backgroundColor: "#FFF0F3",
    borderWidth: 1.5,
    borderColor: "#FFC5CE",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    maxWidth: "100%",
    flexShrink: 1,
  },
  correctAnswerCardLong: {
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  correctAnswerChipCorrect: {
    backgroundColor: "#E8F8F0",
    borderColor: "#8FE3B6",
  },
  correctAnswerChipText: {
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    color: "#A32437",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  correctAnswerChipTextLong: {
    fontFamily: fonts.reading,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: "700",
  },
  correctAnswerChipTextCorrect: {
    color: "#166F42",
  },
  sheetExplanationText: {
    fontFamily: fonts.reading,
    fontSize: 15,
    lineHeight: 22,
    color: "#352A47",
    textAlign: "center",
  },
  storyQuestionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#E5DAFA",
    gap: 10,
    shadowColor: "#6B42A6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  storyQuestionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storyBadgeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3EDFD",
    borderWidth: 1,
    borderColor: "#D8C4F6",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  storyBadgeBtnActive: {
    backgroundColor: "#7548C7",
    borderColor: "#7548C7",
  },
  storyBadgeBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#6937BE",
  },
  storyBadgeBtnTextActive: {
    color: "#FFFFFF",
  },
  questionSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3EDFD",
    borderWidth: 1,
    borderColor: "#D8C4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  questionBodyWrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 16,
    gap: 16,
  },
  storyQuestionPromptText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    lineHeight: 30,
    color: "#281B45",
  },
});

export default ActivityScreen;
