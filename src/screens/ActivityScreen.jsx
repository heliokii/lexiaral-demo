import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { CONTENT, STORIES, feedbackFor } from "../content";
import { Icon } from "../Art";
import { speak, stopAudio } from "../audio";
import { useLearning } from "../state/LearningProvider";
import {
  currentAnswer,
  currentQuestion,
  sessionQuestions,
  sessionScore,
} from "../state/engine";
import {
  Body,
  Button,
  Card,
  ProgressBar,
  Screen,
  Title,
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
  1: "Look at the picture or word. Tap one answer. You can press the speaker button to hear the word.",
  2: "Read the sentence. Choose the missing word or its meaning.",
  3: "Read the short story. Tap underlined words for help. Then answer questions about the words and the story.",
};

export function ActivityScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();
  const session = state.session;

  const scrollRef = useRef(null);
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    setShowStory(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [session?.id, session?.index, session?.phase]);

  if (!session) {
    return (
      <Screen>
        <Title>Ready to learn?</Title>
        <Button
          title="CHOOSE A LEVEL"
          onPress={() => navigation.replace("Levels")}
        />
      </Screen>
    );
  }

  if (session.phase === "done") {
    return (
      <Screen>
        <Title>Activity complete!</Title>
        <Button
          title="SEE MY RESULT"
          onPress={() => navigation.replace("Results", { id: session.id })}
        />
      </Screen>
    );
  }

  if (session.phase === "instructions") {
    return (
      <Screen>
        <Title>Level {session.level}: Instructions</Title>
        <Card>
          <Body>{INSTRUCTIONS[session.level]}</Body>
          <Body>
            Each correct answer earns one star. A mistake is a chance to learn!
          </Body>
        </Card>

        <Button
          title="Hear instructions"
          icon="sound"
          secondary
          onPress={() => speak(INSTRUCTIONS[session.level], "en-US", true)}
        />

        <Button
          title={session.level === 3 ? "READ THE STORY" : "BEGIN"}
          disabled={busy}
          onPress={async () => {
            stopAudio();
            await dispatch({ type: "BEGIN" });
          }}
        />
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
        <InteractiveStoryReaderWidget
          story={activeStory}
          onSelectStory={(storyId) =>
            dispatch({ type: "SELECT_STORY", storyId })
          }
        />

        <Button
          title="NEXT: ANSWER QUESTIONS"
          disabled={busy}
          onPress={async () => {
            stopAudio();
            await dispatch({ type: "READ_DONE" });
          }}
        />
      </Screen>
    );
  }

  const question = currentQuestion(state);
  const answer = currentAnswer(state);
  const total = sessionQuestions(session).length;
  const feedback = answer ? feedbackFor(question, answer.correct) : "";

  const submitAnswer = async (choiceId) => {
    const next = await dispatch({
      type: "ANSWER",
      questionId: question.id,
      choiceId,
      at: new Date().toISOString(),
    });

    if (next) {
      speak(feedbackFor(question, choiceId === question.answerId));
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

  const feedbackSlot = answer ? (
    <View
      testID="activity-feedback-dock"
      style={{
        backgroundColor: answer.correct ? "#EAF8F1" : "#FFF0F3",
        borderColor: answer.correct ? "#20A464" : "#E85A71",
        borderWidth: 1.5,
        borderRadius: 20,
        padding: 12,
        gap: 8,
        shadowColor: "#7E6B9B",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -2 },
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          <Icon
            name={answer.correct ? "check" : "sound"}
            size={20}
            color={answer.correct ? "#20A464" : "#E85A71"}
          />
          <Text
            testID="activity-feedback-text"
            accessibilityLiveRegion="polite"
            style={{
              flex: 1,
              fontFamily: "Nunito_800ExtraBold",
              fontSize: 14,
              lineHeight: 19,
              color: answer.correct ? "#176640" : "#8A2B1D",
            }}
          >
            {feedback}
          </Text>
        </View>

        <Pressable
          testID="activity-hear-feedback-btn"
          accessibilityRole="button"
          accessibilityLabel="Hear feedback"
          onPress={() => speak(feedback, "en-US", true)}
          style={{
            backgroundColor: answer.correct ? "#D5F2E3" : "#FDE1DC",
            borderRadius: 10,
            padding: 7,
          }}
        >
          <Icon
            name="sound"
            size={18}
            color={answer.correct ? "#20A464" : "#E85A71"}
          />
        </Pressable>
      </View>

      <Button
        testID="activity-next-question-btn"
        title={session.index === total - 1 ? "SEE MY RESULT" : "NEXT QUESTION"}
        tone={answer.correct ? "mint" : "coral"}
        arrow
        disabled={busy}
        onPress={nextQuestion}
        style={{ minHeight: 48 }}
      />
    </View>
  ) : null;

  return (
    <Screen testID="screen-activity" scrollRef={scrollRef} bottomSlot={feedbackSlot}>
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
  );
}

export default ActivityScreen;
