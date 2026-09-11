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
};