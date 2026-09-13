import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

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
              gap: 16,
              shadowColor: "#5E4399",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            <Title
              testID="instructions-title"
              style={{
                fontSize: 22,
                color: colors.darkPurple,
              }}
            >
              How to Play
            </Title>

            <Text
              testID="instructions-text"
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: 17,
                lineHeight: 26,
                color: "#2C1B4D",
              }}
            >
              {INSTRUCTIONS[session.level]}
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: "#EFE8FC",
              }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "#FFF4D2",
                  borderWidth: 1,
                  borderColor: "#F7D885",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="star" size={15} color="#E59812" />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#675981",
                }}
              >
                Correct answers earn stars; mistakes help you learn!
              </Text>
            </View>
          </Card>

          <View style={{ gap: 12 }}>
            <Button
              testID="instructions-hear-btn"
              title="Hear instructions"
              icon="sound"
              secondary
              onPress={() =>
                speak(
                  `${INSTRUCTIONS[session.level]} Correct answers earn stars; mistakes help you learn!`,
                  "en-US",
                  true
                )
              }
              style={{ minHeight: 52 }}
            />

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
              style={{ minHeight: 56 }}
            />
          </View>
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
      <Screen>
        <ActivityHeader
          title={`Level ${session.level}`}
          onBack={() => navigation.navigate("Home")}
        />

        <InteractiveStoryReaderWidget
          story={activeStory}
          onSelectStory={(storyId) =>
            dispatch({ type: "SELECT_STORY", storyId })
          }
        />

        <Button
          title="NEXT: ANSWER QUESTIONS"
          tone="purple"
          arrow
          disabled={busy}
          onPress={async () => {
            stopAudio();
            await dispatch({ type: "READ_DONE" });
          }}
          style={{ minHeight: 54 }}
        />
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
            <Button
              secondary
              title={showStory ? "HIDE STORY" : "READ STORY AGAIN"}
              onPress={() => setShowStory((value) => !value)}
            />

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

            <Card>
              <Body>{question.prompt}</Body>

              <Button
                title="Hear the question"
                icon="sound"
                secondary
                onPress={() => speak(question.prompt, "en-US", true)}
              />
            </Card>

            <AnswerChoices {...widgetProps} />
          </>
        )}
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
              },
            ]}
          >
            {/* Top row: Status icon, heading title, star badge, and single replay speaker */}
            <View style={styles.sheetHeaderRow}>
              <View style={styles.statusBadgeGroup}>
                <Art
                  name={isCorrect ? "owl_happy" : "owl_sad"}
                  height={38}
                  width={38}
                />
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
            </View>

            {/* Middle row: Clean separated lines for visual hierarchy */}
            <View style={styles.sheetBodyContent}>
              {feedbackDetails.correctLabel ? (
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
              ) : null}

              {feedbackDetails.explanation ? (
                <Text style={styles.sheetExplanationText}>
                  {feedbackDetails.explanation}
                </Text>
              ) : null}
            </View>

            {/* Bottom row: Primary Action Button */}
            <Button
              testID="activity-next-question-btn"
              title={session.index === total - 1 ? "SEE MY RESULT" : "NEXT QUESTION"}
              tone={isCorrect ? "mint" : "coral"}
              arrow
              disabled={busy}
              onPress={nextQuestion}
              style={{ minHeight: 52, borderRadius: 18 }}
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
    gap: 14,
    shadowColor: "#2C1B4D",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 16,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadgeGroup: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: 8,
  },
  correctAnswerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  correctAnswerLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#6B5E80",
  },
  correctAnswerLabelCorrect: {
    color: "#187242",
  },
  correctAnswerChip: {
    backgroundColor: "#FFF0F3",
    borderWidth: 1.5,
    borderColor: "#FFC5CE",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
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
  },
  correctAnswerChipTextCorrect: {
    color: "#166F42",
  },
  sheetExplanationText: {
    fontFamily: fonts.reading,
    fontSize: 15,
    lineHeight: 22,
    color: "#352A47",
  },
});

export default ActivityScreen;
