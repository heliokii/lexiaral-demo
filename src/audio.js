import { Alert, AppState, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { preloadAllWordImages } from './assets/wordImages';

const isWeb = Platform.OS === 'web';

let muted = false;
let currentTicket = 0;
let activeUtterance = null;
let cachedFemaleVoice = null;
let audioCtx = null;

// Native player instances and session configuration
let nativeBgmPlayer = null;
const nativeSfxPlayers = {};
let nativeAudioConfigured = false;

async function ensureNativeAudioMode() {
  if (isWeb || nativeAudioConfigured) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
    nativeAudioConfigured = true;
  } catch (e) {
    console.warn('[Audio] Failed to configure native audio mode:', e);
  }
}

function getNativeSfxPlayer(type) {
  if (isWeb) return null;
  if (!nativeSfxPlayers[type]) {
    const source = SFX_PATHS[type];
    if (!source) return null;
    try {
      nativeSfxPlayers[type] = createAudioPlayer(source);
    } catch (e) {
      console.warn('[Audio] Failed to create native SFX player for', type, e);
      return null;
    }
  }
  return nativeSfxPlayers[type];
}

function getNativeBgmPlayer() {
  if (isWeb) return null;
  if (!nativeBgmPlayer) {
    try {
      nativeBgmPlayer = createAudioPlayer(SFX_PATHS.bgm);
      nativeBgmPlayer.loop = true;
      nativeBgmPlayer.volume = bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME;
    } catch (e) {
      console.warn('[Audio] Failed to create native BGM player:', e);
      return null;
    }
  }
  return nativeBgmPlayer;
}

// Initialize or resume browser-native Web Audio context for zero-latency procedural SFX
function getAudioContext() {
  if (!isWeb || typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

const SFX_PATHS = {
  correct: require('../assets/answer-correct.mp3'),
  wrong: require('../assets/answer-wrong.mp3'),
  yehey: require('../assets/yehey-kids.mp3'),
  bgm: require('../assets/bgm-cheerful.mp3'),
  cardFlip: require('../assets/card-flip.mp3'),
  cardSwipe: require('../assets/card-swipe.mp3'),
  cardShuffle: require('../assets/card-shuffle.mp3'),
};

const resolvedPaths = {};

async function getResolvedPath(type) {
  if (resolvedPaths[type]) return resolvedPaths[type];

  const assetModule = SFX_PATHS[type];
  if (!assetModule) return null;

  try {
    const asset = Asset.fromModule(assetModule);
    if (asset.localUri) {
      resolvedPaths[type] = asset.localUri;
      return asset.localUri;
    }
    // Timeout of 1.5 seconds so asset downloads over Metro never block
    await Promise.race([
      asset.downloadAsync(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
    ]);
    resolvedPaths[type] = asset.localUri || asset.uri || null;
    return resolvedPaths[type];
  } catch (e) {
    try {
      const asset = Asset.fromModule(assetModule);
      resolvedPaths[type] = asset.localUri || asset.uri || null;
      return resolvedPaths[type];
    } catch {
      return null;
    }
  }
}

// Reusable audio helper with instant fallback
function playAudioClip(type, volume = 1.0, fallbackSynth) {
  if (muted) return null;

  if (isWeb) {
    const path = resolvedPaths[type] || SFX_PATHS[type];
    if (!path) {
      if (fallbackSynth) fallbackSynth();
      return null;
    }

    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(path);
        audio.volume = Math.max(0, Math.min(1, volume));
        const playPromise = audio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {
            if (fallbackSynth) fallbackSynth();
          });
        }
        return audio;
      } catch {
        if (fallbackSynth) fallbackSynth();
      }
    } else if (fallbackSynth) {
      fallbackSynth();
    }
    return null;
  }

  // Native Android and iOS (Expo Go / Standalone APK)
  try {
    const player = getNativeSfxPlayer(type);
    if (player) {
      player.volume = Math.max(0, Math.min(1, volume));
      player.seekTo(0).catch(() => {});
      player.play();
      return player;
    }
  } catch (e) {
    console.warn('[Audio] Native SFX error playing', type, e);
  }
  return null;
}

// Procedural harmonic bell chime fallback
function playSuccessSynthFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 1046.5, time: 0, duration: 0.38, gain: 0.55, type: 'triangle' },
      { freq: 1318.51, time: 0, duration: 0.38, gain: 0.45, type: 'sine' },
      { freq: 1567.98, time: 0.075, duration: 0.45, gain: 0.65, type: 'triangle' },
      { freq: 2093.0, time: 0.075, duration: 0.48, gain: 0.4, type: 'sine' },
    ];

    notes.forEach(({ freq, time, duration, gain: peakGain, type }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(peakGain, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + duration + 0.02);
    });
  } catch {}
}

// Procedural game-show double buzzer fallback
function playErrorSynthFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const pulses = [
      { time: 0, duration: 0.12, freq: 145 },
      { time: 0.15, duration: 0.16, freq: 130 },
    ];

    pulses.forEach(({ time, duration, freq }) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(460, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(0.55, now + time + 0.015);
      gain.gain.setValueAtTime(0.55, now + time + duration - 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.01);
    });
  } catch {}
}

// Procedural victory fanfare fallback
function playVictorySynthFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.14, gain: 0.45 },
      { freq: 659.25, time: 0.1, duration: 0.14, gain: 0.5 },
      { freq: 783.99, time: 0.2, duration: 0.16, gain: 0.55 },
      { freq: 1046.5, time: 0.32, duration: 0.55, gain: 0.65 },
      { freq: 1318.51, time: 0.32, duration: 0.55, gain: 0.45 },
      { freq: 1567.98, time: 0.36, duration: 0.52, gain: 0.4 },
    ];

    notes.forEach(({ freq, time, duration, gain: peakGain }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(peakGain, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + duration + 0.02);
    });
  } catch {}
}

// User-provided MP3 correct answer SFX (answer-correct.mp3)
export function playSuccessSfx() {
  playAudioClip('correct', 1.0, playSuccessSynthFallback);
}

// User-provided MP3 incorrect answer SFX (answer-wrong.mp3)
export function playErrorSfx() {
  playAudioClip('wrong', 1.0, playErrorSynthFallback);
}

// User-provided MP3 completion fanfare (yehey-kids.mp3)
export function playVictoryFanfare(onFinish) {
  duckBgm(true);
  const audio = playAudioClip('yehey', 1.0, playVictorySynthFallback);
  if (audio) {
    let called = false;
    const done = () => {
      if (!called) {
        called = true;
        duckBgm(false);
        if (onFinish) onFinish();
      }
    };

    if (isWeb) {
      audio.onended = done;
      audio.onerror = done;
    } else if (typeof audio.addListener === 'function') {
      const sub = audio.addListener('playbackStatusUpdate', (status) => {
        if (status && status.didJustFinish) {
          if (sub && typeof sub.remove === 'function') sub.remove();
          done();
        }
      });
    }
    // Fallback timer matches the 4.23s duration of yehey-kids.mp3
    setTimeout(done, 4350);
  } else if (onFinish) {
    duckBgm(false);
    setTimeout(onFinish, 1100);
  }
}

// Interactive button click SFX (uses pleasant tactile sound)
export function playTapSfx() {
  if (muted) return;
  if (isWeb) {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (bgmActive && audio && audio.paused) {
      audio.play().catch(() => {});
    }
    playMatchSfx();
  } else {
    if (bgmActive && nativeBgmPlayer && !nativeBgmPlayer.playing) {
      nativeBgmPlayer.play();
    }
    playAudioClip('cardFlip', 0.45);
  }
}

// Procedural paper card-flip fallback
function playCardFlipSynthFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

// Procedural card swipe/sliding paper fallback
function playCardSwipeSynthFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

// User-provided MP3 card flip SFX (card-flip.mp3)
export function playCardFlipSfx() {
  playAudioClip('cardFlip', 0.9, playCardFlipSynthFallback);
}

// User-provided MP3 card swipe/pagination SFX (card-swipe.mp3)
export function playCardSwipeSfx() {
  playAudioClip('cardSwipe', 0.9, playCardSwipeSynthFallback);
}

// User-provided MP3 card shuffle SFX (card-shuffle.mp3)
export function playCardShuffleSfx() {
  playAudioClip('cardShuffle', 0.9, playCardSwipeSynthFallback);
}

// Short, light chime for pair matches in vocabulary activities
export function playMatchSfx() {
  if (muted) return;
  if (isWeb) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [
        { freq: 659.25, time: 0, duration: 0.14, gain: 0.4 },
        { freq: 880.0, time: 0.06, duration: 0.22, gain: 0.5 },
      ];

      notes.forEach(({ freq, time, duration, gain: peakGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(peakGain, now + time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + duration + 0.02);
      });
    } catch {}
  } else {
    playAudioClip('correct', 0.5);
  }
}

// Strict Global BGM Singleton & Cleanup Architecture
// Ensures that NO duplicate audio streams ever run simultaneously across Fast Refresh or screen transitions
const BGM_DEFAULT_VOLUME = 0.14; // General screens (Welcome, Home, Results, Badges, Progress, About) - energetic and lively (14%)
const BGM_FOCUS_VOLUME = 0.035;  // Focus activities (Levels, Activity, Review) - balanced & subtle focus bed (3.5%)
const BGM_DUCK_VOLUME = 0.005;   // During speech narration - smooth ducking (0.5%)

let bgmActive = false;
let bgmFocusMode = false;

// Explicitly clean up any previous/orphaned audio instances currently attached to window or DOM
if (isWeb && typeof window !== 'undefined') {
  if (window.__LEXIARAL_BGM_SINGLETON__) {
    try {
      window.__LEXIARAL_BGM_SINGLETON__.pause();
      window.__LEXIARAL_BGM_SINGLETON__.src = '';
      window.__LEXIARAL_BGM_SINGLETON__.load();
    } catch {}
    window.__LEXIARAL_BGM_SINGLETON__ = null;
  }
}

function getBgmAudio() {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;

  if (!window.__LEXIARAL_BGM_SINGLETON__) {
    try {
      const path = resolvedPaths.bgm || SFX_PATHS.bgm;
      const audio = new Audio(path);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME;

      // Pre-load the file to avoid delay on play()
      audio.load();

      window.__LEXIARAL_BGM_SINGLETON__ = audio;
      console.log('[Audio] BGM singleton created and loading:', path);
    } catch (e) {
      console.error('[Audio] Failed to create BGM Audio object:', e);
      return null;
    }
  }

  return window.__LEXIARAL_BGM_SINGLETON__;
}

let interactionUnlocked = false;

// Universal audio & speech synthesis unlocker for mobile devices (iOS Safari, Android Chrome)
export function unlockAudioAndSpeech() {
  if (typeof window === 'undefined') return;

  // 1. Resume Web Audio Context
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  } else if (!audioCtx) {
    getAudioContext();
  }

  // 2. Prime and wake up Speech Synthesis on mobile browsers
  if (window.speechSynthesis) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (!interactionUnlocked) {
        const prime = new SpeechSynthesisUtterance('');
        prime.volume = 0.01;
        prime.rate = 1.0;
        window.speechSynthesis.speak(prime);
      }
    } catch {}
  }

  // 3. Resume background music if active
  if (bgmActive && !muted) {
    const audio = getBgmAudio();
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  }

  interactionUnlocked = true;
}

function attachInteractionUnlock() {
  unlockAudioAndSpeech();
}

// Pause BGM when tab is inactive, resume single instance when returning (Web)
if (isWeb && typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('visibilitychange', () => {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (document.hidden) {
      if (audio && !audio.paused) {
        audio.pause();
      }
    } else if (bgmActive && !muted) {
      if (audio && audio.paused) {
        audio.play().catch(() => {});
      }
    }
  });
}

// Pause BGM when app moves to background, resume when active (Native)
if (!isWeb) {
  AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      if (bgmActive && !muted) {
        resumeBgm();
      }
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      pauseBgm();
    }
  });
}

export function isBgmActive() {
  return bgmActive;
}

export function setBgmFocusMode(enabled = true) {
  bgmFocusMode = Boolean(enabled);
  const targetVol = activeUtterance
    ? BGM_DUCK_VOLUME
    : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);

  if (isWeb) {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (audio) {
      try {
        audio.volume = targetVol;
      } catch {}
    }
  } else if (nativeBgmPlayer) {
    try {
      nativeBgmPlayer.volume = targetVol;
    } catch {}
  }
}

export function startBgm() {
  bgmActive = true;
  if (muted) return;

  if (isWeb) {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    console.log('[Audio] startBgm() called. Active:', bgmActive, 'Muted:', muted);

    const audio = getBgmAudio();
    if (audio) {
      audio.volume = activeUtterance
        ? BGM_DUCK_VOLUME
        : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);

      if (!audio.paused) {
        console.log('[Audio] BGM already playing');
        return;
      }

      console.log('[Audio] Attempting to play BGM...');
      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise
          .then(() => console.log('[Audio] BGM started immediately'))
          .catch((err) => {
            console.warn('[Audio] Autoplay blocked, attaching interaction unlock. Error:', err.message);
            attachInteractionUnlock();
          });
      }
    }
  } else {
    // Native Android / iOS
    const player = getNativeBgmPlayer();
    if (player) {
      player.volume = activeUtterance
        ? BGM_DUCK_VOLUME
        : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);
      if (!player.playing) {
        player.play();
        console.log('[Audio] Native BGM started');
      }
    }
  }
}

export function stopBgm() {
  bgmActive = false;
  if (isWeb) {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    }
  } else if (nativeBgmPlayer) {
    try {
      nativeBgmPlayer.pause();
      nativeBgmPlayer.seekTo(0).catch(() => {});
    } catch {}
  }
}

export function pauseBgm() {
  if (isWeb) {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (audio && !audio.paused) {
      try {
        audio.pause();
      } catch {}
    }
  } else if (nativeBgmPlayer && nativeBgmPlayer.playing) {
    try {
      nativeBgmPlayer.pause();
    } catch {}
  }
}

export function resumeBgm() {
  if (muted || !bgmActive) return;

  if (isWeb) {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    const audio = getBgmAudio();
    if (audio) {
      audio.volume = activeUtterance
        ? BGM_DUCK_VOLUME
        : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);

      if (!audio.paused) return;

      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          attachInteractionUnlock();
        });
      }
    }
  } else {
    // Native Android / iOS
    const player = getNativeBgmPlayer();
    if (player) {
      player.volume = activeUtterance
        ? BGM_DUCK_VOLUME
        : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);
      if (!player.playing) {
        player.play();
      }
    }
  }
}

export function duckBgm(duck = true) {
  const targetVol = duck
    ? BGM_DUCK_VOLUME
    : (bgmFocusMode ? BGM_FOCUS_VOLUME : BGM_DEFAULT_VOLUME);

  if (isWeb) {
    const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
    if (audio) {
      try {
        audio.volume = targetVol;
      } catch {}
    }
  } else if (nativeBgmPlayer) {
    try {
      nativeBgmPlayer.volume = targetVol;
    } catch {}
  }
}

// Audio preference restored by LearningProvider
export function configureAudio(enabled) {
  muted = !enabled;
  if (muted) {
    stopAudio();
    if (isWeb) {
      const audio = typeof window !== 'undefined' ? window.__LEXIARAL_BGM_SINGLETON__ : null;
      if (audio && !audio.paused) {
        audio.pause();
      }
    } else if (nativeBgmPlayer && nativeBgmPlayer.playing) {
      nativeBgmPlayer.pause();
    }
  } else {
    startBgm();
  }
}

// Immediately halts any currently playing audio
export function stopAudio() {
  currentTicket += 1;
  activeUtterance = null;
  duckBgm(false);

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      // Ensure Chrome speech queue does not stay frozen
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }

  Speech.stop().catch(() => {});
}

// Known friendly female voices suitable for early grade instruction
const PREFERRED_FEMALE_VOICES = [
  'microsoft zira',
  'zira',
  'google us english',
  'microsoft jenny',
  'microsoft aria',
  'microsoft ana',
  'microsoft michelle',
  'jenny',
  'aria',
  'samantha',
  'victoria',
  'karen',
  'susan',
  'hazel',
  'catherine',
  'linda',
  'eva',
];

const DISQUALIFIED_MALE_VOICES = [
  'david',
  'mark',
  'george',
  'guy',
  'christopher',
  'eric',
  'steffan',
  'richard',
  'james',
  'john',
  'daniel',
  'oliver',
  'male',
  'man',
  'boy',
];

function isDisqualifiedMaleVoice(name) {
  const lower = (name || '').toLowerCase();
  return DISQUALIFIED_MALE_VOICES.some((m) => lower.includes(m));
}

// Resolves a high-quality, friendly voice for young learners (prioritizing Philippine English)
function getBestFemaleVoice(targetLang = 'en-PH') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedFemaleVoice) return cachedFemaleVoice;

  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    // 1. Search for Philippine English voice (Android Google Speech, Samsung TTS, or Windows en-PH)
    const phVoice = voices.find((v) => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      const n = (v.name || '').toLowerCase();
      const isPH = l === 'en-ph' || l.startsWith('en-ph') || n.includes('philippines') || n.includes('(ph)');
      return isPH && !isDisqualifiedMaleVoice(n);
    }) || voices.find((v) => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      return l === 'en-ph' || l.startsWith('en-ph');
    });

    if (phVoice) {
      cachedFemaleVoice = phVoice;
      return cachedFemaleVoice;
    }

    // 2. Filter English voices
    const englishVoices = voices.filter(
      (v) => v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.includes('US'))
    );

    const candidates = englishVoices.length > 0 ? englishVoices : voices;

    // 3. Search for prioritized known friendly female voices (excluding any male indicators)
    for (const pref of PREFERRED_FEMALE_VOICES) {
      const match = candidates.find((v) => {
        const n = (v.name || '').toLowerCase();
        return n.includes(pref) && !isDisqualifiedMaleVoice(n);
      });
      if (match) {
        cachedFemaleVoice = match;
        return cachedFemaleVoice;
      }
    }

    // 4. Search for explicit female or woman label
    const explicitFemale = candidates.find((v) => {
      const n = (v.name || '').toLowerCase();
      return (n.includes('female') || n.includes('woman')) && !isDisqualifiedMaleVoice(n);
    });
    if (explicitFemale) {
      cachedFemaleVoice = explicitFemale;
      return cachedFemaleVoice;
    }

    // 5. Fallback: select any candidate that is definitely not a male voice
    const nonMale = candidates.find((v) => !isDisqualifiedMaleVoice(v.name));
    if (nonMale) {
      cachedFemaleVoice = nonMale;
      return cachedFemaleVoice;
    }

    cachedFemaleVoice = candidates[0] || null;
    return cachedFemaleVoice;
  } catch {
    return null;
  }
}

// Refresh cache when voices load asynchronously in browser
if (isWeb && typeof window !== 'undefined' && window.speechSynthesis) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedFemaleVoice = null;
      getBestFemaleVoice();
    };
  } catch {}
}

// Speak text using friendly teacher voice and calm, clear instructional pace
export async function speak(text, language = 'en-PH', reportErrors = false) {
  if (muted || !text || typeof text !== 'string') return;

  const cleanText = text.trim();
  if (!cleanText) return;

  // Unpause / unlock mobile audio session
  unlockAudioAndSpeech();

  // 1. Stop any previous speech
  stopAudio();

  // 2. Issue a new ticket for this request
  const ticket = ++currentTicket;

  const report = () => {
    if (reportErrors) {
      Alert.alert(
        'Audio is not available',
        'Ask an adult to install an English voice in this device speech settings. You can keep learning using the words on the screen.'
      );
    }
  };

  try {
    // Web Speech API execution (Chrome, Edge, Safari, Firefox - Desktop & Mobile)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (muted || ticket !== currentTicket) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const femaleVoice = getBestFemaleVoice(language);

      // Target Philippine English (en-PH) or the resolved voice's language
      utterance.lang = femaleVoice ? femaleVoice.lang : (language || 'en-PH');
      utterance.rate = 0.78; // Calm, clear, instructional teacher pace for Grade 3 pupils (resolves "mabilis masyado")
      utterance.pitch = 1.06; // Warm, natural, friendly tone (no chipmunk squeak)

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        duckBgm(true);
      };

      utterance.onend = () => {
        duckBgm(false);
        if (activeUtterance === utterance) {
          activeUtterance = null;
        }
        if (window._activeSpeechUtterance === utterance) {
          window._activeSpeechUtterance = null;
        }
      };

      utterance.onerror = (e) => {
        duckBgm(false);
        if (activeUtterance === utterance) {
          activeUtterance = null;
        }
        if (window._activeSpeechUtterance === utterance) {
          window._activeSpeechUtterance = null;
        }
        if (e && e.error !== 'canceled' && e.error !== 'interrupted') {
          report();
        }
      };

      activeUtterance = utterance;
      // Keep alive in global window reference to prevent Android Chrome GC bug from cutting speech
      window._activeSpeechUtterance = utterance;

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
      return;
    }

    // Native mobile platforms (iOS / Android) via expo-speech (e.g. USB hot reload in Expo Go)
    let voiceIdentifier = null;
    try {
      const available = await Speech.getAvailableVoicesAsync();
      // 1. Search for Philippine English voice in native device TTS
      const phVoice = (available || []).find((v) => {
        const l = (v.language || '').toLowerCase().replace('_', '-');
        const n = (v.name || '').toLowerCase();
        return (l === 'en-ph' || l.startsWith('en-ph') || n.includes('philippines')) && !isDisqualifiedMaleVoice(n);
      });

      if (phVoice) {
        voiceIdentifier = phVoice.identifier;
      } else {
        const eng = (available || []).filter(
          (v) => v.language && (v.language.startsWith('en') || v.language.includes('US'))
        );
        const female = eng.find((v) => {
          const n = (v.name || '').toLowerCase();
          return (
            n.includes('samantha') ||
            n.includes('zira') ||
            n.includes('jenny') ||
            n.includes('aria') ||
            n.includes('female')
          );
        });
        if (female) voiceIdentifier = female.identifier;
      }
    } catch {}

    if (muted || ticket !== currentTicket) return;

    activeUtterance = true;
    duckBgm(true);

    const onFinishSpeech = () => {
      activeUtterance = null;
      duckBgm(false);
    };

    Speech.speak(cleanText, {
      language: voiceIdentifier ? undefined : (language || 'en-PH'),
      rate: 0.78,
      pitch: 1.06,
      voice: voiceIdentifier,
      onStart: () => {
        duckBgm(true);
      },
      onDone: onFinishSpeech,
      onStopped: onFinishSpeech,
      onError: (err) => {
        onFinishSpeech();
        report();
      },
    });
  } catch {
    report();
  }
}

export function pronounce(word) {
  if (!word) return;

  if (typeof word === 'string') {
    speak(word, 'en-PH', true);
    return;
  }

  // If word has audio_url format: tts://en-US/cat or tts://en-PH/cat
  if (word.audio_url) {
    const match = /^tts:\/\/([^/]+)\/(.+)$/.exec(word.audio_url);
    if (match) {
      speak(decodeURIComponent(match[2]), match[1] || 'en-PH', true);
      return;
    }
  }

  // Fallback to word text directly
  if (word.word) {
    speak(word.word, 'en-PH', true);
    return;
  }

  Alert.alert('Audio unavailable', 'This word has no supported audio source.');
}

export async function initAudio() {
  console.log('[Audio] Initializing and pre-resolving assets in background...');
  await ensureNativeAudioMode();

  try {
    preloadAllWordImages();
  } catch {}

  try {
    const types = Object.keys(SFX_PATHS);
    await Promise.all(types.map(type => getResolvedPath(type)));
    console.log('[Audio] All assets pre-resolved:', resolvedPaths);
  } catch (e) {
    console.warn('[Audio] Non-fatal asset pre-resolution issue:', e);
  }
}

// Global "First-Interaction" Audio, TTS, and BGM Trigger
// Browsers strictly require user activation to unlock AudioContext, TTS, and Audio elements
if (isWeb && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  const onFirstInteraction = () => {
    console.log('[Audio] Global interaction trigger: unlocking audio, speech, and BGM');
    unlockAudioAndSpeech();
    startBgm();
    ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
      if (typeof window.removeEventListener === 'function') {
        window.removeEventListener(evt, onFirstInteraction, true);
      }
    });
  };
  ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
    window.addEventListener(evt, onFirstInteraction, { capture: true, once: true });
  });
}