import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import assets from '../assets.generated';
import { CONTENT, WORDS, STORIES } from '../content';
import { illustrations } from '../illustrations';
import { pronounce, speak, stopAudio } from '../audio';
import { Art, Icon } from '../Art';
import {
  Body,
  Button,
  Card,
  Title,
  colors,
} from './ui';

export function WordPicture({ word, height = 170 }) {
  if (!word) return null;

  const rawUrl = word.image_url || '';
  const key = rawUrl.replace('asset://', '');

  // 1. Direct raster or web image URI (http, https, file, data)
  if (
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.startsWith('data:') ||
    rawUrl.startsWith('file://')
  ) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Picture of ${word.word}`}
        style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height }}
      >
        <Image
          source={{ uri: rawUrl }}
          style={{ width: '100%', height, resizeMode: 'contain' }}
        />
      </View>
    );
  }

  // 2. Vector SVG in illustrations.js
  if (illustrations[key]) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Picture of ${word.word}`}
        style={{ alignItems: 'center' }}
      >
        <SvgXml
          xml={illustrations[key]}
          width="100%"
          height={height}
        />
      </View>
    );
  }

  // 3. Vector SVG in assets.generated.js
  const assetXml = assets[key] || assets[key.replace(/-/g, '_')];
  if (assetXml) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Picture of ${word.word}`}
        style={{ alignItems: 'center' }}
      >
        <SvgXml xml={assetXml} width="100%" height={height} />
      </View>
    );
  }

  // 4. Safe educational fallback card if image is not yet supplied
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Picture placeholder of ${word.word}`}
      style={{
        width: '100%',
        height,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: '#CCE2FA',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <Icon name="book" size={42} color="#7BA5DF" />
      <Text style={{ fontFamily: 'Nunito_800ExtraBold', color: '#4B77AE', fontSize: 18 }}>
        {word.word}
      </Text>
    </View>
  );
}

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
            testID={`choice-btn-${choice.id}`}
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
              grid && styles.gridTile,
              chosen && !revealed && styles.answerSelected,
              correct && styles.correct,
              wrong && styles.wrong,
              pressed && !revealed && { transform: [{ scale: 0.98 }] },
            ]}
          >
            {pictures ? (
              <>
                <Text style={styles.pictureLabel}>Picture {index + 1}</Text>
                <WordPicture word={WORDS[choice.wordId]} height={92} />
              </>
            ) : (
              <Text
                style={[
                  styles.answerText,
                  correct && { color: '#176640' },
                  wrong && { color: '#8A2B1D' },
                ]}
              >
                {choice.label}
              </Text>
            )}

            {correct && (
              <View style={styles.choiceFeedbackTagCorrect}>
                <Icon name="check" size={12} color="#FFFFFF" />
                <Text style={styles.choiceFeedbackTextCorrect}>Correct</Text>
              </View>
            )}

            {wrong && (
              <View style={styles.choiceFeedbackTagWrong}>
                <Text style={styles.choiceFeedbackTextWrong}>Nice try</Text>
              </View>
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

  useEffect(() => {
    if (question.type === 'listenAndChoose' && word) {
      pronounce(word);
    }
  }, [question.id]);

  return (
    <View style={{ gap: 10 }}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeaderRow}>
          <Title style={styles.questionTitle}>
            {question.type === 'pictureToWord'
              ? 'What is this?'
              : question.type === 'listenAndChoose'
                ? 'Listen to the word'
                : `Find the "${word?.word || 'word'}"`}
          </Title>

          {word && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hear the word"
              onPress={() => pronounce(word)}
              style={styles.speakerBtn}
            >
              <Icon name="sound" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {question.type === 'listenAndChoose' ? (
          <View style={{ paddingVertical: 14, alignItems: 'center', gap: 10 }}>
            <Icon name="sound" size={46} color={colors.primary} />
            <Body style={{ textAlign: 'center', fontSize: 15, color: colors.muted }}>
              Tap the sound button above or below, then choose the word you heard.
            </Body>
            <Button
              title="Play Word Sound"
              icon="sound"
              onPress={() => pronounce(word)}
              style={{ minHeight: 44, paddingHorizontal: 20 }}
            />
          </View>
        ) : question.type === 'pictureToWord' ? (
          <WordPicture word={word} height={140} />
        ) : (
          <View style={{ paddingVertical: 18, alignItems: 'center', gap: 8 }}>
            <Icon name="book" size={36} color={colors.primary} />
            <Title style={{ fontSize: 32, color: colors.darkPurple }}>
              {word?.word}
            </Title>
          </View>
        )}
      </Card>

      <AnswerChoices
        {...props}
        pictures={question.type === 'wordToPicture'}
      />
    </View>
  );
}

export function MatchingPairsQuestionWidget({
  question,
  selected,
  disabled,
  onAnswer,
}) {
  const pairs = question.pairs || [];
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [mismatchPair, setMismatchPair] = useState(null);

  const [wordItems] = useState(() => [...pairs]);
  const [picItems] = useState(() => {
    if (pairs.length > 2) {
      return [...pairs.slice(1), pairs[0]];
    }
    return [...pairs].reverse();
  });

  const isCompleted = selected != null || matchedIds.length === pairs.length;

  const handleSelectWord = (wordId) => {
    if (disabled || isCompleted || matchedIds.includes(wordId)) return;
    setSelectedWordId(wordId);
    const wordObj = WORDS[wordId];
    if (wordObj) {
      pronounce(wordObj);
    }
  };

  const handleSelectPic = (picWordId) => {
    if (disabled || isCompleted || matchedIds.includes(picWordId)) return;
    if (!selectedWordId) {
      speak('Tap a word on the left first!', 'en-US', true);
      return;
    }

    if (selectedWordId === picWordId) {
      const next = [...matchedIds, selectedWordId];
      setMatchedIds(next);
      setSelectedWordId(null);
      setMismatchPair(null);
      const wordObj = WORDS[selectedWordId];
      speak(`Good job! ${wordObj?.word || ''}`, 'en-US', true);

      if (next.length === pairs.length && !selected) {
        onAnswer(question.answerId);
      }
    } else {
      setMismatchPair({ wordId: selectedWordId, picWordId });
      speak('Try again', 'en-US', true);
      setTimeout(() => {
        setMismatchPair(null);
        setSelectedWordId(null);
      }, 700);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeaderRow}>
          <Text style={styles.questionBadge}>Match Words to Pictures</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hear instruction"
            onPress={() =>
              speak(
                'Tap a word on the left, then tap its matching picture on the right.',
                'en-US',
                true
              )
            }
            style={styles.speakerBtn}
          >
            <Icon name="sound" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <Body style={{ textAlign: 'center', fontSize: 15, color: colors.text }}>
          {question.prompt || 'Tap a word on the left, then tap its matching picture on the right.'}
        </Body>

        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#E8F8F0',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              color: '#20A464',
              fontSize: 13.5,
            }}
          >
            Matched: {isCompleted ? pairs.length : matchedIds.length} of {pairs.length} pairs
          </Text>
        </View>
      </Card>

      <View style={styles.matchingBoard}>
        <View style={styles.matchingColumn}>
          <Text style={styles.columnHeader}>WORDS</Text>
          {wordItems.map((item) => {
            const isMatched = isCompleted || matchedIds.includes(item.wordId);
            const isSelected = selectedWordId === item.wordId;
            const isWrong = mismatchPair?.wordId === item.wordId;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Word ${item.word}`}
                disabled={disabled || isMatched}
                onPress={() => handleSelectWord(item.wordId)}
                style={[
                  styles.matchCard,
                  isSelected && styles.matchCardSelected,
                  isMatched && styles.matchCardMatched,
                  isWrong && styles.matchCardWrong,
                ]}
              >
                <Text
                  style={[
                    styles.matchWordText,
                    isMatched && { color: '#267A59' },
                    isSelected && { color: colors.darkPurple },
                  ]}
                >
                  {item.word}
                </Text>
                {isMatched && (
                  <View style={styles.checkBadge}>
                    <Icon name="check" size={13} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.matchingColumn}>
          <Text style={styles.columnHeader}>PICTURES</Text>
          {picItems.map((item) => {
            const isMatched = isCompleted || matchedIds.includes(item.wordId);
            const isWrong = mismatchPair?.picWordId === item.wordId;

            return (
              <Pressable
                key={`pic-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Picture for ${item.word}`}
                disabled={disabled || isMatched}
                onPress={() => handleSelectPic(item.wordId)}
                style={[
                  styles.matchCard,
                  styles.matchPicCard,
                  isMatched && styles.matchCardMatched,
                  isWrong && styles.matchCardWrong,
                ]}
              >
                <WordPicture word={WORDS[item.wordId]} height={60} />
                {isMatched && (
                  <View style={styles.checkBadge}>
                    <Icon name="check" size={13} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function SentenceCompletionQuestionWidget(props) {
  const { question } = props;
  const word = WORDS[question.wordId];

  return (
    <View style={{ gap: 10 }}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeaderRow}>
          <Text style={styles.questionBadge}>Level 2: Use the Word</Text>

          {question.type !== 'bestUse' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read the sentence"
              onPress={() =>
                speak(
                  question.sentence.replace('____', 'blank'),
                  'en-US',
                  true
                )
              }
              style={styles.speakerBtn}
            >
              <Icon name="sound" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {question.type === 'pictureSentence' && word && (
          <WordPicture word={word} height={125} />
        )}

        <View style={styles.sentenceBox}>
          <Text style={styles.sentenceText}>
            {question.sentence}
          </Text>
        </View>

        <Body style={{ textAlign: 'center', fontSize: 15, color: colors.muted }}>
          {question.prompt}
        </Body>
      </Card>

      <AnswerChoices {...props} />
    </View>
  );
}

export function ReviewFlashcard({ word, isPracticed = false }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card testID={`flashcard-card-${word.id}`}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 13,
            color: colors.muted,
            letterSpacing: 0.5,
          }}
        >
          VOCABULARY CARD
        </Text>
        {isPracticed && (
          <View
            testID={`flashcard-practiced-badge-${word.id}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#E0F5EB',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 10,
            }}
          >
            <Icon name="check" size={12} color="#2A8E67" />
            <Text
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 11,
                color: '#2A8E67',
              }}
            >
              Practiced
            </Text>
          </View>
        )}
      </View>

      <WordPicture word={word} height={170} />

      <Button
        testID={`flashcard-turn-btn-${word.id}`}
        title={revealed ? 'Hide details' : 'Turn the card'}
        secondary
        icon="cards"
        onPress={() => setRevealed((value) => !value)}
      />

      {revealed && (
        <>
          <Title style={{ textAlign: 'center', fontSize: 26 }}>
            {word.word}
          </Title>
          <Body style={{ fontSize: 16 }}>{word.definition}</Body>
          <Body style={{ fontSize: 15, fontStyle: 'italic', color: '#524B63' }}>
            "{word.example_sentence}"
          </Body>

          <Button
            testID={`flashcard-hear-btn-${word.id}`}
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
  onSelectStory,
}) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setIsReading(false);
    return () => {
      stopAudio();
    };
  }, [story?.id]);

  const targets = (story.target_word_ids || [])
    .map((id) => WORDS[id])
    .filter(Boolean);

  const expression =
    targets.length > 0
      ? new RegExp(
          `\\b(${[...targets]
            .sort((a, b) => b.word.length - a.word.length)
            .map((word) => escapeRegex(word.word))
            .join('|')})\\b`,
          'gi'
        )
      : null;

  const parts = expression ? story.text.split(expression) : [story.text];

  const handleToggleReading = () => {
    if (isReading) {
      stopAudio();
      setIsReading(false);
    } else {
      setIsReading(true);
      speak(story.text, 'en-US', true);
    }
  };

  return (
    <Card>
      <View style={styles.storyHeader}>
        <Icon name="book" size={28} />
        <Title style={{ flex: 1 }}>{story.title}</Title>
        {onSelectStory && (
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Choose another story from 20 ARAL stories"
            onPress={() => setPickerOpen(true)}
            style={styles.storyPickerBtn}
          >
            <Text style={styles.storyPickerBtnText}>Choose Story</Text>
            <Icon name="arrow" size={14} color="#7548C7" />
          </Pressable>
        )}
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
              accessible
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
        title={isReading ? "Stop reading" : "Listen to the story"}
        icon={isReading ? "lock" : "sound"}
        secondary
        onPress={handleToggleReading}
      />

      <Modal
        transparent
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.modalCard, { maxHeight: '84%' }]}
            accessibilityViewIsModal
          >
            <View style={styles.storyPickerHeader}>
              <Title style={{ fontSize: 20, color: colors.darkPurple }}>
                Choose a Story
              </Title>
              <Body style={{ fontSize: 13, color: colors.muted }}>
                Grade 3 ARAL Official Curriculum (20 Stories)
              </Body>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
              {(STORIES || []).map((item, idx) => {
                const isCurrent = item.id === story.id;
                const targetLabels = (item.target_word_ids || [])
                  .map((id) => WORDS[id]?.word || id)
                  .join(', ');

                return (
                  <Pressable
                    key={item.id}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`Story ${idx + 1}: ${item.title}. Target words: ${targetLabels}`}
                    onPress={() => {
                      stopAudio();
                      setIsReading(false);
                      setPickerOpen(false);
                      onSelectStory(item.id);
                    }}
                    style={[
                      styles.storyOptionRow,
                      isCurrent && styles.storyOptionCurrent,
                    ]}
                  >
                    <View
                      style={[
                        styles.storyOptionNum,
                        isCurrent && styles.storyOptionNumCurrent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.storyOptionNumText,
                          isCurrent && { color: '#FFF' },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text
                        style={[
                          styles.storyOptionTitle,
                          isCurrent && { color: colors.darkPurple },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {targetLabels ? (
                        <Text style={styles.storyOptionBadge}>
                          Words: {targetLabels}
                        </Text>
                      ) : null}
                    </View>
                    {isCurrent ? (
                      <View style={styles.checkBadge}>
                        <Icon name="check" size={13} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View
              style={{
                padding: 14,
                borderTopWidth: 1,
                borderColor: '#EDE6F6',
              }}
            >
              <Button
                title="Close"
                secondary
                onPress={() => setPickerOpen(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

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
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 10,
    borderRadius: 22,
  },
  questionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  questionBadge: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: colors.primary,
    backgroundColor: '#F0EBF9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EBF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionTitle: {
    color: colors.darkPurple,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Nunito_900Black',
  },
  sentenceBox: {
    backgroundColor: '#F8F6FD',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ECE4F7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  sentenceText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 19,
    lineHeight: 27,
    color: colors.darkPurple,
    textAlign: 'center',
  },
  answers: {
    gap: 10,
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  answer: {
    minHeight: 62,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E7DFEE',
    backgroundColor: '#FFFFFF',
    gap: 4,
    shadowColor: '#8E7DA7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  gridTile: {
    width: '48.5%',
  },
  answerSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F6F2FD',
  },
  answerText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: colors.text,
    textAlign: 'center',
  },
  pictureLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.muted,
  },
  correct: {
    borderColor: '#20A464',
    borderWidth: 2,
    backgroundColor: '#EBF8F1',
  },
  wrong: {
    borderColor: '#E85A71',
    borderWidth: 2,
    backgroundColor: '#FFF0F3',
  },
  choiceFeedbackTagCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#20A464',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  choiceFeedbackTextCorrect: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
  },
  choiceFeedbackTagWrong: {
    backgroundColor: '#E85A71',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  choiceFeedbackTextWrong: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
  },
  answerStatus: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
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
  matchingBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  matchingColumn: {
    flex: 1,
    gap: 10,
  },
  columnHeader: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 2,
  },
  matchCard: {
    minHeight: 74,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#DCE7F5',
    shadowColor: '#9986B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  matchPicCard: {
    paddingVertical: 6,
  },
  matchCardSelected: {
    borderColor: colors.purple,
    backgroundColor: '#F3EDFF',
    borderWidth: 3,
  },
  matchCardMatched: {
    borderColor: '#319F77',
    backgroundColor: '#E8F8EE',
  },
  matchCardWrong: {
    borderColor: '#D39A50',
    backgroundColor: '#FFF0D7',
  },
  matchWordText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: '#319F77',
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_900Black',
    fontSize: 13,
    lineHeight: 16,
  },
  storyPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDE8FC',
    borderColor: '#C7B4F3',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  storyPickerBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#7548C7',
  },
  storyPickerHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#EDE6F6',
  },
  storyOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E1F4',
  },
  storyOptionCurrent: {
    borderColor: colors.purple,
    backgroundColor: '#F7F3FF',
  },
  storyOptionNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDE8FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyOptionNumCurrent: {
    backgroundColor: colors.purple,
  },
  storyOptionNumText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#7056BE',
  },
  storyOptionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: colors.text,
  },
  storyOptionBadge: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#8372A5',
  },
});