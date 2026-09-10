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
  width = '100%',
  height = 180,
  label,
  style,
}) {
  const xml = assets[name];

  if (!xml) return null;

  return (
    <View
      accessible={Boolean(label)}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
      style={style}
    >
      <SvgXml xml={xml} width={width} height={height} />
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
  arrow: `
    <path d="M9 5 L16 12 L9 19" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  cards: `
    <rect x="8" y="2" width="13" height="18" rx="3"
      transform="rotate(12 8 2)" fill="currentColor" opacity=".45"/>
    <rect x="2" y="5" width="14" height="18" rx="3" fill="white"/>
    <path d="M9 11 C4 8 3 16 8 19 C9 20 10 19 11 19
      C17 16 14 8 9 11" fill="#ED849C"/>
    <path d="M9 11 Q8 7 12 7" stroke="#72BFA4" stroke-width="2"/>
  `,
};

export function Icon({ name, color = '#8F78D8', size = 24 }) {
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
      accessible={false}
    />
  );
}