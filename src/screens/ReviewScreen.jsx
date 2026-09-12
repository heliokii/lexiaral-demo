import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { CONTENT } from "../content";
import { Icon } from "../Art";
import { Body, Screen, Title, colors } from "../components/ui";
import { ReviewFlashcard } from "../components/learning";

export function ReviewScreen() {
  const [words, setWords] = useState(() => [...(CONTENT.words || [])]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("card"); // 'card' (single card mode) or 'list'

  const shuffleAnim = useRef(new Animated.Value(0)).current;

  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, words.length - 1),
  );
  const currentWord = words[safeIndex];

  const handleShuffle = () => {
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

  return (
    <Screen testID="screen-review">
      <View testID="review-header" style={{ gap: 4 }}>
        <Title testID="review-title">Word Flashcards</Title>
        <Body
          testID="review-subtitle"
          style={{ fontSize: 15, color: colors.muted }}
        >
          Study all {words.length} Grade 3 ARAL words with pictures, definitions, and sound.
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
          onPress={() => setViewMode(viewMode === "card" ? "list" : "card")}
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
                transform: [
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
              onPress={() => setCurrentIndex(Math.max(0, safeIndex - 1))}
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
              onPress={() =>
                setCurrentIndex(
                  Math.min(words.length - 1, safeIndex + 1),
                )
              }
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
    gap: 8,
    paddingVertical: 6,
  },
  pagerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2D8F2",
    shadowColor: "#8C77B0",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
    fontSize: 13,
    color: colors.primary,
  },
  pagerBtnTextDisabled: {
    color: "#8C8599",
  },
  pagerPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#F0EBF9",
  },
  pagerPillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: colors.primary,
  },
});

export default ReviewScreen;
