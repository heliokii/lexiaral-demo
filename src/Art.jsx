import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import assets from './assets.generated';

/**
 * Decorative artwork is hidden from screen readers.
 * Provide a label when an illustration communicates useful information.
 */
export function Art({
  name,
  width,
  height,
  label,
  style,
}) {
  const xml = assets[name] || assets[name?.replace(/-/g, '_')];

  if (!xml) return null;

  const finalHeight = height ?? (width ?? 180);
  const finalWidth = width ?? (height ?? 180);

  return (
    <View
      accessible={Boolean(label)}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
      style={[
        {
          width: finalWidth,
          height: finalHeight,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <SvgXml xml={xml} width={finalWidth} height={finalHeight} />
    </View>
  );
}

const shapes = {
  home: `
    <path d="M3 11 L12 3 L21 11 V21 H15 V15 H9 V21 H3 Z"
      fill="currentColor"/>
  `,
  book: `
    <path d="M2 5 Q7 3 11 6 V21 Q7 18 2 20 Z
      M13 6 Q17 3 22 5 V20 Q17 18 13 21 Z"
      fill="currentColor"/>
  `,
  chart: `
    <rect x="3" y="13" width="5" height="9" rx="1.5" fill="currentColor"/>
    <rect x="10" y="7" width="5" height="15" rx="1.5" fill="currentColor"/>
    <rect x="17" y="2" width="5" height="20" rx="1.5" fill="currentColor"/>
  `,
  star: `
    <path d="M12 2 L15.2 8.5 L22.4 9.5 L17.2 14.6
      L18.4 21.8 L12 18.4 L5.6 21.8 L6.8 14.6
      L1.6 9.5 L8.8 8.5 Z" fill="currentColor"/>
  `,
  badge: `
    <path d="M7 14 L5 23 L10 20 L12 23 L14 14
      M13 14 L15 23 L18 20 L22 22 L18 13"
      fill="currentColor" opacity=".7"/>
    <circle cx="12" cy="9" r="8" fill="currentColor"/>
    <path d="M12 4 L13.5 7 L17 7.5 L14.5 10 L15 13.5
      L12 12 L9 13.5 L9.5 10 L7 7.5 L10.5 7 Z" fill="white"/>
  `,
  lock: `
    <rect x="5" y="10" width="14" height="12" rx="3" fill="currentColor"/>
    <path d="M8 10 V7 A4 4 0 0 1 16 7 V10"
      stroke="currentColor" stroke-width="3" fill="none"/>
    <circle cx="12" cy="15" r="1.5" fill="white"/>
    <path d="M12 16 V18" stroke="white" stroke-width="2"/>
  `,
  sound: `
    <path d="M3 9 H7 L12 5 V19 L7 15 H3 Z" fill="currentColor"/>
    <path d="M16 8 Q20 12 16 16 M19 4 Q26 12 19 20"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  `,
  mute: `
    <path d="M3 9 H7 L12 5 V19 L7 15 H3 Z" fill="currentColor"/>
    <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  `,
  arrow: `
    <path d="M9 5 L16 12 L9 19" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  check: `
    <polyline points="20 6 9 17 4 12" stroke="currentColor"
      stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  cards: `
    <rect x="8" y="2" width="13" height="18" rx="3"
      transform="rotate(12 8 2)" fill="currentColor" opacity=".45"/>
    <rect x="2" y="5" width="14" height="18" rx="3" fill="white"/>
    <path d="M9 11 C4 8 3 16 8 19 C9 20 10 19 11 19
      C17 16 14 8 9 11" fill="#ED849C"/>
    <path d="M9 11 Q8 7 12 7" stroke="#72BFA4" stroke-width="2"/>
  `,
  info: `
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" fill="none"/>
    <circle cx="12" cy="8" r="1.3" fill="currentColor"/>
    <path d="M12 11 V16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  `,
  shuffle: `
    <path d="M16 3 H21 V8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 20 L21 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M21 16 V21 H16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 15 L21 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M4 4 L9 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  `,
  arrowLeft: `
    <path d="M15 19 L8 12 L15 5" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  shield: `
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  `,
  refresh: `
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 3v5h5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 21v-5h-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  close: `
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  x: `
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  play: `
    <path d="M7.5 5 C6.7 4.5 5.5 5 5.5 6 L5.5 18 C5.5 19 6.7 19.5 7.5 19 L18.5 13 C19.3 12.5 19.3 11.5 18.5 11 Z" fill="currentColor"/>
  `,
  replay: `
    <path d="M4 11 A8 8 0 1 1 6.2 16.8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" fill="none"/>
    <polyline points="4 5.5 4 11.5 10 11.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  `,
  grid: `
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor"/>
  `,
  checklist: `
    <rect x="4" y="3" width="16" height="18" rx="3.5" stroke="currentColor" stroke-width="2.4" fill="none"/>
    <path d="M8 8.5 L10 10.5 L14.5 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="8" y1="17.5" x2="13" y2="17.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  `,
  award: `
    <path d="M7 4 H17 V10 C17 12.8 14.8 15 12 15 C9.2 15 7 12.8 7 10 V4 Z" fill="currentColor"/>
    <path d="M7 6 H4 C4 9 5.5 11 7 11" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M17 6 H20 C20 9 18.5 11 17 11" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M12 15 V19 M8 21 H16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  `,
};

export function Icon({ name, color = '#8F78D8', size = 24, style }) {
  const shape = shapes[name] || shapes.star;

  const xml = `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" fill="none" color="${color}">
    ${shape.replaceAll('currentColor', color)}
  </svg>`;

  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
      style={style}
    />
  );
}