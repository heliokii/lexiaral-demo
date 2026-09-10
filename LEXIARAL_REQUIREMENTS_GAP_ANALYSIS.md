# 🔍 LEXIARAL Requirements Gap Analysis & Unimplemented Features Audit

**Document:** Comprehensive Requirements Traceability & Technical Gap Analysis  
**Reference Sources:** 
- `LEXIARAL_Combined_App_Structure_and_Flow-TRUEEEE.pdf` (Client Project Specification)
- `Screenshot 2026-09-10 194555 (1).pdf` (Client Chat History & Agreements)
- `UI UX.jpg` (Visual Mockup Blueprint)
- Current Codebase (`src/`, `assets/`, `App.js`)  
**Date:** September 2026  
**Status:** Discussion & Planning Phase (**No Code Execution Yet**)

---

## Table of Contents
1. [Executive Confirmation & Asset Status](#1-executive-confirmation--asset-status)
2. [Section-by-Section Audit of the PDF Specification](#2-section-by-section-audit-of-the-pdf-specification)
3. [Major Feature Gaps (Unimplemented Requirements)](#3-major-feature-gaps-unimplemented-requirements)
   - [Gap 1: Missing Learning Activity Types](#gap-1-missing-learning-activity-types)
   - [Gap 2: Content Pack Scope (4 Demo Words vs. 15 ARAL Target Words)](#gap-2-content-pack-scope-4-demo-words-vs-15-aral-target-words)
   - [Gap 3: Audio & Story Read-Aloud Narration](#gap-3-audio--story-read-aloud-narration)
   - [Gap 4: Multi-Pupil Testing & Research Data Reset (Critical Thesis Gap)](#gap-4-multi-pupil-testing--research-data-reset-critical-thesis-gap)
   - [Gap 5: Flexible Image Loader for Client Flashcard Photos (PNG/JPG)](#gap-5-flexible-image-loader-for-client-flashcard-photos-pngjpg)
   - [Gap 6: Configurable Level Mastery / Unlocking Thresholds](#gap-6-configurable-level-mastery--unlocking-thresholds)
4. [Identified Technical Bugs & Code Smells](#4-identified-technical-bugs--code-smells)
5. [The 18 Screens Checklist: Current Implementation Status](#5-the-18-screens-checklist-current-implementation-status)
6. [Prioritized Decision Matrix for Developer Team Discussion](#6-prioritized-decision-matrix-for-developer-team-discussion)

---

## 1. Executive Confirmation & Asset Status

### Did fixing the asset code resolve the mascot visibility?
**Yes, exactly.**  
In [src/Art.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/Art.js#L18), the app was previously looking for hyphenated keys (e.g. `assets["owl-reading"]`), while `src/assets.generated.js` exported underscore keys (e.g. `owl_reading`). We patched [src/Art.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/Art.js) to resolve both (`assets[name] || assets[name.replace(/-/g, '_')]`). Lexi the owl now loads and renders cleanly.

### Is the previous roadmap document updated?
**Yes.**  
[LEXIARAL_PROJECT_PERSPECTIVE_AND_ROADMAP.md](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/LEXIARAL_PROJECT_PERSPECTIVE_AND_ROADMAP.md) contains:
- Complete background on Reynalyn's team (4th-year BEEd students from Luansing/Rosario).
- Negotiation analysis (budget, timeline, ₱7,000 agreement).
- Breakdown of `UI UX.jpg` and the 10-item gap checklist.

This new document focuses strictly on **what requirements from the client's PDF are still missing, incomplete, or buggy** in our current codebase.

---

## 2. Section-by-Section Audit of the PDF Specification

We compared each numbered section of `LEXIARAL_Combined_App_Structure_and_Flow-TRUEEEE.pdf` against our code:

| PDF Section | Requirement in PDF | Current State in Codebase | Compliance Status |
| :--- | :--- | :--- | :---: |
| **Section 5: Progression** | Know $\rightarrow$ Understand $\rightarrow$ Apply $\rightarrow$ Mastery | Easy (recognition) $\rightarrow$ Average (sentence) $\rightarrow$ Difficult (story) | ✅ **100% Implemented** |
| **Section 6: Main Flow** | Splash $\rightarrow$ Welcome $\rightarrow$ Home $\rightarrow$ Levels $\rightarrow$ Activities $\rightarrow$ Results | Full React Navigation stack in [App.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/App.js) | ✅ **100% Implemented** |
| **Section 7: Screens** | Splash, Home, Level Selection, Badges, Progress, Review, About | All screen components present in [DashboardScreens.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/screens/DashboardScreens.js) | ✅ **100% Implemented** |
| **Section 8.1: Easy Activities** | 5 activity modes: Picture-to-Word, Word-to-Picture, Matching, Listen-and-Choose, Flashcard Review | Only Picture-to-Word & Word-to-Picture are in the game loop; Matching & Listen-and-Choose are **missing** | ⚠️ **Partial (40%)** |
| **Section 9.1: Average Activities**| Complete Sentence, Meaning in Context, Picture-Supported Sentence, Choose Best Use | Complete Sentence & Meaning in Context exist; Picture-supported & Best-use are **missing** | ⚠️ **Partial (50%)** |
| **Section 10.1: Story Challenge** | Story reading, highlighted words, word definitions, WH-questions, optional audio | Interactive word tap & questions work; Full story read-aloud TTS audio is **missing** | ⚠️ **Partial (80%)** |
| **Section 11: Final Results** | Easy/Avg/Diff scores, Total stars, Performance message, Vocabulary Master badge, 3 action buttons | FinalScreen implements all metrics, confetti, badge award, and action buttons | ✅ **100% Implemented** |
| **Section 12: Scoring** | +1 star per correct, 0 for wrong, positive reinforcement | Reducer in [src/state/engine.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/state/engine.js) follows exact scoring formula | ✅ **100% Implemented** |
| **Section 13: Vocabulary Review**| Flashcards with Word, Picture, Meaning, Example Sentence, Audio, Introduced Level | [ReviewScreen](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/screens/DashboardScreens.js#L168) has flip cards with audio and sentence | ✅ **95% Implemented** |
| **Section 14: Progress Dashboard**| Words practiced, scores, stars, badge count, activity completion | Implemented in [ProgressScreen](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/screens/DashboardScreens.js#L193) with progress bars | ✅ **100% Implemented** |
| **Section 15: Badges** | 5 specific badges: First Word, Word Explorer, Sentence Builder, Story Reader, Vocabulary Master | Exact 5 badges defined and awarded in [src/state/engine.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/state/engine.js#L8-L34) | ✅ **100% Implemented** |
| **Section 16: Vocabulary Table** | 15 official Grade 3 ARAL target words | Only 4 mock demo words (`seed`, `soil`, `water`, `sprout`) | ❌ **Incomplete Content** |
| **Section 20: Technical Stack** | Offline storage, audio, question counters, level unlocking | `AsyncStorage`, `expo-speech`, question pagination | ✅ **100% Implemented** |

---

## 3. Major Feature Gaps (Unimplemented Requirements)

### Gap 1: Missing Learning Activity Types
In the PDF, Level 1 and Level 2 describe specific pedagogical activity modes that are not yet written in our question generator:

#### A. Level 1 (Easy Level) Missing Activities:
1. **Listen-and-Choose (Audio-First Activity):**
   - *PDF Requirement (Section 8.1):* *"Listen to pronunciation and select the correct word."*
   - *Current Code:* Only visual picture-to-word and word-to-picture exist. A student cannot currently test their listening/phonics comprehension where they tap a speaker icon, hear the spoken word, and pick the matching word/picture.
2. **Matching Activity:**
   - *PDF Requirement (Section 8.1):* *"Match target vocabulary words with corresponding pictures."*
   - *Current Code:* We only have multiple-choice (1 question $\rightarrow$ 4 choices). We do not have a 2-column drag/tap matching widget. *(Note: Multiple-choice can substitute if agreed upon, but it is explicitly listed in the PDF).*

#### B. Level 2 (Average Level) Missing Activities:
1. **Picture-Supported Sentence:**
   - *PDF Requirement (Section 9.1):* *"Use a picture as additional support for understanding."*
   - *Current Code:* In [SentenceCompletionQuestionWidget](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/components/learning.js#L168), the top of the card shows `<Art name="owl-reading" height={110} />` instead of the picture of the target word! For struggling Grade 3 pupils, seeing the picture alongside the fill-in-the-blank sentence is a primary learning aid.
2. **Choose the Best Use:**
   - *PDF Requirement (Section 9.1):* *"Select the sentence that uses the target word correctly."*
   - *Current Code:* Currently we only have "Which word completes the blank?" and "What does the word mean in this sentence?". We don't have sentence-choice questions where 4 sentences are shown and the student picks the grammatically correct one.

---

### Gap 2: Content Pack Scope (4 Demo Words vs. 15 ARAL Target Words)
- *PDF Requirement (Section 16 & 25):* The PDF provides a 15-row table for official Grade 3 ARAL English target words. The research team specifically noted:  
  > *"The vocabulary database must be based on the approved Grade 3 ARAL English 3 materials... The actual word list should be filled in only after the research team verifies the Grade 3 ARAL English 3 flashcards, modules, and reading passages."*
- *Current Code:* [assets/content.json](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/assets/content.json) has only **4 placeholder words**: `seed`, `soil`, `water`, `sprout`, and one demo story ("Mia's Little Garden").
- *Impact:* The code is currently a technology demo. It cannot be used for the clients' thesis data gathering until their 15 words, definitions, sentences, and ARAL reading passage are inserted.

---

### Gap 3: Audio & Story Read-Aloud Narration
- *PDF Requirement (Section 10.1):* *"Optional audio for reading/pronunciation... Tap a target word to view its simple meaning and/or pronunciation."*
- *Current Code:*
  - Individual word tapping and pronunciation works in Level 1, Level 2, and in the Story vocabulary modal.
  - **Missing:** There is no **"Read the whole story to me"** audio narration button on the reading passage screen. For struggling Grade 3 pupils (who experience slow decoding as noted in Section 1 of the thesis), having a button that speaks the full passage aloud via `expo-speech` would be a massive educational asset.

---

### Gap 4: Multi-Pupil Testing & Research Data Reset (Critical Thesis Gap)
- *Thesis Reality:* Reynalyn and her 3 co-researchers need to test this app on **20 to 30 Grade 3 respondents** at selected elementary schools in Rosario West District to gather empirical pre-test/post-test data.
- *Current Code Limitation:*
  - [src/state/LearningProvider.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/state/LearningProvider.js) saves all progress under a single global storage key: `LEXIARAL:progress:v1:lexiaral-demo-v1`.
  - There is **no profile switcher, no "Pupil ID / Name" input**, and **no "Reset Data for Next Pupil" button**.
  - If Pupil 1 plays and finishes Level 1 (earning 4 stars and unlocking Level 2), when the researcher hands the tablet to Pupil 2, Level 2 is already unlocked and Pupil 1's stars are already there!
- *Why this is critical:* Without an in-app "Reset Data" or "New Pupil Session" button, the researchers will not be able to conduct clean testing without uninstalling the app or clearing the device cache between each student!

---

### Gap 5: Flexible Image Loader for Client Flashcard Photos (PNG/JPG)
- *PDF Requirement (Section 8.2 & 23):* *"Prepare pictures and pronunciation resources for Easy... Actual ARAL vocabulary picture."*
- *Current Code Limitation:*
  - In [src/components/learning.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/components/learning.js#L38-L43), images are rendered strictly through `react-native-svg` `<SvgXml>` using bundled SVG strings in `illustrations.js`.
  - If the client sends official DepEd ARAL flashcards as **photos, camera scans, or `.png` / `.jpg` files**, the app **cannot display them**! It will throw an error or show a blank card.
- *Solution Needed:* `WordPicture` must support standard React Native `Image` components (`require('../assets/words/basket.png')` or URI) in addition to SVGs.

---

### Gap 6: Configurable Level Mastery / Unlocking Thresholds
- *PDF Requirement (Section 7.3 & 25):*  
  > *"Recommended unlocking: Easy $\rightarrow$ Average $\rightarrow$ Difficult. The mastery requirement may be adjusted by the research team or teacher... The mastery threshold for unlocking levels should be agreed upon by the research team and adviser."*
- *Current Code:* In [src/content.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/content.js#L33):
  ```javascript
  export const UNLOCK_PERCENT = 0;
  ```
  Zero percent means that simply reaching the end of Level 1 unlocks Level 2, even if the student got 0 out of 10 answers correct!
- *Gap:* The thesis panel or adviser will likely demand a true mastery threshold (e.g. 75% or 80% passing score) to validate their research title (*"Strengthening Lexical Acquisition..."*). We need an easy way to adjust this percentage or let the researchers configure it.

---

## 4. Identified Technical Bugs & Code Smells

During our code review, we discovered several technical issues that should be cleaned up:

1. **Hardcoded `basket` Exception in [src/components/learning.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/components/learning.js#L35):**
   ```javascript
   {key === 'basket' ? (
     <Art name="basket" height={height} />
   ) : (
     <SvgXml xml={illustrations[key]} ... />
   )}
   ```
   `Art name="basket"` was hardcoded as a special case for the mockup, but `"basket"` was never actually added to `scripts/create-assets.cjs` or `assets.generated.js`! If a question uses `asset://basket`, it renders blank.
2. **Duplicate Component in [src/screens/LearningScreens.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/screens/LearningScreens.js#L47):**
   There is a duplicate `LevelsScreen` defined in `LearningScreens.js` (lines 47–137) that is never imported or used by `App.js` (which imports the richer [src/screens/LevelsScreen.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/screens/LevelsScreen.js)). Dead code that should be cleaned up to avoid confusion.
3. **Audio Queue Collision on Fast Tapping:**
   In [src/audio.js](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/src/audio.js#L38-L47), if an excited child rapidly taps several answer choices or the speaker button multiple times, `Speech.speak` calls can occasionally overlap or stutter on some Android devices.
4. **Desktop Web Viewport Stretching:**
   As seen in the teammate's screenshots, when running on web without mobile device emulation, `maxWidth: 720` causes the layout to stretch across 1920 pixels, distorting the pastoral background SVG.

---

## 5. The 18 Screens Checklist: Current Implementation Status

Section 19 of the client's PDF specifies **18 Recommended Screens**:

| # | Screen Name | Screen in Codebase | Implementation Status | Notes |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Splash / Welcome Screen | `WelcomeScreen` | ✅ Complete | Shows Lexi, title, and "Let's start!" |
| **2** | Home Screen | `HomeScreen` | ✅ Complete | "Hi, I'm Lexi", tiles, stats, bottom nav |
| **3** | Level Selection | `LevelsScreen` | ✅ Complete | Easy, Average, Difficult cards |
| **4** | Easy Instructions | `ActivityScreen` (phase: instructions) | ✅ Complete | Audio instruction read-aloud |
| **5** | Easy Flashcard Game | `ActivityScreen` (level 1) | ⚠️ Partial | Has Picture-to-Word & Word-to-Picture; lacks Listen-and-Choose |
| **6** | Easy Results | `ResultsScreen` | ✅ Complete | Score, stars, review button |
| **7** | Average Instructions | `ActivityScreen` (phase: instructions) | ✅ Complete | Instructions for sentence level |
| **8** | Average Sentence Game | `ActivityScreen` (level 2) | ⚠️ Partial | Has blank sentences; lacks word picture support |
| **9** | Average Results | `ResultsScreen` | ✅ Complete | Score, stars, next unlock |
| **10** | Difficult Instructions | `ActivityScreen` (phase: instructions) | ✅ Complete | Instructions for story challenge |
| **11** | Story / Reading Screen | `ActivityScreen` (phase: story) | ✅ Complete | Passage with clickable target words |
| **12** | Difficult Questions | `ActivityScreen` (level 3 questions) | ✅ Complete | WH-comprehension & vocabulary questions |
| **13** | Difficult Results | `ResultsScreen` | ✅ Complete | Score and completion summary |
| **14** | Final Results | `FinalScreen` | ✅ Complete | Confetti, 3-level score bars, Master badge |
| **15** | Vocabulary Review | `ReviewScreen` | ✅ Complete | Flip cards with definitions and audio |
| **16** | My Progress | `ProgressScreen` | ✅ Complete | Lifetime stars, word counts, attempt history |
| **17** | Badges / Achievements | `BadgesScreen` | ✅ Complete | 5 milestone achievement cards |
| **18** | About the App | `AboutScreen` | ✅ Complete | Educational context, audio toggle, thesis info |

**Scorecard:** **16 out of 18 screens are 100% complete.** The remaining 2 screens (Easy Game and Average Game) work, but need the missing activity modes outlined in Gap 1.

---

## 6. Prioritized Decision Matrix for Developer Team Discussion

Here is a recommended discussion roadmap for you and your teammate:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT ROADMAP                             │
├────────────────────────────────┬───────────────────────────────────────┤
│ PHASE 1: Immediate Alignment   │ • Add Reset Data button (for thesis)  │
│          (Before Client Meet)  │ • Add PNG/JPG image support           │
│                                │ • Adjust desktop web width to 440px   │
├────────────────────────────────┼───────────────────────────────────────┤
│ PHASE 2: Content Integration   │ • Client submits 15 ARAL words        │
│          (Upon Downpayment)    │ • Populate assets/content.json        │
│                                │ • Add official story passage          │
├────────────────────────────────┼───────────────────────────────────────┤
│ PHASE 3: Activity Expansion    │ • Add Listen-and-Choose in Level 1    │
│          (Polish & Refinement) │ • Add picture in Level 2 sentences    │
│                                │ • Build Android APK for school test   │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Questions to Align on With Your Teammate:
1. **Activity Complexity:**  
   Do we want to build the 2-column "Matching" drag-and-drop game, or can we stick to multiple-choice (which is much more reliable on budget school tablets)?
2. **Audio Narration:**  
   Should we add a button to read the full story aloud via TTS, or keep it word-by-word only?
3. **Data Reset Placement:**  
   Where should we put the "Reset for Next Pupil" button? (Recommendation: In the `About` screen or a hidden long-press on the Home logo so pupils don't accidentally erase their data during a test).
4. **Mastery Threshold:**  
   What passing percentage should we recommend to the client (e.g. 75% or 80%) before Level 2 and Level 3 unlock?

---

*This document is saved in your workspace at [LEXIARAL_REQUIREMENTS_GAP_ANALYSIS.md](file:///c:/Users/HP%20LAPTOP%2015s/lexiaral-demo/LEXIARAL_REQUIREMENTS_GAP_ANALYSIS.md) for you and your teammate to review and discuss.*
