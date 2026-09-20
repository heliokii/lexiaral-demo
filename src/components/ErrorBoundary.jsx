import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Art, Icon } from "../Art";
import { colors } from "./ui";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[LexiAral ErrorBoundary] Caught unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "/";
    } else {
      this.handleReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDev = typeof __DEV__ !== "undefined" && __DEV__;
      const errorMessage = this.state.error?.message || "An unexpected error occurred.";

      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.mascotWrap}>
                <Art name="owl_thinking" width={120} height={120} />
              </View>

              <Text style={styles.title}>Oops! Something went wrong</Text>

              <Text style={styles.subtitle}>
                Don't worry! Your stars, badges, and learning progress are safely
                saved on this device.
              </Text>

              {isDev && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorLabel}>Technical Details:</Text>
                  <Text style={styles.errorText} numberOfLines={4}>
                    {errorMessage}
                  </Text>
                </View>
              )}

              <View style={styles.actionRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try again"
                  onPress={this.handleReset}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Icon name="replay" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Try Again</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Return to home screen"
                  onPress={this.handleReload}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Icon name="home" size={18} color={colors.primary} />
                  <Text style={styles.secondaryBtnText}>Return to Home</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2EEFD",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    maxWidth: 500,
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#DCD0F8",
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    gap: 14,
    shadowColor: "#5E4399",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  mascotWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Nunito_900Black",
    fontSize: 23,
    lineHeight: 29,
    color: colors.darkPurple,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    lineHeight: 22,
    color: "#5E5373",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  errorBox: {
    width: "100%",
    backgroundColor: "#FFF3F3",
    borderWidth: 1,
    borderColor: "#F7C3C3",
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  errorLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    color: "#C0392B",
  },
  errorText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#8B2B2B",
    lineHeight: 16,
  },
  actionRow: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    width: "100%",
    minHeight: 52,
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  secondaryBtn: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#FAF7FF",
    borderWidth: 1.5,
    borderColor: "#DCD0F8",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryBtnText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    color: colors.primary,
  },
});

export default ErrorBoundary;
