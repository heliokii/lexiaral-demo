// Small, original offline illustrations for the demonstration pack.
// Replace these with reviewed ARAL flashcard illustrations before deployment.

const frame = (body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
  <rect width="240" height="180" rx="22" fill="#EFF7FF"/>
  ${body}
</svg>
`;

export const illustrations = {
  seed: frame(`
    <ellipse cx="120" cy="95" rx="38" ry="51"
      transform="rotate(28 120 95)"
      fill="#986035" stroke="#57351F" stroke-width="5"/>
    <path d="M106 56 Q139 94 115 131"
      fill="none" stroke="#D7B185" stroke-width="7"
      stroke-linecap="round"/>
  `),

  soil: frame(`
    <path d="M20 108 Q62 72 99 96 Q146 54 220 108
      L220 157 L20 157 Z"
      fill="#8A583A" stroke="#593821" stroke-width="4"/>
    <circle cx="58" cy="124" r="7" fill="#C89B6B"/>
    <circle cx="106" cy="138" r="6" fill="#50321F"/>
    <circle cx="156" cy="115" r="8" fill="#C89B6B"/>
    <circle cx="192" cy="139" r="6" fill="#50321F"/>
  `),

  water: frame(`
    <path d="M120 25 C106 51 72 87 72 115
      A48 48 0 0 0 168 115 C168 87 134 51 120 25 Z"
      fill="#3298E5" stroke="#155D96" stroke-width="5"/>
    <path d="M94 111 Q90 132 110 140"
      fill="none" stroke="#D8F2FF" stroke-width="8"
      stroke-linecap="round"/>
  `),

  sprout: frame(`
    <path d="M20 145 Q120 126 220 145 L220 170 L20 170 Z"
      fill="#8A583A"/>
    <path d="M120 145 L120 76"
      stroke="#237344" stroke-width="9" stroke-linecap="round"/>
    <path d="M119 105 Q57 102 62 55 Q114 52 119 105 Z"
      fill="#58B96B" stroke="#237344" stroke-width="4"/>
    <path d="M121 84 Q124 34 181 40 Q182 89 121 84 Z"
      fill="#76C85C" stroke="#237344" stroke-width="4"/>
  `),
};