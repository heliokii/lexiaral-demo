import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { CONTENT } from "../content";
import { Art, Icon } from "../Art";
import { Body, Screen, Title, colors } from "../components/ui";
import { ReviewFlashcard } from "../components/learning";
import {
  playCardShuffleSfx,
  playCardSwipeSfx,
  playTapSfx,
  setBgmFocusMode,
  stopAudio,
} from "../audio";

const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    name: "Easy",
    title: "Easy Level",
    count: 20,
    subtitle: "CVC Words (cat, mat, hat, dog...)",
    color: "#20A464",
    bg: "#EDF9F2",
    border: "#C2ECCF",
    icon: "star",
  },
  {
    id: "average",
    name: "Average",
    title: "Average Level",
    count: 15,
    subtitle: "2-Syllables & Blends (basket, moon, candle...)",
    color: "#D97B08",
    bg: "#FEF7EC",
    border: "#F7E1B8",
    icon: "book",
  },
  {
    id: "difficult",
    name: "Difficult",
    title: "Difficult Level",
    count: 15,
    subtitle: "Clusters & Vowels (happy, plant, clock...)",
    color: "#774DC9",
    bg: "#F5EFFD",
    border: "#DCCAFB",
    icon: "sparkles",
  },
];

export function ReviewScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [words, setWords] = useState(() => [...(CONTENT.words || [])]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("card"); // 'card' (single card mode) or 'list'

  const shuffleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slideOpacity = useRef(new Animated.Value(1)).current;
  const isTransitioning = useRef(false);

  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, words.length - 1),
  );
  const currentWord = words[safeIndex];
  const currentLevelInfo = DIFFICULTY_LEVELS.find((l) => l.id === selectedDifficulty);

  // Enable soft BGM focus mode while studying flashcards
  useEffect(() => {
    setBgmFocusMode(true);
    return () => {
      setBgmFocusMode(false);
      stopAudio();
    };
  }, []);

  const selectLevel = (difficultyId) => {
    stopAudio();
    playTapSfx();
    setSelectedDifficulty(difficultyId);
    if (difficultyId === "all") {
      setWords([...(CONTENT.words || [])]);
    } else {
      setWords(
        (CONTENT.words || []).filter((w) => w.difficulty === difficultyId)
      );
    }
    setCurrentIndex(0);
  };

  const handleBackToLevels = () => {
    stopAudio();
    playTapSfx();
    setSelectedDifficulty(null);
  };

  const handleShuffle = () => {
    stopAudio();
    playCardShuffleSfx();
    Animated.sequence([
      Animated.timing(shuffleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(shuffleAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setWords(shuffled);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (safeIndex >= words.length - 1 || isTransitioning.current) return;
    stopAudio();
    playCardSwipeSfx();
    isTransitioning.current = true;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -140,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(slideOpacity, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
      slideAnim.setValue(140);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isTransitioning.current = false;
      });
    });
  };

  const handlePrev = () => {
    if (safeIndex <= 0 || isTransitioning.current) return;
    stopAudio();
    playCardSwipeSfx();
    isTransitioning.current = true;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 140,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(slideOpacity, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      slideAnim.setValue(-140);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isTransitioning.current = false;
      });
    });
  };

  const handleToggleView = () => {
    stopAudio();
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  // 1. PRE-LEARN LEVEL SELECTION SCREEN (Child-friendly 3 difficulty buttons + All)
  if (selectedDifficulty === null) {
    return (
      <Screen testID="screen-review">
        <View testID="review-level-selector" style={styles.selectorWrapper}>
          <View style={styles.selectorHeader}>
            <Art name="owl-reading" width={130} height={140} />
            <Title testID="review-title" style={styles.selectorTitle}>
              Word Flashcards
            </Title>
            <Body testID="review-subtitle" style={styles.selectorSubtitle}>
              Choose a level to start practicing your words!
            </Body>
          </View>

          <View style={styles.levelButtonsWrap}>
            {DIFFICULTY_LEVELS.map((lvl) => (
              <Pressable
                key={lvl.id}
                testID={`review-level-${lvl.id}-btn`}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Start ${lvl.name} level flashcards, ${lvl.count} words`}
                onPress={() => selectLevel(lvl.id)}
                style={({ pressed }) => [
                  styles.levelCard,
                  { backgroundColor: lvl.bg, borderColor: lvl.border },
                  pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
                ]}
              >
                <View style={[styles.levelBadge, { backgroundColor: lvl.color }]}>
                  <Icon name={lvl.icon} size={22} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.levelCardTop}>
                    <Text style={[styles.levelCardName, { color: lvl.color }]}>
                      {lvl.name} Level
                    </Text>
                    <View style={[styles.countTag, { backgroundColor: lvl.color }]}>
                      <Text style={styles.countTagText}>{lvl.count} Words</Text>
                    </View>
                  </View>
                  <Text style={styles.levelCardDesc}>{lvl.subtitle}</Text>
                </View>

                <Icon name="arrow" size={18} color={lvl.color} />
              </Pressable>
            ))}

            <Pressable
              testID="review-level-all-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Study all 50 words"
              onPress={() => selectLevel("all")}
              style={({ pressed }) => [
                styles.allWordsBtn,
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.85 },
              ]}
            >
              <Icon name="cards" size={18} color={colors.primary} />
              <Text style={styles.allWordsBtnText}>Study All 50 Words</Text>
              <Icon name="arrow" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </Screen>
    );
  }

  // 2. FLASHCARD STUDY SCREEN (Filtered to selected level)
  return (
    <Screen testID="screen-review">
      <View testID="review-header" style={{ gap: 6 }}>
        <View style={styles.headerTopRow}>
          <Pressable
            testID="review-back-to-levels-btn"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Back to level selection"
            onPress={handleBackToLevels}
            style={({ pressed }) => [
              styles.changeLevelBtn,
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
          >
            <Icon name="arrowLeft" size={14} color={colors.primary} />
            <Text style={styles.changeLevelBtnText}>Change Level</Text>
          </Pressable>

          <View style={styles.levelTagPill}>
            <Text style={styles.levelTagPillText}>
              {currentLevelInfo ? `${currentLevelInfo.name} Level` : "All Words"}
            </Text>
          </View>
        </View>

        <Title testID="review-title">
          {currentLevelInfo ? `${currentLevelInfo.name} Flashcards` : "All 50 Flashcards"}
        </Title>
        <Body
          testID="review-subtitle"
          style={{ fontSize: 14.5, color: colors.muted }}
        >
          Tap the card to flip between picture and meaning.
        </Body>
      </View>

      <View testID="review-controls-row" style={styles.controlsRow}>
        <Pressable
          testID="review-shuffle-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Shuffle word cards"
          onPress={handleShuffle}
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Icon name="shuffle" size={15} color={colors.primary} />
          <Text style={styles.actionBtnText}>Shuffle</Text>
        </Pressable>

        <Pressable
          testID="review-view-mode-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${viewMode === "card" ? "list" : "card"} mode`}
          onPress={handleToggleView}
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Icon
            name={viewMode === "card" ? "cards" : "book"}
            size={15}
            color={colors.primary}
          />
          <Text style={styles.actionBtnText}>
            {viewMode === "card" ? "List View" : "Card Mode"}
          </Text>
        </Pressable>
      </View>

      {viewMode === "card" && currentWord ? (
        <View testID="review-card-container" style={{ gap: 10 }}>
          <Animated.View
            style={[
              { width: "100%" },
              {
                opacity: slideOpacity,
                transform: [
                  { translateX: slideAnim },
                  {
                    translateX: shuffleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 42, 0],
                    }),
                  },
                  {
                    rotate: shuffleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ["0deg", "7deg", "0deg"],
                    }),
                  },
                  {
                    scale: shuffleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <ReviewFlashcard key={currentWord.id} word={currentWord} />
          </Animated.View>

          <View testID="review-card-pager-row" style={styles.cardPagerRow}>
            <Pressable
              testID="review-pager-prev-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Previous word"
              disabled={safeIndex === 0}
              onPress={handlePrev}
              style={[
                styles.pagerBtn,
                safeIndex === 0 && styles.pagerBtnDisabled,
              ]}
            >
              <Icon
                name="arrowLeft"
                size={16}
                color={safeIndex === 0 ? "#BFB8CB" : colors.primary}
              />
              <Text
                style={[
                  styles.pagerBtnText,
                  safeIndex === 0 && styles.pagerBtnTextDisabled,
                ]}
              >
                Previous
              </Text>
            </Pressable>

            <View testID="review-pager-counter-pill" style={styles.pagerPill}>
              <Text style={styles.pagerPillText}>
                {safeIndex + 1} of {words.length}
              </Text>
            </View>

            <Pressable
              testID="review-pager-next-btn"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Next word"
              disabled={safeIndex >= words.length - 1}
              onPress={handleNext}
              style={[
                styles.pagerBtn,
                safeIndex >= words.length - 1 && styles.pagerBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.pagerBtnText,
                  safeIndex >= words.length - 1 &&
                    styles.pagerBtnTextDisabled,
                ]}
              >
                Next
              </Text>
              <Icon
                name="arrow"
                size={16}
                color={
                  safeIndex >= words.length - 1
                    ? "#BFB8CB"
                    : colors.primary
                }
              />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {words.map((word) => (
            <ReviewFlashcard key={word.id} word={word} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  selectorWrapper: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 10,
    width: "100%",
  },
  selectorHeader: {
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  selectorTitle: {
    fontSize: 26,
    color: colors.darkPurple,
    textAlign: "center",
  },
  selectorSubtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 320,
  },
  levelButtonsWrap: {
    width: "100%",
    gap: 12,
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    gap: 14,
    shadowColor: "#7A61A6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  levelCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  levelCardName: {
    fontFamily: "Nunito_900Black",
    fontSize: 18,
  },
  countTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countTagText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
  },
  levelCardDesc: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: "#6C657A",
  },
  allWordsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#DECFFC",
    marginTop: 4,
    shadowColor: "#7A61A6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  allWordsBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: colors.primary,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  changeLevelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F0EBF9",
    borderWidth: 1,
    borderColor: "#DECFFC",
  },
  changeLevelBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12.5,
    color: colors.primary,
  },
  levelTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#EDE8FC",
  },
  levelTagPillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: colors.darkPurple,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DECFFC",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12.5,
    color: colors.primary,
  },
  cardPagerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 6,
  },
  pagerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2D8F2",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pagerBtnDisabled: {
    opacity: 0.45,
    backgroundColor: "#F7F5FA",
    borderColor: "#EAE6F0",
    elevation: 0,
    shadowOpacity: 0,
  },
  pagerBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14.5,
    color: colors.primary,
  },
  pagerBtnTextDisabled: {
    color: "#8C8599",
  },
  pagerPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#F0EBF9",
  },
  pagerPillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.primary,
  },
});

export default ReviewScreen;
