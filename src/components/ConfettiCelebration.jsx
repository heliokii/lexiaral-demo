import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform, Animated, Dimensions } from "react-native";

const CONFETTI_COLORS = [
  "#7E57C2", // Royal purple
  "#FFB300", // Amber gold
  "#20A464", // Mint green
  "#FF5252", // Party coral
  "#00B0FF", // Bright sky
  "#FF4081", // Rose pink
  "#AB47BC", // Lavender orchid
  "#FFCA28", // Sunflower
  "#00E676", // Electric green
  "#FF6E40", // Sunset orange
  "#E040FB", // Bright magenta
];

export function ConfettiCelebration() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = Math.round(rect.width) || window.innerWidth;
      height = canvas.height = Math.round(rect.height) || window.innerHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // 180 particles for a rich, abundant birthday popper celebration
    const particleCount = 180;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 400),
        y: Math.random() * -(height || 700) * 1.2 - 20, // Staggered initial heights above
        w: 8 + Math.random() * 8,
        h: 12 + Math.random() * 14,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape:
          i % 4 === 0
            ? "circle"
            : i % 4 === 1
              ? "ribbon"
              : i % 4 === 2
                ? "diamond"
                : "rect",
        vy: 2.5 + Math.random() * 4.2, // Downward velocity
        vx: (Math.random() - 0.5) * 2.2, // Gentle horizontal drift
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.05 + Math.random() * 0.08,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.06,
      });
    }

    const startTime = Date.now();
    const activeDuration = 6000; // 6 seconds active raining
    const fadeDuration = 1800; // 1.8s smooth fade out

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;

      let alpha = 1;
      if (elapsed > activeDuration) {
        alpha = Math.max(0, 1 - (elapsed - activeDuration) / fadeDuration);
      }

      ctx.globalAlpha = alpha;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Realistic top-to-bottom physics with air wobble
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.wobble) * 1.6;
        p.tilt += p.tiltSpeed;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Recycle to top while celebration is active
        if (p.y > height + 40) {
          if (elapsed < activeDuration) {
            p.y = -20 - Math.random() * 60;
            p.x = Math.random() * width;
            p.vy = 2.5 + Math.random() * 4.2;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // 3D tumbling paper flip
        const scaleX = Math.cos(p.tilt);
        ctx.scale(scaleX, 1);

        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.fillRect(-2, -p.h * 0.7, 4, p.h * 1.5);
        } else if (p.shape === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -p.h * 0.5);
          ctx.lineTo(p.w * 0.5, 0);
          ctx.lineTo(0, p.h * 0.5);
          ctx.lineTo(-p.w * 0.5, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
        }

        ctx.restore();
      }

      if (alpha > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  if (Platform.OS === "web") {
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    );
  }

  // Native mobile animated fallback
  return <NativeConfettiFallback />;
}

// Precomputed scattered particle specs for native mobile (iOS / Android)
const NATIVE_PARTICLES = Array.from({ length: 60 }).map((_, i) => {
  // Disperse X across 3% to 95%
  const leftPct = ((i * 17.3 + 7) % 92) + 4;
  // Stagger startY so particles are distributed vertically by up to 700px
  const startY = -40 - ((i * 43) % 720);
  // Vary fall distance and speed
  const extraFall = (i * 31) % 360;
  // Horizontal air drift / sway
  const sway = (((i % 7) - 3) * 12);
  // Spin turns
  const spinTurns = (i % 2 === 0 ? 1 : -1) * (2 + (i % 4));
  // Shape: 0=ribbon, 1=square, 2=circle, 3=diamond
  const shapeType = i % 4;
  const size = 8 + (i % 4) * 2.5;
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

  return {
    id: i,
    leftPct: `${leftPct}%`,
    startY,
    extraFall,
    sway,
    spinTurns,
    shapeType,
    size,
    color,
  };
});

// Fallback for native mobile platforms (iOS / Android)
function NativeConfettiFallback() {
  const windowDims = Dimensions.get("window");
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 6200,
      useNativeDriver: true,
    }).start();
  }, [animValue]);

  const opacity = animValue.interpolate({
    inputRange: [0, 0.05, 0.84, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <View pointerEvents="none" style={styles.nativeOverlay}>
      {NATIVE_PARTICLES.map((p) => {
        const translateY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [p.startY, windowDims.height + 60 + p.extraFall],
        });

        const translateX = animValue.interpolate({
          inputRange: [0, 0.3, 0.65, 1],
          outputRange: [0, p.sway, -p.sway * 0.8, p.sway * 0.5],
        });

        const rotate = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${360 * p.spinTurns}deg`],
        });

        const isCircle = p.shapeType === 2;
        const isRibbon = p.shapeType === 0;

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.nativePiece,
              {
                left: p.leftPct,
                width: isRibbon ? p.size * 0.7 : p.size,
                height: isRibbon ? p.size * 1.8 : p.size,
                borderRadius: isCircle ? p.size * 0.5 : 2,
                backgroundColor: p.color,
                opacity,
                transform: [{ translateY }, { translateX }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nativeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    overflow: "hidden",
  },
  nativePiece: {
    position: "absolute",
    top: 0,
  },
});

export default ConfettiCelebration;

