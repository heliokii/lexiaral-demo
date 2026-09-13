const fs = require('fs');
const path = require('path');
const content = require('../assets/content.json');

// Helper to create backdrop types:
// 1. "indoor" (room wall, floor, door/window with sunlit hills)
// 2. "outdoor_day" (sky, clouds, sun, rolling green hills, path)
// 3. "outdoor_garden" (sky, garden fence, flowers, bushes)
// 4. "classroom" (classroom wall, chalkboard/bookshelf, desk/rug)
// 5. "evening" (warm interior or twilight outdoor with moon/lamp)

function baseIndoor(sceneProps) {
  return `
  <!-- Interior Room Backdrop -->
  <rect width="400" height="135" fill="url(#wallGrad)"/>
  <rect y="135" width="400" height="65" fill="url(#floorGrad)"/>
  <line x1="0" y1="135" x2="400" y2="135" stroke="#E2D4BF" stroke-width="2"/>
  <line x1="75" y1="135" x2="60" y2="200" stroke="#ECE0CB" stroke-width="1.5"/>
  <line x1="175" y1="135" x2="160" y2="200" stroke="#ECE0CB" stroke-width="1.5"/>
  <line x1="285" y1="135" x2="275" y2="200" stroke="#ECE0CB" stroke-width="1.5"/>
  
  <!-- Window or Doorway View to outside landscape -->
  <g transform="translate(265, 18)">
    <rect width="105" height="85" rx="14" fill="#E1EEFF" stroke="#C5B1E6" stroke-width="3"/>
    <circle cx="85" cy="25" r="12" fill="#FFE082"/>
    <path d="M0 65 Q45 50 105 60 V85 H0 Z" fill="#D2E9CE"/>
    <line x1="52" y1="0" x2="52" y2="85" stroke="#FFFFFF" stroke-width="2"/>
    <line x1="0" y1="42" x2="105" y2="42" stroke="#FFFFFF" stroke-width="2"/>
  </g>
  ${sceneProps || ''}
  `;
}

function baseOutdoor(sceneProps) {
  return `
  <!-- Sunny Outdoor Landscape -->
  <rect width="400" height="130" fill="url(#skyGrad)"/>
  <!-- Morning Sun -->
  <circle cx="65" cy="40" r="18" fill="#FFE082"/>
  <circle cx="65" cy="40" r="25" fill="#FFF3C4" opacity="0.4"/>
  <!-- Clouds -->
  <ellipse cx="280" cy="35" rx="22" ry="9" fill="#FFFFFF" opacity="0.85"/>
  <ellipse cx="295" cy="32" rx="15" ry="10" fill="#FFFFFF" opacity="0.85"/>
  <ellipse cx="140" cy="48" rx="18" ry="7" fill="#FFFFFF" opacity="0.75"/>
  <!-- Rolling Hills -->
  <path d="M0 120 Q120 88 230 115 Q330 92 400 115 V200 H0 Z" fill="#D8CFF0" opacity="0.85"/>
  <path d="M0 135 Q100 110 210 132 Q320 112 400 128 V200 H0 Z" fill="url(#grassGrad)"/>
  <!-- Scenic Footpath -->
  <path d="M120 200 Q200 160 250 140" stroke="#FFEAA7" stroke-width="28" stroke-linecap="round" opacity="0.85"/>
  ${sceneProps || ''}
  `;
}

function baseClassroom(sceneProps) {
  return `
  <!-- Classroom Backdrop -->
  <rect width="400" height="140" fill="#F8F4FF"/>
  <rect y="140" width="400" height="60" fill="#EFE8D8"/>
  <line x1="0" y1="140" x2="400" y2="140" stroke="#D8CBBA" stroke-width="2.5"/>
  <!-- Chalkboard / Bulletin Board -->
  <g transform="translate(130, 20)">
    <rect width="140" height="75" rx="8" fill="#2D5A46" stroke="#C5A880" stroke-width="4"/>
    <line x1="15" y1="20" x2="65" y2="20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <line x1="15" y1="35" x2="120" y2="35" stroke="#FFEAA7" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <line x1="15" y1="50" x2="95" y2="50" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <rect x="15" y="77" width="20" height="4" rx="1" fill="#FFFFFF"/>
  </g>
  <!-- Bookshelf on left -->
  <g transform="translate(18, 30)">
    <rect width="55" height="110" rx="4" fill="#D2B48C" stroke="#A88B64" stroke-width="2.5"/>
    <line x1="0" y1="38" x2="55" y2="38" stroke="#A88B64" stroke-width="2"/>
    <line x1="0" y1="74" x2="55" y2="74" stroke="#A88B64" stroke-width="2"/>
    <!-- Books -->
    <rect x="8" y="14" width="7" height="24" rx="1" fill="#FF7675"/>
    <rect x="17" y="10" width="8" height="28" rx="1" fill="#74B9FF"/>
    <rect x="27" y="16" width="7" height="22" rx="1" fill="#55EFC4"/>
    <rect x="36" y="12" width="9" height="26" rx="1" fill="#FDCB6E"/>
    <rect x="8" y="48" width="8" height="26" rx="1" fill="#A29BFE"/>
    <rect x="18" y="52" width="7" height="22" rx="1" fill="#FAB1A0"/>
    <rect x="27" y="46" width="10" height="28" rx="1" fill="#00B894"/>
  </g>
  ${sceneProps || ''}
  `;
}

function wrapSvg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" fill="none">
  <defs>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#7B61A4" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="wallGrad" x1="200" y1="0" x2="200" y2="135" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FDF9FF"/>
      <stop offset="1" stop-color="#F1E8FC"/>
    </linearGradient>
    <linearGradient id="skyGrad" x1="200" y1="0" x2="200" y2="135" gradientUnits="userSpaceOnUse">
      <stop stop-color="#DFEAFF"/>
      <stop offset="0.6" stop-color="#F5F1FF"/>
      <stop offset="1" stop-color="#E8F4EC"/>
    </linearGradient>
    <linearGradient id="floorGrad" x1="200" y1="135" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FAF4E8"/>
      <stop offset="1" stop-color="#EFE4D2"/>
    </linearGradient>
    <linearGradient id="grassGrad" x1="200" y1="125" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D7ECD3"/>
      <stop offset="1" stop-color="#BEE0B9"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="18" fill="#FFFFFF"/>
  ${body}
</svg>`;
}

// Generate the 48 custom scenario scenarios
const scenarios = {};

// 1. The Cat (Mia, Mimi on mat, ball, bowls, sunlit doorway)
scenarios['story-1-cat'] = wrapSvg(`
  <rect width="400" height="135" fill="url(#wallGrad)"/>
  <g transform="translate(245, 20)">
    <path d="M0 115 V35 Q0 2 45 2 Q90 2 90 35 V115 Z" fill="url(#skyGrad)" stroke="#DAC8F2" stroke-width="4"/>
    <path d="M0 85 Q45 65 90 80 V115 H0 Z" fill="#D8CFF0" opacity="0.8"/>
    <path d="M0 100 Q45 80 90 95 V115 H0 Z" fill="#D2E9CE"/>
    <circle cx="67" cy="28" r="11" fill="#FFE082"/>
    <ellipse cx="23" cy="22" rx="9" ry="5" fill="#FFFFFF" opacity="0.9"/>
  </g>
  <rect y="135" width="400" height="65" fill="url(#floorGrad)"/>
  <line x1="0" y1="135" x2="400" y2="135" stroke="#E2D4BF" stroke-width="2.5"/>
  <g id="mat" filter="url(#softShadow)" transform="translate(175, 146)">
    <rect width="98" height="42" rx="8" fill="#58B2DC" stroke="#247299" stroke-width="3"/>
    <line x1="0" y1="14" x2="98" y2="14" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5 3"/>
    <line x1="0" y1="28" x2="98" y2="28" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5 3"/>
  </g>
  <g id="cat" transform="translate(195, 118)" filter="url(#softShadow)">
    <path d="M50 48 Q64 45 66 32 Q67 22 58 20" fill="none" stroke="#D3681E" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="28" cy="46" rx="26" ry="20" fill="#FFAB66" stroke="#D3681E" stroke-width="3"/>
    <ellipse cx="22" cy="47" rx="14" ry="12" fill="#FFF4EB"/>
    <polygon points="12,25 18,3 28,20" fill="#FFAB66" stroke="#D3681E" stroke-width="2"/>
    <polygon points="35,20 45,3 51,25" fill="#FFAB66" stroke="#D3681E" stroke-width="2"/>
    <ellipse cx="31" cy="28" rx="20" ry="17" fill="#FFAB66" stroke="#D3681E" stroke-width="2.5"/>
    <path d="M21 27 Q25 24 29 27" fill="none" stroke="#2D2140" stroke-width="2"/>
    <path d="M34 27 Q38 24 42 27" fill="none" stroke="#2D2140" stroke-width="2"/>
    <polygon points="31,31 29,29 33,29" fill="#FF6B8B"/>
    <path d="M27 33 Q31 36 35 33" fill="none" stroke="#2D2140" stroke-width="1.8"/>
    <ellipse cx="20" cy="62" rx="6" ry="4" fill="#FFF4EB" stroke="#D3681E" stroke-width="2"/>
    <ellipse cx="33" cy="62" rx="6" ry="4" fill="#FFF4EB" stroke="#D3681E" stroke-width="2"/>
  </g>
  <g id="ball" transform="translate(130, 160)" filter="url(#softShadow)">
    <circle cx="12" cy="12" r="11" fill="#FF5252" stroke="#C92A2A" stroke-width="2.5"/>
    <path d="M4 17 Q12 7 20 17" fill="none" stroke="#FFD43B" stroke-width="3.5"/>
  </g>
  <g id="bowls" transform="translate(20, 160)">
    <ellipse cx="14" cy="12" rx="12" ry="7" fill="#FFA94D" stroke="#D97706" stroke-width="2"/>
    <ellipse cx="38" cy="12" rx="12" ry="7" fill="#63E6BE" stroke="#0CA678" stroke-width="2"/>
    <text x="26" y="25" font-family="sans-serif" font-size="7.5" font-weight="bold" fill="#8879A8" text-anchor="middle">food &amp; water</text>
  </g>
  <g id="mia" transform="translate(68, 50)" filter="url(#softShadow)">
    <ellipse cx="26" cy="30" rx="19" ry="20" fill="#4B3322"/>
    <circle cx="7" cy="32" r="8" fill="#4B3322"/>
    <circle cx="45" cy="32" r="8" fill="#4B3322"/>
    <circle cx="26" cy="30" r="15" fill="#FDDFCE"/>
    <path d="M12 24 Q26 14 40 24 Q36 17 26 17 Q16 17 12 24 Z" fill="#4B3322"/>
    <circle cx="21" cy="29" r="2" fill="#2D2140"/>
    <circle cx="31" cy="29" r="2" fill="#2D2140"/>
    <ellipse cx="17" cy="33" rx="3" ry="1.8" fill="#FFA0B0"/>
    <ellipse cx="35" cy="33" rx="3" ry="1.8" fill="#FFA0B0"/>
    <path d="M23 33 Q26 37 29 33" fill="none" stroke="#B8324D" stroke-width="1.8"/>
    <path d="M15 45 L9 82 H43 L37 45 Z" fill="#845EC2"/>
    <line x1="20" y1="82" x2="20" y2="98" stroke="#FDDFCE" stroke-width="4"/>
    <line x1="32" y1="82" x2="32" y2="98" stroke="#FDDFCE" stroke-width="4"/>
  </g>
`);

// 2. The Mat (Tom's cat sitting on front porch mat in front of clean house)
scenarios['story-2-mat'] = wrapSvg(baseIndoor(`
  <g id="porch-mat" filter="url(#softShadow)" transform="translate(130, 138)">
    <rect width="150" height="50" rx="10" fill="#58B2DC" stroke="#247299" stroke-width="3"/>
    <line x1="0" y1="16" x2="150" y2="16" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5 3"/>
    <line x1="0" y1="34" x2="150" y2="34" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5 3"/>
    <ellipse cx="75" cy="24" rx="26" ry="16" fill="#FFAB66" stroke="#D3681E" stroke-width="2.5"/>
    <circle cx="56" cy="18" r="12" fill="#FFAB66" stroke="#D3681E" stroke-width="2"/>
    <polygon points="48,10 54,2 60,10" fill="#FFA0B0"/>
    <polygon points="58,10 64,2 70,10" fill="#FFA0B0"/>
    <path d="M52 18 Q56 21 60 18" fill="none" stroke="#2D2140" stroke-width="1.5"/>
  </g>
  <g transform="translate(30, 75)">
    <rect width="40" height="65" rx="6" fill="#FFF4DC" stroke="#E2D4BF" stroke-width="2"/>
    <circle cx="20" cy="30" r="10" fill="#FFA0B0"/>
  </g>
`));

// 3. The Hat (Ben wearing new red hat outside in the sunny park)
scenarios['story-3-hat'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 52)">
    <path d="M22 65 L14 110 H46 L38 65 Z" fill="#74B9FF"/>
    <line x1="24" y1="110" x2="24" y2="135" stroke="#FDDFCE" stroke-width="4"/>
    <line x1="36" y1="110" x2="36" y2="135" stroke="#FDDFCE" stroke-width="4"/>
    <circle cx="30" cy="50" r="16" fill="#FDDFCE"/>
    <circle cx="25" cy="50" r="2" fill="#2D2140"/>
    <circle cx="35" cy="50" r="2" fill="#2D2140"/>
    <path d="M26 56 Q30 60 34 56" fill="none" stroke="#B8324D" stroke-width="2"/>
    <ellipse cx="30" cy="40" rx="36" ry="10" fill="#E24444" stroke="#9E1B1B" stroke-width="3"/>
    <path d="M10 38 C10 12 50 12 50 38 Z" fill="#E24444" stroke="#9E1B1B" stroke-width="2.5"/>
    <path d="M10 34 C18 28 42 28 50 34 L50 38 C42 32 18 32 10 38 Z" fill="#3178C6"/>
  </g>
  <g transform="translate(325, 70)">
    <rect x="18" y="45" width="12" height="45" rx="3" fill="#A8815B"/>
    <circle cx="24" cy="35" r="30" fill="#7EBCAC"/>
    <circle cx="35" cy="25" r="20" fill="#9ED3BE"/>
  </g>
`));

// 4. The Rat (Small friendly rat near an old wooden box seeing food)
scenarios['story-4-rat'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(230, 80)">
    <rect width="90" height="70" rx="6" fill="#DFC9B0" stroke="#B89B77" stroke-width="3"/>
    <line x1="0" y1="35" x2="90" y2="35" stroke="#B89B77" stroke-width="2"/>
    <line x1="45" y1="0" x2="45" y2="70" stroke="#B89B77" stroke-width="2"/>
  </g>
  <g id="rat-character" filter="url(#softShadow)" transform="translate(130, 135)">
    <ellipse cx="40" cy="30" rx="28" ry="20" fill="#A8B2C1" stroke="#636E7B" stroke-width="2.5"/>
    <circle cx="20" cy="18" r="10" fill="#A8B2C1" stroke="#636E7B" stroke-width="2"/>
    <circle cx="20" cy="18" r="6" fill="#FFA0B0"/>
    <circle cx="28" cy="26" r="3" fill="#2D2140"/>
    <path d="M68 30 Q88 30 85 14" fill="none" stroke="#FFA0B0" stroke-width="3" stroke-linecap="round"/>
    <polygon points="6,34 16,26 16,34" fill="#FFD43B" stroke="#F59F00" stroke-width="1.5"/>
  </g>
`));

// 5. The Bat (Bat sleeping peacefully in a tall garden tree near a hill)
scenarios['story-5-bat'] = wrapSvg(`
  <rect width="400" height="135" fill="#2D204E"/>
  <rect y="135" width="400" height="65" fill="#1C1433"/>
  <circle cx="320" cy="45" r="22" fill="#FFEAA7"/>
  <circle cx="328" cy="45" r="20" fill="#2D204E"/>
  <circle cx="80" cy="35" r="1.5" fill="#FFFFFF"/>
  <circle cx="150" cy="25" r="2" fill="#FFFFFF"/>
  <circle cx="240" cy="40" r="1.5" fill="#FFFFFF"/>
  <path d="M0 120 Q120 90 230 115 Q330 95 400 118 V200 H0 Z" fill="#382C5E"/>
  <g transform="translate(130, 10)">
    <path d="M0 45 Q70 30 140 40" stroke="#7A5636" stroke-width="12" stroke-linecap="round"/>
    <circle cx="70" cy="70" r="16" fill="#5F4B8B"/>
    <polygon points="62,56 66,48 70,56" fill="#5F4B8B"/>
    <polygon points="70,56 74,48 78,56" fill="#5F4B8B"/>
    <path d="M50 70 Q30 75 40 95 Q60 85 70 70" fill="#48386E"/>
    <path d="M90 70 Q110 75 100 95 Q80 85 70 70" fill="#48386E"/>
    <circle cx="66" cy="68" r="2" fill="#FFEAA7"/>
    <circle cx="74" cy="68" r="2" fill="#FFEAA7"/>
  </g>
`);

// 6. My Pet (Ana with her friendly pet kitten at home)
scenarios['story-6-pet'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(140, 60)">
    <circle cx="30" cy="30" r="16" fill="#FDDFCE"/>
    <path d="M14 26 Q30 14 46 26 Z" fill="#6C5CE7"/>
    <circle cx="25" cy="30" r="2" fill="#2D2140"/>
    <circle cx="35" cy="30" r="2" fill="#2D2140"/>
    <path d="M26 36 Q30 40 34 36" fill="none" stroke="#B8324D" stroke-width="1.8"/>
    <path d="M18 46 L10 95 H50 L42 46 Z" fill="#FD79A8"/>
    <ellipse cx="60" cy="85" rx="16" ry="12" fill="#FFAB66" stroke="#D3681E" stroke-width="2"/>
    <circle cx="50" cy="78" r="9" fill="#FFAB66"/>
    <polygon points="45,72 48,66 52,72" fill="#FFA0B0"/>
    <polygon points="52,72 55,66 58,72" fill="#FFA0B0"/>
  </g>
`));

// 7. A Happy Day (Leo reading his new book on a park bench under sunny tree)
scenarios['story-7-happy'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(150, 95)">
    <!-- Park Bench -->
    <rect width="110" height="12" rx="3" fill="#A8815B"/>
    <line x1="20" y1="12" x2="16" y2="45" stroke="#4B3322" stroke-width="4"/>
    <line x1="90" y1="12" x2="94" y2="45" stroke="#4B3322" stroke-width="4"/>
    <!-- Boy reading -->
    <circle cx="55" cy="-18" r="14" fill="#FDDFCE"/>
    <circle cx="51" cy="-18" r="1.8" fill="#2D2140"/>
    <circle cx="59" cy="-18" r="1.8" fill="#2D2140"/>
    <path d="M52 -13 Q55 -10 58 -13" fill="none" stroke="#B8324D" stroke-width="1.5"/>
    <path d="M43 -4 L38 30 H72 L67 -4 Z" fill="#00CEC9"/>
    <!-- Open Book in hands -->
    <path d="M42 12 L55 16 L68 12 L68 25 L55 29 L42 25 Z" fill="#FFFFFF" stroke="#6C5CE7" stroke-width="2"/>
  </g>
`));

// 8. The Sun (Big warm smiling sun rising over hills with children playing)
scenarios['story-8-sun'] = wrapSvg(`
  <rect width="400" height="135" fill="url(#skyGrad)"/>
  <g transform="translate(200, 70)">
    <circle r="42" fill="#FFD43B" stroke="#F59F00" stroke-width="3"/>
    <circle cx="-14" cy="-8" r="4" fill="#2D2140"/>
    <circle cx="14" cy="-8" r="4" fill="#2D2140"/>
    <ellipse cx="-22" cy="2" rx="5" ry="3" fill="#FFA0B0"/>
    <ellipse cx="22" cy="2" rx="5" ry="3" fill="#FFA0B0"/>
    <path d="M-12 8 Q0 22 12 8" fill="none" stroke="#D9480F" stroke-width="3" stroke-linecap="round"/>
    <!-- Sun Rays -->
    <line x1="0" y1="-52" x2="0" y2="-62" stroke="#FFD43B" stroke-width="4" stroke-linecap="round"/>
    <line x1="42" y1="-32" x2="52" y2="-40" stroke="#FFD43B" stroke-width="4" stroke-linecap="round"/>
    <line x1="52" y1="0" x2="62" y2="0" stroke="#FFD43B" stroke-width="4" stroke-linecap="round"/>
    <line x1="-42" y1="-32" x2="-52" y2="-40" stroke="#FFD43B" stroke-width="4" stroke-linecap="round"/>
    <line x1="-52" y1="0" x2="-62" y2="0" stroke="#FFD43B" stroke-width="4" stroke-linecap="round"/>
  </g>
  <path d="M0 135 Q110 100 230 130 Q310 115 400 128 V200 H0 Z" fill="url(#grassGrad)"/>
  <g transform="translate(90, 140)">
    <circle cx="15" cy="15" r="8" fill="#FDDFCE"/>
    <path d="M10 23 L6 45 H24 L20 23 Z" fill="#FF7675"/>
  </g>
  <g transform="translate(290, 140)">
    <circle cx="15" cy="15" r="8" fill="#FDDFCE"/>
    <path d="M10 23 L6 45 H24 L20 23 Z" fill="#74B9FF"/>
  </g>
`);

// 9. Sit and Read (Nina in classroom reading corner on beanbag with books)
scenarios['story-9-sit'] = wrapSvg(baseClassroom(`
  <g filter="url(#softShadow)" transform="translate(220, 110)">
    <!-- Beanbag -->
    <ellipse cx="50" cy="45" rx="42" ry="25" fill="#A29BFE" stroke="#6C5CE7" stroke-width="3"/>
    <!-- Girl reading -->
    <circle cx="45" cy="15" r="14" fill="#FDDFCE"/>
    <circle cx="41" cy="15" r="1.8" fill="#2D2140"/>
    <circle cx="49" cy="15" r="1.8" fill="#2D2140"/>
    <path d="M42 20 Q45 24 48 20" fill="none" stroke="#B8324D" stroke-width="1.5"/>
    <path d="M35 29 L28 55 H62 L55 29 Z" fill="#FD79A8"/>
    <path d="M38 40 L50 44 L62 40 L62 52 L50 56 L38 52 Z" fill="#FFFFFF" stroke="#6C5CE7" stroke-width="2"/>
  </g>
`));

// 10. The Book (Sam setting book carefully on wooden desk with study lamp)
scenarios['story-10-set'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(130, 90)">
    <!-- Wooden Table -->
    <rect width="140" height="20" rx="4" fill="#D2B48C" stroke="#A88B64" stroke-width="2.5"/>
    <line x1="15" y1="20" x2="15" y2="75" stroke="#A88B64" stroke-width="5"/>
    <line x1="125" y1="20" x2="125" y2="75" stroke="#A88B64" stroke-width="5"/>
    <!-- Book set on table -->
    <rect x="45" y="-8" width="50" height="18" rx="2" fill="#3867D6" stroke="#2D55B4" stroke-width="2"/>
    <line x1="45" y1="1" x2="95" y2="1" stroke="#FFFFFF" stroke-width="2"/>
    <!-- Desk Lamp -->
    <path d="M20 -15 L32 -15 L38 2 L14 2 Z" fill="#FDCB6E"/>
    <line x1="26" y1="2" x2="26" y2="8" stroke="#4B3322" stroke-width="3"/>
  </g>
`));

// 11. The Lamp (Ana in bedroom in evening with warm glowing bedside lamp)
scenarios['story-11-lit'] = wrapSvg(`
  <rect width="400" height="135" fill="#342459"/>
  <rect y="135" width="400" height="65" fill="#241740"/>
  <!-- Bed -->
  <g transform="translate(50, 100)">
    <rect width="140" height="55" rx="6" fill="#6C5CE7"/>
    <rect x="15" y="10" width="125" height="45" rx="4" fill="#FAF5FF"/>
    <!-- Girl reading in bed -->
    <circle cx="45" cy="0" r="14" fill="#FDDFCE"/>
    <path d="M30 14 H90 V45 H30 Z" fill="#A29BFE"/>
  </g>
  <!-- Glowing Table Lamp on right -->
  <g filter="url(#softShadow)" transform="translate(240, 75)">
    <rect x="25" y="45" width="45" height="45" rx="4" fill="#B89B77"/>
    <circle cx="47" cy="18" r="32" fill="#FFEAA7" opacity="0.35"/>
    <path d="M35 15 L60 15 L68 38 L27 38 Z" fill="#FFEAA7" stroke="#FDCB6E" stroke-width="2"/>
    <line x1="47" y1="38" x2="47" y2="45" stroke="#4B3322" stroke-width="4"/>
  </g>
`);

// 12. The Little Bird (Little bird singing on blooming tree branch near house)
scenarios['story-12-little'] = wrapSvg(baseOutdoor(`
  <g transform="translate(70, 35)">
    <path d="M0 60 Q80 40 160 55" stroke="#7A5636" stroke-width="8" stroke-linecap="round"/>
    <!-- Bird -->
    <ellipse cx="90" cy="40" rx="18" ry="14" fill="#4B7BEC" stroke="#2652B8" stroke-width="2"/>
    <circle cx="102" cy="34" r="9" fill="#4B7BEC"/>
    <polygon points="111,34 118,37 111,40" fill="#FA8231"/>
    <circle cx="104" cy="33" r="1.8" fill="#FFFFFF"/>
    <circle cx="105" cy="33" r="1" fill="#2D2140"/>
    <ellipse cx="86" cy="42" rx="10" ry="7" fill="#FED330"/>
    <!-- Musical notes -->
    <text x="125" y="25" font-family="sans-serif" font-size="16" fill="#8854D0">♪</text>
    <text x="135" y="15" font-family="sans-serif" font-size="12" fill="#A55EEA">♫</text>
  </g>
`));

// 13. On Top (Mark putting his toy car on top of the colorful toy box)
scenarios['story-13-top'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(170, 90)">
    <!-- Toy Box -->
    <rect width="100" height="70" rx="8" fill="#FF7675" stroke="#D63031" stroke-width="3"/>
    <line x1="0" y1="20" x2="100" y2="20" stroke="#FFF" stroke-width="3"/>
    <circle cx="50" cy="45" r="12" fill="#FFEAA7"/>
    <!-- Toy car ON TOP -->
    <g transform="translate(25, -25)">
      <rect x="8" y="8" width="34" height="15" rx="3" fill="#0984E3"/>
      <path d="M14 8 L20 0 L30 0 L36 8 Z" fill="#74B9FF"/>
      <circle cx="16" cy="23" r="5" fill="#2D3436"/>
      <circle cx="34" cy="23" r="5" fill="#2D3436"/>
    </g>
  </g>
`));

// 14. The Map (Ben and father holding a trail map on a hill)
scenarios['story-14-map'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(160, 65)">
    <!-- Father -->
    <circle cx="30" cy="20" r="15" fill="#FDDFCE"/>
    <path d="M16 35 L8 95 H52 L44 35 Z" fill="#2D3436"/>
    <!-- Ben -->
    <circle cx="75" cy="45" r="12" fill="#FDDFCE"/>
    <path d="M64 57 L58 95 H92 L86 57 Z" fill="#E17055"/>
    <!-- The Map between them -->
    <rect x="35" y="45" width="40" height="28" rx="2" fill="#FFF9E6" stroke="#D6A354" stroke-width="2"/>
    <path d="M40 52 Q48 60 55 50 Q62 62 70 54" fill="none" stroke="#D63031" stroke-width="1.5" stroke-dasharray="2 2"/>
  </g>
`));

// 15. The Kind Man (Kind elderly man helping child on sunny village path)
scenarios['story-15-man'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(150, 50)">
    <!-- Kind Man -->
    <circle cx="35" cy="25" r="16" fill="#F8C291"/>
    <ellipse cx="35" cy="14" rx="22" ry="6" fill="#6D4C41"/>
    <circle cx="30" cy="24" r="2" fill="#2D2140"/>
    <circle cx="40" cy="24" r="2" fill="#2D2140"/>
    <path d="M30 30 Q35 34 40 30" fill="none" stroke="#B8324D" stroke-width="2"/>
    <path d="M20 42 L12 110 H58 L50 42 Z" fill="#4B6584"/>
    <!-- Child -->
    <circle cx="85" cy="65" r="12" fill="#FDDFCE"/>
    <path d="M75 77 L69 110 H101 L95 77 Z" fill="#20BF6B"/>
    <!-- Apple in hand -->
    <circle cx="58" cy="72" r="6" fill="#EB3B5A"/>
  </g>
`));

// 16. The Dog (Dan playing fetch with friendly dog Max in green yard)
scenarios['story-16-dog'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(210, 110)">
    <!-- Dog Max -->
    <ellipse cx="35" cy="30" rx="28" ry="18" fill="#C79255" stroke="#966028" stroke-width="2.5"/>
    <circle cx="18" cy="20" r="14" fill="#C79255" stroke="#966028" stroke-width="2"/>
    <polygon points="10,12 14,3 20,12" fill="#633D14"/>
    <polygon points="20,12 24,3 28,12" fill="#633D14"/>
    <circle cx="14" cy="18" r="2" fill="#2D2140"/>
    <ellipse cx="6" cy="22" rx="4" ry="3" fill="#2D2140"/>
    <path d="M60 25 Q75 15 70 5" fill="none" stroke="#966028" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g transform="translate(90, 65)">
    <!-- Dan -->
    <circle cx="30" cy="22" r="14" fill="#FDDFCE"/>
    <path d="M18 36 L10 95 H50 L42 36 Z" fill="#45AAF2"/>
  </g>
  <circle cx="170" cy="155" r="9" fill="#EB3B5A" stroke="#B33939" stroke-width="2"/>
`));

// 17. The Dog's Den (Cute wooden dog den under shade tree with dog bed)
scenarios['story-17-den'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 80)">
    <!-- Dog House / Den -->
    <polygon points="50,0 0,35 100,35" fill="#EB3B5A" stroke="#B33939" stroke-width="3"/>
    <rect x="10" y="35" width="80" height="55" fill="#F7D794" stroke="#D6A354" stroke-width="3"/>
    <path d="M35 90 V60 Q50 45 65 60 V90 Z" fill="#3D3D3D"/>
    <!-- Bone -->
    <rect x="25" y="85" width="20" height="5" rx="2" fill="#FFFFFF"/>
  </g>
  <g transform="translate(60, 20)">
    <rect x="35" y="60" width="16" height="80" fill="#7A5636"/>
    <circle cx="43" cy="50" r="45" fill="#20BF6B"/>
  </g>
`));

// 18. Digging (Playful dog digging in garden soil near flowers)
scenarios['story-18-dig'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(160, 105)">
    <!-- Dog digging -->
    <ellipse cx="50" cy="35" rx="30" ry="20" fill="#C79255" stroke="#966028" stroke-width="2.5" transform="rotate(-15 50 35)"/>
    <path d="M80 20 Q95 10 90 0" fill="none" stroke="#966028" stroke-width="4"/>
    <!-- Soil flying -->
    <ellipse cx="20" cy="45" rx="18" ry="8" fill="#5D4037"/>
    <circle cx="15" cy="35" r="3" fill="#5D4037"/>
    <circle cx="28" cy="30" r="2.5" fill="#5D4037"/>
    <circle cx="10" cy="25" r="2" fill="#5D4037"/>
  </g>
  <g transform="translate(280, 120)">
    <!-- Garden Tulips -->
    <line x1="15" y1="40" x2="15" y2="10" stroke="#20BF6B" stroke-width="3"/>
    <polygon points="10,12 15,2 20,12" fill="#EB3B5A"/>
    <line x1="35" y1="40" x2="35" y2="15" stroke="#20BF6B" stroke-width="3"/>
    <polygon points="30,17 35,7 40,17" fill="#F7B731"/>
  </g>
`));

// 19. The Egg (Mother hen sitting in straw nest with egg)
scenarios['story-19-egg'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(160, 95)">
    <!-- Straw Nest -->
    <ellipse cx="60" cy="55" rx="55" ry="22" fill="#F7D794" stroke="#D6A354" stroke-width="3"/>
    <!-- Hen -->
    <ellipse cx="50" cy="38" rx="32" ry="22" fill="#A55EEA" stroke="#8854D0" stroke-width="2"/>
    <circle cx="32" cy="24" r="14" fill="#A55EEA"/>
    <polygon points="20,24 12,28 20,32" fill="#FA8231"/>
    <polygon points="32,10 28,14 36,14" fill="#EB3B5A"/>
    <!-- The Egg -->
    <ellipse cx="85" cy="48" rx="9" ry="13" fill="#FFFFFF" stroke="#DCDDE1" stroke-width="2" transform="rotate(15 85 48)"/>
  </g>
`));

// 20. The Hill (Sara and brother reaching top of green hill enjoying the view)
scenarios['story-20-hill'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 50)">
    <!-- Sara -->
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 95 H46 L38 39 Z" fill="#FC5C65"/>
    <!-- Brother -->
    <circle cx="65" cy="30" r="14" fill="#FDDFCE"/>
    <path d="M53 44 L46 95 H84 L77 44 Z" fill="#45AAF2"/>
  </g>
  <!-- Flag on top of hill -->
  <g transform="translate(130, 45)">
    <line x1="10" y1="0" x2="10" y2="90" stroke="#4B3322" stroke-width="3"/>
    <polygon points="10,5 35,15 10,25" fill="#FED330"/>
  </g>
`));

// 21. Pink (Mia in grandmother's garden admiring lovely pink flower)
scenarios['story-21-pink'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(110, 60)">
    <circle cx="30" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M18 39 L10 95 H50 L42 39 Z" fill="#A55EEA"/>
  </g>
  <!-- Big Beautiful Pink Flower -->
  <g filter="url(#softShadow)" transform="translate(240, 70)">
    <line x1="40" y1="90" x2="40" y2="40" stroke="#20BF6B" stroke-width="4"/>
    <circle cx="40" cy="35" r="12" fill="#FED330"/>
    <circle cx="40" cy="18" r="12" fill="#FC5C65"/>
    <circle cx="40" cy="52" r="12" fill="#FC5C65"/>
    <circle cx="23" cy="35" r="12" fill="#FC5C65"/>
    <circle cx="57" cy="35" r="12" fill="#FC5C65"/>
    <!-- Watering can -->
    <rect x="70" y="65" width="24" height="20" rx="3" fill="#45AAF2"/>
  </g>
`));

// 22. Fast (Ben racing red toy car fast on driveway)
scenarios['story-22-fast'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(130, 120)">
    <!-- Speed motion streaks -->
    <line x1="-30" y1="20" x2="0" y2="20" stroke="#FED330" stroke-width="4" stroke-dasharray="6 4"/>
    <line x1="-45" y1="35" x2="-10" y2="35" stroke="#FED330" stroke-width="4" stroke-dasharray="6 4"/>
    <!-- Race Car -->
    <rect x="20" y="10" width="75" height="25" rx="6" fill="#EB3B5A"/>
    <path d="M35 10 L48 0 L65 0 L75 10 Z" fill="#2D3436"/>
    <circle cx="38" cy="35" r="10" fill="#2D3436"/>
    <circle cx="78" cy="35" r="10" fill="#2D3436"/>
  </g>
`));

// 23. Frog (Cute green frog on lily pad near rain-washed plants)
scenarios['story-23-frog'] = wrapSvg(`
  <rect width="400" height="135" fill="#DFF9FB"/>
  <rect y="135" width="400" height="65" fill="#48CAE4"/>
  <!-- Garden Pond Lilypad -->
  <g filter="url(#softShadow)" transform="translate(150, 105)">
    <ellipse cx="55" cy="45" rx="55" ry="20" fill="#2ED573" stroke="#10AC84" stroke-width="3"/>
    <!-- Frog -->
    <ellipse cx="55" cy="30" rx="25" ry="18" fill="#26DE81" stroke="#20BF6B" stroke-width="2.5"/>
    <circle cx="43" cy="18" r="8" fill="#26DE81"/>
    <circle cx="67" cy="18" r="8" fill="#26DE81"/>
    <circle cx="43" cy="18" r="3.5" fill="#2D3436"/>
    <circle cx="67" cy="18" r="3.5" fill="#2D3436"/>
    <path d="M45 32 Q55 38 65 32" fill="none" stroke="#009432" stroke-width="2"/>
  </g>
`);

// 24. Stop (Carlo and sister waiting at red stop sign crosswalk)
scenarios['story-24-stop'] = wrapSvg(baseOutdoor(`
  <!-- Red Stop Sign -->
  <g filter="url(#softShadow)" transform="translate(250, 45)">
    <line x1="25" y1="45" x2="25" y2="120" stroke="#718093" stroke-width="5"/>
    <polygon points="25,0 45,8 50,30 40,48 10,48 0,30 5,8" fill="#EB3B5A" stroke="#FFFFFF" stroke-width="2"/>
    <text x="25" y="28" font-family="sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle">STOP</text>
  </g>
  <g transform="translate(120, 60)">
    <!-- Brother & Sister -->
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 95 H46 L38 39 Z" fill="#45AAF2"/>
    <circle cx="65" cy="28" r="12" fill="#FDDFCE"/>
    <path d="M55 40 L48 95 H82 L75 40 Z" fill="#FC5C65"/>
  </g>
`));

// 25. Back (Nina returning home with backpack as mother welcomes her)
scenarios['story-25-back'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(180, 50)">
    <!-- Mother welcoming -->
    <circle cx="30" cy="25" r="15" fill="#FDDFCE"/>
    <path d="M15 40 L8 100 H52 L45 40 Z" fill="#8854D0"/>
  </g>
  <g transform="translate(80, 70)">
    <!-- Nina with Backpack -->
    <circle cx="30" cy="25" r="13" fill="#FDDFCE"/>
    <path d="M18 38 L12 90 H48 L42 38 Z" fill="#20BF6B"/>
    <rect x="8" y="45" width="12" height="22" rx="3" fill="#2D3436"/>
  </g>
`));

// 26. Nine (Nine colorful pencils neatly arranged on desk)
scenarios['story-26-nine'] = wrapSvg(baseClassroom(`
  <g filter="url(#softShadow)" transform="translate(110, 125)">
    <!-- Nine Pencils Row -->
    ${[
      '#FF7675', '#74B9FF', '#55EFC4', '#FDCB6E', '#A29BFE',
      '#FD79A8', '#00CEC9', '#FFA94D', '#E17055'
    ].map((c, i) => `
      <g transform="translate(${i * 20}, 0)">
        <rect width="10" height="42" rx="2" fill="${c}"/>
        <polygon points="0,0 5,-10 10,0" fill="#FFEAA7"/>
        <polygon points="3,-6 5,-10 7,-6" fill="#2D3436"/>
      </g>
    `).join('')}
  </g>
`));

// 27. Nuts (Sam collecting acorns and nuts under oak tree)
scenarios['story-27-nuts'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 130)">
    <!-- Acorns on ground -->
    <ellipse cx="20" cy="25" rx="8" ry="10" fill="#A8815B"/>
    <ellipse cx="20" cy="18" rx="9" ry="4" fill="#634832"/>
    <ellipse cx="50" cy="30" rx="9" ry="11" fill="#A8815B"/>
    <ellipse cx="50" cy="22" rx="10" ry="5" fill="#634832"/>
    <ellipse cx="80" cy="20" rx="8" ry="10" fill="#A8815B"/>
    <ellipse cx="80" cy="13" rx="9" ry="4" fill="#634832"/>
  </g>
  <g transform="translate(80, 65)">
    <!-- Sam with basket -->
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 95 H46 L38 39 Z" fill="#26DE81"/>
    <rect x="42" y="65" width="20" height="15" rx="3" fill="#D2B48C"/>
  </g>
`));

// 28. Floor (Mia picking book up from clean bedroom floor)
scenarios['story-28-floor'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(160, 115)">
    <!-- Open storybook on floor -->
    <path d="M15 35 L40 40 L65 35 L65 52 L40 57 L15 52 Z" fill="#FFFFFF" stroke="#FF7675" stroke-width="2.5"/>
    <line x1="40" y1="40" x2="40" y2="57" stroke="#D63031" stroke-width="2"/>
  </g>
  <g transform="translate(90, 65)">
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 95 H46 L38 39 Z" fill="#6C5CE7"/>
  </g>
`));

// 29. Spins (Ben reading near spinning desk fan)
scenarios['story-29-spins'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(240, 80)">
    <!-- Electric Desk Fan -->
    <circle cx="40" cy="40" r="32" fill="#E1F5FE" stroke="#0288D1" stroke-width="3"/>
    <line x1="40" y1="72" x2="40" y2="95" stroke="#0288D1" stroke-width="5"/>
    <rect x="25" y="92" width="30" height="8" rx="3" fill="#0288D1"/>
    <!-- Spinning blades -->
    <ellipse cx="40" cy="40" rx="6" ry="24" fill="#4FC3F7" transform="rotate(30 40 40)"/>
    <ellipse cx="40" cy="40" rx="6" ry="24" fill="#4FC3F7" transform="rotate(90 40 40)"/>
    <ellipse cx="40" cy="40" rx="6" ry="24" fill="#4FC3F7" transform="rotate(150 40 40)"/>
    <circle cx="40" cy="40" r="7" fill="#01579B"/>
  </g>
  <g transform="translate(90, 70)">
    <!-- Ben reading -->
    <circle cx="30" cy="22" r="14" fill="#FDDFCE"/>
    <path d="M16 36 L8 95 H52 L44 36 Z" fill="#00B894"/>
  </g>
`));

// 30. Test (Lara doing her reading test paper at school)
scenarios['story-30-test'] = wrapSvg(baseClassroom(`
  <g filter="url(#softShadow)" transform="translate(180, 85)">
    <!-- Desk & Exam Paper -->
    <rect width="110" height="65" rx="4" fill="#D2B48C" stroke="#A88B64" stroke-width="3"/>
    <rect x="25" y="10" width="40" height="45" rx="2" fill="#FFFFFF" stroke="#B2BEC3" stroke-width="1.5"/>
    <line x1="32" y1="18" x2="58" y2="18" stroke="#0984E3" stroke-width="1.5"/>
    <line x1="32" y1="26" x2="55" y2="26" stroke="#0984E3" stroke-width="1.5"/>
    <line x1="32" y1="34" x2="58" y2="34" stroke="#0984E3" stroke-width="1.5"/>
    <!-- Pencil -->
    <line x1="72" y1="15" x2="62" y2="30" stroke="#FDCB6E" stroke-width="3"/>
  </g>
`));

// 31. Last (Mark closing last page of storybook by bookshelf)
scenarios['story-31-last'] = wrapSvg(baseClassroom(`
  <g filter="url(#softShadow)" transform="translate(190, 60)">
    <!-- Mark with completed book -->
    <circle cx="30" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M16 39 L8 95 H52 L44 39 Z" fill="#E17055"/>
    <rect x="42" y="48" width="28" height="35" rx="3" fill="#2E86DE" stroke="#1B60A5" stroke-width="2"/>
    <!-- Gold star on cover -->
    <polygon points="56,60 58,65 64,65 59,69 61,74 56,71 51,74 53,69 48,65 54,65" fill="#FED330"/>
  </g>
`));

// 32. Stem (Lia watering windowsill plant with strong tall stem)
scenarios['story-32-stem'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(200, 70)">
    <!-- Potted Plant -->
    <polygon points="25,60 15,100 65,100 55,60" fill="#E17055"/>
    <!-- Strong Green Stem -->
    <line x1="40" y1="60" x2="40" y2="10" stroke="#10AC84" stroke-width="6" stroke-linecap="round"/>
    <!-- Leaves -->
    <ellipse cx="28" cy="35" rx="14" ry="7" fill="#2ED573" transform="rotate(-30 28 35)"/>
    <ellipse cx="52" cy="25" rx="14" ry="7" fill="#2ED573" transform="rotate(30 52 25)"/>
    <ellipse cx="40" cy="5" rx="10" ry="12" fill="#FF4757"/>
  </g>
`));

// 33. Mist (Ben looking out window at morning mist rolling over field)
scenarios['story-33-mist'] = wrapSvg(`
  <rect width="400" height="135" fill="#E8EEF5"/>
  <rect y="135" width="400" height="65" fill="#D3DFEE"/>
  <!-- Blurry Trees in mist -->
  <circle cx="120" cy="80" r="35" fill="#BDC3C7" opacity="0.6"/>
  <circle cx="280" cy="85" r="45" fill="#BDC3C7" opacity="0.5"/>
  <!-- Floating Mist waves -->
  <path d="M0 70 Q90 60 180 75 Q270 90 400 70" fill="none" stroke="#FFFFFF" stroke-width="18" opacity="0.75"/>
  <path d="M0 100 Q120 115 240 95 Q340 85 400 105" fill="none" stroke="#FFFFFF" stroke-width="22" opacity="0.8"/>
  <!-- Window frame border -->
  <rect x="15" y="15" width="370" height="170" rx="12" fill="none" stroke="#6C5CE7" stroke-width="8"/>
`);

// 34. Mill (Rico and father gazing at old countryside windmill)
scenarios['story-34-mill'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(250, 40)">
    <!-- Windmill Body -->
    <polygon points="35,30 20,110 60,110 45,30" fill="#E67E22" stroke="#D35400" stroke-width="2.5"/>
    <polygon points="40,15 15,30 65,30" fill="#C0392B"/>
    <!-- Windmill Blades -->
    <g transform="translate(40, 30)">
      <circle r="4" fill="#2C3E50"/>
      <line x1="-35" y1="0" x2="35" y2="0" stroke="#7F8C8D" stroke-width="3"/>
      <line x1="0" y1="-35" x2="0" y2="35" stroke="#7F8C8D" stroke-width="3"/>
    </g>
  </g>
`));

// 35. Tell (Lina speaking enthusiastically in front of smiling class)
scenarios['story-35-tell'] = wrapSvg(baseClassroom(`
  <g filter="url(#softShadow)" transform="translate(180, 50)">
    <!-- Lina storytelling -->
    <circle cx="30" cy="22" r="14" fill="#FDDFCE"/>
    <path d="M16 36 L8 95 H52 L44 36 Z" fill="#9B59B6"/>
    <!-- Speech bubble -->
    <rect x="55" y="10" width="55" height="30" rx="10" fill="#FFFFFF" stroke="#9B59B6" stroke-width="2"/>
    <text x="82" y="28" font-family="sans-serif" font-size="10" font-weight="bold" fill="#8E44AD" text-anchor="middle">Story!</text>
  </g>
`));

// 36. Sell (Family fruit market stand with apples, bananas, oranges)
scenarios['story-36-sell'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(130, 85)">
    <!-- Fruit Stand Table -->
    <rect width="140" height="35" rx="4" fill="#D35400"/>
    <rect x="10" y="35" width="120" height="40" fill="#E67E22"/>
    <!-- Fruit Crates -->
    <circle cx="30" cy="18" r="8" fill="#E74C3C"/>
    <circle cx="45" cy="18" r="8" fill="#E74C3C"/>
    <ellipse cx="70" cy="18" rx="10" ry="6" fill="#F1C40F"/>
    <circle cx="100" cy="18" r="8" fill="#E67E22"/>
    <circle cx="115" cy="18" r="8" fill="#E67E22"/>
  </g>
`));

// 37. Light (Ana smiling as bedroom lamp turns back on with warm light)
scenarios['story-37-light'] = wrapSvg(`
  <rect width="400" height="135" fill="#3F2B68"/>
  <rect y="135" width="400" height="65" fill="#281A45"/>
  <!-- Glowing ceiling light -->
  <g transform="translate(200, 20)">
    <line x1="0" y1="0" x2="0" y2="40" stroke="#F1C40F" stroke-width="3"/>
    <circle cx="0" cy="48" r="45" fill="#FFEAA7" opacity="0.4"/>
    <circle cx="0" cy="48" r="16" fill="#F1C40F"/>
  </g>
  <g transform="translate(160, 110)">
    <circle cx="40" cy="20" r="14" fill="#FDDFCE"/>
    <path d="M26 34 L18 80 H62 L54 34 Z" fill="#1ABC9C"/>
  </g>
`);

// 38. Bell (School belfry with golden bell chiming early morning)
scenarios['story-38-bell'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(170, 30)">
    <!-- Schoolhouse Tower -->
    <polygon points="30,0 0,30 60,30" fill="#C0392B"/>
    <rect x="8" y="30" width="44" height="60" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="2"/>
    <!-- Golden Bell -->
    <path d="M20 65 Q30 45 40 65 H20 Z" fill="#F1C40F" stroke="#F39C12" stroke-width="2"/>
    <circle cx="30" cy="68" r="3" fill="#D35400"/>
    <!-- Sound Waves -->
    <path d="M8 55 Q2 65 8 75" fill="none" stroke="#F39C12" stroke-width="2"/>
    <path d="M52 55 Q58 65 52 75" fill="none" stroke="#F39C12" stroke-width="2"/>
  </g>
`));

// 39. Bath (Leo in warm bubble bath with rubber duck)
scenarios['story-39-bath'] = wrapSvg(`
  <rect width="400" height="135" fill="#E0F7FA"/>
  <rect y="135" width="400" height="65" fill="#B2EBF2"/>
  <!-- Bathtub -->
  <g filter="url(#softShadow)" transform="translate(130, 95)">
    <rect width="140" height="65" rx="20" fill="#FFFFFF" stroke="#00ACC1" stroke-width="4"/>
    <!-- Foam Bubbles -->
    <circle cx="30" cy="10" r="14" fill="#E0F2F1"/>
    <circle cx="50" cy="6" r="16" fill="#E0F2F1"/>
    <circle cx="75" cy="8" r="18" fill="#E0F2F1"/>
    <circle cx="100" cy="12" r="14" fill="#E0F2F1"/>
    <!-- Rubber Duck -->
    <circle cx="110" cy="4" r="8" fill="#FFEB3B"/>
    <polygon points="118,4 124,6 118,8" fill="#FF9800"/>
  </g>
`);

// 40. Bark (Dog barking alertly near gate as cat walks by)
scenarios['story-40-bark'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(120, 95)">
    <!-- Wooden Gate -->
    <rect width="80" height="60" rx="4" fill="#D7CCC8" stroke="#8D6E63" stroke-width="3"/>
    <!-- Dog barking -->
    <circle cx="40" cy="25" r="15" fill="#A1887F"/>
    <polygon points="30,15 35,5 40,15" fill="#5D4037"/>
    <polygon points="40,15 45,5 50,15" fill="#5D4037"/>
    <text x="75" y="15" font-family="sans-serif" font-size="11" font-weight="900" fill="#E67E22">WOOF!</text>
  </g>
  <g transform="translate(250, 130)">
    <!-- Cat on wall -->
    <ellipse cx="30" cy="18" rx="20" ry="12" fill="#2C3E50"/>
    <circle cx="15" cy="12" r="9" fill="#2C3E50"/>
  </g>
`));

// 41. Road (Red family car driving along scenic road across stone bridge)
scenarios['story-41-road'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(160, 110)">
    <!-- Red Car -->
    <rect x="15" y="12" width="70" height="24" rx="5" fill="#E74C3C"/>
    <path d="M28 12 L38 0 L58 0 L68 12 Z" fill="#34495E"/>
    <circle cx="32" cy="36" r="9" fill="#2C3E50"/>
    <circle cx="70" cy="36" r="9" fill="#2C3E50"/>
  </g>
`));

// 42. Rain (Cozy window watching rain fall on garden outside)
scenarios['story-42-rain'] = wrapSvg(`
  <rect width="400" height="200" fill="#718093"/>
  <!-- Raindrops outside -->
  ${Array.from({ length: 24 }).map((_, i) => `
    <line x1="${15 + (i * 16)}" y1="${15 + ((i * 7) % 150)}" x2="${5 + (i * 16)}" y2="${35 + ((i * 7) % 150)}" stroke="#74B9FF" stroke-width="2"/>
  `).join('')}
  <!-- Window frame -->
  <rect x="25" y="20" width="350" height="160" rx="10" fill="none" stroke="#FFFFFF" stroke-width="10"/>
  <line x1="200" y1="20" x2="200" y2="180" stroke="#FFFFFF" stroke-width="6"/>
  <line x1="25" y1="100" x2="375" y2="100" stroke="#FFFFFF" stroke-width="6"/>
`);

// 43. Rock (Ben and father beside giant rock on forest trail)
scenarios['story-43-rock'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(230, 80)">
    <!-- Giant Rock -->
    <ellipse cx="60" cy="55" rx="55" ry="38" fill="#7F8C8D" stroke="#576574" stroke-width="3"/>
    <ellipse cx="45" cy="45" rx="20" ry="12" fill="#95A5A6"/>
  </g>
  <g transform="translate(90, 65)">
    <!-- Father & Ben -->
    <circle cx="30" cy="22" r="14" fill="#FDDFCE"/>
    <path d="M18 36 L10 95 H50 L42 36 Z" fill="#2C3E50"/>
    <circle cx="70" cy="40" r="11" fill="#FDDFCE"/>
    <path d="M60 52 L54 95 H86 L80 52 Z" fill="#E67E22"/>
  </g>
`));

// 44. Round (Ana and brother rolling big round ball to each other)
scenarios['story-44-round'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(175, 125)">
    <!-- Big Round Ball -->
    <circle cx="25" cy="25" r="22" fill="#E84118" stroke="#C23616" stroke-width="3"/>
    <path d="M5 25 Q25 8 45 25" fill="none" stroke="#FBC531" stroke-width="5"/>
  </g>
  <g transform="translate(80, 70)">
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 90 H46 L38 39 Z" fill="#9C88FF"/>
  </g>
  <g transform="translate(270, 70)">
    <circle cx="25" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M12 39 L4 90 H46 L38 39 Z" fill="#4CD137"/>
  </g>
`));

// 45. Plant (Healthy potted houseplant thriving on sunny windowsill)
scenarios['story-45-plant'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(170, 70)">
    <polygon points="30,65 20,105 70,105 60,65" fill="#E17055"/>
    <line x1="45" y1="65" x2="45" y2="15" stroke="#10AC84" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="30" cy="40" rx="18" ry="9" fill="#2ED573" transform="rotate(-25 30 40)"/>
    <ellipse cx="60" cy="30" rx="18" ry="9" fill="#2ED573" transform="rotate(25 60 30)"/>
    <ellipse cx="45" cy="15" rx="14" ry="16" fill="#00B894"/>
  </g>
`));

// 46. Green (Tom and teacher inspecting big vibrant green leaf)
scenarios['story-46-green'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 80)">
    <!-- Big Green Leaf -->
    <path d="M20 60 Q20 10 70 10 Q70 60 20 60 Z" fill="#2ED573" stroke="#10AC84" stroke-width="3"/>
    <line x1="20" y1="60" x2="70" y2="10" stroke="#10AC84" stroke-width="2.5"/>
  </g>
  <g transform="translate(70, 50)">
    <!-- Teacher & Tom -->
    <circle cx="30" cy="25" r="15" fill="#FDDFCE"/>
    <path d="M15 40 L8 105 H52 L45 40 Z" fill="#6C5CE7"/>
  </g>
`));

// 47. Black (Ben packing school books in his black backpack)
scenarios['story-47-black'] = wrapSvg(baseIndoor(`
  <g filter="url(#softShadow)" transform="translate(200, 85)">
    <!-- Black Backpack -->
    <rect width="70" height="85" rx="12" fill="#2D3436" stroke="#000000" stroke-width="3"/>
    <rect x="15" y="35" width="40" height="35" rx="4" fill="#3D4548"/>
    <line x1="20" y1="48" x2="50" y2="48" stroke="#F1C40F" stroke-width="2.5"/>
    <!-- School Book sticking out -->
    <rect x="20" y="8" width="30" height="25" rx="2" fill="#E74C3C"/>
  </g>
  <g transform="translate(90, 65)">
    <circle cx="30" cy="25" r="14" fill="#FDDFCE"/>
    <path d="M16 39 L8 95 H52 L44 39 Z" fill="#0984E3"/>
  </g>
`));

// 48. House (Charming cottage with red door and flower garden)
scenarios['story-48-house'] = wrapSvg(baseOutdoor(`
  <g filter="url(#softShadow)" transform="translate(180, 45)">
    <!-- House Body -->
    <rect y="40" width="130" height="75" rx="6" fill="#FFF4DC" stroke="#E2D4BF" stroke-width="3"/>
    <polygon points="65,0 -5,40 135,40" fill="#E74C3C" stroke="#C0392B" stroke-width="3"/>
    <!-- Red Door -->
    <rect x="50" y="65" width="30" height="50" rx="3" fill="#C0392B"/>
    <circle cx="72" cy="90" r="3" fill="#F1C40F"/>
    <!-- Windows -->
    <rect x="15" y="55" width="22" height="25" rx="2" fill="#74B9FF" stroke="#FFFFFF" stroke-width="2"/>
    <rect x="92" y="55" width="22" height="25" rx="2" fill="#74B9FF" stroke="#FFFFFF" stroke-width="2"/>
  </g>
  <!-- Flowers beside house -->
  <circle cx="150" cy="155" r="8" fill="#FC5C65"/>
  <circle cx="165" cy="160" r="8" fill="#FED330"/>
  <circle cx="330" cy="155" r="8" fill="#A55EEA"/>
`));

// Now assemble the output JavaScript module
let output = `// Auto-generated 48 Custom Scenario Landscapes for Grade 3 ARAL Reading Stories
// Every single story has a dedicated, narrative-tailored landscape illustration in the Lexi ARAL artstyle.

export const storyIllustrations = {\n`;

for (let i = 1; i <= 48; i++) {
  const story = content.stories[i - 1];
  const id = story ? story.id : `story-${i}`;
  const svg = scenarios[id] || scenarios['story-1-cat'];
  output += `  ${JSON.stringify(id)}: ${JSON.stringify(svg)},\n`;
}

output += `};\n\n`;

output += `// Main lookup function to get the custom scenario landscape SVG for any given story
export function getStoryScenarioSvg(story) {
  if (!story) return null;
  return storyIllustrations[story.id] || storyIllustrations["story-1-cat"];
}
`;

const outputPath = path.join(__dirname, '..', 'src', 'storyIllustrations.js');
fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully generated and saved all 48 custom scenario landscape illustrations to src/storyIllustrations.js!');
