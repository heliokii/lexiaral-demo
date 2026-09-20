import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Art, Icon } from "../Art";
import { colors } from "./ui";
import { playTapSfx } from "../audio";

export function InAppBrowserModal() {
  if (Platform.OS !== "web") {
    return null;
  }

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    try {
      const ua = (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase();
      const isMessengerInApp =
        ua.includes("fban") ||
        ua.includes("fbav") ||
        ua.includes("messenger") ||
        ua.includes("instagram") ||
        ua.includes("threads");

      const hasSpeech = Boolean(window.speechSynthesis);

      // Trigger if inside Facebook Messenger/Instagram or if speech is completely disabled
      if (isMessengerInApp || (!hasSpeech && /android|iphone|ipad/i.test(ua))) {
        // Show after a brief delay so page has mounted smoothly
        const timer = setTimeout(() => {
          setVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleOpenInBrowser = () => {
    playTapSfx();
    if (typeof window === "undefined") return;

    try {
      const host = window.location.host;
      const path = window.location.pathname || "/";
      const search = window.location.search || "";
      const fullUrl = window.location.href;

      // Android Chrome intent scheme directly launches Google Chrome app from Messenger
      const isAndroid = /android/i.test(navigator.userAgent || "");
      if (isAndroid) {
        const intentUrl = `intent://${host}${path}${search}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = intentUrl;
        setTimeout(() => {
          window.open(fullUrl, "_system");
        }, 1200);
      } else {
        // iOS or fallback: open in Safari/default browser
        window.open(fullUrl, "_blank");
      }
    } catch {
      if (window.location) {
        window.open(window.location.href, "_blank");
      }
    }
  };

  const handleDismiss = () => {
    playTapSfx();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.mascotWrap}>
            <Art name="owl_thinking" width={116} height={116} />
          </View>

          <Text style={styles.title}>Open in Chrome for Sound!</Text>

          <Text style={styles.description}>
            Facebook Messenger mutes the teacher's voice and audio narration.
            For full voice sounds, please open LexiAral directly in Google Chrome!
          </Text>

          <Pressable
            testID="btn-open-in-chrome"
            accessibilityRole="button"
            accessibilityLabel="Open LexiAral in Chrome browser"
            onPress={handleOpenInBrowser}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Icon name="arrow" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Open in Google Chrome</Text>
          </Pressable>

          <Pressable
            testID="btn-continue-in-app"
            accessibilityRole="button"
            accessibilityLabel="Continue reading inside Messenger"
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.secondaryBtnText}>Continue Reading Here</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 18, 48, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 99999,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2F1954",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#E6DCFA",
  },
  mascotWrap: {
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Nunito_900Black",
    fontSize: 21,
    lineHeight: 27,
    color: colors.darkPurple,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14.5,
    lineHeight: 22,
    color: "#5C5270",
    textAlign: "center",
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: "#83759C",
  },
});
