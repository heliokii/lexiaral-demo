# 📚 LEXIARAL

LEXIARAL is an interactive vocabulary learning application designed for children (specifically targeting Grade 3 ARAL standards). It combines visual aids, audio pronunciation, and a structured learning path to help students grow their language skills.

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- **Expo Go** app (installed on your iOS or Android device for testing)

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/heliokii/lexiaral-demo.git
cd lexiaral
npm install
```

### 3. Generate Assets
The app uses custom vector illustrations generated from scripts. Run the following command to ensure all assets are present:

```bash
node scripts/create-assets.cjs
```

### 4. Running the App
Start the Expo development server:

```bash
npm start
```

- **On Mobile**: Scan the QR code appearing in the terminal using the **Expo Go** app.
- **On Web**: Press `w` in the terminal to open the app in your browser.

---

## 🛠 Tech Stack
- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **State Management**: Context API / Reducer pattern
- **Audio**: `expo-speech` (Text-to-Speech)
- **Styling**: `StyleSheet` (Custom design system for kids)

## 📁 Project Structure
- `App.js`: Main entry point and navigation configuration.
- `src/`: Core application logic.
  - `components/`: Reusable UI elements and learning widgets.
  - `screens/`: Application views (Dashboard, Activity, Results).
  - `state/`: State management and the learning engine.
  - `audio.js`: Audio handling and TTS logic.
  - `content.js`: Content configuration and question generators.
- `assets/`: Static assets and generated SVGs.
- `scripts/`: Automation scripts for asset creation.

## 🤝 Contributing
Feel free to open issues or submit pull requests to improve the learning experience!
