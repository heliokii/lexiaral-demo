import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

import { Art } from "../Art";
import assets from "../assets.generated";
import { playTapSfx, speak } from "../audio";

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

  // Wing rotation pivoted around shoulder joint (214, 204) in 300x300 space
  const wingPivotX = size * (214 / 300);
  const wingPivotY = size * (204 / 300);
  const wingAngle = wingAnim.interpolate({
    inputRange: [-30, 0, 30],
    outputRange: ["-30deg", "0deg", "30deg"],
  });

  // Sparkles scale & opacity pivoted around (44, 72)
  const sparklePivotX = size * (44 / 300);
  const sparklePivotY = size * (72 / 300);
  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0.35, 1.0],
    outputRange: [0.85, 1.2],
  });

  const isReadingOwl = name === "owl-reading" || name === "owl_reading";

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
            <SvgXml xml={assets.owl_reading_body} width={size} height={size} />
          </View>

          {/* Waving Right Wing Layer (pivoted around shoulder at 214, 204) */}
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
            <SvgXml xml={assets.owl_wave_wing} width={size} height={size} />
          </Animated.View>

          {/* Twinkling Sparkles Layer (pulsating beside ear at 44, 72) */}
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
            <SvgXml xml={assets.owl_sparkles} width={size} height={size} />
          </Animated.View>
        </View>
      ) : (
        <Art name={name} width={size} height={size} />
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
