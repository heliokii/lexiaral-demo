<p align="center">
  <img src="./assets/app-logo.png" alt="LEXIARAL App Logo" width="160" height="160" />
</p>

<h1 align="center">LEXIARAL</h1>

<p align="center">
  <strong>Grade 3 ARAL English Vocabulary & Literacy Learning Application</strong><br>
  Strengthening Lexical Acquisition through Flashcard-Based Instruction and Digital Games
</p>

---

## Overview

LEXIARAL is an interactive vocabulary learning application designed for Grade 3 learners following the Department of Education (DepEd) ARAL Program standards. It pairs flashcard-based vocabulary study (**LEARN** mode) with digital game reinforcement (**PLAY** mode across Easy, Average, and Difficult tiers) to support children's lexical acquisition and reading comprehension.

## Video Demonstration

<p align="center">
  <video src="./assets/generated/VideoIntro.mp4" controls="controls" width="100%" style="max-width: 680px; border-radius: 14px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);">
    <a href="./assets/generated/VideoIntro.mp4">Watch the LEXIARAL Video Introduction</a>
  </video>
</p>

> [!NOTE]
> A comprehensive video walkthrough demonstrating the LEXIARAL Grade 3 ARAL learning pathways, interactive story reader, auditory feedback, and animated mascot companion.

## Key Features

- **Dual Learning Pathways (LEARN & PLAY)**: Study all 20 Grade 3 ARAL vocabulary flashcards upfront, then reinforce mastery through progressive digital game levels.
- **Level 1 (Easy)**: Word identification, picture-word association, phonics drills, and an interactive 2-column tap-to-match widget.
- **Level 2 (Average)**: Sentence completion, contextual fill-in-the-blanks, and sentence scramble drills.
- **Level 3 (Difficult)**: Interactive 20-story reader with 100 comprehension questions and tappable vocabulary definitions.
- **Auditory Support**: Text-to-Speech (TTS) pronunciation on demand with quick header mute/unmute toggle.
- **Researcher & Teacher Tools**: Configurable mastery passing thresholds (0% Demo, 75% DepEd Standard, 80% Thesis Benchmark), progress tracking, and score logs.

---

## Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or newer recommended)
- **npm** (bundled with Node.js)
- **Expo Go** app (optional, for physical iOS or Android device testing)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/heliokii/lexiaral-demo.git
cd lexiaral-demo
npm install
```

### 3. Generate Assets

The app uses custom vector illustrations. Run the following command to ensure all vector art assets are compiled:

```bash
node scripts/create-assets.cjs
```

### 4. Running the App

Start the Expo development server:

```bash
npm start
```

- **On Web**: Press `w` in the terminal to open the app in your browser, or run `npm run web`.
- **On Mobile**: Scan the QR code appearing in the terminal using the **Expo Go** app (Android) or the Camera app (iOS).

---

## Tech Stack

- **Framework**: Expo (SDK 53) / React Native
- **Navigation**: React Navigation (Native Stack)
- **State Management**: React Context & Reducer engine with AsyncStorage persistence
- **Audio & Speech**: `expo-speech` (TTS pronunciation)
- **Vector Graphics**: `react-native-svg`
- **Typography**: `@expo-google-fonts/nunito`

## Project Structure

- `App.jsx`: Main application container, navigation stack, and responsive frame.
- `src/`: Core application logic.
  - `components/`: UI design system (`ui.jsx`) and activity components (`learning.jsx`).
  - `screens/`: Dashboard screens (`DashboardScreens.jsx`), levels (`LevelsScreen.jsx`), and learning flows (`LearningScreens.jsx`).
  - `state/`: Learning state provider (`LearningProvider.jsx`) and reducer engine (`engine.js`).
  - `audio.js`: Audio handling and TTS logic.
  - `content.js`: ARAL curriculum data model and question generation logic.
  - `Art.jsx`: Vector illustrations and SVG icon system.
- `assets/`: App icons, splash screens, and official curriculum dataset (`content.json`).
- `scripts/`: Build and asset generation automation scripts.

## Contributing

Feel free to open issues or submit pull requests to improve the learning experience for Grade 3 learners.
