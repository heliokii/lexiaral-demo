import pack from '../assets/content.json';
import { illustrations } from './illustrations';
import { WORD_IMAGES } from './assets/wordImages';

export const CONTENT = pack;

export const LEVELS = [
  {
    id: 1,
    name: 'Easy',
    title: 'Learn the Words',
    description: 'Pictures and flashcards',
  },
  {
    id: 2,
    name: 'Average',
    title: 'Use the Words',
    description: 'Sentences and meanings',
  },
  {
    id: 3,
    name: 'Difficult',
    title: 'Story Challenge',
    description: 'Reading and understanding',
  },
];

export const WORDS = Object.fromEntries(
  pack.words.map((word) => [word.id, word])
);

// Change to 70, 80, etc. only after approval by the research team.
// Zero means: completing the previous level is sufficient.
export const UNLOCK_PERCENT = 0;

const rotate = (items, offset) => {
  const n = offset % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
};

export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export const EASY_WORDS = pack.words.filter(
  (word) => word.difficulty === 'easy' || word.introduced_level === 1
);

export const AVERAGE_WORDS = pack.words.filter(
  (word) => word.difficulty === 'average' || word.introduced_level === 2
);

export const DIFFICULT_WORDS = pack.words.filter(
  (word) => word.difficulty === 'difficult' || word.introduced_level === 3
);

export const createWordChoices = (target, pool, useDefinitions = false) => {
  const candidatePool = pool && pool.length >= 4 ? pool : pack.words;
  const otherWords = shuffleArray(
    candidatePool.filter((word) => word.id !== target.id)
  ).slice(0, 3);
  const selected = shuffleArray([target, ...otherWords]);

  return selected.map((word) => ({
    id: word.id,
    label: useDefinitions ? word.definition : word.word,
    wordId: word.id,
  }));
};

export const createSentenceChoices = (targetWord, pool) => {
  const candidatePool = (
    pool && pool.length >= 3 ? pool : pack.words
  ).filter((w) => w.example_sentence);
  const otherWords = shuffleArray(
    candidatePool.filter((w) => w.id !== targetWord.id)
  ).slice(0, 2);
  const distractor1 =
    otherWords[0]?.example_sentence ||
    `The ${targetWord.word} is flying in the sky.`;
  const distractor2 =
    otherWords[1]?.example_sentence ||
    `We ate a ${targetWord.word} for breakfast.`;

  const options = [
    { id: targetWord.id, label: targetWord.example_sentence },
    { id: `${targetWord.id}-wrong1`, label: distractor1 },
    { id: `${targetWord.id}-wrong2`, label: distractor2 },
  ];

  return shuffleArray(options);
};

const wordChoices = (target, offset, useDefinitions = false) => {
  const selected = [
    target,
    ...pack.words.filter((word) => word.id !== target.id).slice(0, 3),
  ];

  return rotate(
    selected.map((word) => ({
      id: word.id,
      label: useDefinitions ? word.definition : word.word,
      wordId: word.id,
    })),
    offset
  );
};

const sentenceChoices = (targetWord, offset) => {
  const otherWords = pack.words.filter((w) => w.id !== targetWord.id);
  const distractor1 = otherWords[0]
    ? otherWords[0].example_sentence
    : `The ${targetWord.word} is flying in the sky.`;
  const distractor2 = otherWords[1]
    ? otherWords[1].example_sentence
    : `We ate a ${targetWord.word} for breakfast.`;

  const options = [
    { id: targetWord.id, label: targetWord.example_sentence },
    { id: `${targetWord.id}-wrong1`, label: distractor1 },
    { id: `${targetWord.id}-wrong2`, label: distractor2 },
  ];

  return rotate(options, offset);
};

const easy = pack.words.flatMap((word, index) => [
  {
    id: `easy-picture-${word.id}`,
    type: 'pictureToWord',
    category: 'vocabulary',
    wordId: word.id,
    prompt: 'Which word matches the picture?',
    choices: wordChoices(word, index),
    answerId: word.id,
    explanation: word.definition,
  },
  {
    id: `easy-word-${word.id}`,
    type: 'wordToPicture',
    category: 'vocabulary',
    wordId: word.id,
    prompt: `Which picture shows "${word.word}"?`,
    choices: wordChoices(word, index + 1),
    answerId: word.id,
    explanation: word.definition,
  },
  {
    id: `easy-listen-${word.id}`,
    type: 'listenAndChoose',
    category: 'vocabulary',
    wordId: word.id,
    prompt: 'Listen to the word. Which word did you hear?',
    choices: wordChoices(word, index + 2),
    answerId: word.id,
    explanation: `${word.word}: ${word.definition}`,
  },
]);

const average = pack.words.flatMap((word, index) => [
  {
    id: `average-blank-${word.id}`,
    type: 'sentence',
    category: 'vocabulary',
    wordId: word.id,
    sentence: word.sentence_blank,
    prompt: 'Which word completes the sentence?',
    choices: wordChoices(word, index + 2),
    answerId: word.id,
    explanation: `${word.word}: ${word.definition}`,
  },
  {
    id: `average-pic-${word.id}`,
    type: 'pictureSentence',
    category: 'vocabulary',
    wordId: word.id,
    sentence: word.sentence_blank,
    prompt: 'Look at the picture and complete the sentence:',
    choices: wordChoices(word, index + 1),
    answerId: word.id,
    explanation: `${word.word}: ${word.definition}`,
  },
  {
    id: `average-meaning-${word.id}`,
    type: 'meaning',
    category: 'vocabulary',
    wordId: word.id,
    sentence: word.example_sentence,
    prompt: `What does "${word.word}" mean in this sentence?`,
    choices: wordChoices(word, index + 3, true),
    answerId: word.id,
    explanation: word.example_sentence ? `Example: "${word.example_sentence}"` : `"${word.word}" means: ${word.definition}`,
  },
  {
    id: `average-best-use-${word.id}`,
    type: 'bestUse',
    category: 'vocabulary',
    wordId: word.id,
    sentence: `Word: ${word.word}`,
    prompt: `Which sentence uses "${word.word}" correctly?`,
    choices: sentenceChoices(word, index + 2),
    answerId: word.id,
    explanation: `Correct: "${word.example_sentence}"`,
  },
]);

const difficultVocabulary = pack.story.target_word_ids.map((id, index) => {
  const word = WORDS[id];

  return {
    id: `story-meaning-${id}`,
    type: 'storyQuestion',
    category: 'vocabulary',
    wordId: id,
    prompt: `In the story, what does "${word.word}" mean?`,
    choices: wordChoices(word, index + 1, true),
    answerId: id,
    explanation: word.example_sentence ? `Example: "${word.example_sentence}"` : `"${word.word}" means: ${word.definition}`,
  };
});

const comprehension = pack.story.questions.map((question, index) => ({
  id: question.id,
  type: 'storyQuestion',
  category: question.category,
  prompt: question.prompt,
  choices: rotate(
    question.choices.map((label) => ({ id: label, label })),
    index + 1
  ),
  answerId: question.answer,
  explanation: question.explanation,
}));

const easyMatching = {
  id: 'easy-matching-all',
  type: 'matching',
  category: 'vocabulary',
  prompt: 'Match each target word with its correct picture!',
  pairs: pack.words.slice(0, 6).map((word) => ({
    id: word.id,
    wordId: word.id,
    word: word.word,
    image: word.image_url,
  })),
  choices: [
    { id: 'all_matched', label: 'All pairs matched!' },
    { id: 'keep_matching', label: 'Keep matching' },
  ],
  answerId: 'all_matched',
  explanation: 'All vocabulary words are correctly matched with their pictures.',
};

export const STORIES = pack.stories || [pack.story];

export function getQuestionsForStory(story) {
  if (!story) return [...difficultVocabulary, ...comprehension];
  const storyTargetWords = (story.target_word_ids || [])
    .map((id) => WORDS[id])
    .filter(Boolean);

  const vocab = storyTargetWords.map((word, index) => ({
    id: `${story.id}-vocab-${word.id}`,
    type: 'storyQuestion',
    category: 'vocabulary',
    wordId: word.id,
    prompt: `In the story, what does "${word.word}" mean?`,
    choices: wordChoices(word, index + 1, true),
    answerId: word.id,
    explanation: word.example_sentence ? `Example: "${word.example_sentence}"` : `"${word.word}" means: ${word.definition}`,
  }));

  const comp = (story.questions || []).map((question, index) => ({
    id: `${story.id}-${question.id}`,
    type: 'storyQuestion',
    category: question.category,
    prompt: question.prompt,
    choices: rotate(
      question.choices.map((label) => ({ id: label, label })),
      index + 1
    ),
    answerId: question.answer,
    explanation: question.explanation,
  }));

  return [...vocab, ...comp];
}

// Child-friendly 10-question balanced sessions for Grade 3 attention spans (Section 20 & 21)
export const QUESTIONS = {
  1: [
    easy.find((q) => q.type === 'pictureToWord' && q.wordId === 'cat'),
    easy.find((q) => q.type === 'wordToPicture' && q.wordId === 'mat'),
    easy.find((q) => q.type === 'listenAndChoose' && q.wordId === 'hat'),
    easy.find((q) => q.type === 'pictureToWord' && q.wordId === 'dog'),
    easy.find((q) => q.type === 'wordToPicture' && q.wordId === 'sun'),
    easy.find((q) => q.type === 'listenAndChoose' && q.wordId === 'egg'),
    easy.find((q) => q.type === 'pictureToWord' && q.wordId === 'pen'),
    easy.find((q) => q.type === 'wordToPicture' && q.wordId === 'pig'),
    easy.find((q) => q.type === 'listenAndChoose' && q.wordId === 'hen'),
    easyMatching,
  ].filter(Boolean),

  2: [
    average.find((q) => q.type === 'sentence' && q.wordId === 'basket'),
    average.find((q) => q.type === 'pictureSentence' && q.wordId === 'moon'),
    average.find((q) => q.type === 'meaning' && q.wordId === 'ball'),
    average.find((q) => q.type === 'bestUse' && q.wordId === 'book'),
    average.find((q) => q.type === 'sentence' && q.wordId === 'bark'),
    average.find((q) => q.type === 'pictureSentence' && q.wordId === 'nest'),
    average.find((q) => q.type === 'meaning' && q.wordId === 'test'),
    average.find((q) => q.type === 'bestUse' && q.wordId === 'pencil'),
    average.find((q) => q.type === 'sentence' && q.wordId === 'candle'),
    average.find((q) => q.type === 'pictureSentence' && q.wordId === 'road'),
  ].filter(Boolean),

  3: [...difficultVocabulary, ...comprehension],
};

export function generateSessionQuestions(level, options = {}) {
  if (level === 1) {
    const easyWords = EASY_WORDS.length >= 9 ? EASY_WORDS : pack.words;
    const shuffled = shuffleArray(easyWords);
    const selectedWords = shuffled.slice(0, 9);

    const pictureToWordQuestions = selectedWords.slice(0, 3).map((word) => ({
      id: `easy-picture-${word.id}`,
      type: 'pictureToWord',
      category: 'vocabulary',
      wordId: word.id,
      prompt: 'Which word matches the picture?',
      choices: createWordChoices(word, easyWords, false),
      answerId: word.id,
      explanation: word.definition,
    }));

    const wordToPictureQuestions = selectedWords.slice(3, 6).map((word) => ({
      id: `easy-word-${word.id}`,
      type: 'wordToPicture',
      category: 'vocabulary',
      wordId: word.id,
      prompt: `Which picture shows "${word.word}"?`,
      choices: createWordChoices(word, easyWords, false),
      answerId: word.id,
      explanation: word.definition,
    }));

    const listenQuestions = selectedWords.slice(6, 9).map((word) => ({
      id: `easy-listen-${word.id}`,
      type: 'listenAndChoose',
      category: 'vocabulary',
      wordId: word.id,
      prompt: 'Listen to the word. Which word did you hear?',
      choices: createWordChoices(word, easyWords, false),
      answerId: word.id,
      explanation: `${word.word}: ${word.definition}`,
    }));

    // Randomize the sequence of individual activities
    const randomizedQuestions = shuffleArray([
      ...pictureToWordQuestions,
      ...wordToPictureQuestions,
      ...listenQuestions,
    ]);

    // Matching pairs for the 10th activity: pick 6 random easy words
    const matchingCandidates = shuffleArray(easyWords).slice(0, 6);
    const dynamicMatching = {
      id: 'easy-matching-all',
      type: 'matching',
      category: 'vocabulary',
      prompt: 'Match each target word with its correct picture!',
      pairs: matchingCandidates.map((word) => ({
        id: word.id,
        wordId: word.id,
        word: word.word,
        image: word.image_url,
      })),
      choices: [
        { id: 'all_matched', label: 'All pairs matched!' },
        { id: 'keep_matching', label: 'Keep matching' },
      ],
      answerId: 'all_matched',
      explanation: 'All vocabulary words are correctly matched with their pictures.',
    };

    return [...randomizedQuestions, dynamicMatching];
  }

  if (level === 2) {
    const avgWords = AVERAGE_WORDS.length >= 10 ? AVERAGE_WORDS : pack.words;
    const shuffled = shuffleArray(avgWords);
    const selectedWords = shuffled.slice(0, 10);

    const sentenceQuestions = selectedWords.slice(0, 3).map((word) => ({
      id: `average-blank-${word.id}`,
      type: 'sentence',
      category: 'vocabulary',
      wordId: word.id,
      sentence: word.sentence_blank,
      prompt: 'Which word completes the sentence?',
      choices: createWordChoices(word, avgWords, false),
      answerId: word.id,
      explanation: `${word.word}: ${word.definition}`,
    }));

    const picSentenceQuestions = selectedWords.slice(3, 6).map((word) => ({
      id: `average-pic-${word.id}`,
      type: 'pictureSentence',
      category: 'vocabulary',
      wordId: word.id,
      sentence: word.sentence_blank,
      prompt: 'Look at the picture and complete the sentence:',
      choices: createWordChoices(word, avgWords, false),
      answerId: word.id,
      explanation: `${word.word}: ${word.definition}`,
    }));

    const meaningQuestions = selectedWords.slice(6, 8).map((word) => ({
      id: `average-meaning-${word.id}`,
      type: 'meaning',
      category: 'vocabulary',
      wordId: word.id,
      sentence: word.example_sentence,
      prompt: `What does "${word.word}" mean in this sentence?`,
      choices: createWordChoices(word, avgWords, true),
      answerId: word.id,
      explanation: word.example_sentence
        ? `Example: "${word.example_sentence}"`
        : `"${word.word}" means: ${word.definition}`,
    }));

    const bestUseQuestions = selectedWords.slice(8, 10).map((word) => ({
      id: `average-best-use-${word.id}`,
      type: 'bestUse',
      category: 'vocabulary',
      wordId: word.id,
      sentence: `Word: ${word.word}`,
      prompt: `Which sentence uses "${word.word}" correctly?`,
      choices: createSentenceChoices(word, avgWords),
      answerId: word.id,
      explanation: `Correct: "${word.example_sentence}"`,
    }));

    return shuffleArray([
      ...sentenceQuestions,
      ...picSentenceQuestions,
      ...meaningQuestions,
      ...bestUseQuestions,
    ]);
  }

  if (level === 3) {
    const storyId = options.storyId || CONTENT.story?.id || 'story-cat';
    const story = (STORIES || []).find((s) => s.id === storyId) || CONTENT.story;
    return getQuestionsForStory(story);
  }

  return QUESTIONS[level] || [];
}

export function performance(score, total) {
  const percentage = total ? (score / total) * 100 : 0;

  if (percentage >= 90) return 'Excellent!';
  if (percentage >= 80) return 'Great Job!';
  if (percentage >= 70) return 'Good Work!';
  return 'Keep Practicing!';
}

export function answerLabel(question) {
  const choice = (question.choices || []).find(
    (c) => c.id === question.answerId
  );
  return choice ? choice.label : '';
}

export function getFeedbackDetails(question, correct) {
  const isMatching =
    question?.type === 'matching' ||
    question?.answerId === 'all_matched' ||
    (question?.choices && question.choices.some(c => c.id === 'all_matched'));

  const correctLabel = answerLabel(question);
  let rawExplanation = (question.explanation || '').trim();

  // Strip redundant duplicate prefixes like "hat: ", "hat. ", "hat - "
  if (correctLabel) {
    const pColon = `${correctLabel}:`;
    const pDot = `${correctLabel}.`;
    const pDash = `${correctLabel} -`;
    if (rawExplanation.toLowerCase().startsWith(pColon.toLowerCase())) {
      rawExplanation = rawExplanation.slice(pColon.length).trim();
    } else if (rawExplanation.toLowerCase().startsWith(pDot.toLowerCase())) {
      rawExplanation = rawExplanation.slice(pDot.length).trim();
    } else if (rawExplanation.toLowerCase().startsWith(pDash.toLowerCase())) {
      rawExplanation = rawExplanation.slice(pDash.length).trim();
    }
  }

  // If explanation is verbatim identical to correctLabel, suppress to prevent repetition
  if (correctLabel && rawExplanation.trim().toLowerCase() === correctLabel.trim().toLowerCase()) {
    rawExplanation = '';
  }

  // Clean any trailing ellipsis artifacts
  if (rawExplanation.endsWith('...')) {
    rawExplanation = rawExplanation.slice(0, -3).trim();
    if (rawExplanation && !rawExplanation.endsWith('.')) {
      rawExplanation += '.';
    }
  }

  // Capitalize first letter of explanation
  if (rawExplanation) {
    rawExplanation = rawExplanation.charAt(0).toUpperCase() + rawExplanation.slice(1);
  }

  const title = correct ? 'Great Job!' : 'Nice Try!';

  let fullSpeech = '';
  if (isMatching) {
    fullSpeech = correct
      ? `${title} All pairs matched! ${rawExplanation}`.trim()
      : `${title} Let's keep matching words with their pictures.`.trim();
  } else {
    const speechExp = rawExplanation ? ` ${rawExplanation}` : '';
    fullSpeech = `${title} The correct answer is ${correctLabel}.${speechExp}`.trim();
  }

  return {
    correct,
    title,
    isMatching,
    correctLabel: isMatching ? 'All pairs matched!' : correctLabel,
    explanation: rawExplanation,
    fullSpeech,
  };
}

export function feedbackFor(question, correct) {
  return getFeedbackDetails(question, correct).fullSpeech;
}

// Fail visibly at startup instead of letting invalid content corrupt scores.
export function validateContent() {
  const requiredFields = [
    'id',
    'word',
    'image_url',
    'audio_url',
    'definition',
    'example_sentence',
    'story_context',
    'sentence_blank',
  ];

  if (pack.words.length < 4) {
    throw new Error('The content pack needs at least four vocabulary words.');
  }

  if (new Set(pack.words.map((word) => word.id)).size !== pack.words.length) {
    throw new Error('Vocabulary IDs must be unique.');
  }

  for (const word of pack.words) {
    for (const field of requiredFields) {
      if (typeof word[field] !== 'string' || !word[field].trim()) {
        throw new Error(`Missing ${field} for vocabulary item ${word.id}.`);
      }
    }

    const imageKey = word.image_url.replace('asset://', '');

    if (!WORD_IMAGES[imageKey] && !illustrations[imageKey]) {
      throw new Error(`Missing bundled illustration: ${word.image_url}`);
    }

    if (!word.audio_url.startsWith('tts://')) {
      throw new Error(`This build expects a TTS URI for ${word.id}.`);
    }
  }

  for (const id of pack.story.target_word_ids) {
    if (!WORDS[id]) throw new Error(`Unknown story vocabulary ID: ${id}`);
  }

  const questionIds = new Set();

  for (const questions of Object.values(QUESTIONS)) {
    if (!questions.length) throw new Error('A level has no questions.');

    for (const question of questions) {
      if (questionIds.has(question.id)) {
        throw new Error(`Duplicate question ID: ${question.id}`);
      }

      questionIds.add(question.id);

      if (
        question.choices.length < 2 ||
        new Set(question.choices.map((choice) => choice.id)).size !==
          question.choices.length ||
        !question.choices.some(
          (choice) => choice.id === question.answerId
        )
      ) {
        throw new Error(`Invalid answer choices: ${question.id}`);
      }
    }
  }
}