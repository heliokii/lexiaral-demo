import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { CONTENT, WORDS } from '../content';
import { illustrations } from '../illustrations';
import { pronounce, speak } from '../audio';
import { Art, Icon } from '../Art';
import {
  Body,
  Button,
  Card,
  Title,
  colors,
} from './ui';

export function WordPicture({ word, height = 170 }) {
  const key = word.image_url.replace('asset://', '');

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Picture of ${word.word}`}
      style={{ alignItems: 'center' }}
    >
      {key === 'basket' ? (
        <Art name="basket" height={height} />
      ) : (
        <SvgXml
          xml={illustrations[key]}
          width="100%"
          height={height}
        />
      )}
    </View>
  );
}

const tileColors = [
  '#DDD2FA',
  '#FADBE4',
  '#D5F0E8',
  '#FFF0C8',
];

export function AnswerChoices({
  question,
  selected,
  disabled,
  onAnswer,
  pictures = false,
}) {
  const { width, fontScale } = useWindowDimensions();

  const compactAnswers = question.choices.every(
    (choice) => choice.label.length <= 18
  );

  // Larger accessibility text switches to one column.
  const grid =
    width >= 340 &&
    fontScale < 1.35 &&
    (pictures || compactAnswers);

  return (
    <View style={[styles.answers, grid && styles.answerGrid]}>
      {question.choices.map((choice, index) => {
        const revealed = selected != null;
        const correct = revealed && choice.id === question.answerId;
        const chosen = selected?.choiceId === choice.id;
        const wrong = revealed && chosen && !correct;

        return (
          <Pressable
            key={choice.id}
            accessibilityRole="button"
            accessibilityLabel={
              pictures
                ? `Picture ${index + 1}: ${WORDS[choice.wordId].word}`
                : choice.label
            }
            accessibilityState={{
              disabled: disabled || revealed,
              selected: chosen,
            }}
            disabled={disabled || revealed}
            onPress={() => onAnswer(choice.id)}
            style={({ pressed }) => [
              styles.answer,
              { backgroundColor: tileColors[index % tileColors.length] },
              grid && styles.gridTile,
              correct && styles.correct,
              wrong && styles.wrong,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            {pictures ? (
              <>
                <Text style={styles.pictureLabel}>Picture {index + 1}</Text>
                <WordPicture word={WORDS[choice.wordId]} height={108} />
              </>
            ) : (
              <Text style={styles.answerText}>{choice.label}</Text>
            )}

            {correct && (
              <Text style={styles.answerStatus}>✓ Correct</Text>
            )}

            {wrong && (
              <Text style={styles.answerStatus}>Nice try!</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export function FlashcardQuestionWidget(props) {
  const { question } = props;
  const word = WORDS[question.wordId];

  return (
    <View style={{ gap: 14 }}>
      <Card style={styles.questionCard}>
        <Title style={styles.questionTitle}>
          {question.type === 'pictureToWord'
            ? 'What is this?'
            : `Find the ${word.word}`}
        </Title>

        {question.type === 'pictureToWord' ? (
  <WordPicture word={word} height={210} />
) : (
  <View style={{ paddingVertical: 36, alignItems: 'center', gap: 10 }}>
    <Icon name="book" size={44} />
    <Title style={{ fontSize: 38 }}>{word.word}</Title>
  </View>
)}

        <Button
          title="Hear the word"
          icon="sound"
          secondary
          onPress={() => pronounce(word)}
          style={{ minHeight: 46, alignSelf: 'center' }}
        />
      </Card>

      <AnswerChoices
        {...props}
        pictures={question.type === 'wordToPicture'}
      />
    </View>
  );
}

export function SentenceCompletionQuestionWidget(props) {
  const { question } = props;

  return (
    <View style={{ gap: 14 }}>
      <Card style={styles.questionCard}>
        <Art name="owl-reading" height={110} />

        <Title style={styles.questionTitle}>
          {question.sentence}
        </Title>

        <Body style={{ textAlign: 'center' }}>{question.prompt}</Body>

        <Button
          title="Read the sentence"
          icon="sound"
          secondary
          onPress={() =>
            speak(
              question.sentence.replace('____', 'blank'),
              'en-US',
              true
            )
          }
        />
      </Card>

      <AnswerChoices {...props} />
    </View>
  );
}

export function ReviewFlashcard({ word }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card>
      <WordPicture word={word} height={170} />

      <Button
        title={revealed ? 'Hide word' : 'Turn the card'}
        secondary
        icon="cards"
        onPress={() => setRevealed((value) => !value)}
      />

      {revealed && (
        <>
          <Title style={{ textAlign: 'center' }}>{word.word}</Title>
          <Body>{word.definition}</Body>
          <Body>{word.example_sentence}</Body>

          <Button
            title="Hear the word"
            icon="sound"
            onPress={() => pronounce(word)}
          />
        </>
      )}
    </Card>
  );
}

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function InteractiveStoryReaderWidget({
  story = CONTENT.story,
}) {
  const [selectedWord, setSelectedWord] = useState(null);

  const targets = story.target_word_ids.map((id) => WORDS[id]);

  const expression = new RegExp(
    `\\b(${[...targets]
      .sort((a, b) => b.word.length - a.word.length)
      .map((word) => escapeRegex(word.word))
      .join('|')})\\b`,
    'gi'
  );

  const parts = story.text.split(expression);

  return (
    <Card>
      <View style={styles.storyHeader}>
        <Icon name="book" size={28} />
        <Title style={{ flex: 1 }}>{story.title}</Title>
      </View>

      <Body style={styles.hint}>
        Tap the purple words to see their meanings.
      </Body>

      <Text style={styles.story}>
        {parts.map((part, index) => {
          const target = targets.find(
            (word) => word.word.toLowerCase() === part.toLowerCase()
          );

          return target ? (
            <Text
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${part}. Show meaning.`}
              onPress={() => setSelectedWord(target)}
              style={styles.targetWord}
            >
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          );
        })}
      </Text>

      <Button
        title="Listen to the story"
        icon="sound"
        secondary
        onPress={() => speak(story.text, 'en-US', true)}
      />

      <Modal
        transparent
        visible={Boolean(selectedWord)}
        animationType="fade"
        onRequestClose={() => setSelectedWord(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
              {selectedWord && (
                <>
                  <WordPicture word={selectedWord} height={135} />
                  <Title>{selectedWord.word}</Title>
                  <Body>{selectedWord.definition}</Body>
                  <Body>{selectedWord.example_sentence}</Body>

                  <Button
                    title="Hear the word"
                    icon="sound"
                    secondary
                    onPress={() => pronounce(selectedWord)}
                  />

                  <Button
                    title="Back to the story"
                    onPress={() => setSelectedWord(null)}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  questionCard: {
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  questionTitle: {
    color: colors.text,
    fontSize: 27,
    textAlign: 'center',
  },
  answers: {
    gap: 12,
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  answer: {
    minHeight: 76,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
    shadowColor: '#9986B2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  gridTile: {
    width: '48%',
  },
  answerText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  pictureLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.muted,
  },
  correct: {
    borderColor: '#319F77',
    backgroundColor: '#DDF5E6',
  },
  wrong: {
    borderColor: '#D39A50',
    backgroundColor: '#FFF0D7',
  },
  answerStatus: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: colors.text,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hint: {
    fontSize: 16,
    color: colors.muted,
  },
  story: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 24,
    lineHeight: 39,
    color: colors.text,
  },
  targetWord: {
    fontFamily: 'Nunito_900Black',
    color: colors.darkPurple,
    textDecorationLine: 'underline',
    backgroundColor: '#EEE6FD',
  },
  modalBackdrop: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    backgroundColor: 'rgba(54,40,77,.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '88%',
    alignSelf: 'center',
    backgroundColor: '#FFFCFF',
    borderRadius: 28,
    overflow: 'hidden',
  },
});