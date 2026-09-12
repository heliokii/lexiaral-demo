import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { QUESTIONS, UNLOCK_PERCENT, answerLabel, performance } from "../content";
import { Art, Icon } from "../Art";
import { speak } from "../audio";
import { useLearning } from "../state/LearningProvider";
import { isLevelUnlocked } from "../state/engine";
import { Body, Button, Card, Screen, Title, colors } from "../components/ui";
import { newSessionAction } from "./ActivityScreen";

export function ResultsScreen({ navigation, route }) {
  const { state, dispatch, busy } = useLearning();
  const [showAnswers, setShowAnswers] = useState(false);

  const attempt = state.history.find((item) => item.id === route.params?.id);

  useEffect(() => {
    if (attempt) {
      speak(
        `${performance(attempt.score, attempt.total)} You earned ${attempt.score} stars out of ${attempt.total}.`,
      );
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

  const questions = QUESTIONS[attempt.level];

  const startLevel = async (level) => {
    const next = await dispatch(newSessionAction(level));

    if (next) navigation.replace("Activity");
  };

  const categoryResult = (category) => {
    const answers = attempt.answers.filter(
      (_, index) => questions[index].category === category,
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

  return (
    <Screen testID="screen-results">
      <View testID="results-summary-header" style={{ alignItems: "center", gap: 6, paddingTop: 6 }}>
        <Art name="owl-cheering" height={160} />
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
          paddingVertical: 18,
          gap: 10,
          borderColor: "#DECFFC",
          borderWidth: 1.5,
        }}
      >
        <View testID="results-stars-row" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="star" size={28} color="#F5A623" />
          <Icon
            name="star"
            size={28}
            color={
              attempt.total > 0 && attempt.score / attempt.total >= 0.5
                ? "#F5A623"
                : "#DDD7E8"
            }
          />
          <Icon
            name="star"
            size={28}
            color={
              attempt.total > 0 && attempt.score / attempt.total >= 0.8
                ? "#F5A623"
                : "#DDD7E8"
            }
          />
        </View>

        <Title testID="results-score-fraction" style={{ fontSize: 34, color: colors.darkPurple }}>
          {attempt.score} / {attempt.total}
        </Title>

        <Text
          testID="results-stars-earned-text"
          style={{
            fontFamily: "Nunito_800ExtraBold",
            fontSize: 16,
            color: "#8D7040",
          }}
        >
          {attempt.score} Stars Earned
        </Text>

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
            <Body style={{ fontSize: 14 }}>
              Vocabulary: {categoryResult("vocabulary")}
            </Body>
            <Body style={{ fontSize: 14 }}>
              Comprehension: {categoryResult("comprehension")}
            </Body>
          </View>
        )}
      </Card>

      {/* Dominant Primary Action (Von Restorff Effect) */}
      {attempt.level === 3 ? (
        <Button
          testID="results-primary-action-btn"
          title="VIEW FINAL BADGES & AWARDS"
          tone="mint"
          arrow
          onPress={() => navigation.navigate("Final")}
        />
      ) : isNextUnlocked ? (
        <Button
          testID="results-primary-action-btn"
          title={`CONTINUE TO LEVEL ${nextLevel}`}
          arrow
          disabled={busy}
          onPress={() => startLevel(nextLevel)}
        />
      ) : (
        <Button
          testID="results-primary-action-btn"
          title="TRY AGAIN FOR MASTERY"
          arrow
          disabled={busy}
          onPress={() => startLevel(attempt.level)}
        />
      )}

      {/* Secondary Actions (Quiet, Collapsible) */}
      <View testID="results-secondary-actions-row" style={{ flexDirection: "row", gap: 10 }}>
        {attempt.level < 3 && isNextUnlocked && (
          <Button
            testID="results-try-again-btn"
            title="Try Again"
            secondary
            disabled={busy}
            onPress={() => startLevel(attempt.level)}
            style={{ flex: 1, minHeight: 48 }}
          />
        )}
        <Button
          testID="results-toggle-answers-btn"
          title={showAnswers ? "Hide Answers" : "Review Answers"}
          secondary
          onPress={() => setShowAnswers((value) => !value)}
          style={{ flex: 1, minHeight: 48 }}
        />
      </View>

      {showAnswers &&
        attempt.answers.map((answer, index) => {
          const question = questions[index];
          const chosen = question.choices.find(
            (choice) => choice.id === answer.choiceId,
          );

          return (
            <Card
              key={question.id}
              testID={`results-answer-card-${index}`}
              style={{
                borderColor: answer.correct ? "#20A464" : "#E85A71",
                borderWidth: 1.5,
                backgroundColor: answer.correct ? "#F6FCF8" : "#FFF9F9",
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito_800ExtraBold",
                  fontSize: 15,
                  color: colors.darkPurple,
                }}
              >
                Question {index + 1}: {question.prompt}
              </Text>

              {!!question.sentence && (
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 14,
                    color: colors.text,
                  }}
                >
                  {question.sentence}
                </Text>
              )}

              <Text
                style={{
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: 14,
                  color: answer.correct ? "#1E8D5B" : "#C0392B",
                }}
              >
                Your answer: {chosen?.label}
              </Text>

              {!answer.correct && (
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 14,
                    color: "#1E8D5B",
                  }}
                >
                  Correct answer: {answerLabel(question)}
                </Text>
              )}

              {!!question.explanation && (
                <Text
                  style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 13,
                    color: colors.muted,
                  }}
                >
                  {question.explanation}
                </Text>
              )}
            </Card>
          );
        })}

      <Button
        testID="results-back-to-levels-btn"
        title="Back to Levels"
        secondary
        onPress={() => navigation.navigate("Levels")}
        style={{ minHeight: 48 }}
      />
    </Screen>
  );
}

export default ResultsScreen;
