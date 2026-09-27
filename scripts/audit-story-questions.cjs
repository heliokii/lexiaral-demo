/**
 * Story question audit — flags question prompts whose answer (or the names they
 * mention) do not appear anywhere in the story text they are asked about.
 *
 * Used to find the stale-template mismatches fixed by scripts/fix-content-audit.cjs.
 * Run: node scripts/audit-story-questions.cjs
 *
 * Note: a capitalized sentence-initial word that never appears lowercase in the
 * corpus ("Crossed", "Whom", "If") can show up as a false positive.
 */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'assets', 'content.json'), 'utf8')
);

const STOP = new Set([
  'a','an','and','or','of','to','in','on','at','for','with','from','into',
  'his','her','him','she','he','they','their','it','its','was','were','is','are',
  'that','this','then','when','where','who','what','why','how','do','does','did',
  'near','over','under','by','up','down','out','one','some','all','again','after',
  'before','while','there','here','them','very','but','not','every','because',
  'goes','went','have','has','had','you','your','yes','no'
]);

const words = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && w.length > 2 && !STOP.has(w));

// Proper nouns = capitalised tokens across the whole corpus (story text + every
// question prompt/answer/explanation) whose lowercase form never appears on its
// own anywhere (so "Red", "Fresh", "Several" are excluded).
const allText = data.stories
  .map((s) => {
    const qs = (s.questions || [])
      .map((q) => `${q.prompt} ${q.answer} ${q.explanation}`)
      .join(' ');
    return `${s.text} ${qs}`;
  })
  .join(' ');
// Common words = tokens that appear in a purely lowercase form somewhere in the
// corpus. Anything that only ever appears capitalised is treated as a proper
// noun ("Mia", "Sara", "Ricky"), while sentence-initial words like "When" or
// "Red" (also seen lowercase) are ignored.
const lowerTokens = new Set(
  (allText.match(/\b[a-z]{3,}\b/g) || []).filter((w) => !STOP.has(w))
);
const PROPER_NOUNS = new Set(
  (allText.match(/\b[A-Z][a-z]+\b/g) || []).filter(
    (n) => !lowerTokens.has(n.toLowerCase()) && !STOP.has(n.toLowerCase())
  )
);

const properNounsIn = (text) =>
  [...new Set((String(text).match(/\b[A-Z][a-z]+\b/g) || []))].filter((n) =>
    PROPER_NOUNS.has(n)
  );

let flagged = 0;

for (const story of data.stories) {
  const storyWords = new Set(words(story.text));
  const storyNames = new Set(properNounsIn(story.text));
  const issues = [];

  for (const q of story.questions || []) {
    const answerWords = words(q.answer);
    const promptWords = words(q.prompt);
    const answerHit = answerWords.some((w) => storyWords.has(w));
    const promptHit = promptWords.some((w) => storyWords.has(w));
    const staleNames = [
      ...properNounsIn(q.prompt),
      ...properNounsIn(q.answer),
      ...properNounsIn(q.explanation),
    ].filter((n) => !storyNames.has(n));

    if (!answerHit && !promptHit) {
      issues.push(`  [no-overlap]  ${q.id} | ${q.prompt} => ${q.answer}`);
    }
    if (staleNames.length) {
      issues.push(
        `  [foreign]     ${q.id} | not in story text: ${[...new Set(staleNames)].join(', ')}`
      );
    }
  }

  if (issues.length) {
    flagged += issues.length;
    console.log(`\n### ${story.id} — "${story.title}"`);
    console.log(`  TEXT: ${story.text}`);
    console.log(issues.join('\n'));
  }
}

console.log(
  `\nFlagged ${flagged} issue(s) across ${data.stories.length} stories.`
);


