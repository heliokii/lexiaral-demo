// Official offline illustrations for Grade 3 ARAL English target vocabulary.

const frame = (body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
  <rect width="240" height="180" rx="22" fill="#EFF7FF"/>
  ${body}
</svg>
`;

export const illustrations = {
  // 20 Official Grade 3 ARAL Target Words
  cat: frame(`
    <ellipse cx="120" cy="105" rx="46" ry="40" fill="#FFAB66" stroke="#D3681E" stroke-width="4"/>
    <polygon points="84,78 96,40 114,68" fill="#FFAB66" stroke="#D3681E" stroke-width="4"/>
    <polygon points="90,74 98,48 110,68" fill="#FFA0B0"/>
    <polygon points="156,78 144,40 126,68" fill="#FFAB66" stroke="#D3681E" stroke-width="4"/>
    <polygon points="150,74 142,48 130,68" fill="#FFA0B0"/>
    <circle cx="102" cy="102" r="6" fill="#2D2140"/>
    <circle cx="138" cy="102" r="6" fill="#2D2140"/>
    <polygon points="120,112 114,106 126,106" fill="#FF6B8B"/>
    <path d="M112 116 Q120 124 128 116" fill="none" stroke="#2D2140" stroke-width="3" stroke-linecap="round"/>
    <line x1="80" y1="108" x2="60" y2="104" stroke="#2D2140" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="80" y1="114" x2="58" y2="116" stroke="#2D2140" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="160" y1="108" x2="180" y2="104" stroke="#2D2140" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="160" y1="114" x2="182" y2="116" stroke="#2D2140" stroke-width="2.5" stroke-linecap="round"/>
  `),

  mat: frame(`
    <rect x="35" y="55" width="170" height="70" rx="8" fill="#58B2DC" stroke="#247299" stroke-width="4"/>
    <line x1="35" y1="78" x2="205" y2="78" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="35" y1="102" x2="205" y2="102" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="25" y1="58" x2="35" y2="58" stroke="#E39F47" stroke-width="3"/>
    <line x1="25" y1="72" x2="35" y2="72" stroke="#E39F47" stroke-width="3"/>
    <line x1="25" y1="88" x2="35" y2="88" stroke="#E39F47" stroke-width="3"/>
    <line x1="25" y1="105" x2="35" y2="105" stroke="#E39F47" stroke-width="3"/>
    <line x1="25" y1="120" x2="35" y2="120" stroke="#E39F47" stroke-width="3"/>
    <line x1="205" y1="58" x2="215" y2="58" stroke="#E39F47" stroke-width="3"/>
    <line x1="205" y1="72" x2="215" y2="72" stroke="#E39F47" stroke-width="3"/>
    <line x1="205" y1="88" x2="215" y2="88" stroke="#E39F47" stroke-width="3"/>
    <line x1="205" y1="105" x2="215" y2="105" stroke="#E39F47" stroke-width="3"/>
    <line x1="205" y1="120" x2="215" y2="120" stroke="#E39F47" stroke-width="3"/>
  `),

  hat: frame(`
    <ellipse cx="120" cy="125" rx="75" ry="18" fill="#E24444" stroke="#9E1B1B" stroke-width="4"/>
    <path d="M72 120 C72 65 168 65 168 120 Z" fill="#E24444" stroke="#9E1B1B" stroke-width="4"/>
    <path d="M72 110 C90 100 150 100 168 110 L168 120 C150 110 90 110 72 120 Z" fill="#3178C6"/>
  `),

  rat: frame(`
    <ellipse cx="120" cy="105" rx="42" ry="32" fill="#A8B2C1" stroke="#636E7B" stroke-width="4"/>
    <circle cx="92" cy="76" r="14" fill="#A8B2C1" stroke="#636E7B" stroke-width="3"/>
    <circle cx="92" cy="76" r="8" fill="#FFA0B0"/>
    <circle cx="106" cy="100" r="5" fill="#2D2140"/>
    <circle cx="78" cy="108" r="5" fill="#FFA0B0"/>
    <path d="M162 105 Q195 105 190 75 Q185 50 195 45" fill="none" stroke="#FFA0B0" stroke-width="4" stroke-linecap="round"/>
    <line x1="78" y1="112" x2="52" y2="110" stroke="#636E7B" stroke-width="2.5"/>
    <line x1="78" y1="116" x2="55" y2="120" stroke="#636E7B" stroke-width="2.5"/>
  `),

  bat: frame(`
    <circle cx="175" cy="55" r="22" fill="#FFDF78"/>
    <path d="M120 95 C95 65 45 65 35 90 C55 105 75 95 95 110 C105 105 115 105 120 95 Z" fill="#694C9E" stroke="#452C70" stroke-width="3"/>
    <path d="M120 95 C145 65 195 65 205 90 C185 105 165 95 145 110 C135 105 125 105 120 95 Z" fill="#694C9E" stroke="#452C70" stroke-width="3"/>
    <ellipse cx="120" cy="100" rx="18" ry="24" fill="#452C70"/>
    <polygon points="110,80 114,68 118,80" fill="#452C70"/>
    <polygon points="122,80 126,68 130,80" fill="#452C70"/>
    <circle cx="114" cy="94" r="3" fill="#FFFFFF"/>
    <circle cx="126" cy="94" r="3" fill="#FFFFFF"/>
  `),

  pet: frame(`
    <ellipse cx="120" cy="95" rx="42" ry="38" fill="#D79E60" stroke="#8A5826" stroke-width="4"/>
    <ellipse cx="78" cy="85" rx="14" ry="24" transform="rotate(-15 78 85)" fill="#8A5826"/>
    <ellipse cx="162" cy="85" rx="14" ry="24" transform="rotate(15 162 85)" fill="#8A5826"/>
    <circle cx="106" cy="92" r="5" fill="#2D2140"/>
    <circle cx="134" cy="92" r="5" fill="#2D2140"/>
    <ellipse cx="120" cy="104" rx="8" ry="6" fill="#2D2140"/>
    <rect x="94" y="126" width="52" height="12" rx="6" fill="#E24444"/>
    <path d="M120 138 L124 144 L120 148 L116 144 Z" fill="#FFDF78" stroke="#8A5826" stroke-width="2"/>
  `),

  happy: frame(`
    <circle cx="120" cy="90" r="48" fill="#FFDF4D" stroke="#D19C00" stroke-width="4"/>
    <circle cx="104" cy="80" r="6" fill="#3D2900"/>
    <circle cx="136" cy="80" r="6" fill="#3D2900"/>
    <ellipse cx="94" cy="96" rx="8" ry="5" fill="#FFA5A5"/>
    <ellipse cx="146" cy="96" rx="8" ry="5" fill="#FFA5A5"/>
    <path d="M102 96 Q120 122 138 96 Z" fill="#E03E3E" stroke="#8A1818" stroke-width="2"/>
  `),

  sun: frame(`
    <circle cx="120" cy="90" r="36" fill="#FFD000" stroke="#D99B00" stroke-width="4"/>
    <line x1="120" y1="35" x2="120" y2="20" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="120" y1="145" x2="120" y2="160" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="65" y1="90" x2="50" y2="90" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="175" y1="90" x2="190" y2="90" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="81" y1="51" x2="70" y2="40" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="159" y1="129" x2="170" y2="140" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="81" y1="129" x2="70" y2="140" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <line x1="159" y1="51" x2="170" y2="40" stroke="#FF9D00" stroke-width="5" stroke-linecap="round"/>
    <circle cx="108" cy="84" r="4" fill="#543A00"/>
    <circle cx="132" cy="84" r="4" fill="#543A00"/>
    <path d="M110 96 Q120 106 130 96" fill="none" stroke="#543A00" stroke-width="3" stroke-linecap="round"/>
  `),

  sit: frame(`
    <rect x="75" y="45" width="14" height="60" rx="3" fill="#8C532B"/>
    <rect x="70" y="85" width="70" height="12" rx="4" fill="#B87333" stroke="#633818" stroke-width="3"/>
    <line x1="82" y1="97" x2="82" y2="145" stroke="#633818" stroke-width="6" stroke-linecap="round"/>
    <line x1="130" y1="97" x2="130" y2="145" stroke="#633818" stroke-width="6" stroke-linecap="round"/>
    <line x1="75" y1="45" x2="75" y2="145" stroke="#633818" stroke-width="6" stroke-linecap="round"/>
    <line x1="75" y1="55" x2="105" y2="55" stroke="#B87333" stroke-width="6" stroke-linecap="round"/>
  `),

  set: frame(`
    <ellipse cx="120" cy="115" rx="75" ry="24" fill="#D29A66" stroke="#7A4E27" stroke-width="4"/>
    <line x1="65" y1="120" x2="65" y2="155" stroke="#7A4E27" stroke-width="6" stroke-linecap="round"/>
    <line x1="175" y1="120" x2="175" y2="155" stroke="#7A4E27" stroke-width="6" stroke-linecap="round"/>
    <rect x="90" y="85" width="60" height="22" rx="4" fill="#3D74B8" stroke="#1F477A" stroke-width="3"/>
    <line x1="120" y1="85" x2="120" y2="107" stroke="#FFFFFF" stroke-width="2"/>
  `),

  lit: frame(`
    <circle cx="120" cy="70" r="42" fill="#FFF2AC" opacity="0.6"/>
    <polygon points="90,75 150,75 138,40 102,40" fill="#FF8264" stroke="#B84228" stroke-width="3"/>
    <rect x="116" y="75" width="8" height="48" fill="#8898AA"/>
    <ellipse cx="120" cy="125" rx="28" ry="10" fill="#607185"/>
    <circle cx="120" cy="75" r="7" fill="#FFF280"/>
  `),

  little: frame(`
    <circle cx="120" cy="90" r="28" fill="#FFDB4D" stroke="#C79800" stroke-width="3"/>
    <polygon points="144,90 156,94 144,98" fill="#E65100"/>
    <circle cx="132" cy="84" r="4" fill="#2A1E00"/>
    <ellipse cx="106" cy="96" rx="14" ry="10" fill="#FFC926"/>
    <line x1="112" y1="118" x2="112" y2="132" stroke="#E65100" stroke-width="3"/>
    <line x1="124" y1="118" x2="124" y2="132" stroke="#E65100" stroke-width="3"/>
    <path d="M60 132 C95 125 150 135 185 130" stroke="#704824" stroke-width="6" stroke-linecap="round"/>
    <circle cx="80" cy="126" r="6" fill="#58A842"/>
  `),

  top: frame(`
    <rect x="70" y="80" width="100" height="65" rx="6" fill="#E05B5B" stroke="#9E2B2B" stroke-width="4"/>
    <line x1="70" y1="95" x2="170" y2="95" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 5"/>
    <path d="M98 78 L104 62 L136 62 L142 78 Z" fill="#3D85C6" stroke="#1C5285" stroke-width="3"/>
    <circle cx="108" cy="78" r="7" fill="#2B2B2B"/>
    <circle cx="132" cy="78" r="7" fill="#2B2B2B"/>
    <polygon points="120,44 114,54 126,54" fill="#FFD000"/>
    <line x1="120" y1="35" x2="120" y2="48" stroke="#FFD000" stroke-width="4"/>
  `),

  map: frame(`
    <polygon points="50,45 95,35 145,45 190,35 190,135 145,145 95,135 50,145" fill="#EBF4DF" stroke="#7D995B" stroke-width="4"/>
    <line x1="95" y1="35" x2="95" y2="135" stroke="#A7C286" stroke-width="3" stroke-dasharray="4 3"/>
    <line x1="145" y1="45" x2="145" y2="145" stroke="#A7C286" stroke-width="3" stroke-dasharray="4 3"/>
    <path d="M65 110 Q105 85 130 110 T175 75" fill="none" stroke="#D64545" stroke-width="4" stroke-dasharray="5 3"/>
    <circle cx="175" cy="75" r="5" fill="#D64545"/>
  `),

  man: frame(`
    <circle cx="120" cy="75" r="32" fill="#FAD1A0" stroke="#BD8950" stroke-width="3"/>
    <path d="M88 70 C88 45 152 45 152 70 C140 55 100 55 88 70 Z" fill="#543A22"/>
    <circle cx="108" cy="75" r="4" fill="#2B2014"/>
    <circle cx="132" cy="75" r="4" fill="#2B2014"/>
    <path d="M112 88 Q120 96 128 88" fill="none" stroke="#2B2014" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M75 145 C75 112 165 112 165 145 Z" fill="#208B8B" stroke="#125959" stroke-width="3"/>
  `),

  dog: frame(`
    <ellipse cx="120" cy="95" rx="44" ry="40" fill="#B3733B" stroke="#6E3E15" stroke-width="4"/>
    <ellipse cx="74" cy="90" rx="14" ry="26" transform="rotate(-15 74 90)" fill="#6E3E15"/>
    <ellipse cx="166" cy="90" rx="14" ry="26" transform="rotate(15 166 90)" fill="#6E3E15"/>
    <circle cx="104" cy="90" r="6" fill="#1C1005"/>
    <circle cx="136" cy="90" r="6" fill="#1C1005"/>
    <ellipse cx="120" cy="106" rx="10" ry="7" fill="#1C1005"/>
    <path d="M116 114 Q120 124 124 114" fill="none" stroke="#1C1005" stroke-width="2.5"/>
    <path d="M118 116 Q122 130 126 116" fill="#FF788D"/>
  `),

  den: frame(`
    <polygon points="120,40 60,85 180,85" fill="#D9534F" stroke="#8C2522" stroke-width="4"/>
    <rect x="70" y="85" width="100" height="60" fill="#E6B87D" stroke="#8C5E29" stroke-width="4"/>
    <path d="M102 145 C102 110 138 110 138 145 Z" fill="#3D2914"/>
  `),

  dig: frame(`
    <ellipse cx="120" cy="130" rx="70" ry="24" fill="#8C5C36" stroke="#4F2E14" stroke-width="4"/>
    <path d="M130 75 L165 40" stroke="#A8B4C0" stroke-width="7" stroke-linecap="round"/>
    <polygon points="110,95 135,70 148,82 122,108" fill="#E04F4F" stroke="#942424" stroke-width="3"/>
    <circle cx="85" cy="120" r="5" fill="#4F2E14"/>
    <circle cx="145" cy="125" r="4" fill="#4F2E14"/>
    <circle cx="105" cy="135" r="6" fill="#4F2E14"/>
  `),

  egg: frame(`
    <ellipse cx="120" cy="135" rx="60" ry="22" fill="#D49D65" stroke="#7A4E21" stroke-width="4"/>
    <ellipse cx="120" cy="85" rx="32" ry="44" fill="#FFF8EE" stroke="#D1BEA5" stroke-width="3"/>
    <circle cx="110" cy="80" r="2.5" fill="#C4B097"/>
    <circle cx="128" cy="95" r="2" fill="#C4B097"/>
    <circle cx="116" cy="105" r="2" fill="#C4B097"/>
  `),

  hill: frame(`
    <path d="M10 155 Q80 75 170 115 Q210 95 230 155 Z" fill="#58B84B" stroke="#2D6E24" stroke-width="4"/>
    <path d="M60 155 Q110 100 160 155" fill="none" stroke="#D9BA6A" stroke-width="8" stroke-linecap="round"/>
    <circle cx="90" cy="80" r="5" fill="#FF5E7E"/>
    <circle cx="180" cy="110" r="5" fill="#FFDE59"/>
  `),

  // Preserved original demo items
  seed: frame(`
    <ellipse cx="120" cy="95" rx="38" ry="51" transform="rotate(28 120 95)" fill="#986035" stroke="#57351F" stroke-width="5"/>
    <path d="M106 56 Q139 94 115 131" fill="none" stroke="#D7B185" stroke-width="7" stroke-linecap="round"/>
  `),

  soil: frame(`
    <path d="M20 108 Q62 72 99 96 Q146 54 220 108 L220 157 L20 157 Z" fill="#8A583A" stroke="#593821" stroke-width="4"/>
    <circle cx="58" cy="124" r="7" fill="#C89B6B"/>
    <circle cx="106" cy="138" r="6" fill="#50321F"/>
    <circle cx="156" cy="115" r="8" fill="#C89B6B"/>
    <circle cx="192" cy="139" r="6" fill="#50321F"/>
  `),

  water: frame(`
    <path d="M120 25 C106 51 72 87 72 115 A48 48 0 0 0 168 115 C168 87 134 51 120 25 Z" fill="#3298E5" stroke="#155D96" stroke-width="5"/>
    <path d="M94 111 Q90 132 110 140" fill="none" stroke="#D8F2FF" stroke-width="8" stroke-linecap="round"/>
  `),

  sprout: frame(`
    <path d="M20 145 Q120 126 220 145 L220 170 L20 170 Z" fill="#8A583A"/>
    <path d="M120 145 L120 76" stroke="#237344" stroke-width="9" stroke-linecap="round"/>
    <path d="M119 105 Q57 102 62 55 Q114 52 119 105 Z" fill="#58B96B" stroke="#237344" stroke-width="4"/>
    <path d="M121 84 Q124 34 181 40 Q182 89 121 84 Z" fill="#76C85C" stroke="#237344" stroke-width="4"/>
  `),

  // --- 28 Additional Grade 3 ARAL Target Words ---
  pink: frame(`
    <path d="M70 140 Q120 40 170 140 Z" fill="#FFAEC9" stroke="#E66A90" stroke-width="4"/>
    <path d="M90 140 L120 60 L150 140" stroke="#FFFFFF" stroke-width="2.5"/>
    <circle cx="120" cy="140" r="10" fill="#E66A90"/>
    <circle cx="120" cy="140" r="4" fill="#FFFFFF"/>
  `),

  fast: frame(`
    <path d="M40 120 L65 85 L145 85 L190 110 L195 130 L35 130 Z" fill="#E84A5F" stroke="#B8263B" stroke-width="4"/>
    <polygon points="75,90 135,90 130,110 65,110" fill="#8CE8FF"/>
    <circle cx="70" cy="135" r="16" fill="#2D2140" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="160" cy="135" r="16" fill="#2D2140" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="20" y1="95" x2="45" y2="95" stroke="#FFB830" stroke-width="4" stroke-linecap="round"/>
    <line x1="15" y1="110" x2="35" y2="110" stroke="#FFB830" stroke-width="4" stroke-linecap="round"/>
  `),

  frog: frame(`
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
  `),

  stop: frame(`
    <line x1="120" y1="120" x2="120" y2="170" stroke="#909DAE" stroke-width="10" stroke-linecap="round"/>
    <polygon points="90,40 150,40 185,75 185,125 150,160 90,160 55,125 55,75" fill="#E83A3A" stroke="#FFFFFF" stroke-width="5"/>
    <text x="120" y="112" font-family="'Century Gothic', Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">STOP</text>
  `),

  back: frame(`
    <path d="M140 50 L80 95 L140 140" stroke="#7548C7" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M85 95 H180" stroke="#7548C7" stroke-width="12" stroke-linecap="round"/>
    <circle cx="70" cy="95" r="10" fill="#FFAEC9"/>
  `),

  nine: frame(`
    <text x="120" y="130" font-family="'Century Gothic', sans-serif" font-size="105" font-weight="bold" fill="#7E57C2" text-anchor="middle">9</text>
    <circle cx="120" cy="65" r="22" fill="none" stroke="#FFAEC9" stroke-width="6"/>
    <rect x="35" y="140" width="170" height="8" rx="4" fill="#E2D5F5"/>
  `),

  nuts: frame(`
    <ellipse cx="95" cy="115" rx="28" ry="34" fill="#B5733A" stroke="#704118" stroke-width="4"/>
    <path d="M65 95 Q95 70 125 95 Z" fill="#6E3E16" stroke="#48270B" stroke-width="3"/>
    <line x1="95" y1="78" x2="95" y2="65" stroke="#48270B" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="145" cy="125" rx="24" ry="28" fill="#D28F50" stroke="#704118" stroke-width="3.5"/>
    <path d="M120 108 Q145 88 170 108 Z" fill="#6E3E16" stroke="#48270B" stroke-width="3"/>
  `),

  floor: frame(`
    <rect x="25" y="45" width="190" height="95" rx="10" fill="#EEDAC0" stroke="#B8966E" stroke-width="4"/>
    <line x1="25" y1="80" x2="215" y2="80" stroke="#CBB08C" stroke-width="3"/>
    <line x1="25" y1="110" x2="215" y2="110" stroke="#CBB08C" stroke-width="3"/>
    <line x1="100" y1="45" x2="100" y2="80" stroke="#CBB08C" stroke-width="2.5"/>
    <line x1="150" y1="80" x2="150" y2="110" stroke="#CBB08C" stroke-width="2.5"/>
    <line x1="80" y1="110" x2="80" y2="140" stroke="#CBB08C" stroke-width="2.5"/>
    <rect x="105" y="90" width="45" height="32" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/>
  `),

  spins: frame(`
    <circle cx="120" cy="85" r="48" fill="#E8F4FC" stroke="#4DA7E8" stroke-width="4"/>
    <circle cx="120" cy="85" r="10" fill="#2478B8"/>
    <path d="M120 75 Q145 45 125 40 Q110 55 120 75 Z" fill="#60BAF8"/>
    <path d="M130 85 Q160 110 155 125 Q140 110 130 85 Z" fill="#60BAF8"/>
    <path d="M110 85 Q80 60 85 45 Q100 60 110 85 Z" fill="#60BAF8"/>
    <rect x="115" y="133" width="10" height="24" fill="#889BB0"/>
    <ellipse cx="120" cy="158" rx="35" ry="8" fill="#64788C"/>
    <path d="M175 70 Q195 80 185 95" fill="none" stroke="#90CDF4" stroke-width="3" stroke-linecap="round"/>
  `),

  test: frame(`
    <rect x="65" y="25" width="110" height="135" rx="8" fill="#FFFFFF" stroke="#BAC7D5" stroke-width="3"/>
    <line x1="80" y1="50" x2="150" y2="50" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <line x1="80" y1="70" x2="150" y2="70" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <line x1="80" y1="90" x2="150" y2="90" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    <polyline points="80,115 88,122 100,108" fill="none" stroke="#20A464" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="145" cy="115" r="18" fill="#FFEFEF" stroke="#E84A5F" stroke-width="2"/>
    <text x="145" y="122" font-family="'Century Gothic', sans-serif" font-size="16" font-weight="bold" fill="#E84A5F" text-anchor="middle">A+</text>
  `),

  last: frame(`
    <path d="M45 130 C75 125 110 128 120 135 C130 128 165 125 195 130 L195 60 C165 55 130 58 120 65 C110 58 75 55 45 60 Z" fill="#FFFDF8" stroke="#7A6855" stroke-width="3"/>
    <path d="M120 65 L120 135" stroke="#7A6855" stroke-width="3"/>
    <path d="M120 65 Q135 90 140 145 L130 140 L120 145 Z" fill="#8F78D8"/>
    <text x="160" y="98" font-family="'Century Gothic', sans-serif" font-size="12" font-weight="bold" fill="#B5A489" text-anchor="middle">END</text>
  `),

  stem: frame(`
    <path d="M120 140 Q118 70 120 40" fill="none" stroke="#3D9B52" stroke-width="8" stroke-linecap="round"/>
    <path d="M120 90 Q85 75 90 60 Q110 70 120 85 Z" fill="#58B96B" stroke="#237344" stroke-width="2.5"/>
    <path d="M120 70 Q155 55 150 40 Q130 50 120 65 Z" fill="#58B96B" stroke="#237344" stroke-width="2.5"/>
    <polygon points="95,140 145,140 140,165 100,165" fill="#D47343" stroke="#94451D" stroke-width="3"/>
  `),

  mist: frame(`
    <path d="M20 155 Q80 105 160 135 Q200 115 225 155 Z" fill="#72C78A" opacity=".7"/>
    <path d="M30 75 Q75 60 120 75 T210 75" fill="none" stroke="#CADBEA" stroke-width="7" stroke-linecap="round" opacity=".8"/>
    <path d="M45 100 Q95 85 145 100 T215 100" fill="none" stroke="#CADBEA" stroke-width="9" stroke-linecap="round" opacity=".85"/>
    <path d="M25 125 Q80 110 135 125 T220 125" fill="none" stroke="#CADBEA" stroke-width="8" stroke-linecap="round" opacity=".9"/>
  `),

  mill: frame(`
    <polygon points="95,155 145,155 135,80 105,80" fill="#E8D8C5" stroke="#7A6855" stroke-width="3"/>
    <polygon points="100,80 140,80 120,55" fill="#C25953" stroke="#872924" stroke-width="3"/>
    <rect x="112" y="125" width="16" height="30" fill="#654321"/>
    <line x1="85" y1="50" x2="155" y2="90" stroke="#5C4533" stroke-width="4" stroke-linecap="round"/>
    <line x1="85" y1="90" x2="155" y2="50" stroke="#5C4533" stroke-width="4" stroke-linecap="round"/>
    <circle cx="120" cy="70" r="5" fill="#3E2C1E"/>
  `),

  tell: frame(`
    <path d="M50 45 H175 Q195 45 195 65 V115 Q195 135 175 135 H95 L65 155 V135 H50 Q30 135 30 115 V65 Q30 45 50 45 Z" fill="#7548C7" stroke="#4A2F8A" stroke-width="4"/>
    <circle cx="80" cy="90" r="8" fill="#FFFFFF"/>
    <circle cx="115" cy="90" r="8" fill="#FFFFFF"/>
    <circle cx="150" cy="90" r="8" fill="#FFFFFF"/>
  `),

  sell: frame(`
    <path d="M40 50 L60 80 H180 L200 50 Z" fill="#E85A71" stroke="#B8263B" stroke-width="3"/>
    <path d="M70 50 L80 80 M110 50 L115 80 M150 50 L150 80 M180 50 L175 80" stroke="#FFFFFF" stroke-width="3"/>
    <rect x="55" y="80" width="130" height="65" fill="#D99B5B" stroke="#8A531E" stroke-width="3"/>
    <circle cx="85" cy="110" r="10" fill="#E24444"/>
    <circle cx="120" cy="110" r="10" fill="#F5A623"/>
    <circle cx="155" cy="110" r="10" fill="#20A464"/>
  `),

  light: frame(`
    <path d="M90 70 L150 70 L165 105 L75 105 Z" fill="#FFD000" stroke="#C98B00" stroke-width="3"/>
    <line x1="120" y1="105" x2="120" y2="145" stroke="#7A8B9E" stroke-width="6"/>
    <ellipse cx="120" cy="148" rx="30" ry="8" fill="#506173"/>
    <path d="M50 110 L30 120 M190 110 L210 120 M120 45 V25" stroke="#FFBF00" stroke-width="4" stroke-linecap="round"/>
  `),

  bell: frame(`
    <path d="M120 40 C95 40 85 75 80 115 L65 128 H175 L160 115 C155 75 145 40 120 40 Z" fill="#FFC72C" stroke="#B8860B" stroke-width="4"/>
    <circle cx="120" cy="138" r="12" fill="#DAA520" stroke="#996515" stroke-width="3"/>
    <path d="M110 38 Q120 22 130 38" fill="none" stroke="#B8860B" stroke-width="4"/>
    <path d="M50 95 Q40 110 50 125 M190 95 Q200 110 190 125" fill="none" stroke="#FFC72C" stroke-width="3.5" stroke-linecap="round"/>
  `),

  bath: frame(`
    <ellipse cx="120" cy="135" rx="85" ry="12" fill="#E2E8F0"/>
    <path d="M45 90 H195 C190 135 170 145 120 145 C70 145 50 135 45 90 Z" fill="#FFFFFF" stroke="#8CA0BA" stroke-width="4"/>
    <ellipse cx="120" cy="90" rx="75" ry="15" fill="#7DD3FC"/>
    <circle cx="85" cy="82" r="8" fill="#FFFFFF" opacity=".8"/>
    <circle cx="100" cy="80" r="6" fill="#FFFFFF" opacity=".8"/>
    <circle cx="145" cy="82" r="10" fill="#FFD000" stroke="#D99B00" stroke-width="2"/>
  `),

  bark: frame(`
    <ellipse cx="110" cy="115" rx="38" ry="30" fill="#D79E60" stroke="#8A5826" stroke-width="3.5"/>
    <circle cx="140" cy="90" r="22" fill="#D79E60" stroke="#8A5826" stroke-width="3.5"/>
    <ellipse cx="130" cy="72" rx="7" ry="14" fill="#8A5826"/>
    <circle cx="146" cy="88" r="4" fill="#2D2140"/>
    <ellipse cx="158" cy="94" rx="8" ry="6" fill="#2D2140"/>
    <path d="M148 98 Q155 106 148 110" fill="none" stroke="#8A5826" stroke-width="2.5"/>
    <path d="M175 80 Q190 90 180 100" fill="none" stroke="#7548C7" stroke-width="3" stroke-linecap="round"/>
    <path d="M185 70 Q205 90 190 110" fill="none" stroke="#7548C7" stroke-width="3" stroke-linecap="round"/>
  `),

  road: frame(`
    <polygon points="105,65 135,65 185,160 55,160" fill="#4B5563" stroke="#374151" stroke-width="3"/>
    <line x1="120" y1="70" x2="120" y2="85" stroke="#FBBF24" stroke-width="3"/>
    <line x1="120" y1="100" x2="120" y2="120" stroke="#FBBF24" stroke-width="4"/>
    <line x1="120" y1="135" x2="120" y2="155" stroke="#FBBF24" stroke-width="5"/>
    <path d="M20 160 Q80 80 120 65 Q160 80 220 160 Z" fill="#86EFAC" opacity=".5"/>
  `),

  rain: frame(`
    <ellipse cx="100" cy="75" rx="35" ry="25" fill="#93C5FD"/>
    <ellipse cx="140" cy="70" rx="30" ry="22" fill="#60A5FA"/>
    <ellipse cx="120" cy="85" rx="45" ry="22" fill="#3B82F6"/>
    <line x1="85" y1="115" x2="75" y2="135" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="110" y1="120" x2="100" y2="140" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="135" y1="115" x2="125" y2="135" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="160" y1="120" x2="150" y2="140" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"/>
  `),

  rock: frame(`
    <polygon points="65,145 50,115 85,75 145,65 185,95 195,135 175,150 75,150" fill="#9CA3AF" stroke="#4B5563" stroke-width="4"/>
    <polyline points="85,75 110,95 145,90 185,95" fill="none" stroke="#6B7280" stroke-width="3"/>
    <polyline points="110,95 105,145" fill="none" stroke="#6B7280" stroke-width="2.5"/>
    <ellipse cx="125" cy="152" rx="70" ry="8" fill="#374151" opacity=".3"/>
  `),

  round: frame(`
    <circle cx="120" cy="90" r="48" fill="#F43F5E" stroke="#BE123C" stroke-width="4"/>
    <path d="M120 42 C145 60 145 120 120 138" fill="none" stroke="#FDE047" stroke-width="12"/>
    <path d="M85 55 C110 70 110 110 85 125" fill="none" stroke="#38BDF8" stroke-width="8"/>
    <ellipse cx="105" cy="65" r="10" fill="#FFFFFF" opacity=".4"/>
  `),

  plant: frame(`
    <path d="M120 110 Q80 80 85 50 Q105 65 120 90 Z" fill="#4ADE80" stroke="#16A34A" stroke-width="3"/>
    <path d="M120 100 Q160 70 155 40 Q135 55 120 80 Z" fill="#22C55E" stroke="#15803D" stroke-width="3"/>
    <path d="M120 90 Q120 45 115 30 Q130 45 120 90 Z" fill="#86EFAC" stroke="#16A34A" stroke-width="2.5"/>
    <polygon points="90,110 150,110 142,155 98,155" fill="#38BDF8" stroke="#0284C7" stroke-width="3.5"/>
    <rect x="85" y="105" width="70" height="8" rx="3" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
  `),

  green: frame(`
    <path d="M65 135 C50 75 120 45 175 45 C175 100 145 150 65 135 Z" fill="#22C55E" stroke="#15803D" stroke-width="4"/>
    <line x1="65" y1="135" x2="165" y2="55" stroke="#15803D" stroke-width="3.5"/>
    <path d="M115 95 Q135 90 145 80 M95 110 Q115 115 130 120" stroke="#15803D" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="130" cy="70" r="5" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
  `),

  black: frame(`
    <rect x="75" y="55" width="90" height="95" rx="20" fill="#262626" stroke="#171717" stroke-width="4"/>
    <path d="M95 55 V40 C95 32 145 32 145 40 V55" fill="none" stroke="#525252" stroke-width="4"/>
    <rect x="88" y="95" width="64" height="42" rx="10" fill="#404040" stroke="#262626" stroke-width="3"/>
    <line x1="95" y1="108" x2="145" y2="108" stroke="#737373" stroke-width="2.5"/>
    <circle cx="120" cy="118" r="4" fill="#A3A3A3"/>
  `),

  house: frame(`
    <rect x="65" y="85" width="110" height="65" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="3.5"/>
    <polygon points="55,90 120,40 185,90" fill="#EF4444" stroke="#B91C1C" stroke-width="4"/>
    <rect x="150" y="45" width="14" height="25" fill="#991B1B"/>
    <rect x="105" y="105" width="30" height="45" rx="3" fill="#DC2626" stroke="#991B1B" stroke-width="2.5"/>
    <circle cx="128" cy="128" r="2.5" fill="#FDE047"/>
    <rect x="75" y="95" width="22" height="22" rx="2" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
    <circle cx="75" cy="148" r="5" fill="#EC4899"/>
    <circle cx="165" cy="148" r="5" fill="#F59E0B"/>
  `),

};
