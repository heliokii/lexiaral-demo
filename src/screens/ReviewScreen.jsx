import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CONTENT } from "../content";
import { Art, Icon } from "../Art";
import { useLearning } from "../state/LearningProvider";
import {
  Body,
  Button,
  Card,
  Screen,
  Title,
  colors,
} from "../components/ui";
import { ReviewFlashcard } from "../components/learning";

export function ReviewScreen({ navigation }) {
  const { state } = useLearning();
  const [filter, setFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("card"); // 'card' (single card mode) or 'list'

  const allWords = CONTENT.words || [];
  const practicedIds = new Set(state.encounteredWordIds || []);
  const practicedWords = allWords.filter((w) => practicedIds.has(w.id));

  const displayWords = filter === "practiced" ? practicedWords : allWords;
  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, displayWords.length - 1),
  );
  const currentWord = displayWords[safeIndex];

  return (
    <Screen testID="screen-review">
      <View testID="review-header" style={{ gap: 4 }}>
        <Title testID="review-title">Learn: Word Flashcards</Title>
        <Body testID="review-subtitle" style={{ fontSize: 15, color: colors.muted }}>
          Study all 20 Grade 3 ARAL words with pictures, definitions, and sound.
        </Body>
      </View>

      <View testID="review-filter-row" style={styles.flashcardFilterRow}>
        <Pressable
          testID="review-filter-all-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`All ${allWords.length} words`}
          onPress={() => {
            setFilter("all");
            setCurrentIndex(0);
          }}
          style={[
            styles.flashcardFilterBtn,
            filter === "all" && styles.flashcardFilterBtnActive,
          ]}
        >
          <Text
            style={[
              styles.flashcardFilterText,
              filter === "all" && styles.flashcardFilterTextActive,
            ]}
          >
            All Words ({allWords.length})
          </Text>
        </Pressable>

        <Pressable
          testID="review-filter-practiced-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Practiced ${practicedWords.length} words`}
          onPress={() => {
            setFilter("practiced");
            setCurrentIndex(0);
          }}
          style={[
            styles.flashcardFilterBtn,
            filter === "practiced" && styles.flashcardFilterBtnActive,
          ]}
        >
          <Text
            style={[
              styles.flashcardFilterText,
              filter === "practiced" && styles.flashcardFilterTextActive,
            ]}
          >
            Practiced ({practicedWords.length})
          </Text>
        </Pressable>

        <Pressable
          testID="review-view-mode-btn"
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${viewMode === "card" ? "list" : "card"} mode`}
          onPress={() => setViewMode(viewMode === "card" ? "list" : "card")}
          style={styles.flashcardViewModeBtn}
        >
          <Icon
            name={viewMode === "card" ? "cards" : "book"}
            size={15}
            color={colors.primary}
          />
          <Text style={styles.flashcardViewModeText}>
            {viewMode === "card" ? "List View" : "Card Mode"}
          </Text>
        </Pressable>
      </View>

      {filter === "practiced" && !practicedWords.length ? (
        <Card testID="review-no-practiced-card" style={{ alignItems: "center", padding: 24, gap: 12 }}>
          <Art name="owl-reading" height={140} />
          <Title style={{ fontSize: 20, textAlign: "center" }}>
            No practiced words yet
          </Title>
          <Body style={{ textAlign: "center", fontSize: 15 }}>
            Play the quiz games in Play mode to practice words, or switch to
            "All Words" to study now!
          </Body>
          <Button
            testID="review-goto-play-btn"
            title="Go to Play Mode"
            icon="book"
            onPress={() => navigation.navigate("Levels")}
          />
        </Card>
      ) : viewMode === "card" && currentWord ? (
        <View testID="review-card-container" style={{ gap: 12 }}>
          <ReviewFlashcard
            key={currentWord.id}
            word={currentWord}
            isPracticed={practicedIds.has(currentWord.id)}
          />

          <View testID="review-card-pager-row" style={styles.cardPagerRow}>
            <Pressable
              testID="review-pager-prev-btn"
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
                name="arrow"
                size={16}
                color={safeIndex === 0 ? "#BFB8CB" : colors.primary}
                style={{ transform: [{ rotate: "180deg" }] }}
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
                {safeIndex + 1} of {displayWords.length}
              </Text>
            </View>

            <Pressable
              testID="review-pager-next-btn"
              accessibilityRole="button"
              accessibilityLabel="Next word"
              disabled={safeIndex >= displayWords.length - 1}
              onPress={() =>
                setCurrentIndex(
                  Math.min(displayWords.length - 1, safeIndex + 1),
                )
              }
              style={[
                styles.pagerBtn,
                safeIndex >= displayWords.length - 1 && styles.pagerBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.pagerBtnText,
                  safeIndex >= displayWords.length - 1 &&
                    styles.pagerBtnTextDisabled,
                ]}
              >
                Next
              </Text>
              <Icon
                name="arrow"
                size={16}
                color={
                  safeIndex >= displayWords.length - 1
                    ? "#BFB8CB"
                    : colors.primary
                }
              />
            </Pressable>
          </View>
        </View>
      ) : (
        displayWords.map((word) => (
          <ReviewFlashcard
            key={word.id}
            word={word}
            isPracticed={practicedIds.has(word.id)}
          />
        ))
      )}

      <Card
        style={{
          backgroundColor: "#F6F2FD",
          borderColor: "#D9CBF7",
          borderWidth: 1.5,
          gap: 10,
          marginTop: 4,
        }}
      >
        <Title style={{ fontSize: 18, color: colors.darkPurple }}>
          Ready to play and test yourself?
        </Title>
        <Body style={{ fontSize: 14 }}>
          Jump into Play mode to earn stars and complete all three Grade 3 ARAL
          levels!
        </Body>
        <Button
          title="Play Learning Levels"
          icon="book"
          tone="mint"
          onPress={() => navigation.navigate("Levels")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flashcardFilterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  flashcardFilterBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2D9F3",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  flashcardFilterBtnActive: {
    borderColor: colors.purple,
    backgroundColor: "#F3EDFF",
  },
  flashcardFilterText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.muted,
  },
  flashcardFilterTextActive: {
    color: colors.darkPurple,
  },
  flashcardViewModeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F3EEFB",
    borderWidth: 1.5,
    borderColor: "#DECFFC",
  },
  flashcardViewModeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
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
  },
  pagerBtnDisabled: {
    opacity: 0.45,
    backgroundColor: "#F7F5FA",
    borderColor: "#EAE6F0",
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
    paddingVertical: 6,
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
