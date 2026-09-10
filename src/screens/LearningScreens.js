import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import {
  LEVELS,
  QUESTIONS,
  UNLOCK_PERCENT,
  answerLabel,
  feedbackFor,
  performance,
} from '../content';
import { speak, stopAudio } from '../audio';
import { useLearning } from '../state/LearningProvider';
import {
  currentAnswer,
  currentQuestion,
  latestAttempt,
  sessionScore,
} from '../state/engine';
import {
  Body,
  Button,
  Card,
  ProgressBar,
  Screen,
  Title,
  Encouragement,
  colors,
} from '../components/ui';
import { Art, Icon } from '../Art';
import {
  AnswerChoices,
  FlashcardQuestionWidget,
  InteractiveStoryReaderWidget,
  SentenceCompletionQuestionWidget,
} from '../components/learning';

function newSessionAction(level) {
  return {
    type: 'START',
    level,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    at: new Date().toISOString(),
  };
}

export function LevelsScreen({ navigation }) {
  const { state, dispatch, busy } = useLearning();

  const start = async (level) => {
    const next = await dispatch(newSessionAction(level));

    if (next) navigation.navigate('Activity');
  };

  const requestStart = (level) => {
    const unfinished =
      state.session && state.session.phase !== 'done';

    if (!unfinished) {
      start(level);
      return;
    }

    Alert.alert(
      'Start a new activity?',
      'Your current activity will be replaced. Stars and completed results already saved will stay.',
      [
        { text: 'Keep my activity', style: 'cancel' },
        { text: 'Start new', onPress: () => start(level) },
      ]
    );
  };

  const resume = () => {
    if (state.session.phase === 'done') {
      navigation.navigate('Results', { id: state.session.id });
    } else {
      navigation.navigate('Activity');
    }
  };

  return (
    <Screen>
      <Title>Choose your level</Title>
      <Body>Know the word. Use the word. Read the word.</Body>

      {state.session && (
        <Button
          title={
            state.session.phase === 'done'
              ? 'VIEW LAST RESULT'
              : 'RESUME MY ACTIVITY'
          }
          onPress={resume}
          disabled={busy}
        />
      )}

      {LEVELS.map((level) => {
        const unlocked = state.unlocked.includes(level.id);
        const latest = latestAttempt(state, level.id);

        return (
          <Card key={level.id}>
            <Title>
              {unlocked ? '📚' : '🔒'} Level {level.id}: {level.name}
            </Title>

            <Body>{level.title}</Body>
            <Body>{level.description}</Body>

            {latest && (
              <Body>
                Latest completed score: {latest.score}/{latest.total}
              </Body>
            )}

            {!unlocked && (
              <Body>
                {UNLOCK_PERCENT === 0
                  ? 'Complete the previous level to unlock this one.'
                  : `Complete the previous level with at least ${UNLOCK_PERCENT}% to unlock this one.`}
              </Body>
            )}

            <Button
              title={unlocked ? 'LET’S LEARN' : 'LOCKED'}
              disabled={!unlocked || busy}
              onPress={() => requestStart(level.id)}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const INSTRUCTIONS = {
  1: 'Look at the picture or word. Tap one answer. You can press the speaker button to hear the word.',
  2: 'Read the sentence. Choose the missing word or its meaning.',
  3: 'Read the short story. Tap underlined words for help. Then answer questions about the words and the story.',
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
          onPress={() => navigation.replace('Levels')}
        />
      </Screen>
    );
  }

  if (session.phase === 'done') {
    return (
      <Screen>
        <Title>Activity complete!</Title>
        <Button
          title="SEE MY RESULT"
          onPress={() =>
            navigation.replace('Results', { id: session.id })
          }
        />
      </Screen>
    );
  }

  if (session.phase === 'instructions') {
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
          title="🔊 HEAR INSTRUCTIONS"
          secondary
          onPress={() =>
            speak(INSTRUCTIONS[session.level], 'en-US', true)
          }
        />

        <Button
          title={session.level === 3 ? 'READ THE STORY' : 'BEGIN'}
          disabled={busy}
          onPress={async () => {
            stopAudio();
            await dispatch({ type: 'BEGIN' });
          }}
        />
      </Screen>
    );
  }

  if (session.phase === 'story') {
    return (
      <Screen>
        <InteractiveStoryReaderWidget />

        <Button
          title="NEXT: ANSWER QUESTIONS"
          disabled={busy}
          onPress={async () => {
            stopAudio();
            await dispatch({ type: 'READ_DONE' });
          }}
        />
      </Screen>
    );
  }

  const question = currentQuestion(state);
  const answer = currentAnswer(state);
  const total = QUESTIONS[session.level].length;
  const feedback = answer ? feedbackFor(question, answer.correct) : '';

  const submitAnswer = async (choiceId) => {
    const next = await dispatch({
      type: 'ANSWER',
      questionId: question.id,
      choiceId,
      at: new Date().toISOString(),
    });

    if (next) {
      speak(
        feedbackFor(
          question,
          choiceId === question.answerId
        )
      );
    }
  };

  const nextQuestion = async () => {
    stopAudio();

    const next = await dispatch({
      type: 'NEXT',
      questionId: question.id,
      at: new Date().toISOString(),
    });

    if (next?.session.phase === 'done') {
      navigation.replace('Results', { id: next.session.id });
    }
  };

  const widgetProps = {
    question,
    selected: answer,
    disabled: busy,
    onAnswer: submitAnswer,
  };

  return (
    <Screen scrollRef={scrollRef}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Body
          style={{
            flex: 1,
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 16,
          }}
        >
          Question {session.index + 1} of {total}
        </Body>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#FFF5DA',
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Icon name="star" size={22} color="#F2C456" />
          <Body
            style={{
              fontFamily: 'Nunito_900Black',
              fontSize: 17,
            }}
          >
            {sessionScore(session)}
          </Body>
        </View>
      </View>

      <ProgressBar
        value={session.answers.length / total}
        label="Questions answered"
      />

      {session.level === 1 && (
        <FlashcardQuestionWidget {...widgetProps} />
      )}

      {session.level === 2 && (
        <SentenceCompletionQuestionWidget {...widgetProps} />
      )}

      {session.level === 3 && (
        <>
          <Button
            secondary
            title={showStory ? 'HIDE STORY' : 'READ STORY AGAIN'}
            onPress={() => setShowStory((value) => !value)}
          />

          {showStory && <InteractiveStoryReaderWidget />}

          <Card>
            <Body>{question.prompt}</Body>

            <Button
              title="🔊 HEAR THE QUESTION"
              secondary
              onPress={() => speak(question.prompt, 'en-US', true)}
            />
          </Card>

          <AnswerChoices {...widgetProps} />
        </>
      )}

      {answer && (
        <Card
          style={{
            backgroundColor: answer.correct
              ? colors.paleGreen
              : colors.paleOrange,
          }}
        >
          <Body accessibilityLiveRegion="polite">{feedback}</Body>

          <Button
            title="🔊 HEAR FEEDBACK"
            secondary
            onPress={() => speak(feedback, 'en-US', true)}
          />

          <Button
            title={
              session.index === total - 1
                ? 'SEE MY RESULT'
                : 'NEXT QUESTION'
            }
            disabled={busy}
            onPress={nextQuestion}
          />
        </Card>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginTop: 6,
        }}
      >
        <Art name="owl-cheering" width={110} height={118} />
        <Encouragement />
      </View>
    </Screen>
  );
}

export function ResultsScreen({ navigation, route }) {
  const { state, dispatch, busy } = useLearning();
  const [showAnswers, setShowAnswers] = useState(false);

  const attempt = state.history.find(
    (item) => item.id === route.params?.id
  );

  useEffect(() => {
    if (attempt) {
      speak(
        `${performance(attempt.score, attempt.total)} You earned ${attempt.score} stars out of ${attempt.total}.`
      );
    }
  }, [attempt?.id]);

  if (!attempt) {
    return (
      <Screen>
        <Title>No result found</Title>
        <Button
          title="MY PROGRESS"
          onPress={() => navigation.replace('Progress')}
        />
      </Screen>
    );
  }

  const questions = QUESTIONS[attempt.level];

  const startLevel = async (level) => {
    const next = await dispatch(newSessionAction(level));

    if (next) navigation.replace('Activity');
  };

  const categoryResult = (category) => {
    const answers = attempt.answers.filter(
      (_, index) => questions[index].category === category
    );

    return `${answers.filter((answer) => answer.correct).length}/${answers.length}`;
  };

  return (
    <Screen>
      <Art name="owl-cheering" height={175} />
      <Title>{performance(attempt.score, attempt.total)}</Title>

      <Card>
        <Body>Level {attempt.level} complete</Body>
        <Title>
          {attempt.score} / {attempt.total}
        </Title>
        <Body>⭐ {attempt.score} stars earned</Body>

        {attempt.level === 3 && (
          <>
            <Body>Vocabulary: {categoryResult('vocabulary')}</Body>
            <Body>Comprehension: {categoryResult('comprehension')}</Body>
          </>
        )}
      </Card>

      <Button
        title="REVIEW WORDS"
        secondary
        onPress={() => navigation.navigate('Review')}
      />

      <Button
        title={showAnswers ? 'HIDE ANSWERS' : 'REVIEW MY ANSWERS'}
        secondary
        onPress={() => setShowAnswers((value) => !value)}
      />

      {showAnswers &&
        attempt.answers.map((answer, index) => {
          const question = questions[index];
          const chosen = question.choices.find(
            (choice) => choice.id === answer.choiceId
          );

          return (
            <Card key={question.id}>
              <Body>
                {index + 1}. {question.prompt}
              </Body>

              {!!question.sentence && <Body>{question.sentence}</Body>}

              <Body>Your answer: {chosen.label}</Body>
              <Body>Correct answer: {answerLabel(question)}</Body>
              <Body>{question.explanation}</Body>
            </Card>
          );
        })}

      <Button
        title="TRY AGAIN"
        disabled={busy}
        onPress={() => startLevel(attempt.level)}
      />

      {attempt.level < 3 && (
        state.unlocked.includes(attempt.level + 1) ? (
          <Button
            title={`CONTINUE TO LEVEL ${attempt.level + 1}`}
            disabled={busy}
            onPress={() => startLevel(attempt.level + 1)}
          />
        ) : (
          <Body>
            Keep practicing! Earn at least {UNLOCK_PERCENT}% to unlock
            the next level.
          </Body>
        )
      )}

      {attempt.level === 3 && (
        <Button
          title="FINAL RESULTS & BADGES"
          onPress={() => navigation.navigate('Final')}
        />
      )}

      <Button
        title="HOME"
        secondary
        onPress={() => navigation.popToTop()}
      />
    </Screen>
  );
}