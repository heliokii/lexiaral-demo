import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "../Art";
import { playTapSfx } from "../audio";
import { COMMUNITY_RESOURCES } from "../community";
import { Card, colors } from "./ui";

/**
 * Opens a resource link in the learner's browser or the system handler.
 *
 * Linking.openURL resolves to window.open(url, "_blank", "noopener") on web
 * (react-native-web) and to the native intent/UIApplication handler on
 * Android & iOS, so one call covers every platform this app ships to.
 *
 * Resolves true when the link was handed off, false when the url is empty or
 * the platform refused to open it. Never rejects, so callers can ignore it.
 */
export function openResourceUrl(url) {
  if (!url) return Promise.resolve(false);

  return Linking.openURL(url)
    .then(() => true)
    .catch(() => false);
}

/**
 * A single tappable resource row inside CommunityCard.
 * Rows without a url stay visible but render a "Soon" pill and are disabled.
 */
export function ResourceRow({ resource, onPress, testID }) {
  const {
    id,
    icon = "community",
    title,
    description,
    url,
    accent = colors.primary,
    accentBg = "#F1EAFC",
  } = resource;

  const isLive = Boolean(url);

  return (
    <Pressable
      testID={testID || `community-row-${id}`}
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        isLive ? `${title}: open link` : `${title}: coming soon`
      }
      accessibilityState={{ disabled: !isLive }}
      disabled={!isLive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLive && styles.rowDisabled,
        pressed && isLive && styles.rowPressed,
      ]}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: accentBg }]}>
        <Icon name={icon} size={18} color={accent} />
      </View>

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>

      <View style={[styles.rowPill, !isLive && styles.rowPillMuted]}>
        <Text
          style={[styles.rowPillText, !isLive && styles.rowPillTextMuted]}
        >
          {isLive ? "Open" : "Soon"}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Community & Resources card used on the Home screen.
 *
 * Data-driven and self-contained: pass `resources` to render any list, or rely
 * on COMMUNITY_RESOURCES. Pass `onPressResource` to route a row somewhere in
 * app instead of opening an external link.
 */
export function CommunityCard({
  title = "Community & Resources",
  description = "Live calls, tips, and printables for the teachers and grown-ups helping Grade 3 readers grow.",
  resources = COMMUNITY_RESOURCES,
  onPressResource,
  testID = "community-card",
  style,
}) {
  if (!resources || resources.length === 0) return null;

  const handlePress = (resource) => {
    playTapSfx();
    if (onPressResource) {
      onPressResource(resource);
      return;
    }
    openResourceUrl(resource.url);
  };

  return (
    <Card testID={testID} style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconWrap}>
          <Icon name="community" size={18} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <View style={styles.list}>
        {resources.map((resource) => (
          <ResourceRow
            key={resource.id}
            resource={resource}
            onPress={() => handlePress(resource)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#EAE2FB",
    padding: 16,
    gap: 12,
    marginVertical: 4,
    shadowColor: "#8C77B0",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3EFFC",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    color: colors.darkPurple,
  },
  description: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.muted,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAF8FF",
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFE8FA",
  },
  rowPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  rowDisabled: {
    opacity: 0.72,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: colors.text,
  },
  rowDescription: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  rowPill: {
    backgroundColor: "#EDE5FD",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D9C8FA",
  },
  rowPillMuted: {
    backgroundColor: "#F4F1F8",
    borderColor: "#E5DEF2",
  },
  rowPillText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11.5,
    color: "#6536BC",
  },
  rowPillTextMuted: {
    color: "#8E83A3",
  },
});

export default CommunityCard;
