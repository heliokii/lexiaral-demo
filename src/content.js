import pack from '../assets/content.json';
import { illustrations } from './illustrations';

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
    id: `average-meaning-${word.id}`,
    type: 'meaning',
    category: 'vocabulary',
    wordId: word.id,
    sentence: word.example_sentence,
    prompt: `What does "${word.word}" mean in this sentence?`,
    choices: wordChoices(word, index + 3, true),
    answerId: word.id,
    explanation: word.definition,
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
    explanation: `${word.story_context} ${word.definition}`,
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

export const QUESTIONS = {
  1: easy,
  2: average,
  3: [...difficultVocabulary, ...comprehension],
};

export function performance(score, total) {
  const percentage = total ? (score / total) * 100 : 0;

  if (percentage >= 90) return 'Excellent!';
  if (percentage >= 80) return 'Great Job!';
  if (percentage >= 70) return 'Good Work!';
  return 'Keep Practicing!';
}

export function answerLabel(question) {
  return question.choices.find(
    (choice) => choice.id === question.answerId
  ).label;
}

export function feedbackFor(question, correct) {
  const result = correct
    ? 'Great Job! You earned 1 star.'
    : `Nice Try! The correct answer is ${answerLabel(question)}.`;

  return `${result} ${question.explanation}`;
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

    if (!illustrations[imageKey]) {
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