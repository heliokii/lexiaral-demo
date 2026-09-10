import { Alert } from 'react-native';
import * as Speech from 'expo-speech';

let muted = false;
let requestNumber = 0;

// Audio preference is restored by LearningProvider.
export function configureAudio(enabled) {
  muted = !enabled;

  if (muted) {
    requestNumber += 1;
    Speech.stop().catch(() => {});
  }
}

export function stopAudio() {
  requestNumber += 1;
  Speech.stop().catch(() => {});
}

// Cancel previous speech so repeated taps do not create an audio queue.
export async function speak(text, language = 'en-US', reportErrors = false) {
  if (muted) return;

  const currentRequest = ++requestNumber;

  const report = () => {
    if (reportErrors) {
      Alert.alert(
        'Audio is not available',
        'Ask an adult to install an English voice in this device’s speech settings. You can keep learning using the words on the screen.'
      );
    }
  };

  try {
    await Speech.stop();

    if (muted || currentRequest !== requestNumber) return;

    Speech.speak(text, {
      language,
      rate: 0.82,
      pitch: 1.0,
      onError: report,
    });
  } catch {
    report();
  }
}

export function pronounce(word) {
  // Example: tts://en-US/seed
  const match = /^tts:\/\/([^/]+)\/(.+)$/.exec(word.audio_url);

  if (!match) {
    Alert.alert('Audio unavailable', 'This word has no supported audio source.');
    return;
  }

  speak(decodeURIComponent(match[2]), match[1], true);
}