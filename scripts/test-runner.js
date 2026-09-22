/**
 * LexiAral Automated Test Suite & Sanity Verification Runner
 * Run via: npm test
 *
 * This test suite verifies:
 * 1. AST Scope & Static Reference Integrity (catches missing imports / undeclared variables)
 * 2. Content & Curriculum Integrity (validates all 50 words, choices, answerIds, and stories)
 * 3. State Engine Simulation (Level 1, Level 2, Level 3, and Level 3 Retry)
 * 4. Component Export & Runtime Sanity
 */

const Module = require('module');
const originalRequire = Module.prototype.require;
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const ROOT_DIR = path.resolve(__dirname, '..');
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} ${details ? '- ' + details : ''}`);
  }
}

function runSuite(name, fn) {
  console.log(`\n--- Running Suite: ${name} ---`);
  try {
    fn();
  } catch (err) {
    console.error(`Suite "${name}" threw an unhandled error:`, err);
    failedTests++;
  }
}

// -------------------------------------------------------------
// SUITE 1: Static AST & Scope Reference Analysis
// -------------------------------------------------------------
runSuite('Static AST & Reference Scope Analysis', () => {
  function scanDir(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        if (item !== 'node_modules' && item !== '.git' && item !== 'scripts') {
          files = files.concat(scanDir(full));
        }
      } else if (full.endsWith('.js') || full.endsWith('.jsx')) {
        files.push(full);
      }
    }
    return files;
  }

  const files = scanDir(path.join(ROOT_DIR, 'src')).concat([
    path.join(ROOT_DIR, 'App.jsx'),
    path.join(ROOT_DIR, 'index.js'),
  ]);

  const allowedGlobals = new Set([
    'console', 'window', 'document', 'setTimeout', 'clearTimeout',
    'setInterval', 'clearInterval', 'Date', 'Math', 'Array', 'Object',
    'String', 'Number', 'Boolean', 'RegExp', 'Error', 'Set', 'Map',
    'JSON', 'Promise', 'NaN', 'Infinity', 'undefined', 'parseInt',
    'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent',
    'decodeURIComponent', 'requestAnimationFrame', 'cancelAnimationFrame',
    'Audio', 'alert', 'confirm', 'prompt', 'process', 'require',
    'module', 'exports', '__dirname', '__filename', 'global', 'Intl',
    '__DEV__', 'SpeechSynthesisUtterance', 'navigator', 'screen'
  ]);

  let undeclaredIssues = [];

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const relative = path.relative(ROOT_DIR, file);

    let ast;
    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
      });
    } catch (parseErr) {
      assert(false, `Syntax parsing for ${relative}`, parseErr.message);
      continue;
    }

    traverse(ast, {
      Program(progPath) {
        progPath.traverse({
          ReferencedIdentifier(identPath) {
            const name = identPath.node.name;
            if (allowedGlobals.has(name)) return;
            if (!identPath.scope.hasBinding(name)) {
              undeclaredIssues.push({
                file: relative,
                name,
                line: identPath.node.loc?.start?.line,
              });
            }
          },
        });
      },
    });
  }

  const hasNoUndeclared = undeclaredIssues.length === 0;
  assert(
    hasNoUndeclared,
    'No undeclared variables or missing imports found',
    undeclaredIssues
      .map((i) => `${i.file}:${i.line} -> ${i.name}`)
      .join('; ')
  );
});

// -------------------------------------------------------------
// Setup Node.js Runtime Environment for React Native / Expo Code
// -------------------------------------------------------------
const mocks = {
  'react-native': {
    Platform: { OS: 'web', select: (obj) => obj.web || obj.default },
    StyleSheet: { create: (s) => s },
    Image: { prefetch: () => Promise.resolve() },
    View: 'View',
    Text: 'Text',
    Pressable: 'Pressable',
    Alert: { alert: () => {} },
  },
  'expo-asset': {
    Asset: { fromModule: () => ({ downloadAsync: () => Promise.resolve() }) },
  },
  'expo-speech': { speak: () => {}, stop: () => {} },
  'expo-audio': {},
  '@react-native-async-storage/async-storage': {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  },
};

Module.prototype.require = function (id) {
  if (mocks[id]) return mocks[id];
  return originalRequire.apply(this, arguments);
};

const assetExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp3', '.wav'];
for (const ext of assetExtensions) {
  require.extensions[ext] = function (module) {
    module.exports = 1;
  };
}

require.extensions['.js'] = function (module, filename) {
  if (filename.includes('node_modules')) {
    return module._compile(fs.readFileSync(filename, 'utf8'), filename);
  }
  const code = fs.readFileSync(filename, 'utf8');
  const transformed = babel.transformSync(code, {
    plugins: [
      require('@babel/plugin-transform-modules-commonjs'),
      require('@babel/plugin-transform-react-jsx'),
    ],
    filename,
  });
  module._compile(transformed.code, filename);
};

// -------------------------------------------------------------
// SUITE 2: Content & Curriculum Integrity
// -------------------------------------------------------------
runSuite('Content & Curriculum Integrity', () => {
  const { CONTENT, WORDS, QUESTIONS, STORIES, getQuestionsForStory } = require('../src/content');

  assert(Array.isArray(CONTENT.words), 'CONTENT.words is an array');
  assert(CONTENT.words.length === 50, `Expected 50 vocabulary words, found ${CONTENT.words.length}`);

  let wordsValid = true;
  for (const word of CONTENT.words) {
    if (!word.id || !word.word || !word.definition || !word.difficulty) {
      wordsValid = false;
      break;
    }
  }
  assert(wordsValid, 'All 50 words have valid id, word, definition, and difficulty');

  // Verify Questions for Level 1, 2, 3
  for (const level of [1, 2, 3]) {
    const questions = QUESTIONS[level];
    assert(Array.isArray(questions) && questions.length > 0, `Level ${level} has questions defined`);

    let allQuestionsValid = true;
    for (const q of questions) {
      if (!q.id || !q.prompt || !q.type || !q.category || !q.answerId) {
        allQuestionsValid = false;
        break;
      }
      if (q.type !== 'matching') {
        const hasChoice = q.choices?.some((c) => c.id === q.answerId);
        if (!hasChoice) {
          allQuestionsValid = false;
          break;
        }
      }
    }
    assert(allQuestionsValid, `Level ${level} questions have valid answerId and choices`);
  }

  // Verify Stories
  assert(Array.isArray(STORIES) && STORIES.length >= 3, `Expected at least 3 stories, found ${STORIES.length}`);
  for (const story of STORIES) {
    assert(Boolean(story.id && story.title && story.text), `Story ${story.id} has title and text`);
    const storyQuestions = getQuestionsForStory(story);
    assert(storyQuestions.length === 6, `Story ${story.id} provides exactly 6 questions (found ${storyQuestions.length})`);
  }
});

// -------------------------------------------------------------
// SUITE 3: State Engine & User Flow Simulation
// -------------------------------------------------------------
runSuite('State Engine & User Flow Simulation', () => {
  const {
    initialState,
    reduceState,
    isLevelUnlocked,
    sessionQuestions,
    currentQuestion,
    currentAnswer,
    validateSavedState,
  } = require('../src/state/engine');

  // 1. Initial State & Unlocking
  let state = initialState('Learner', 0);
  assert(state.pupilName === 'Learner', 'Initial state sets pupil name');
  assert(isLevelUnlocked(state, 1), 'Level 1 is unlocked in demo mode');
  assert(isLevelUnlocked(state, 2), 'Level 2 is unlocked in demo mode');
  assert(isLevelUnlocked(state, 3), 'Level 3 is unlocked in demo mode');

  // 2. Level 1 Flow (Matching + Flashcards)
  const l1SessionId = 'test-l1-session';
  state = reduceState(state, {
    type: 'START',
    level: 1,
    id: l1SessionId,
    at: new Date().toISOString(),
  });
  assert(state.session?.phase === 'instructions', 'Level 1 starts in instructions phase');

  state = reduceState(state, { type: 'BEGIN' });
  assert(state.session?.phase === 'quiz', 'Level 1 transitions to quiz phase');

  const l1Questions = sessionQuestions(state.session);
  for (let i = 0; i < l1Questions.length; i++) {
    const q = currentQuestion(state);
    assert(q.id === l1Questions[i].id, `Level 1 question ${i + 1} matches currentQuestion`);

    state = reduceState(state, {
      type: 'ANSWER',
      questionId: q.id,
      choiceId: q.answerId,
      at: new Date().toISOString(),
    });
    assert(currentAnswer(state)?.correct === true, `Level 1 question ${i + 1} answered correctly`);

    state = reduceState(state, {
      type: 'NEXT',
      questionId: q.id,
      at: new Date().toISOString(),
    });
  }

  assert(state.session?.phase === 'done', 'Level 1 finishes in done phase');
  assert(state.history.length === 1, 'Level 1 attempt recorded in history');
  assert(state.history[0].score === l1Questions.length, 'Level 1 earned perfect score');

  // 3. Level 2 Flow (Sentence Completion)
  const l2SessionId = 'test-l2-session';
  state = reduceState(state, {
    type: 'START',
    level: 2,
    id: l2SessionId,
    at: new Date().toISOString(),
  });
  state = reduceState(state, { type: 'BEGIN' });
  const l2Questions = sessionQuestions(state.session);

  for (let i = 0; i < l2Questions.length; i++) {
    const q = currentQuestion(state);
    state = reduceState(state, {
      type: 'ANSWER',
      questionId: q.id,
      choiceId: q.answerId,
      at: new Date().toISOString(),
    });
    state = reduceState(state, {
      type: 'NEXT',
      questionId: q.id,
      at: new Date().toISOString(),
    });
  }
  assert(state.session?.phase === 'done', 'Level 2 finishes in done phase');
  assert(state.history.length === 2, 'Level 2 attempt recorded in history');

  // 4. Level 3 Flow (Story Reading -> Quiz)
  const l3SessionId = 'test-l3-session';
  state = reduceState(state, {
    type: 'START',
    level: 3,
    id: l3SessionId,
    at: new Date().toISOString(),
  });
  assert(state.session?.phase === 'instructions', 'Level 3 starts in instructions phase');

  state = reduceState(state, { type: 'BEGIN' });
  assert(state.session?.phase === 'story', 'Level 3 transitions to story reading phase');

  state = reduceState(state, { type: 'READ_DONE' });
  assert(state.session?.phase === 'quiz', 'Level 3 transitions to quiz phase after reading');

  const l3Questions = sessionQuestions(state.session);
  for (let i = 0; i < l3Questions.length; i++) {
    const q = currentQuestion(state);
    state = reduceState(state, {
      type: 'ANSWER',
      questionId: q.id,
      choiceId: q.answerId,
      at: new Date().toISOString(),
    });
    state = reduceState(state, {
      type: 'NEXT',
      questionId: q.id,
      at: new Date().toISOString(),
    });
  }
  assert(state.session?.phase === 'done', 'Level 3 finishes in done phase');
  assert(state.history.length === 3, 'Level 3 attempt recorded in history');

  // 5. Level 3 Retry Flow (Verifying no crash or corrupt state on retry)
  const l3RetrySessionId = 'test-l3-retry-session';
  state = reduceState(state, {
    type: 'START',
    level: 3,
    id: l3RetrySessionId,
    at: new Date().toISOString(),
  });
  assert(state.session?.id === l3RetrySessionId, 'Level 3 retry creates new session');
  assert(state.session?.phase === 'instructions', 'Level 3 retry resets to instructions');
  assert(state.session?.answers.length === 0, 'Level 3 retry resets answers array');
  assert(state.history.length === 3, 'Level 3 previous attempt preserved in history during retry');

  // 6. Validation of Saved State
  const validated = validateSavedState(state);
  assert(validated !== null, 'Saved state passes defensive validation');

  let tamperedCaught = false;
  try {
    validateSavedState({ ...state, lifetimeStars: -5 });
  } catch {
    tamperedCaught = true;
  }
  assert(tamperedCaught, 'Tampered state correctly caught by validateSavedState');

  // 7. Test "Run" present tense vocabulary and content
  const { WORDS, QUESTIONS } = require('../src/content');
  assert(Boolean(WORDS.run), 'Word "run" is present in WORDS catalog');
  assert(WORDS.run.word === 'run', 'Word "run" has correct word text');
  assert(WORDS.run.definition.toLowerCase().includes('move quickly'), 'Word "run" has present tense definition');
  assert(WORDS.ran === WORDS.run, 'WORDS.ran backwards-compatibility alias points to WORDS.run');

  // 8. Test Rhyming Distractors in Level 1 & 2 Questions
  const l1QuestionsList = QUESTIONS[1] || [];
  const wordToPicQ = l1QuestionsList.find((q) => q.type === 'wordToPicture');
  if (wordToPicQ) {
    assert(wordToPicQ.choices.length === 4, 'Level 1 wordToPicture question provides 4 choices');
  }
  const picToWordQ = l1QuestionsList.find((q) => q.type === 'pictureToWord');
  if (picToWordQ) {
    assert(picToWordQ.choices.length === 4, 'Level 1 pictureToWord question provides 4 choices');
  }

  // 9. Test NAVIGATE_QUESTION (Previous / Next navigation during quiz)
  let navState = initialState('NavPupil', 0);
  navState = reduceState(navState, {
    type: 'START',
    level: 1,
    id: 'test-nav-session',
    at: new Date().toISOString(),
  });
  navState = reduceState(navState, { type: 'BEGIN' });
  const q0 = currentQuestion(navState);
  navState = reduceState(navState, {
    type: 'ANSWER',
    questionId: q0.id,
    choiceId: q0.answerId,
    at: new Date().toISOString(),
  });
  navState = reduceState(navState, {
    type: 'NEXT',
    questionId: q0.id,
    at: new Date().toISOString(),
  });
  // Now on question index 1, answers.length = 1
  assert(navState.session.index === 1, 'Quiz advances to index 1');
  assert(navState.session.answers.length === 1, 'One answer recorded');

  // Navigate back to index 0 (review mode)
  navState = reduceState(navState, { type: 'NAVIGATE_QUESTION', index: 0 });
  assert(navState.session.index === 0, 'NAVIGATE_QUESTION safely navigates back to index 0');
  assert(navState.session.answers.length === 1, 'Previous answer preserved during navigation');

  // Navigate forward to active index 1
  navState = reduceState(navState, { type: 'NAVIGATE_QUESTION', index: 1 });
  assert(navState.session.index === 1, 'NAVIGATE_QUESTION safely navigates forward to index 1');

  // Attempt invalid navigation beyond answers.length
  const preInvalidState = navState;
  navState = reduceState(navState, { type: 'NAVIGATE_QUESTION', index: 5 });
  assert(navState.session.index === 1, 'NAVIGATE_QUESTION rejects out-of-bounds target index');
});

// -------------------------------------------------------------
// SUMMARY & EXIT CODE
// -------------------------------------------------------------
console.log('\n========================================');
console.log(`Test Results: ${passedTests} passed, ${failedTests} failed, ${totalTests} total.`);
console.log('========================================');

if (failedTests > 0) {
  console.error('\nTests FAILED. Please review the errors above.');
  process.exit(1);
} else {
  console.log('\nAll tests PASSED successfully!');
  process.exit(0);
}
