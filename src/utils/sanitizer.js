/**
 * Pupil input sanitizer & bad-word filter for Lexiaral
 * Strictly cleans learner IDs / names:
 * 1. Reasonable max length (20 characters)
 * 2. Anti-spam same char: max 3 consecutive identical characters (e.g. aaaaa -> aaa)
 * 3. Anti-gibberish / keyboard mash (e.g. suhdshshfdhsf, asdfghjk)
 * 4. Comprehensive profanity & slur filter covering English and Tagalog / Filipino
 * 5. No red warning displays - silent, robust sanitization
 */

// Comprehensive list of English and Tagalog bad words, slurs, profanities, and vulgar terms
export const BAD_WORDS = [
  // English Profanities & Slurs
  "fuck", "fuk", "fck", "fucker", "fucking", "fukker", "fckn", "mofo", "motherfucker", "motherfucking",
  "shit", "shite", "shits", "shitty", "bullshit", "dipshit", "dumbshit", "horseshit",
  "bitch", "bitches", "bitching", "bitchy", "biatch",
  "asshole", "arse", "arsehole", "dumbass", "jackass", "badass",
  "bastard", "bastards",
  "dick", "dicks", "dickhead", "cock", "cocks", "cocksucker",
  "cunt", "cunts",
  "pussy", "pussies",
  "whore", "whores", "slut", "sluts", "skank", "hoe", "thot",
  "fag", "fags", "faggot", "faggots", "dyke", "homo",
  "nigger", "niggers", "nigga", "niggas", "negro", "chink", "spic", "kike", "gook", "wetback", "coon", "tranny",
  "retard", "retarded", "spaz",
  "porn", "porno", "sex", "sexual", "penis", "vagina", "dildo", "boob", "boobs", "tit", "tits",
  "nazi", "hitler",
  "damn", "dammit",

  // Tagalog / Filipino Profanities, Slurs & Vulgar Words
  "tanga", "tangina", "tang-ina", "taena", "tangena", "putangina", "putang-ina", "pukinangina", "puta", "pota", "putang",
  "gago", "gaga", "kagaguhan", "kupal", "tarantado", "tarantada", "ulol", "ulul", "buwisit", "bwisit", "bwiset",
  "bano", "engot", "ungas", "hangal", "bobo", "boba", "kabobohan", "ugok", "siraulo", "sira-ulo", "bastos",
  "hinayupak", "putris", "peste", "punyeta", "punyete", "hudas",
  "puke", "puki", "pekpek", "pikpik", "bilat", "kiki", "puday",
  "burat", "tite", "titi", "utin", "bayag", "betlog",
  "tamod", "kantot", "kantutan", "kantonan", "kakantot", "kinantot", "jakol", "chupa", "tsuba",
  "libog", "malibog", "salsal", "himod", "iyot",
  "pokpok", "pakpok", "putahe", "patutot",
  "pakshet", "pakyu", "fakyu", "fakyut",
  "tae", "ebak", "jebs", "tubol", "kurikong",
];

// Leetspeak mapping to catch obfuscated bad words (e.g. g4g0, b0b0, f*ck)
const LEET_MAP = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  "$": "s",
  "!": "i",
  "*": "",
};

/**
 * Normalizes leetspeak to standard alphabet for checking
 */
function normalizeLeet(str) {
  return str
    .toLowerCase()
    .split("")
    .map((char) => LEET_MAP[char] || char)
    .join("");
}

/**
 * Checks if a word is gibberish or keyboard mashing (e.g. suhdshshfdhsf, asdfghjk)
 */
export function isGibberish(word) {
  if (!word || word.length < 4) return false;
  // If a 4+ char word has no vowels at all (a, e, i, o, u, y) -> gibberish
  if (!/[aeiouyAEIOUY\u00f1\u00d1]/.test(word)) return true;

  // If word has 4 or more consecutive consonants -> keyboard mash
  if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{4,}/.test(word)) return true;

  // Excessive consonant-to-vowel ratio in words >= 6 chars (e.g. 12 consonants with 1 vowel)
  const consonants = (word.match(/[bcdfghjklmnpqrstvwxz]/gi) || []).length;
  const vowels = (word.match(/[aeiouy]/gi) || []).length;
  if (word.length >= 6 && vowels > 0 && consonants / vowels >= 4) return true;

  // Keyboard row runs (e.g. asdf, hjkl, qwer, zxcv)
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const lower = word.toLowerCase();
  for (const row of rows) {
    for (let i = 0; i <= row.length - 4; i++) {
      if (lower.includes(row.slice(i, i + 4))) return true;
    }
  }
  return false;
}

/**
 * Checks if a normalized word is a bad word or contains one as a whole token / prefix
 */
function containsBadWord(word) {
  if (!word || word.length < 3) return false;
  const lower = word.toLowerCase();
  const normalized = normalizeLeet(lower);
  const lettersOnly = normalized.replace(/[^a-z]/g, "");

  return BAD_WORDS.some((bad) => {
    if (lettersOnly === bad) return true;
    if (lettersOnly.includes(bad)) {
      // If the bad word is at least 4 chars long or exact match, flag it
      if (bad.length >= 4) return true;
      // For 3-char bad words like 'tae', 'fag', check boundaries
      const regex = new RegExp(`(^|[^a-z])${bad}([^a-z]|$)`, "i");
      return regex.test(normalized) || regex.test(lower);
    }
    return false;
  });
}

/**
 * Main sanitizer function for Learner / Pupil ID input
 * @param {string} rawInput - raw text from TextInput
 * @param {number} maxLength - default 20
 * @returns {string} cleaned and sanitized string
 */
export function sanitizePupilInput(rawInput, maxLength = 20) {
  if (!rawInput || typeof rawInput !== "string") return "";

  // 1. Only allow letters (including Filipino ñ/Ñ), numbers, spaces, hyphens, and periods
  let cleaned = rawInput.replace(/[^a-zA-Z0-9\u00f1\u00d1\s\-\.]/g, "");

  // 2. Anti-spam same character: collapse 3+ identical consecutive characters down to max 3 (e.g. aaaaa -> aaa)
  // Case-insensitive so AaAaAa also collapses
  cleaned = cleaned.replace(/(.)\1{2,}/gi, "$1$1$1");

  // 3. Filter bad words, slurs, and full gibberish tokens BEFORE consonant clipping
  const tokens = cleaned.split(/(\s+|-|\.)/);
  const filteredTokens = tokens.map((token) => {
    // Keep delimiters
    if (/^(\s+|-|\.)$/.test(token)) return token;

    // Check if token is a bad word
    if (containsBadWord(token)) return "";

    // Check if token is keyboard mash gibberish (e.g. suhdshshfdhsf)
    if (isGibberish(token)) return "";

    return token;
  });

  cleaned = filteredTokens.join("");

  // 4. Prevent excessive consecutive consonant hammering while typing (cap at 4 consonants in a row)
  cleaned = cleaned.replace(/([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4})[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]+/g, "$1");

  // 5. Collapse multiple whitespace into a single space
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // 6. Enforce reasonable max length (default 20)
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  // 7. Trim leading/trailing separators and extra spaces
  cleaned = cleaned.replace(/^[\s\-\.]+|[\s\-\.]+$/g, "").replace(/\s{2,}/g, " ");

  return cleaned;
}

/**
 * Verifies whether a string is a valid pupil name/ID
 */
export function isValidPupilInput(input) {
  const sanitized = sanitizePupilInput(input);
  if (!sanitized || sanitized.trim().length === 0) return false;
  return /[a-zA-Z0-9\u00f1\u00d1]/.test(sanitized);
}
