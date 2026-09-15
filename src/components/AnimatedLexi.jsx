import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

import { Art } from "../Art";
import { playTapSfx, speak } from "../audio";

const OWL_BODY_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
  <ellipse cx="150" cy="278" rx="79" ry="10" fill="#A89CD3" opacity=".16"/>

  <path d="M118 259 L107 274 M118 263 L122 275 M176 259 L166 275 M176 263 L185 274"
    stroke="#CC914E" stroke-width="8" stroke-linecap="round"/>

  <path d="M83 151 Q47 163 58 207 Q64 224 79 217 L105 184 Z"
    fill="#C89760" stroke="#936747" stroke-width="4"/>

  <path d="M76 105 L68 49 L111 69 Q147 43 190 66 L220 40 L223 103 Q240 126 233 170 Q237 253 151 263 Q67 259 67 177 Q60 135 76 105 Z"
    fill="#D4AE7C" stroke="#936747" stroke-width="4"/>

  <path d="M88 99 Q111 71 146 96 Q182 70 209 99 Q228 130 208 161 Q183 183 148 174 Q109 187 86 159 Q67 131 88 99 Z"
    fill="#FFF1D0"/>

  <ellipse cx="149" cy="211" rx="57" ry="43" fill="#FFF1D0"/>

  <path d="M93 66 L101 53 M128 60 L137 46 M172 58 L181 47"
    stroke="#936747" stroke-width="4" stroke-linecap="round"/>

  <path d="M102 123 Q115 100 128 123 M169 123 Q182 100 195 123"
    stroke="#59402E" stroke-width="8" stroke-linecap="round"/>

  <ellipse cx="93" cy="140" rx="12" ry="7" fill="#EFABA2" opacity=".8"/>
  <ellipse cx="208" cy="140" rx="12" ry="7" fill="#EFABA2" opacity=".8"/>

  <path d="M139 132 Q149 124 159 132 L149 147 Z"
    fill="#E7A34F" stroke="#B97D37" stroke-width="3"/>

  <path d="M78 163 Q148 188 222 162 L210 189 Q155 211 89 186 Z"
    fill="#9980E0" stroke="#7560B6" stroke-width="4"/>

  <path d="M93 185 L76 205 L103 201 L111 187"
    fill="#9980E0" stroke="#7560B6" stroke-width="3"/>

  <path d="M184 181 C177 172 168 181 184 190 C200 179 191 172 184 181 Z"
    fill="#F5D8E4"/>

  <path d="M83 187 Q115 177 147 196 L147 258 Q113 238 83 247 Z"
    fill="#83D6C5" stroke="#4B988D" stroke-width="4"/>
  <path d="M147 196 Q179 178 211 187 L211 247 Q178 238 147 258 Z"
    fill="#5EBDAA" stroke="#4B988D" stroke-width="4"/>
  <path d="M147 198 L147 253" stroke="#F0FFF9" stroke-width="4"/>
  <path d="M96 199 Q113 195 130 203 M96 210 Q111 205 129 214"
    stroke="#D8F5E8" stroke-width="3" stroke-linecap="round"/>
  <path d="M76 204 Q99 196 103 210 Q102 223 78 224"
    fill="#D4A977" stroke="#936747" stroke-width="4"/>
</svg>`;

const OWL_WING_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
  <path d="M215 148 Q244 140 255 116 Q269 119 257 143 Q276 131 277 143 Q267 168 244 180 Q269 175 264 188 Q244 211 215 199 Z"
    fill="#C89760" stroke="#936747" stroke-width="4"/>
</svg>`;

const OWL_SPARKLES_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
  <path d="M44 71 L35 57 M54 65 L51 48 M32 81 L20 77"
    stroke="#F5CC65" stroke-width="6" stroke-linecap="round"/>
</svg>`;

/**
 * AnimatedLexi - Alive mascot with:
 * 1. Full-body organic breathing and floating idle loop.
 * 2. Continuously waving right wing with shoulder pivot.
 * 3. Pulsing and twinkling excitement sparkles.
 * 4. Interactive tap reaction: excited wing flutter, spring bounce, voice greeting + onSpeak callback.
 */
export function AnimatedLexi({
  name = "owl-reading",
  height = 155,
  interactive = true,
  pupilName = "",
  onSpeak,
  style,
  testID = "animated-lexi",
}) {
  const size = height;

  // Body animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const squashX = useRef(new Animated.Value(1)).current;
  const squashY = useRef(new Animated.Value(1)).current;

  // Wing and Sparkle animation values
  const wingAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // 1. Full-body gentle floating loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // 2. Reading curiosity sway / head tilt loop
    const tiltLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tiltAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // 3. Rhythmic breathing scale loop
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.02,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1.0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // 4. Idle friendly waving wing loop
    const wingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, {
          toValue: -12,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 6,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // 5. Twinkling excitement sparkles loop
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0.35,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();
    tiltLoop.start();
    breathLoop.start();
    wingLoop.start();
    sparkleLoop.start();

    return () => {
      floatLoop.stop();
      tiltLoop.stop();
      breathLoop.stop();
      wingLoop.stop();
      sparkleLoop.stop();
    };
  }, [floatAnim, tiltAnim, breathAnim, wingAnim, sparkleAnim]);

  const handlePress = () => {
    if (!interactive) return;

    playTapSfx();

    // Energetic tap reaction: squash & stretch launch + excited wing wave flutter
    Animated.parallel([
      // Body jump sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(squashX, {
            toValue: 1.08,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(squashY, {
            toValue: 0.92,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bounceAnim, {
            toValue: -18,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(squashX, {
            toValue: 0.94,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(squashY, {
            toValue: 1.08,
            duration: 160,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(bounceAnim, {
            toValue: 0,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(squashX, {
            toValue: 1.0,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(squashY, {
            toValue: 1.0,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Energetic wing flutter
      Animated.sequence([
        Animated.timing(wingAnim, {
          toValue: -22,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 14,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: -18,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 10,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(wingAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Friendly spoken voice greeting
    const learnerName = pupilName ? pupilName.trim() : "";
    const greetings = learnerName
      ? [
          `Hi ${learnerName}! Ready to learn?`,
          `Let's earn stars together, ${learnerName}!`,
          `Ready to read with me, ${learnerName}?`,
          `Let's learn happily, ${learnerName}!`,
        ]
      : [
          "Hi! I'm Lexi. Ready to learn?",
          "Ready to read? Tap Play or Learn!",
          "You can do it! Let's earn stars!",
          "Reading is fun! Let's get started!",
        ];

    const chosenGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];

    if (onSpeak) {
      onSpeak(chosenGreeting);
    }

    speak(chosenGreeting, "en-US", false);
  };

  const bodyRotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-2deg", "0deg", "2deg"],
  });

  const totalTranslateY = Animated.add(floatAnim, bounceAnim);

  // Wing rotation pivoted around shoulder joint (215, 180) in 300x300 space
  const wingPivotX = size * (215 / 300);
  const wingPivotY = size * (180 / 300);
  const wingAngle = wingAnim.interpolate({
    inputRange: [-30, 0, 30],
    outputRange: ["-30deg", "0deg", "30deg"],
  });

  // Sparkles scale & opacity pivoted around (40, 65)
  const sparklePivotX = size * (40 / 300);
  const sparklePivotY = size * (65 / 300);
  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0.35, 1.0],
    outputRange: [0.85, 1.2],
  });

  const isReadingOwl = name === "owl-reading";

  const mascotView = (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        transform: [
          { translateY: totalTranslateY },
          { rotate: bodyRotation },
          { scaleX: Animated.multiply(breathAnim, squashX) },
          { scaleY: Animated.multiply(breathAnim, squashY) },
        ],
      }}
    >
      {isReadingOwl ? (
        <View style={{ width: size, height: size, position: "relative" }}>
          {/* Base Body Layer (feet, body, face, book, scarf, left wing) */}
          <View style={StyleSheet.absoluteFill}>
            <SvgXml xml={OWL_BODY_XML} width={size} height={size} />
          </View>

          {/* Waving Right Wing Layer (pivoted around shoulder at 215, 180) */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [
                  { translateX: wingPivotX },
                  { translateY: wingPivotY },
                  { rotate: wingAngle },
                  { translateX: -wingPivotX },
                  { translateY: -wingPivotY },
                ],
              },
            ]}
          >
            <SvgXml xml={OWL_WING_XML} width={size} height={size} />
          </Animated.View>

          {/* Twinkling Sparkles Layer (pulsating above ear at 40, 65) */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: sparkleAnim,
                transform: [
                  { translateX: sparklePivotX },
                  { translateY: sparklePivotY },
                  { scale: sparkleScale },
                  { translateX: -sparklePivotX },
                  { translateY: -sparklePivotY },
                ],
              },
            ]}
          >
            <SvgXml xml={OWL_SPARKLES_XML} width={size} height={size} />
          </Animated.View>
        </View>
      ) : (
        <Art name={name} height={height} />
      )}
    </Animated.View>
  );

  if (!interactive) {
    return (
      <View testID={testID} style={[styles.container, style]}>
        {mascotView}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Lexi the reading owl mascot: tap to hear greeting"
      onPress={handlePress}
      style={[styles.container, style]}
    >
      {mascotView}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedLexi;
