/**
 * Community & resource links for the Home screen.
 *
 * The "Slack Community Call" row previously shown in the "Community &
 * Resources" card has been removed at the client's request, so the list is
 * now empty and <CommunityCard /> is no longer rendered on the main page.
 *
 * Each entry drives one row of <CommunityCard /> (see src/components/CommunityCard.jsx).
 *
 *   id           Stable slug — also used for the row's testID (`community-row-<id>`).
 *   icon         Any key from the `shapes` map in src/Art.jsx (e.g. "community",
 *                "book", "award", "checklist", "sound").
 *   title        Short label shown on the row.
 *   description  One-line supporting copy. Pass "" to hide it.
 *   url          Full https:// link. Leave "" to keep the row visible but disabled —
 *                it then renders a "Soon" pill instead of an "Open" action.
 *   accent       Icon / pill foreground colour.
 *   accentBg     Icon badge background colour.
 */
export const COMMUNITY_RESOURCES = [];

export default COMMUNITY_RESOURCES;
