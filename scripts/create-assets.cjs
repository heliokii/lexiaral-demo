/**
 * Original LEXIARAL vector artwork.
 *
 * Run:
 *   node scripts/create-assets.cjs
 *
 * Generated SVGs can also be opened in a browser, Figma, or Inkscape.
 * No external images or image servers are required.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'assets', 'generated');

fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(path.join(root, 'src'), { recursive: true });

function svg(body, viewBox = '0 0 300 300') {
  return `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="${viewBox}" fill="none">
    ${body}
  </svg>`;
}

function owl(mode = 'reading') {
  const cheering = mode === 'cheering';
  const thinking = mode === 'thinking';

  const eyes = thinking
    ? `
      <ellipse cx="116" cy="119" rx="12" ry="16" fill="#59402E"/>
      <ellipse cx="183" cy="119" rx="12" ry="16" fill="#59402E"/>
      <circle cx="112" cy="113" r="4" fill="white"/>
      <circle cx="179" cy="113" r="4" fill="white"/>
    `
    : `
      <path d="M102 123 Q115 100 128 123
        M169 123 Q182 100 195 123"
        stroke="#59402E" stroke-width="8" stroke-linecap="round"/>
    `;

  const wings = cheering
    ? `
      <path d="M76 150 Q35 146 35 115 Q47 111 57 128
        Q28 81 44 76 Q57 75 69 103 Q54 67 71 69
        Q91 91 99 143 Z"
        fill="#C89760" stroke="#936747" stroke-width="4"/>
      <path d="M218 150 Q257 143 267 107 Q256 100 244 122
        Q273 69 256 69 Q245 71 232 99 Q247 61 231 63
        Q211 82 201 143 Z"
        fill="#C89760" stroke="#936747" stroke-width="4"/>
    `
    : `
      <path d="M83 151 Q47 163 58 207 Q64 224 79 217
        L105 184 Z"
        fill="#C89760" stroke="#936747" stroke-width="4"/>
      <path d="M215 148 Q244 140 255 116 Q269 119 257 143
        Q276 131 277 143 Q267 168 244 180
        Q269 175 264 188 Q244 211 215 199 Z"
        fill="#C89760" stroke="#936747" stroke-width="4"/>
    `;

  const book = mode === 'reading'
    ? `
      <path d="M83 187 Q115 177 147 196 L147 258
        Q113 238 83 247 Z"
        fill="#83D6C5" stroke="#4B988D" stroke-width="4"/>
      <path d="M147 196 Q179 178 211 187 L211 247
        Q178 238 147 258 Z"
        fill="#5EBDAA" stroke="#4B988D" stroke-width="4"/>
      <path d="M147 198 L147 253" stroke="#F0FFF9" stroke-width="4"/>
      <path d="M96 199 Q113 195 130 203
        M96 210 Q111 205 129 214"
        stroke="#D8F5E8" stroke-width="3" stroke-linecap="round"/>
      <path d="M76 204 Q99 196 103 210 Q102 223 78 224"
        fill="#D4A977" stroke="#936747" stroke-width="4"/>
    `
    : `
      <path d="M126 231 Q149 239 172 231"
        stroke="#E1C595" stroke-width="4" stroke-linecap="round"/>
    `;

  return svg(`
    <ellipse cx="150" cy="278" rx="79" ry="10" fill="#A89CD3" opacity=".16"/>

    <path d="M118 259 L107 274 M118 263 L122 275
      M176 259 L166 275 M176 263 L185 274"
      stroke="#CC914E" stroke-width="8" stroke-linecap="round"/>

    ${wings}

    <path d="M76 105 L68 49 L111 69
      Q147 43 190 66 L220 40 L223 103
      Q240 126 233 170
      Q237 253 151 263
      Q67 259 67 177 Q60 135 76 105 Z"
      fill="#D4AE7C" stroke="#936747" stroke-width="4"/>

    <path d="M88 99 Q111 71 146 96
      Q182 70 209 99
      Q228 130 208 161
      Q183 183 148 174
      Q109 187 86 159
      Q67 131 88 99 Z"
      fill="#FFF1D0"/>

    <ellipse cx="149" cy="211" rx="57" ry="43" fill="#FFF1D0"/>

    <path d="M93 66 L101 53 M128 60 L137 46
      M172 58 L181 47"
      stroke="#936747" stroke-width="4" stroke-linecap="round"/>

    ${eyes}

    <ellipse cx="93" cy="140" rx="12" ry="7" fill="#EFABA2" opacity=".8"/>
    <ellipse cx="208" cy="140" rx="12" ry="7" fill="#EFABA2" opacity=".8"/>

    <path d="M139 132 Q149 124 159 132 L149 147 Z"
      fill="#E7A34F" stroke="#B97D37" stroke-width="3"/>

    ${cheering ? `
      <path d="M139 149 Q149 169 160 149"
        fill="#9B5B38" stroke="#9B5B38" stroke-width="3"/>
    ` : ''}

    <path d="M78 163 Q148 188 222 162 L210 189
      Q155 211 89 186 Z"
      fill="#9980E0" stroke="#7560B6" stroke-width="4"/>

    <path d="M93 185 L76 205 L103 201 L111 187"
      fill="#9980E0" stroke="#7560B6" stroke-width="3"/>

    <path d="M184 181
      C177 172 168 181 184 190
      C200 179 191 172 184 181 Z"
      fill="#F5D8E4"/>

    ${book}

    <path d="M44 71 L35 57 M54 65 L51 48 M32 81 L20 77"
      stroke="#F5CC65" stroke-width="6" stroke-linecap="round"/>

    ${thinking ? `
      <text x="238" y="65" fill="#A397BC"
        font-family="sans-serif" font-weight="bold" font-size="43">?</text>
    ` : ''}
  `);
}

const landscape = svg(`
  <defs>
    <linearGradient id="sky" x1="195" y1="0" x2="195" y2="844"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#DFEAFF"/>
      <stop offset=".48" stop-color="#F5F1FF"/>
      <stop offset="1" stop-color="#EBE3FC"/>
    </linearGradient>
  </defs>

  <rect width="390" height="844" fill="url(#sky)"/>

  <g fill="#FFFFFF" opacity=".55">
    <path d="M-20 90 Q-4 66 18 76 Q24 40 52 58
      Q70 59 77 84 Q104 80 111 100 H-20 Z"/>
    <path d="M257 62 Q270 35 292 48 Q307 16 330 42
      Q352 39 360 62 Q382 56 399 78 H257 Z"/>
    <path d="M105 173 Q114 153 133 158 Q143 133 165 151
      Q185 146 194 170 H105 Z"/>
    <path d="M228 583 Q242 552 262 571 Q287 553 301 585 H228 Z"/>
  </g>

  <g opacity=".7">
    <path d="M0 699 Q87 661 173 700 Q282 624 390 660
      V844 H0 Z" fill="#D2E9CE"/>
    <path d="M0 727 Q98 668 194 738 Q283 689 390 716
      V844 H0 Z" fill="#E8E1F7"/>
    <path d="M0 782 Q125 709 254 778 Q331 739 390 768
      V844 H0 Z" fill="#D8CFF0"/>
    <path d="M0 819 Q148 754 390 819 V844 H0 Z" fill="#C6B7E6"/>
    <path d="M275 678 Q238 699 220 718 Q297 704 323 739
      Q280 709 300 682 Z" fill="#FFF3D6"/>
  </g>

  <g transform="translate(298 622)">
    <path d="M0 35 L29 11 L58 35" fill="#F2AAB7"/>
    <path d="M7 33 H51 V70 H7 Z" fill="#FFF4DC"/>
    <path d="M21 45 Q29 35 37 45 V70 H21 Z" fill="#B7A3DA"/>
    <path d="M39 38 H47 V48 H39 Z" fill="#A3DAD5"/>
    <path d="M9 38 H17 V48 H9 Z" fill="#A3DAD5"/>
    <path d="M30 0 V17" stroke="#BBA9CF" stroke-width="3"/>
    <path d="M31 1 L47 7 L31 12" fill="#F5BCC8"/>
  </g>

  <g stroke="#7EBCAC" stroke-width="4" stroke-linecap="round">
    <path d="M27 806 L23 741 M365 803 L368 737"/>
  </g>

  <g fill="#9ED3BE">
    <ellipse cx="16" cy="765" rx="10" ry="28"
      transform="rotate(-29 16 765)"/>
    <ellipse cx="36" cy="770" rx="10" ry="31"
      transform="rotate(25 36 770)"/>
    <ellipse cx="357" cy="762" rx="10" ry="30"
      transform="rotate(-25 357 762)"/>
    <ellipse cx="379" cy="761" rx="10" ry="34"
      transform="rotate(20 379 761)"/>
  </g>

  <g fill="#DCC9EC">
    <ellipse cx="46" cy="800" rx="9" ry="23"
      transform="rotate(32 46 800)"/>
    <ellipse cx="345" cy="802" rx="9" ry="23"
      transform="rotate(-32 345 802)"/>
  </g>
`, '0 0 390 844');

const medal = svg(`
  <path d="M103 181 L83 275 L119 258 L143 280 L160 192"
    fill="#ED88A9"/>
  <path d="M154 193 L181 278 L199 252 L228 260 L204 176"
    fill="#F3A1BA"/>

  <path d="M150 31 L171 39 L193 38 L207 54 L228 63
    L232 86 L246 103 L240 126 L245 148 L231 167
    L226 190 L205 198 L190 217 L167 215 L146 226
    L126 214 L103 215 L88 197 L67 187 L65 165
    L51 146 L58 124 L54 101 L70 84 L74 62
    L97 55 L111 38 L134 41 Z"
    fill="#F8D567"/>

  <circle cx="150" cy="130" r="30" fill="#FFF1D0" opacity=".5"/>
`);

// Save all generated SVGs to the output directory.
const assets = { owl_reading: owl('reading'), owl_cheering: owl('cheering'), owl_thinking: owl('thinking'), landscape, medal };

for (const [name, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(output, `${name}.svg`), content);
}

// Also generate the JS mapping for the Art component.
const mapping = `export default ${JSON.stringify(assets, null, 2)};`;
fs.writeFileSync(path.join(root, 'src', 'assets.generated.js'), mapping);

console.log(`Successfully generated ${Object.keys(assets).length} assets in: ${output}`);
console.log(`Generated JS mapping in: ${path.join(root, 'src', 'assets.generated.js')}`);
