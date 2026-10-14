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

// Four-point twinkle star centred on (cx, cy).
function star(cx, cy, r, fill = '#F7CD5D') {
  return `<path d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy}
    Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy}
    Q${cx} ${cy} ${cx} ${cy - r} Z" fill="${fill}"/>`;
}

const OWL = {
  feather: '#B98A5E',
  wing: '#A7774D',
  line: '#8A6343',
  cream: '#FFF1D9',
  eye: '#4A3426',
};

const wingDownLeft = `
  <path d="M86 196 C62 206 58 240 78 256 C94 246 102 224 98 200 Z"
    fill="${OWL.wing}" stroke="${OWL.line}" stroke-width="3" stroke-linejoin="round"/>`;

const wingDownRight = `
  <path d="M214 196 C238 206 242 240 222 256 C206 246 198 224 202 200 Z"
    fill="${OWL.wing}" stroke="${OWL.line}" stroke-width="3" stroke-linejoin="round"/>`;

// Raised right wing. AnimatedLexi pivots it around the shoulder at (214, 204).
const wingWave = `
  <path d="M210 202 C232 188 250 160 256 128 C266 132 270 144 266 158
    C277 156 279 168 270 177 C262 196 240 210 214 214 Z"
    fill="${OWL.wing}" stroke="${OWL.line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M238 178 L257 161 M234 194 L260 178"
    stroke="${OWL.line}" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;

const wingWaveLeft = `<g transform="translate(300 0) scale(-1 1)">${wingWave}</g>`;

const wingChin = `
  <path d="M212 200 C196 196 180 186 174 170 C182 162 196 166 206 174
    C216 182 222 194 218 206 Z"
    fill="${OWL.wing}" stroke="${OWL.line}" stroke-width="3" stroke-linejoin="round"/>`;

const book = `
  <path d="M100 214 Q125 206 150 220 L150 262 Q125 250 100 258 Z"
    fill="#8FD9C6" stroke="#4E9E8E" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M150 220 Q175 206 200 214 L200 258 Q175 250 150 262 Z"
    fill="#6CC7B2" stroke="#4E9E8E" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M150 222 V258" stroke="#F0FFF9" stroke-width="2.5"/>
  <path d="M112 226 Q124 222 138 228 M112 238 Q124 234 138 240
    M162 228 Q176 222 188 226 M162 240 Q176 234 188 238"
    stroke="#E4F8F0" stroke-width="2.5" stroke-linecap="round"/>`;

const EYES = {
  closed: `
    <path d="M104 124 Q120 104 136 124 M164 124 Q180 104 196 124"
      stroke="${OWL.eye}" stroke-width="7" stroke-linecap="round"/>`,
  open: `
    <ellipse cx="120" cy="118" rx="13" ry="15" fill="${OWL.eye}"/>
    <ellipse cx="180" cy="118" rx="13" ry="15" fill="${OWL.eye}"/>
    <circle cx="124" cy="112" r="4.5" fill="#FFFFFF"/>
    <circle cx="184" cy="112" r="4.5" fill="#FFFFFF"/>
    <circle cx="116" cy="124" r="2" fill="#FFFFFF"/>
    <circle cx="176" cy="124" r="2" fill="#FFFFFF"/>`,
  sad: `
    <ellipse cx="120" cy="124" rx="10" ry="12" fill="${OWL.eye}"/>
    <ellipse cx="180" cy="124" rx="10" ry="12" fill="${OWL.eye}"/>
    <circle cx="123" cy="120" r="3.5" fill="#FFFFFF"/>
    <circle cx="183" cy="120" r="3.5" fill="#FFFFFF"/>
    <path d="M104 106 L132 96 M168 96 L196 106"
      stroke="${OWL.eye}" stroke-width="4" stroke-linecap="round"/>
    <path d="M110 142 Q104 152 110 156 Q116 152 110 142 Z" fill="#9FD3F2"/>`,
  sleeping: `
    <path d="M104 120 Q120 132 136 120 M164 120 Q180 132 196 120"
      stroke="${OWL.eye}" stroke-width="6" stroke-linecap="round"/>`,
};

const POSES = {
  reading: { eyes: 'closed', left: wingDownLeft, right: '', wave: true, book: true, sparkles: true },
  happy: { eyes: 'closed', left: wingDownLeft, right: '', wave: true },
  excited: { eyes: 'open', left: wingWaveLeft, right: wingWave, mouth: true, sparkles: true },
  cheering: { eyes: 'closed', left: wingWaveLeft, right: wingWave, mouth: true, sparkles: true },
  thinking: { eyes: 'open', left: wingDownLeft, right: wingDownRight, front: wingChin, extra: 'question' },
  sad: { eyes: 'sad', left: wingDownLeft, right: wingDownRight },
  sleeping: { eyes: 'sleeping', left: wingDownLeft, right: wingDownRight, extra: 'zzz' },
};

function owlSparkles() {
  return `${star(44, 72, 13)}${star(24, 102, 7)}${star(262, 46, 9)}`;
}

// Everything except the waving wing and sparkles, so AnimatedLexi can animate those layers.
function owlBody(mode) {
  const pose = POSES[mode];

  return `
    <ellipse cx="150" cy="281" rx="74" ry="9" fill="#A89CD3" opacity=".18"/>

    <ellipse cx="126" cy="271" rx="14" ry="7" fill="#F2A649"/>
    <ellipse cx="174" cy="271" rx="14" ry="7" fill="#F2A649"/>

    <ellipse cx="150" cy="214" rx="68" ry="56"
      fill="${OWL.feather}" stroke="${OWL.line}" stroke-width="3"/>
    <ellipse cx="150" cy="228" rx="46" ry="38" fill="${OWL.cream}"/>
    <path d="M134 216 l6 6 l6 -6 M154 216 l6 6 l6 -6 M144 234 l6 6 l6 -6"
      stroke="#E3C9A4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

    ${pose.book ? '' : pose.left}
    ${pose.right}

    <path d="M70 70 C62 50 60 34 64 22 C82 30 100 40 112 50
      Q150 36 188 50 C200 40 218 30 236 22
      C240 34 238 50 230 70 C248 92 252 120 244 148
      C232 186 196 202 150 202 C104 202 68 186 56 148
      C48 120 52 92 70 70 Z"
      fill="${OWL.feather}" stroke="${OWL.line}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M72 64 C68 50 68 40 70 32 C82 38 94 46 102 54 Z
      M228 64 C232 50 232 40 230 32 C218 38 206 46 198 54 Z" fill="#D2A679"/>
    <ellipse cx="116" cy="62" rx="22" ry="8" fill="#FFFFFF" opacity=".2"
      transform="rotate(-14 116 62)"/>

    <path d="M150 92 C132 66 80 70 78 118 C76 156 112 178 150 182
      C188 178 224 156 222 118 C220 70 168 66 150 92 Z"
      fill="${OWL.cream}"/>

    ${EYES[pose.eyes]}

    <ellipse cx="100" cy="146" rx="13" ry="8" fill="#F4A9A8" opacity=".75"/>
    <ellipse cx="200" cy="146" rx="13" ry="8" fill="#F4A9A8" opacity=".75"/>

    ${pose.mouth ? `
      <path d="M138 154 Q150 172 162 154 Z" fill="#C25B4E"/>
      <path d="M143 162 Q150 168 157 162" stroke="#F49A9A" stroke-width="3" stroke-linecap="round"/>
    ` : ''}

    <path d="M141 134 Q150 128 159 134 Q156 146 150 152 Q144 146 141 134 Z"
      fill="#F2A649" stroke="#C77F2F" stroke-width="2.5" stroke-linejoin="round"/>

    <path d="M70 176 Q150 214 230 176 Q232 190 222 198 Q150 230 78 198 Q68 190 70 176 Z"
      fill="#8F78D8" stroke="#6F58B8" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M98 198 L84 230 L116 214 Z"
      fill="#8F78D8" stroke="#6F58B8" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M186 203 C180 195 170 203 186 213 C202 203 192 195 186 203 Z" fill="#F7D5E6"/>

    ${pose.book ? `${book}${pose.left}` : ''}
    ${pose.front || ''}

    ${pose.extra === 'question' ? `
      <text x="236" y="70" fill="#A397BC"
        font-family="sans-serif" font-weight="bold" font-size="43">?</text>
    ` : ''}
    ${pose.extra === 'zzz' ? `
      <text x="250" y="78" fill="#A397BC" font-family="sans-serif" font-weight="bold" font-size="22">z</text>
      <text x="264" y="52" fill="#A397BC" font-family="sans-serif" font-weight="bold" font-size="30">Z</text>
    ` : ''}
  `;
}

function owl(mode) {
  const pose = POSES[mode];
  return svg(`${owlBody(mode)}${pose.wave ? wingWave : ''}${pose.sparkles ? owlSparkles() : ''}`);
}

function cloud(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="0" cy="0" r="22"/><circle cx="26" cy="-10" r="28"/>
    <circle cx="56" cy="0" r="22"/><rect x="0" y="0" width="56" height="22"/>
  </g>`;
}

function tree(x, groundY, r, fill) {
  return `<path d="M${x} ${groundY} V${groundY - r - 4}" stroke="#B89A7A" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${x}" cy="${groundY - r - 8}" r="${r}" fill="${fill}"/>`;
}

const landscape = svg(`
  <defs>
    <linearGradient id="sky" x1="195" y1="0" x2="195" y2="844"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#EEE8FF"/>
      <stop offset=".5" stop-color="#F7F4FF"/>
      <stop offset="1" stop-color="#F1ECFC"/>
    </linearGradient>
  </defs>

  <rect width="390" height="844" fill="url(#sky)"/>

  <g fill="#FFFFFF" opacity=".8">
    ${cloud(26, 92, 1)}
    ${cloud(292, 58, 0.8)}
    ${cloud(232, 196, 0.55)}
    ${cloud(40, 560, 0.5)}
  </g>

  ${star(178, 120, 6, '#D9CCF7')}
  ${star(352, 252, 5, '#D9CCF7')}
  ${star(28, 330, 4, '#D9CCF7')}
  ${star(330, 520, 5, '#D9CCF7')}

  <path d="M0 690 Q100 640 200 680 Q300 630 390 660 V844 H0 Z" fill="#CFEBD9"/>
  ${tree(62, 672, 14, '#B9E2CD')}
  <path d="M0 730 Q110 690 210 735 Q300 700 390 720 V844 H0 Z" fill="#E3DAF7"/>
  <path d="M302 690 Q270 730 286 760 Q300 790 250 844 H302 Q332 800 316 765 Q304 735 314 690 Z"
    fill="#FFF6E2"/>

  ${tree(262, 692, 16, '#A8DCC4')}
  ${tree(366, 688, 12, '#BFE6D3')}

  <g transform="translate(278 622)">
    <path d="M0 35 L29 11 L58 35" fill="#F2AAB7"/>
    <path d="M7 33 H51 V70 H7 Z" fill="#FFF4DC"/>
    <path d="M21 45 Q29 35 37 45 V70 H21 Z" fill="#B7A3DA"/>
    <path d="M39 38 H47 V48 H39 Z" fill="#A3DAD5"/>
    <path d="M9 38 H17 V48 H9 Z" fill="#A3DAD5"/>
    <path d="M30 0 V17" stroke="#BBA9CF" stroke-width="3"/>
    <path d="M31 1 L47 7 L31 12" fill="#F5BCC8"/>
  </g>

  <path d="M0 790 Q130 740 260 790 Q330 765 390 780 V844 H0 Z" fill="#D5C9F1"/>
  <path d="M0 825 Q170 790 390 828 V844 H0 Z" fill="#C6B7E6"/>

  <g stroke="#7EBCAC" stroke-width="4" stroke-linecap="round">
    <path d="M27 810 L23 738 M365 807 L368 734"/>
  </g>

  <g fill="#9ED3BE">
    <ellipse cx="14" cy="764" rx="11" ry="31"
      transform="rotate(-29 14 764)"/>
    <ellipse cx="37" cy="770" rx="11" ry="34"
      transform="rotate(25 37 770)"/>
    <ellipse cx="356" cy="761" rx="11" ry="33"
      transform="rotate(-25 356 761)"/>
    <ellipse cx="380" cy="760" rx="11" ry="37"
      transform="rotate(20 380 760)"/>
  </g>

  <g fill="#DCC9EC">
    <ellipse cx="48" cy="802" rx="10" ry="25"
      transform="rotate(32 48 802)"/>
    <ellipse cx="343" cy="804" rx="10" ry="25"
      transform="rotate(-32 343 804)"/>
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
const assets = { landscape, medal };
for (const mode of Object.keys(POSES)) assets[`owl_${mode}`] = owl(mode);

// Separate layers used by AnimatedLexi (body / waving wing / sparkles).
assets.owl_reading_body = svg(owlBody('reading'));
assets.owl_wave_wing = svg(wingWave);
assets.owl_sparkles = svg(owlSparkles());

for (const [name, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(output, `${name}.svg`), content);
}

// Also generate the JS mapping for the Art component.
const mapping = `export default ${JSON.stringify(assets, null, 2)};`;
fs.writeFileSync(path.join(root, 'src', 'assets.generated.js'), mapping);

console.log(`Successfully generated ${Object.keys(assets).length} assets in: ${output}`);
console.log(`Generated JS mapping in: ${path.join(root, 'src', 'assets.generated.js')}`);
