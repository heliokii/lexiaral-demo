// Direct, production-safe Metro require mappings for all 50 official ARAL vocabulary words
// Ensures images are bundled with content hashes by Metro and work across Web, Netlify, Vercel, and Native Expo
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

export const WORD_IMAGES = {
  // Level 1 - Easy (20 Words)
  cat: require('../../assets/Easy/E1. CAT.jpg'),
  mat: require('../../assets/Easy/E2. MAT.jpg'),
  hat: require('../../assets/Easy/E3. HAT.jpg'),
  rat: require('../../assets/Easy/E4. RAT.jpg'),
  bat: require('../../assets/Easy/E5. BAT.jpg'),
  pen: require('../../assets/Easy/E6. PEN.jpg'),
  sun: require('../../assets/Easy/E7. SUN.jpg'),
  sit: require('../../assets/Easy/E8. SIT.jpg'),
  ran: require('../../assets/Easy/E9. RUN.jpg'),
  run: require('../../assets/Easy/E9. RUN.jpg'),
  sad: require('../../assets/Easy/E10. SAD.jpg'),
  bag: require('../../assets/Easy/E11. BAG.jpg'),
  map: require('../../assets/Easy/E12. MAP.jpg'),
  man: require('../../assets/Easy/E13. MAN.jpg'),
  dog: require('../../assets/Easy/E14. DOG.jpg'),
  cow: require('../../assets/Easy/E15. COW.jpg'),
  dig: require('../../assets/Easy/E16. DIG.jpg'),
  egg: require('../../assets/Easy/E17. EGG.jpg'),
  red: require('../../assets/Easy/E18. RED.jpg'),
  hen: require('../../assets/Easy/E19. HEN.jpg'),
  pig: require('../../assets/Easy/E20. PIG.jpg'),

  // Level 2 - Average (15 Words)
  basket: require('../../assets/Average/A1-basket.jpg'),
  moon: require('../../assets/Average/A2-Moon.jpg'),
  ball: require('../../assets/Average/A3-ball.jpg'),
  book: require('../../assets/Average/A4-book.jpg'),
  bark: require('../../assets/Average/A5-bark.jpg'),
  nest: require('../../assets/Average/A6-  nest.jpg'),
  test: require('../../assets/Average/A7-test.jpg'),
  tell: require('../../assets/Average/A8-tell.jpg'),
  pencil: require('../../assets/Average/A9-pencil.jpg'),
  candle: require('../../assets/Average/A10-candle.jpg'),
  nine: require('../../assets/Average/A11-nine.jpg'),
  bath: require('../../assets/Average/A12- bath.jpg'),
  nuts: require('../../assets/Average/A13-Nuts.jpg'),
  road: require('../../assets/Average/A14-road.jpg'),
  stop: require('../../assets/Average/A15- Stop.jpg'),

  // Level 3 - Difficult (15 Words)
  happy: require('../../assets/Difficult/D-1- Happy.jpg'),
  little: require('../../assets/Difficult/D-2 - Little.jpg'),
  floor: require('../../assets/Difficult/D-3 - Floor.jpg'),
  card: require('../../assets/Difficult/D-4 - Card.jpg'),
  switch: require('../../assets/Difficult/D-5 - Switch.jpg'),
  bell: require('../../assets/Difficult/D-6 - Bell.jpg'),
  rain: require('../../assets/Difficult/D-7 - Rain.jpg'),
  rock: require('../../assets/Difficult/D-8 - Rock.jpg'),
  round: require('../../assets/Difficult/D-9 - Round.jpg'),
  plant: require('../../assets/Difficult/D-10 - Plant.jpg'),
  green: require('../../assets/Difficult/D-11 - Green.jpg'),
  black: require('../../assets/Difficult/D-12 - Black.jpg'),
  house: require('../../assets/Difficult/D-13 - House.jpg'),
  chair: require('../../assets/Difficult/D-14 - Chair.jpg'),
  clock: require('../../assets/Difficult/D-15 - Clock.jpg'),
};

export function getWordImage(wordId) {
  if (!wordId) return null;
  const key = String(wordId).toLowerCase().trim();
  return WORD_IMAGES[key] || null;
}

let preloaded = false;

export function preloadAllWordImages() {
  if (preloaded) return;
  preloaded = true;

  try {
    const modules = Object.values(WORD_IMAGES);
    if (Platform.OS === 'web') {
      modules.forEach((mod) => {
        let uri = null;
        if (typeof mod === 'string') {
          uri = mod;
        } else if (mod?.uri) {
          uri = mod.uri;
        } else if (mod?.default) {
          uri = typeof mod.default === 'string' ? mod.default : mod.default.uri;
        }

        if (typeof window !== 'undefined' && uri) {
          const img = new window.Image();
          img.src = uri;
          if (img.decode) {
            img.decode().catch(() => {});
          }
        }
      });
    } else {
      // Native Android and iOS: pre-cache all vocabulary images in background
      Asset.loadAsync(modules).catch(() => {});
    }
  } catch {}
}
