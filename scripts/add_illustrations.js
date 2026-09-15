const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'src', 'illustrations.js');
let code = fs.readFileSync(target, 'utf8');

const newIllustrationsCode = `
  // --- 28 Additional Grade 3 ARAL Target Words ---
  pink: frame(\`
    <path d="M70 140 Q120 40 170 140 Z" fill="#FFAEC9" stroke="#E66A90" stroke-width="4"/>
    <path d="M90 140 L120 60 L150 140" stroke="#FFFFFF" stroke-width="2.5"/>
    <circle cx="120" cy="140" r="10" fill="#E66A90"/>
    <circle cx="120" cy="140" r="4" fill="#FFFFFF"/>
  \`),

  fast: frame(\`
    <path d="M40 120 L65 85 L145 85 L190 110 L195 130 L35 130 Z" fill="#E84A5F" stroke="#B8263B" stroke-width="4"/>
    <polygon points="75,90 135,90 130,110 65,110" fill="#8CE8FF"/>
    <circle cx="70" cy="135" r="16" fill="#2D2140" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="160" cy="135" r="16" fill="#2D2140" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="20" y1="95" x2="45" y2="95" stroke="#FFB830" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="110" x2="35" y2="110" stroke="#FFB830" stroke-width="4" stroke-linecap="round"/>
  \`),

  frog: frame(\`
    <ellipse cx="120" cy="145" rx="80" ry="20" fill="#75C28C" stroke="#3D8B54" stroke-width="3"/>
    <ellipse cx="120" cy="115" rx="42" ry="32" fill="#58B96B" stroke="#2D7A3E" stroke-width="4"/>
    <circle cx="98" cy="85" r="14" fill="#58B96B" stroke="#2D7A3E" stroke-width="3"/>
    <circle cx="142" cy="85" r="14" fill="#58B96B" stroke="#2D7A3E" stroke-width="3"/>
    <circle cx="100" cy="85" r="6" fill="#2D2140"/>
    <circle cx="140" cy="85" r="6" fill="#2D2140"/>
    <circle cx="102" cy="82" r="2" fill="#FFFFFF"/>
    <circle cx="142" cy="82" r="2" fill="#FFFFFF"/>
    <path d="M106 122 Q120 134 134 122" fill="none" stroke="#2D7A3E" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="120" cy="122" rx="20" ry="12" fill="#C4F5CE"/>
  \`),

  stop: frame(\`
    <line x1="120" y1="120" x2="120" y2="170" stroke="#909DAE" stroke-width="10" stroke-linecap="round"/>
    <polygon points="90,40 150,40 185,75 185,125 150,160 90,160 55,125 55,75" fill="#E83A3A" stroke="#FFFFFF" stroke-width="5"/>
    <text x="120" y="112" font-family="'Century Gothic', Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">STOP</text>
  \`),

  back: frame(\`
    <path d="M140 50 L80 95 L140 140" stroke="#7548C7" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M85 95 H180" stroke="#7548C7" stroke-width="12" stroke-linecap="round"/>
    <circle cx="70" cy="95" r="10" fill="#FFAEC9"/>
  \`),

  nine: frame(\`
    <text x="120" y="130" font-family="'Century Gothic', sans-serif" font-size="105" font-weight="bold" fill="#7E57C2" text-anchor="middle">9</text>
    <circle cx="120" cy="65" r="22" fill="none" stroke="#FFAEC9" stroke-width="6"/>
    <rect x="35" y="140" width="170" height="8" rx="4" fill="#E2D5F5"/>
  \`),

  nuts: frame(\`
    <ellipse cx="95" cy="115" rx="28" ry="34" fill="#B5733A" stroke="#704118" stroke-width="4"/>
    <path d="M65 95 Q95 70 125 95 Z" fill="#6E3E16" stroke="#48270B" stroke-width="3"/>
    <line x1="95" y1="78" x2="95" y2="65" stroke="#48270B" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="145" cy="125" rx="24" ry="28" fill="#D28F50" stroke="#704118" stroke-width="3.5"/>
    <path d="M120 108 Q145 88 170 108 Z" fill="#6E3E16" stroke="#48270B" stroke-width="3"/>
  \`),

  floor: frame(\`
    <rect x="25" y="45" width="190" height="95" rx="10" fill="#EEDAC0" stroke="#B8966E" stroke-width="4"/>
    <line x1="25" y1="80" x2="215" y2="80" stroke="#CBB08C" stroke-width="3"/>
    <line x1="25" y1="110" x2="215" y2="110" stroke="#CBB08C" stroke-width="3"/>
    <line x1="100" y1="45" x2="100" y2="80" stroke="#CBB08C" stroke-width="2.5"/>
    <line x1="150" y1="80" x2="150" y2="110" stroke="#CBB08C" stroke-width="2.5"/>
    <line x1="80" y1="110" x2="80" y2="140" stroke="#CBB08C" stroke-width="2.5"/>
    <rect x="105" y="90" width="45" height="32" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/>
  \`),

  spins: frame(\`
    <circle cx="120" cy="85" r="48" fill="#E8F4FC" stroke="#4DA7E8" stroke-width="4"/>
    <circle cx="120" cy="85" r="10" fill="#2478B8"/>
    <path d="M120 75 Q145 45 125 40 Q110 55 120 75 Z" fill="#60BAF8"/>
    <path d="M130 85 Q160 110 155 125 Q140 110 130 85 Z" fill="#60BAF8"/>
    <path d="M110 85 Q80 60 85 45 Q100 60 110 85 Z" fill="#60BAF8"/>
    <rect x="115" y="133" width="10" height="24" fill="#889BB0"/>
    <ellipse cx="120" cy="158" rx="35" ry="8" fill="#64788C"/>
    <path d="M175 70 Q195 80 185 95" fill="none" stroke="#90CDF4" stroke-width="3" stroke-linecap="round"/>
  \`),

  test: frame(\`
    <rect x="65" y="25" width="110" height="135" rx="8" fill="#FFFFFF" stroke="#BAC7D5" stroke-width="3"/>
    <line x1="80" y1="50" x2="150" y2="50" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <line x1="80" y1="70" x2="150" y2="70" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <line x1="80" y1="90" x2="150" y2="90" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <polyline points="80,115 88,122 100,108" fill="none" stroke="#20A464" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="145" cy="115" r="18" fill="#FFEFEF" stroke="#E84A5F" stroke-width="2"/>
    <text x="145" y="122" font-family="'Century Gothic', sans-serif" font-size="16" font-weight="bold" fill="#E84A5F" text-anchor="middle">A+</text>
  \`),

  last: frame(\`
    <path d="M45 130 C75 125 110 128 120 135 C130 128 165 125 195 130 L195 60 C165 55 130 58 120 65 C110 58 75 55 45 60 Z" fill="#FFFDF8" stroke="#7A6855" stroke-width="3"/>
    <path d="M120 65 L120 135" stroke="#7A6855" stroke-width="3"/>
    <path d="M120 65 Q135 90 140 145 L130 140 L120 145 Z" fill="#8F78D8"/>
    <text x="160" y="98" font-family="'Century Gothic', sans-serif" font-size="12" font-weight="bold" fill="#B5A489" text-anchor="middle">END</text>
  \`),

  stem: frame(\`
    <path d="M120 140 Q118 70 120 40" fill="none" stroke="#3D9B52" stroke-width="8" stroke-linecap="round"/>
    <path d="M120 90 Q85 75 90 60 Q110 70 120 85 Z" fill="#58B96B" stroke="#237344" stroke-width="2.5"/>
    <path d="M120 70 Q155 55 150 40 Q130 50 120 65 Z" fill="#58B96B" stroke="#237344" stroke-width="2.5"/>
    <polygon points="95,140 145,140 140,165 100,165" fill="#D47343" stroke="#94451D" stroke-width="3"/>
  \`),

  mist: frame(\`
    <path d="M20 155 Q80 105 160 135 Q200 115 225 155 Z" fill="#72C78A" opacity=".7"/>
    <path d="M30 75 Q75 60 120 75 T210 75" fill="none" stroke="#CADBEA" stroke-width="7" stroke-linecap="round" opacity=".8"/>
    <path d="M45 100 Q95 85 145 100 T215 100" fill="none" stroke="#CADBEA" stroke-width="9" stroke-linecap="round" opacity=".85"/>
    <path d="M25 125 Q80 110 135 125 T220 125" fill="none" stroke="#CADBEA" stroke-width="8" stroke-linecap="round" opacity=".9"/>
  \`),

  mill: frame(\`
    <polygon points="95,155 145,155 135,80 105,80" fill="#E8D8C5" stroke="#7A6855" stroke-width="3"/>
    <polygon points="100,80 140,80 120,55" fill="#C25953" stroke="#872924" stroke-width="3"/>
    <rect x="112" y="125" width="16" height="30" fill="#654321"/>
    <line x1="85" y1="50" x2="155" y2="90" stroke="#5C4533" stroke-width="4" stroke-linecap="round"/>
    <line x1="85" y1="90" x2="155" y2="50" stroke="#5C4533" stroke-width="4" stroke-linecap="round"/>
    <circle cx="120" cy="70" r="5" fill="#3E2C1E"/>
  \`),

  tell: frame(\`
    <path d="M50 45 H175 Q195 45 195 65 V115 Q195 135 175 135 H95 L65 155 V135 H50 Q30 135 30 115 V65 Q30 45 50 45 Z" fill="#7548C7" stroke="#4A2F8A" stroke-width="4"/>
    <circle cx="80" cy="90" r="8" fill="#FFFFFF"/>
    <circle cx="115" cy="90" r="8" fill="#FFFFFF"/>
    <circle cx="150" cy="90" r="8" fill="#FFFFFF"/>
  \`),

  sell: frame(\`
    <path d="M40 50 L60 80 H180 L200 50 Z" fill="#E85A71" stroke="#B8263B" stroke-width="3"/>
    <path d="M70 50 L80 80 M110 50 L115 80 M150 50 L150 80 M180 50 L175 80" stroke="#FFFFFF" stroke-width="3"/>
    <rect x="55" y="80" width="130" height="65" fill="#D99B5B" stroke="#8A531E" stroke-width="3"/>
    <circle cx="85" cy="110" r="10" fill="#E24444"/>
    <circle cx="120" cy="110" r="10" fill="#F5A623"/>
    <circle cx="155" cy="110" r="10" fill="#20A464"/>
  \`),

  light: frame(\`
    <path d="M90 70 L150 70 L165 105 L75 105 Z" fill="#FFD000" stroke="#C98B00" stroke-width="3"/>
    <line x1="120" y1="105" x2="120" y2="145" stroke="#7A8B9E" stroke-width="6"/>
    <ellipse cx="120" cy="148" rx="30" ry="8" fill="#506173"/>
    <path d="M50 110 L30 120 M190 110 L210 120 M120 45 V25" stroke="#FFBF00" stroke-width="4" stroke-linecap="round"/>
  \`),

  bell: frame(\`
    <path d="M120 40 C95 40 85 75 80 115 L65 128 H175 L160 115 C155 75 145 40 120 40 Z" fill="#FFC72C" stroke="#B8860B" stroke-width="4"/>
    <circle cx="120" cy="138" r="12" fill="#DAA520" stroke="#996515" stroke-width="3"/>
    <path d="M110 38 Q120 22 130 38" fill="none" stroke="#B8860B" stroke-width="4"/>
    <path d="M50 95 Q40 110 50 125 M190 95 Q200 110 190 125" fill="none" stroke="#FFC72C" stroke-width="3.5" stroke-linecap="round"/>
  \`),

  bath: frame(\`
    <ellipse cx="120" cy="135" rx="85" ry="12" fill="#E2E8F0"/>
    <path d="M45 90 H195 C190 135 170 145 120 145 C70 145 50 135 45 90 Z" fill="#FFFFFF" stroke="#8CA0BA" stroke-width="4"/>
    <ellipse cx="120" cy="90" rx="75" ry="15" fill="#7DD3FC"/>
    <circle cx="85" cy="82" r="8" fill="#FFFFFF" opacity=".8"/>
    <circle cx="100" cy="80" r="6" fill="#FFFFFF" opacity=".8"/>
    <circle cx="145" cy="82" r="10" fill="#FFD000" stroke="#D99B00" stroke-width="2"/>
  \`),

  bark: frame(\`
    <ellipse cx="110" cy="115" rx="38" ry="30" fill="#D79E60" stroke="#8A5826" stroke-width="3.5"/>
    <circle cx="140" cy="90" r="22" fill="#D79E60" stroke="#8A5826" stroke-width="3.5"/>
    <ellipse cx="130" cy="72" rx="7" ry="14" fill="#8A5826"/>
    <circle cx="146" cy="88" r="4" fill="#2D2140"/>
    <ellipse cx="158" cy="94" rx="8" ry="6" fill="#2D2140"/>
    <path d="M148 98 Q155 106 148 110" fill="none" stroke="#8A5826" stroke-width="2.5"/>
    <path d="M175 80 Q190 90 180 100" fill="none" stroke="#7548C7" stroke-width="3" stroke-linecap="round"/>
    <path d="M185 70 Q205 90 190 110" fill="none" stroke="#7548C7" stroke-width="3" stroke-linecap="round"/>
  \`),

  road: frame(\`
    <polygon points="105,65 135,65 185,160 55,160" fill="#4B5563" stroke="#374151" stroke-width="3"/>
    <line x1="120" y1="70" x2="120" y2="85" stroke="#FBBF24" stroke-width="3"/>
    <line x1="120" y1="100" x2="120" y2="120" stroke="#FBBF24" stroke-width="4"/>
    <line x1="120" y1="135" x2="120" y2="155" stroke="#FBBF24" stroke-width="5"/>
    <path d="M20 160 Q80 80 120 65 Q160 80 220 160 Z" fill="#86EFAC" opacity=".5"/>
  \`),

  rain: frame(\`
    <ellipse cx="100" cy="75" rx="35" ry="25" fill="#93C5FD"/>
    <ellipse cx="140" cy="70" rx="30" ry="22" fill="#60A5FA"/>
    <ellipse cx="120" cy="85" rx="45" ry="22" fill="#3B82F6"/>
    <line x1="85" y1="115" x2="75" y2="135" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="110" y1="120" x2="100" y2="140" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="135" y1="115" x2="125" y2="135" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="160" y1="120" x2="150" y2="140" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
  \`),

  rock: frame(\`
    <polygon points="65,145 50,115 85,75 145,65 185,95 195,135 175,150 75,150" fill="#9CA3AF" stroke="#4B5563" stroke-width="4"/>
    <polyline points="85,75 110,95 145,90 185,95" fill="none" stroke="#6B7280" stroke-width="3"/>
    <polyline points="110,95 105,145" fill="none" stroke="#6B7280" stroke-width="2.5"/>
    <ellipse cx="125" cy="152" rx="70" ry="8" fill="#374151" opacity=".3"/>
  \`),

  round: frame(\`
    <circle cx="120" cy="90" r="48" fill="#F43F5E" stroke="#BE123C" stroke-width="4"/>
    <path d="M120 42 C145 60 145 120 120 138" fill="none" stroke="#FDE047" stroke-width="12"/>
    <path d="M85 55 C110 70 110 110 85 125" fill="none" stroke="#38BDF8" stroke-width="8"/>
    <ellipse cx="105" cy="65" r="10" fill="#FFFFFF" opacity=".4"/>
  \`),

  plant: frame(\`
    <path d="M120 110 Q80 80 85 50 Q105 65 120 90 Z" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
    <path d="M120 100 Q160 70 155 40 Q135 55 120 80 Z" fill="#22C55E" stroke="#15803D" stroke-width="3"/>
    <path d="M120 90 Q120 45 115 30 Q130 45 120 90 Z" fill="#86EFAC" stroke="#16A34A" stroke-width="2.5"/>
    <polygon points="90,110 150,110 142,155 98,155" fill="#38BDF8" stroke="#0284C7" stroke-width="3.5"/>
    <rect x="85" y="105" width="70" height="8" rx="3" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
  \`),

  green: frame(\`
    <path d="M65 135 C50 75 120 45 175 45 C175 100 145 150 65 135 Z" fill="#22C55E" stroke="#15803D" stroke-width="4"/>
    <line x1="65" y1="135" x2="165" y2="55" stroke="#15803D" stroke-width="3.5"/>
    <path d="M115 95 Q135 90 145 80 M95 110 Q115 115 130 120" stroke="#15803D" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="130" cy="70" r="5" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
  \`),

  black: frame(\`
    <rect x="75" y="55" width="90" height="95" rx="20" fill="#262626" stroke="#171717" stroke-width="4"/>
    <path d="M95 55 V40 C95 32 145 32 145 40 V55" fill="none" stroke="#525252" stroke-width="4"/>
    <rect x="88" y="95" width="64" height="42" rx="10" fill="#404040" stroke="#262626" stroke-width="3"/>
    <line x1="95" y1="108" x2="145" y2="108" stroke="#737373" stroke-width="2.5"/>
    <circle cx="120" cy="118" r="4" fill="#A3A3A3"/>
  \`),

  house: frame(\`
    <rect x="65" y="85" width="110" height="65" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="3.5"/>
    <polygon points="55,90 120,40 185,90" fill="#EF4444" stroke="#B91C1C" stroke-width="4"/>
    <rect x="150" y="45" width="14" height="25" fill="#991B1B"/>
    <rect x="105" y="105" width="30" height="45" rx="3" fill="#DC2626" stroke="#991B1B" stroke-width="2.5"/>
    <circle cx="128" cy="128" r="2.5" fill="#FDE047"/>
    <rect x="75" y="95" width="22" height="22" rx="2" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
    <circle cx="75" cy="148" r="5" fill="#EC4899"/>
    <circle cx="165" cy="148" r="5" fill="#F59E0B"/>
  \`),
`;

const lastClosingBrace = code.lastIndexOf('};');
if (lastClosingBrace !== -1) {
  code = code.slice(0, lastClosingBrace) + newIllustrationsCode + '\n};\n';
  fs.writeFileSync(target, code, 'utf8');
  console.log('Successfully added all 28 new illustrations to src/illustrations.js');
} else {
  console.error('Could not find closing brace in src/illustrations.js');
}
