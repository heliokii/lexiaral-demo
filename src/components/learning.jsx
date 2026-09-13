import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgXml } from "react-native-svg";

import assets from "../assets.generated";
import { CONTENT, WORDS, STORIES } from "../content";
import { illustrations } from "../illustrations";
import { getStoryScenarioSvg } from "../storyIllustrations";
import {
  playCardFlipSfx,
  playErrorSfx,
  playMatchSfx,
  playSuccessSfx,
  pronounce,
  speak,
  stopAudio,
} from "../audio";
import { Art, Icon } from "../Art";
import { Body, Button, Card, Title, colors, fonts } from "./ui";

export function WordPicture({ word, height = 170 }) {
  if (!word) return null;

  const rawUrl = word.image_url || "";
  const key = rawUrl.replace("asset://", "");

  // 1. Direct raster or web image URI (http, https, file, data)
  if (
    rawUrl.startsWith("http://") ||
    rawUrl.startsWith("https://") ||
    rawUrl.startsWith("data:") ||
    rawUrl.startsWith("file://")
  ) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Picture of ${word.word}`}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height,
        }}
      >
        <Image
          source={{ uri: rawUrl }}
          style={{ width: "100%", height, resizeMode: "contain" }}
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
        style={{ alignItems: "center" }}
      >
        <SvgXml xml={illustrations[key]} width="100%" height={height} />
      </View>
    );
  }

  // 3. Vector SVG in assets.generated.js
  const assetXml = assets[key] || assets[key.replace(/-/g, "_")];
  if (assetXml) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Picture of ${word.word}`}
        style={{ alignItems: "center" }}
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
        width: "100%",
        height,
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
        borderWidth: 2,
        borderColor: "#CCE2FA",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Icon name="book" size={42} color="#7BA5DF" />
      <Text
        style={{
          fontFamily: "Nunito_800ExtraBold",
          color: "#4B77AE",
          fontSize: 18,
        }}
      >
        {word.word}
      </Text>
    </View>
  );
}

const CHOICE_LETTERS = ["A", "B", "C", "D"];

export function ChoiceBadge({ letter, state }) {
  let bg = "#F3EEFA";
  let border = "#D7C6F5";
  let text = "#653EB5";

  if (state === "selected") {
    bg = "#EDE4FC";
    border = colors.primary;
    text = colors.primary;
  } else if (state === "correct") {
    bg = "#20A464";
    border = "#17824E";
    text = "#FFFFFF";
  } else if (state === "wrong") {
    bg = "#E85A71";
    border = "#C23F54";
    text = "#FFFFFF";
  }

  return (
    <View
      style={[
        styles.choiceBadge,
        {
          backgroundColor: bg,
          borderColor: border,
        },
      ]}
    >
      <Text style={[styles.choiceBadgeText, { color: text }]}>
        {letter}
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
    (choice) => choice.label.length <= 18,
  );

  // Larger accessibility text switches to one column.
  const grid = width >= 340 && fontScale < 1.35 && (pictures || compactAnswers);

  return (
    <View style={[styles.answers, grid && styles.answerGrid]}>
      {question.choices.map((choice, index) => {
        const revealed = selected != null;
        const correct = revealed && choice.id === question.answerId;
        const chosen = selected?.choiceId === choice.id;
        const wrong = revealed && chosen && !correct;

        const badgeState = correct
          ? "correct"
          : wrong
            ? "wrong"
            : chosen
              ? "selected"
              : "default";

        const letter = CHOICE_LETTERS[index] || String.fromCharCode(65 + index);

        return (
          <Pressable
            key={choice.id}
            testID={`choice-btn-${choice.id}`}
            accessibilityRole="button"
            accessibilityLabel={
              pictures
                ? `Option ${letter}: Picture ${index + 1}, ${WORDS[choice.wordId].word}`
                : `Option ${letter}: ${choice.label}`
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
              <View style={styles.pictureChoiceContainer}>
                <View style={styles.pictureBadgeWrap}>
                  <ChoiceBadge letter={letter} state={badgeState} />
                </View>
                <WordPicture word={WORDS[choice.wordId]} height={112} />
              </View>
            ) : grid ? (
              <View style={styles.choiceRowGrid}>
                <ChoiceBadge letter={letter} state={badgeState} />
                <Text
                  style={[
                    styles.answerText,
                    styles.answerTextGrid,
                    correct && { color: "#176640" },
                    wrong && { color: "#8A2B1D" },
                  ]}
                >
                  {choice.label}
                </Text>
                <View style={{ width: 32 }} />
              </View>
            ) : (
              <View style={styles.choiceRowLinear}>
                <ChoiceBadge letter={letter} state={badgeState} />
                <Text
                  style={[
                    styles.answerText,
                    styles.answerTextLinear,
                    correct && { color: "#176640" },
                    wrong && { color: "#8A2B1D" },
                  ]}
                >
                  {choice.label}
                </Text>
              </View>
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
    if (question.type === "listenAndChoose" && word) {
      pronounce(word);
    }
  }, [question.id]);

  const isListenQuestion = question.type === "listenAndChoose";

  return (
    <View style={{ gap: 10 }}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeaderRow}>
          <Title style={styles.questionTitle}>
            {question.type === "pictureToWord"
              ? "What is this?"
              : isListenQuestion
                ? "Listen to the word"
                : `Find the "${word?.word || "word"}"`}
          </Title>

          {word && !isListenQuestion && (
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

        {isListenQuestion ? (
          <View style={styles.listenHeroContainer}>
            <Pressable
              testID="listen-hero-play-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Listen to the word again"
              onPress={() => pronounce(word)}
              style={({ pressed }) => [
                styles.listenHeroBtn,
                pressed && { transform: [{ scale: 0.94 }], opacity: 0.85 },
              ]}
            >
              <View style={styles.listenHeroBtnInner}>
                <Icon name="sound" size={44} color="#FFFFFF" />
              </View>
            </Pressable>
            <Text style={styles.listenHeroText}>Tap to listen again</Text>
          </View>
        ) : question.type === "pictureToWord" ? (
          <WordPicture word={word} height={205} />
        ) : (
          <View
            style={{
              paddingVertical: 28,
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flex: 1,
            }}
          >
            <Icon name="book" size={46} color={colors.primary} />
            <Title
              style={{
                fontSize: 38,
                lineHeight: 44,
                color: colors.darkPurple,
              }}
            >
              {word?.word}
            </Title>
          </View>
        )}
      </Card>

      <AnswerChoices {...props} pictures={question.type === "wordToPicture"} />
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
      return;
    }

    if (selectedWordId === picWordId) {
      const next = [...matchedIds, selectedWordId];
      setMatchedIds(next);
      setSelectedWordId(null);
      setMismatchPair(null);
      playSuccessSfx();

      if (next.length === pairs.length && !selected) {
        onAnswer(question.answerId);
      }
    } else {
      setMismatchPair({ wordId: selectedWordId, picWordId });
      playErrorSfx();
      setTimeout(() => {
        setMismatchPair(null);
        setSelectedWordId(null);
      }, 600);
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
                "Tap a word on the left, then tap its matching picture on the right.",
                "en-US",
                true,
              )
            }
            style={styles.speakerBtn}
          >
            <Icon name="sound" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <Body style={{ textAlign: "center", fontSize: 15, color: colors.text }}>
          {question.prompt ||
            "Tap a word on the left, then tap its matching picture on the right."}
        </Body>
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
                    isMatched && { color: "#267A59" },
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
                <WordPicture word={WORDS[item.wordId]} height={52} />
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
    <View style={{ gap: 12 }}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeaderRow}>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.questionBadge}>Level 2: Use the Word</Text>
            </View>
            <Title style={styles.questionTitle}>
              {question.prompt || "Which word completes the sentence?"}
            </Title>
          </View>

          {question.type !== "bestUse" && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read the sentence"
              onPress={() =>
                speak(question.sentence.replace("____", "blank"), "en-US", true)
              }
              style={styles.speakerBtn}
            >
              <Icon name="sound" size={20} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {question.type === "pictureSentence" && word && (
          <WordPicture word={word} height={155} />
        )}

        <View style={styles.sentenceBox}>
          <Text style={styles.sentenceText}>{question.sentence}</Text>
        </View>
      </Card>

      <AnswerChoices {...props} />
    </View>
  );
}

export function ReviewFlashcard({ word }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    stopAudio();
    flipAnim.setValue(0);
    setIsFlipped(false);
    return () => {
      stopAudio();
    };
  }, [word?.id]);

  const handleFlip = () => {
    stopAudio();
    playCardFlipSfx();
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [90, 91],
    outputRange: [0, 1],
  });

  return (
    <View
      testID={`flashcard-card-${word.id}`}
      style={styles.flashcardContainer}
    >
      {/* FRONT SIDE (Picture) */}
      <Animated.View
        pointerEvents={isFlipped ? "none" : "auto"}
        style={[
          styles.flashcardSide,
          {
            transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
            opacity: frontOpacity,
          },
        ]}
      >
        <View style={styles.flashcardHeaderRow}>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Flip card to see word definition"
            onPress={handleFlip}
          >
            <Text style={styles.flashcardSideBadge}>PICTURE</Text>
          </Pressable>
          <Pressable
            testID={`flashcard-sound-front-${word.id}`}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Hear pronunciation of ${word.word}`}
            onPress={() => pronounce(word)}
            style={({ pressed }) => [
              styles.flashcardSpeakerBtn,
              pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
            ]}
          >
            <Icon name="sound" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <Pressable
          testID={`flashcard-flip-btn-${word.id}`}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Picture of ${word.word}. Tap to flip and see word definition.`}
          onPress={handleFlip}
          style={styles.flashcardFrontBody}
        >
          <WordPicture word={word} height={230} />
        </Pressable>
      </Animated.View>

      {/* BACK SIDE (Word + Description) */}
      <Animated.View
        pointerEvents={isFlipped ? "auto" : "none"}
        style={[
          styles.flashcardSide,
          {
            transform: [{ perspective: 1000 }, { rotateY: backRotate }],
            opacity: backOpacity,
          },
        ]}
      >
        <View style={styles.flashcardHeaderRow}>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Flip card to see picture"
            onPress={handleFlip}
          >
            <Text style={styles.flashcardSideBadge}>WORD & MEANING</Text>
          </Pressable>
          <Pressable
            testID={`flashcard-sound-back-${word.id}`}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Hear meaning of ${word.word}`}
            onPress={() =>
              speak(
                `${word.word}. ${word.definition}. ${word.example_sentence}`,
                "en-US",
                true,
              )
            }
            style={({ pressed }) => [
              styles.flashcardSpeakerBtn,
              pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
            ]}
          >
            <Icon name="sound" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <Pressable
          testID={`flashcard-flip-btn-back-${word.id}`}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Word card for ${word.word}: ${word.definition}. Tap to see picture.`}
          onPress={handleFlip}
          style={styles.flashcardBackBody}
        >
          <Title style={styles.flashcardBackWord}>{word.word}</Title>
          <Text style={styles.flashcardBackDefinition}>{word.definition}</Text>
          <View style={styles.flashcardExampleBox}>
            <Text style={styles.flashcardExampleText}>
              "{word.example_sentence}"
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
            .join("|")})\\b`,
          "gi",
        )
      : null;

  const parts = expression ? story.text.split(expression) : [story.text];

  const scenarioSvg = getStoryScenarioSvg(story);

  const handleToggleReading = () => {
    if (isReading) {
      stopAudio();
      setIsReading(false);
    } else {
      setIsReading(true);
      speak(story.text, "en-US", true);
    }
  };

  return (
    <Card>
      <View style={styles.storyHeader}>
        <Icon name="book" size={26} color={colors.primary} />
        <Title style={{ flex: 1, fontSize: 22, color: colors.darkPurple }}>
          {story.title?.replace(/^\d+\.\s*/, "") || story.title}
        </Title>
        <View style={styles.storyHeaderActions}>
          {onSelectStory && (
            <Pressable
              testID="story-switch-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Choose another reading story"
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.storyHeaderActionBtn,
                pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 },
              ]}
            >
              <Icon name="refresh" size={20} color="#6C47C7" />
            </Pressable>
          )}

          <Pressable
            testID="story-listen-toggle-btn"
            accessible
            accessibilityRole="button"
            accessibilityLabel={
              isReading ? "Stop reading story" : "Listen to story audio"
            }
            onPress={handleToggleReading}
            style={({ pressed }) => [
              styles.storyHeaderActionBtn,
              isReading && styles.storyHeaderActionBtnActive,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 },
            ]}
          >
            <Icon
              name={isReading ? "lock" : "sound"}
              size={20}
              color={isReading ? "#FFFFFF" : colors.primary}
            />
          </Pressable>
        </View>
      </View>

      {scenarioSvg ? (
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Illustration scene for ${story.title?.replace(/^\d+\.\s*/, "") || "the story"}`}
          style={styles.storyScenarioWrapper}
        >
          <SvgXml xml={scenarioSvg} width="100%" height={195} />
        </View>
      ) : null}

      <Text style={styles.story}>
        {parts.map((part, index) => {
          const target = targets.find(
            (word) => word.word.toLowerCase() === part.toLowerCase(),
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

      <Modal
        transparent
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.modalCard, { maxHeight: "84%" }]}
            accessibilityViewIsModal
          >
            <View style={styles.storyPickerHeader}>
              <Title style={{ fontSize: 20, color: colors.darkPurple }}>
                Choose a Story
              </Title>
              <Body style={{ fontSize: 13, color: colors.muted }}>
                Grade 3 ARAL Reading Stories
              </Body>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
              {(STORIES || []).map((item) => {
                const isCurrent = item.id === story.id;
                const cleanTitle = item.title.replace(/^\d+\.\s*/, "");
                const primaryWordId =
                  item.target_word_ids?.[0] || item.id.replace(/^story-\d+-/, "");
                const iconXml =
                  illustrations[primaryWordId] || illustrations[item.id];
                const targetLabels = (item.target_word_ids || [])
                  .map((id) => WORDS[id]?.word || id)
                  .join(", ");

                return (
                  <Pressable
                    key={item.id}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${cleanTitle}. Target words: ${targetLabels}`}
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
                        styles.storyOptionIconWrap,
                        isCurrent && styles.storyOptionIconWrapCurrent,
                      ]}
                    >
                      {iconXml ? (
                        <SvgXml xml={iconXml} width={34} height={34} />
                      ) : (
                        <Icon
                          name="book"
                          size={20}
                          color={isCurrent ? colors.primary : "#8C77B0"}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text
                        style={[
                          styles.storyOptionTitle,
                          isCurrent && { color: colors.darkPurple },
                        ]}
                      >
                        {cleanTitle}
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
                borderColor: "#EDE6F6",
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
          <View style={[styles.modalCard, { position: "relative" }]} accessibilityViewIsModal>
            {selectedWord && (
              <Pressable
                testID="word-popup-sound-btn"
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Hear pronunciation of ${selectedWord.word}`}
                onPress={() => pronounce(selectedWord)}
                style={({ pressed }) => [
                  {
                    position: "absolute",
                    top: 18,
                    right: 18,
                    zIndex: 20,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#F4EEFD",
                    borderWidth: 1,
                    borderColor: "#E1D4FA",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#8C77B0",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  },
                  pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
                ]}
              >
                <Icon name="sound" size={19} color={colors.primary} />
              </Pressable>
            )}

            <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
              {selectedWord && (
                <>
                  <WordPicture word={selectedWord} height={145} />
                  <Title>{selectedWord.word}</Title>
                  <Body>{selectedWord.definition}</Body>
                  <Body>{selectedWord.example_sentence}</Body>

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
    paddingBottom: 20,
    paddingHorizontal: 20,
    minHeight: 290,
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 24,
  },
  questionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  questionBadge: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: colors.primary,
    backgroundColor: "#F0EBF9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0EBF9",
    alignItems: "center",
    justifyContent: "center",
  },
  questionTitle: {
    color: colors.darkPurple,
    fontSize: 23,
    lineHeight: 29,
    fontFamily: "Nunito_900Black",
  },
  sentenceBox: {
    backgroundColor: "#F8F6FD",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#ECE4F7",
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    minHeight: 120,
  },
  sentenceText: {
    fontFamily: fonts.reading,
    fontSize: 22,
    lineHeight: 32,
    color: colors.darkPurple,
    textAlign: "center",
  },
  answers: {
    gap: 12,
  },
  answerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  answer: {
    minHeight: 82,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#E2D7F4",
    backgroundColor: "#FFFFFF",
    gap: 4,
    shadowColor: "#7456A8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  gridTile: {
    width: "48.5%",
  },
  choiceBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8C77B0",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  choiceBadgeText: {
    fontFamily: "Nunito_900Black",
    fontSize: 15,
    lineHeight: 18,
  },
  choiceRowGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 2,
  },
  choiceRowLinear: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    width: "100%",
    paddingHorizontal: 6,
  },
  pictureChoiceContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  pictureBadgeWrap: {
    position: "absolute",
    top: -4,
    left: -2,
    zIndex: 5,
  },
  answerSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F6F2FD",
  },
  answerText: {
    fontFamily: fonts.reading,
    fontSize: 18,
    color: colors.text,
  },
  answerTextGrid: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Nunito_800ExtraBold",
    textAlign: "center",
    flex: 1,
  },
  answerTextLinear: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: "left",
    flex: 1,
  },
  pictureLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: colors.muted,
  },
  correct: {
    borderColor: "#20A464",
    borderWidth: 2,
    backgroundColor: "#EBF8F1",
  },
  wrong: {
    borderColor: "#E85A71",
    borderWidth: 2,
    backgroundColor: "#FFF0F3",
  },
  choiceFeedbackTagCorrect: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#20A464",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  choiceFeedbackTextCorrect: {
    color: "#FFFFFF",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
  },
  choiceFeedbackTagWrong: {
    backgroundColor: "#E85A71",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  choiceFeedbackTextWrong: {
    color: "#FFFFFF",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 10.5,
  },
  answerStatus: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.text,
  },
  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storyScenarioWrapper: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#EBE0FA",
    backgroundColor: "#FFFFFF",
    shadowColor: "#6F48AC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 16,
    color: colors.muted,
  },
  story: {
    fontFamily: fonts.reading,
    fontSize: 22,
    lineHeight: 36,
    color: colors.text,
  },
  targetWord: {
    fontFamily: fonts.vocab,
    fontWeight: "bold",
    color: colors.darkPurple,
    textDecorationLine: "underline",
    backgroundColor: "#EEE6FD",
  },
  modalBackdrop: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    backgroundColor: "rgba(54,40,77,.45)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 600,
    maxHeight: "88%",
    alignSelf: "center",
    backgroundColor: "#FFFCFF",
    borderRadius: 28,
    overflow: "hidden",
  },
  matchingBoard: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  matchingColumn: {
    flex: 1,
    gap: 8,
  },
  columnHeader: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 2,
  },
  matchCard: {
    minHeight: 64,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#DCE7F5",
    shadowColor: "#9986B2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
  },
  matchPicCard: {
    paddingVertical: 4,
  },
  matchCardSelected: {
    borderColor: colors.purple,
    backgroundColor: "#F3EDFF",
    borderWidth: 3,
  },
  matchCardMatched: {
    borderColor: "#319F77",
    backgroundColor: "#E8F8EE",
  },
  matchCardWrong: {
    borderColor: "#D39A50",
    backgroundColor: "#FFF0D7",
  },
  matchWordText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 8,
    backgroundColor: "#319F77",
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_900Black",
    fontSize: 13,
    lineHeight: 16,
  },
  storyPickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDE8FC",
    borderColor: "#C7B4F3",
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  storyPickerBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: "#7548C7",
  },
  storyPickerHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#EDE6F6",
  },
  storyOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E8E1F4",
  },
  storyOptionCurrent: {
    borderColor: colors.purple,
    backgroundColor: "#F7F3FF",
  },
  storyOptionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F4EFFC",
    borderWidth: 1.5,
    borderColor: "#E5DAFA",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  storyOptionIconWrapCurrent: {
    backgroundColor: "#EBE2FC",
    borderColor: colors.purple,
  },
  storyOptionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: colors.text,
  },
  storyOptionBadge: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "#8372A5",
  },
  flashcardContainer: {
    height: 395,
    width: "100%",
    position: "relative",
    marginVertical: 4,
  },
  flashcardPressable: {
    width: "100%",
    height: "100%",
  },
  flashcardSide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#DECFFC",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#8C77B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    backfaceVisibility: "hidden",
  },
  flashcardHeaderRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flashcardSideBadge: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#8B74BC",
    backgroundColor: "#F4EFFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    letterSpacing: 0.4,
  },
  flashcardSpeakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F2ECFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2D6FA",
  },
  flashcardFrontBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  flashcardBackBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  flashcardBackWord: {
    fontFamily: fonts.vocab,
    fontSize: 34,
    fontWeight: "bold",
    color: colors.darkPurple,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  flashcardBackDefinition: {
    fontFamily: fonts.reading,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    textAlign: "center",
  },
  flashcardExampleBox: {
    backgroundColor: "#FAF7FF",
    borderWidth: 1.5,
    borderColor: "#ECE4FA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
    width: "100%",
  },
  flashcardExampleText: {
    fontFamily: fonts.reading,
    fontSize: 14.5,
    fontStyle: "italic",
    lineHeight: 21,
    color: "#574E6B",
    textAlign: "center",
  },
  listenHeroContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    flex: 1,
    minHeight: 180,
  },
  listenHeroBtn: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#F2ECFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#DACBF8",
    shadowColor: "#7048B8",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  listenHeroBtnInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  listenHeroText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    color: colors.darkPurple,
    letterSpacing: 0.3,
  },
  storyHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  storyHeaderActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3EDFD",
    borderWidth: 1.5,
    borderColor: "#DACBF8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7A59AF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  storyHeaderActionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
