# LEXIARAL Mobile UI/UX Comprehensive Audit & Polish Specification

This document provides a systematic, issue-by-issue audit of all 52 physical mobile screenshots captured from the live Android device (`uiuxscreenshots/`). It details every UI/UX defect observed, its root cause in the codebase, the affected screenshot references, and the clean, non-overengineered solution.

---

## 1. Global & Cross-Screen Issues

### Issue 1.1: Missing Safe Area Bottom Insets on Fixed and Bottom-Anchored Elements
- **Screenshots**: `0c4cadfb`, `0f8ad288`, `653472a1`, `81b15bed`, `9ae4418d`, `15e66c60`
- **Observed Defect**: Primary action buttons (such as "Let's start!", "NEXT QUESTION", level cards, and flashcard pagination controls) touch or are partially clipped by the Android 3-button system navigation bar (`||| [] <`) or home gesture area.
- **Root Cause**: In `src/components/ui.jsx` (`Screen`, `bottomSlotWrapper`) and `src/screens/ActivityScreen.jsx` (`styles.bottomSheet`), the bottom padding uses a fixed value (`paddingBottom: 24` or `paddingBottom: 26`) without dynamically adding `insets.bottom` from `useSafeAreaInsets()`.
- **Clean Fix**:
  - In `ActivityScreen.jsx` bottom sheet: update `paddingBottom` to `Math.max(insets.bottom + 16, 24)`.
  - In `ui.jsx` (`Screen`): ensure `contentContainerStyle` paddingBottom dynamically respects `insets.bottom + 20` when no bottom slot is provided.

### Issue 1.2: Header & Back Button Scrolls Off-Screen on Subscreens
- **Screenshots**: `66a22272`, `7d1ddc76`, `c0266393`, `ab00833c`
- **Observed Defect**: When the user scrolls down on Badges, Levels, About, or Home screens, the top navigation back chevron `<` and screen title scroll completely out of view. The user is left with no visible way to navigate back without scrolling all the way to the top.
- **Root Cause**: In `src/components/ui.jsx`, the subscreen back button (`screenBackBtn`) is placed inside the scrollable `<ScrollView>` container rather than in a persistent header bar.
- **Clean Fix**: Provide a fixed or sticky top bar in `Screen` for subscreens, or pin the header row with safe top insets so navigation remains accessible regardless of scroll offset.

---

## 2. Welcome / Onboarding Screen

### Issue 2.1: Viewport Vertical Overflow Pushing CTA Button Into Navigation Bar
- **Screenshots**: `2d8059ba`, `81b15bed`
- **Observed Defect**: On standard mobile screen aspect ratios (18:9, 19.5:9, 20:9), the "Let's start!" button is pushed all the way to the bottom edge and partially obscured by the Android system navigation bar.
- **Root Cause**: In `src/screens/WelcomeScreen.jsx`, `styles.welcome` has `justifyContent: "center", gap: 22, paddingBottom: 30`, with a 200px animated mascot, large brand typography (fontSize 39), pupil ID card, and start button. The cumulative static height exceeds available viewport height between the status bar and navigation bar.
- **Clean Fix**:
  - Reduce mascot height to `160px` on mobile screens.
  - Reduce `gap: 22` to `gap: 14` in `styles.welcome`.
  - Reduce pupil card padding from `16` to `12`.
  - Add explicit safe area bottom inset padding to ensure the CTA button floats cleanly above the system bar.

---

## 3. Home Screen

### Issue 3.1: "About LEXIARAL" Button Hidden Below Fold & Clipped Mascot on Scroll
- **Screenshots**: `1f2312f7`, `66a22272`
- **Observed Defect**:
  - In the default resting view (`1f2312f7`), the "About LEXIARAL" button is hidden below the screen fold.
  - When the user scrolls down (`66a22272`), the top brand row and the mascot's head are clipped awkwardly at the top edge.
- **Root Cause**:
  - The animated mascot container is `175px` tall, and the main action cards (Learn and Play) have substantial padding and vertical footprint.
  - `Encouragement` adds `paddingVertical: 12` and unnecessary vertical space.
- **Clean Fix**:
  - Adjust home layout vertical rhythm: mascot height `150px` on mobile, compact Learn and Play action cards (`paddingVertical: 16`), reduce encouragement vertical margins.
  - This allows the entire Home dashboard, including stats and the About button, to fit comfortably in a single screen without requiring scrolling.

---

## 4. Levels Selection Screen

### Issue 4.1: Level 3 Difficult Card Bottom Clipping
- **Screenshots**: `9ae4418d`, `c0266393`
- **Observed Defect**: The Level 3 (Difficult) card is clipped at the bottom rounded corners by the screen bezel. Scrolling down to see it reveals the "You can do it!" note but pushes the "Choose Your Level" header completely off-screen.
- **Root Cause**: In `src/screens/LevelsScreen.jsx`, `styles.levelCard` has `minHeight: 172`, `paddingVertical: 22`, `paddingTop: 32`, and `gap: 18` between 3 cards, creating an unconstrained ~600px stack.
- **Clean Fix**:
  - Make `levelCard` more compact: `minHeight: 130`, `paddingVertical: 14`, `paddingTop: 18`, `gap: 12`.
  - Keep the header fixed or compact so all three levels fit cleanly within standard viewport bounds.

---

## 5. Activity Screen: Multiple Choice & Sentence Completion

### Issue 5.1: Critical Choice Ellipsis Truncation Bug in 2x2 Grid
- **Screenshots**: `15a7873b`, `e6c2a3d4`
- **Observed Defect**:
  - In screenshot `15a7873b`: options are truncated as "She foun...", "She ate ...", "She wal...", "She has ...".
  - In screenshot `e6c2a3d4`: options are truncated as "Every eve...", "Every mor...", "Only at ni...".
  - In a reading and literacy application for Grade 3 children, truncating choices makes questions unreadable and impossible to answer.
- **Root Cause**: In `src/components/learning.jsx`, lines 197-200:
  ```javascript
  const isCompact =
    isFourChoices &&
    question.choices.every((choice) => (choice.label || "").length <= 32);
  const useGrid = pictures || isCompact;
  ```
  A 32-character threshold forces phrases and short sentences into a 2-column grid (`gridTile`). In a half-screen width (~160px) minus badges and margins, only ~80px is available for text. With `numberOfLines={2}` and large font (`fontSize: 22`), text is aggressively truncated with ellipses.
- **Clean Fix**:
  - Change the grid condition so text choices ONLY use a 2x2 grid if every choice is a single short word (<= 7 characters, e.g. "cat", "hat", "Max", "Sam").
  - Any choice containing spaces (multiple words), phrases, or sentences must ALWAYS render as a full-width linear row (`choiceRowLinear`) with full readability and no truncation.

### Issue 5.2: Awkward Word-Break Splitting Single Words Across Lines
- **Screenshots**: `dcdf51eb`
- **Observed Defect**: In Level 2 Question 1 ("Mia puts fresh vegetables in a _____"), Option C displays "basket" broken as "baske" on line 1 and "t" on line 2.
- **Root Cause**: In `learning.jsx`, `styles.choiceRowGrid` has a dummy `<View style={{ width: 28 }} />` that steals available text width, combined with `fontSize: 22` and no minimum text wrapping restraint.
- **Clean Fix**:
  - Remove the artificial dummy spacer in `choiceRowGrid`.
  - Scale grid text font size based on string length (e.g. `fontSize: 18` for 6+ characters).
  - Ensure words are never broken character-wise.

### Issue 5.3: Vertical Overflow Pushing Options C and D Off-Screen
- **Screenshots**: `17699d46`, `487383ee`, `b814f197`, `f9f079e5`
- **Observed Defect**: In sentence completion activities (e.g. "Which sentence uses 'book' correctly?"), Option C is cut in half and Option D is completely off-screen below the bottom bezel. Children do not realize there is a fourth option unless they scroll down, and scrolling causes the question prompt to disappear.
- **Root Cause**:
  - `styles.questionCard` has `padding: 18`, `gap: 12`, and `styles.sentenceBox` has `paddingVertical: 24`, `minHeight: 120`.
  - The choices list has `gap: 12` with `minHeight: 74` per option (344px total for 4 options).
  - The total height exceeds mobile viewport height.
- **Clean Fix**:
  - Reduce `sentenceBox` vertical padding from `24` to `14`, remove `minHeight: 120` (allow content to dictate height naturally).
  - Compact option cards for full-width sentences: `minHeight: 58`, `paddingVertical: 10`, `paddingHorizontal: 12`.
  - Ensure the activity layout fits the entire question and all 4 choices comfortably without requiring scrolling.

### Issue 5.4: Missing Image in Level 2 Question 10 ("road")
- **Screenshots**: `4e09af4e`, `92e34b6e`
- **Observed Defect**: In Average Level Question 10 ("The children walk carefully along the _____."), there is a giant blank gap between the question prompt and the sentence box.
- **Root Cause**:
  - In `assets/Average/`, `a14-road.png` is an uncompressed 1.88MB PNG file (in contrast to 20-30KB JPEG assets for other words).
  - On native Android devices, large high-resolution PNGs take longer to decode or encounter memory limits in React Native's Fresco image pipeline.
- **Clean Fix**:
  - Optimize and re-encode `a14-road.png` to a lightweight web/mobile-friendly JPEG or compressed PNG (matching the other ~30KB assets in `assets/Average`).
  - Add image loading fallback and error handling in `WordPicture`.

---

## 6. Activity Screen: Match Words to Pictures

### Issue 6.1: Giant White Empty Space in Prompt Card
- **Screenshots**: `0359b8fe`
- **Observed Defect**: The prompt card at the top has a title "Match Words to Pictures" at the top left, speaker button at the top right, and then a 200px blank white void before the instruction text "Match each target word with its correct picture!".
- **Root Cause**: `styles.questionCard` in `learning.jsx` has:
  ```css
  minHeight: 290,
  justifyContent: "space-between",
  ```
  Because `MatchingPairsQuestionWidget` only places a header row and a single `<Body>` text inside this card, `justifyContent: "space-between"` forces them to opposite ends of a 290px card, leaving a massive empty space.
- **Clean Fix**:
  - In `MatchingPairsQuestionWidget`, use a dedicated compact card style: remove `minHeight: 290` and `justifyContent: "space-between"`, using `alignItems: "center"`, `paddingVertical: 12`, `gap: 6`.
  - This immediately saves 180+ pixels of vertical height.

### Issue 6.2: 6-Pair Vertical Overflow Pushing Pairs Off-Screen
- **Screenshots**: `421f722a`, `0359b8fe`
- **Observed Defect**: With 6 word cards on the left and 6 picture cards on the right (each `minHeight: 64`), the board height is 440px+. Combined with the 290px prompt card, pairs 4, 5, and 6 are pushed off-screen, and scrolling pushes the question header out of sight.
- **Root Cause**: 6 pairs is too tall for a single mobile viewport when card height is 64px.
- **Clean Fix**:
  - With the prompt card compacted to ~70px, set `matchCard` `minHeight: 52` and `paddingVertical: 4` for 6-pair activities.
  - The entire 6-pair board fits on screen simultaneously so children can match all words without scrolling.

---

## 7. Activity Screen: Story Reading Challenge

### Issue 7.1: Primary CTA Button "NEXT: ANSWER QUESTIONS" Pushed Off-Screen
- **Screenshots**: `2fe269cd`, `369f0fff`
- **Observed Defect**: On Level 3 (Story phase), the screen shows the story header, illustration, and story text. However, the button "NEXT: ANSWER QUESTIONS >" is below the fold, so children don't immediately know how to proceed.
- **Root Cause**: In `ActivityScreen.jsx`, `session.phase === "story"` puts both the `InteractiveStoryReaderWidget` and the `Button` in a scrollable view without sticky placement.
- **Clean Fix**:
  - Place "NEXT: ANSWER QUESTIONS >" in `Screen`'s `bottomSlot` prop so it remains persistently visible at the bottom of the screen with a safe area inset.
  - The story text scrolls freely above the sticky button.

---

## 8. Activity Screen: Feedback Bottom Sheet Modal

### Issue 8.1: Verbatim Duplication of Answer in Explanation
- **Screenshots**: `c7a5ace0`
- **Observed Defect**: In vocabulary meaning questions, the modal shows:
  ```
  Correct answer: [An examination to measure what someone knows or has learned.]
  An examination to measure what someone knows or has learned.
  ```
  The exact same sentence is repeated twice consecutively.
- **Root Cause**: In `src/content.js`, `average-meaning-${word.id}` sets `choices: wordChoices(word, ..., true)` (which uses `word.definition` as choice labels) and `explanation: word.definition`. In `ActivityScreen.jsx`, the bottom sheet displays both `feedbackDetails.correctLabel` and `feedbackDetails.explanation`. When they are identical, it renders the exact duplicate text.
- **Clean Fix**: In `getFeedbackDetails` or in the modal render logic: if `rawExplanation.trim().toLowerCase() === correctLabel.trim().toLowerCase()`, suppress the redundant explanation text or show contextual reinforcement instead.

### Issue 8.2: Broken Truncated Story Excerpt in Feedback
- **Screenshots**: `a144366c`
- **Observed Defect**: The explanation reads:
  ```
  Mia has a small cat named Mimi. The cat likes to play with a ball every morning. After playing, the cat sits on a mat n... A small, furry animal often kept as a pet.
  ```
  Notice the broken truncated sentence `"on a mat n..."` concatenated with the definition.
- **Root Cause**: In `src/content.js`, lines 166 & 218:
  ```javascript
  explanation: `${word.story_context} ${word.definition}`
  ```
  In `assets/content.json`, `word.story_context` contains a hardcoded truncated string ending in an ellipsis `...`. Appending `word.definition` creates a garbled explanation.
- **Clean Fix**: Clean up `explanation` formatting in `src/content.js`: use the complete story sentence or display only the vocabulary definition and complete context sentence.

---

## 9. Review / Word Flashcards Screen

### Issue 9.1: Stacked Redundant Back Chevrons
- **Screenshots**: `15e66c60`, `49f58d35`
- **Observed Defect**: Two back buttons are stacked directly on top of each other: a circular `<` back button in the top left, and immediately below it, a `< Change Level` pill.
- **Root Cause**: `Screen` in `ui.jsx` automatically renders `screenBackBtn` for all screens where `isSubScreen` is true (including `ReviewScreen`). At the same time, `ReviewScreen.jsx` renders its own `changeLevelBtn` in the header row.
- **Clean Fix**: When in single flashcard study mode, either unify the back navigation so `changeLevelBtn` is the sole back action, or pass a prop to `Screen` to hide the redundant generic subscreen back arrow.

### Issue 9.2: Low Contrast Disabled Previous Button
- **Screenshots**: `9578a158`, `a2e4b669`
- **Observed Defect**: On flashcard 1 of 20, the `< Previous` button is disabled with extremely faint grey-purple text on an off-white pill background, making it practically invisible.
- **Root Cause**: In `ReviewScreen.jsx`, disabled styling has insufficient contrast ratio against the background.
- **Clean Fix**: Use a clear, accessible disabled style (e.g. `#A096B5` text on `#F0EBF9` pill) that satisfies WCAG 4.5:1 contrast requirements.

### Issue 9.3: Flashcard Container Height Pushing Pagination Bar to Screen Bezel
- **Screenshots**: `15e66c60`, `49f58d35`, `a2e4b669`
- **Observed Defect**: The pagination controls (`< Previous`, `1 of 20`, `Next >`) touch the bottom navigation bar with zero breathing room.
- **Root Cause**: In `learning.jsx`, `styles.flashcardContainer` has fixed `height: 395`. Combined with top header, subtitle, and shuffle controls, it pushes the bottom pagination bar against the bottom edge.
- **Clean Fix**: Dynamically adapt `flashcardContainer` height to `340px - 360px` on mobile viewports so the pagination bar sits comfortably above the safe area bottom inset.

### Issue 9.4: "Hat" Image Inconsistent Box Border Artifact
- **Screenshots**: `69e0d38c`, `b22d98f0`
- **Observed Defect**: In "Find the sun" question choices, Option A (hat) has a visible white box border with empty margins around the hat illustration, unlike Options B, C, and D which have full edge-to-edge illustration backgrounds.
- **Root Cause**: In `assets/Easy/E3. HAT.jpg`, the image has uncropped white margins around the subject.
- **Clean Fix**: Trim or format `E3. HAT.jpg` so its aspect ratio and background styling match the rest of the image choices.

---

## 10. Badges Screen

### Issue 10.1: Identical Yellow Rosette Ribbon Medal Used for All Badges
- **Screenshots**: `7d1ddc76`
- **Observed Defect**: Every single badge in the list ("First Word", "Word Explorer", "Sentence Builder", "Story Reader", "Vocabulary Master") displays the exact same yellow rosette ribbon icon (`medal`). There is zero visual reward or uniqueness between milestones.
- **Root Cause**: In `src/screens/BadgesScreen.jsx`, line 18 hardcodes:
  ```jsx
  <Art name="medal" width={78} height={86} />
  ```
  for every single badge in `BADGES.map()`.
- **Clean Fix**: Assign distinct visual iconography or colors to each badge tier (e.g. bronze star, silver book, gold ribbon, emerald story scroll, diamond trophy) using existing SVGs or distinct tint/badge styles in `Art.jsx`.

---

## 11. About Screen

### Issue 11.1: Redundant Floating Settings Gear Overlapping Content
- **Screenshots**: `ab00833c`
- **Observed Defect**: The About screen already functions as the application's settings and teacher controls. A floating quick-access button or overlay gear creates visual clutter directly over the "Researcher & Teacher Tools" section.
- **Clean Fix**: Ensure safe margins on all cards so content is not obscured by system edge controls.

---

## 12. Implementation Priority Roadmap

| Priority | Screen | Issue | Estimated Effort |
|---|---|---|---|
| **P0** | Activity | Fix 2x2 grid truncation bug (`useGrid` on multi-word phrases) | Low (Immediate fix in `learning.jsx`) |
| **P0** | Activity | Fix missing "road" image and add error handling | Low (Image asset / require check) |
| **P0** | Activity | Eliminate 200px empty void in Match Pairs top card (`minHeight: 290`) | Low (CSS adjustment in `learning.jsx`) |
| **P1** | Activity | Prevent Options C/D vertical overflow in sentence completion | Medium (Compact card heights & paddings) |
| **P1** | Activity | Fix duplicated feedback text and broken truncated story string | Low (String cleanup in `content.js`) |
| **P1** | Activity | Make "NEXT: ANSWER QUESTIONS" sticky in Story reader phase | Low (`bottomSlot` in `ActivityScreen.jsx`) |
| **P1** | Global | Add dynamic `insets.bottom` safe area padding to bottom sheets & screens | Low (`SafeAreaView` insets) |
| **P2** | Welcome | Reduce mascot/gap heights to prevent Start button clipping | Low (Spacing tweaks in `WelcomeScreen.jsx`) |
| **P2** | Home | Adjust vertical rhythm to bring "About LEXIARAL" above the fold | Low (Compact cards in `HomeScreen.jsx`) |
| **P2** | Review | Remove redundant stacked `<` back chevron on flashcards | Low (Condition in `ReviewScreen.jsx`) |
| **P2** | Review | Compact flashcard height from 395px to 350px on mobile | Low (CSS in `learning.jsx`) |
| **P2** | Badges | Give distinct icons/colors to the 5 achievement badges | Low (Mapping in `BadgesScreen.jsx`) |
| **P2** | Levels | Compact level cards so Level 3 card is not cut off at bottom | Low (CSS in `LevelsScreen.jsx`) |

---
*Audit completed covering all 52 mobile screenshots from `uiuxscreenshots/`.*
