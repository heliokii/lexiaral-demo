import {
  CONTENT,
  QUESTIONS,
  WORDS,
  UNLOCK_PERCENT,
} from '../content';

export const BADGES = [
  {
    id: 'first-word',
    title: 'First Word',
    description: 'Complete your first vocabulary question.',
  },
  {
    id: 'word-explorer',
    title: 'Word Explorer',
    description: 'Complete Easy.',
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Complete Average.',
  },
  {
    id: 'story-reader',
    title: 'Story Reader',
    description: 'Complete Difficult.',
  },
  {
    id: 'vocabulary-master',
    title: 'Vocabulary Master',
    description: 'Complete all three levels.',
  },
];

export function initialState() {
  return {
    schemaVersion: 1,
    contentId: CONTENT.id,
    audioEnabled: true,
    unlocked: [1],
    badges: [],
    encounteredWordIds: [],
    learnedWordIds: [],
    lifetimeStars: 0,
    answeredActivities: 0,
    history: [],
    session: null,
  };
}

const addUnique = (items, item) =>
  items.includes(item) ? items : [...items, item];

export function latestAttempt(state, level) {
  return [...state.history].reverse().find((item) => item.level === level);
}

export function bestAttempt(state, level) {
  return state.history
    .filter((item) => item.level === level)
    .reduce(
      (best, item) => (!best || item.score > best.score ? item : best),
      null
    );
}

export function currentQuestion(state) {
  const session = state.session;
  return session ? QUESTIONS[session.level][session.index] : null;
}

export function currentAnswer(state) {
  const session = state.session;
  return session ? session.answers[session.index] : null;
}

export function sessionScore(session) {
  return session.answers.filter((answer) => answer.correct).length;
}

function awardCompletionBadges(state) {
  const completed = new Set(state.history.map((attempt) => attempt.level));
  let badges = [...state.badges];

  const milestoneBadges = {
    1: 'word-explorer',
    2: 'sentence-builder',
    3: 'story-reader',
  };

  for (const level of completed) {
    badges = addUnique(badges, milestoneBadges[level]);
  }

  if ([1, 2, 3].every((level) => completed.has(level))) {
    badges = addUnique(badges, 'vocabulary-master');
  }

  return badges;
}

/**
 * Pure state machine.
 * Invalid/repeated actions return the original state and cannot add points.
 */
export function reduceState(state, action) {
  switch (action.type) {
    case 'SET_AUDIO':
      return { ...state, audioEnabled: Boolean(action.enabled) };

    case 'START': {
      if (
        !state.unlocked.includes(action.level) ||
        !QUESTIONS[action.level] ||
        !action.id
      ) {
        return state;
      }

      return {
        ...state,
        session: {
          id: action.id,
          level: action.level,
          phase: 'instructions',
          index: 0,
          answers: [],
          startedAt: action.at,
        },
      };
    }

    case 'BEGIN': {
      if (state.session?.phase !== 'instructions') return state;

      return {
        ...state,
        session: {
          ...state.session,
          phase: state.session.level === 3 ? 'story' : 'quiz',
        },
      };
    }

    case 'READ_DONE': {
      if (state.session?.phase !== 'story') return state;

      return {
        ...state,
        session: { ...state.session, phase: 'quiz' },
      };
    }

    case 'ANSWER': {
      const session = state.session;

      if (!session || session.phase !== 'quiz') return state;

      const question = currentQuestion(state);

      // The expected question ID also rejects stale UI events.
      if (
        action.questionId !== question.id ||
        session.answers[session.index] ||
        !question.choices.some((choice) => choice.id === action.choiceId)
      ) {
        return state;
      }

      const correct = action.choiceId === question.answerId;

      const answer = {
        questionId: question.id,
        choiceId: action.choiceId,
        correct,
        at: action.at,
      };

      return {
        ...state,
        session: {
          ...session,
          answers: [...session.answers, answer],
        },
        lifetimeStars: state.lifetimeStars + (correct ? 1 : 0),
        answeredActivities: state.answeredActivities + 1,

        encounteredWordIds: question.wordId
          ? addUnique(state.encounteredWordIds, question.wordId)
          : state.encounteredWordIds,

        learnedWordIds:
          correct && question.wordId
            ? addUnique(state.learnedWordIds, question.wordId)
            : state.learnedWordIds,

        badges: question.wordId
          ? addUnique(state.badges, 'first-word')
          : state.badges,
      };
    }

    case 'NEXT': {
      const session = state.session;

      if (
        !session ||
        session.phase !== 'quiz' ||
        action.questionId !== currentQuestion(state).id ||
        !currentAnswer(state)
      ) {
        return state;
      }

      const questions = QUESTIONS[session.level];

      if (session.index < questions.length - 1) {
        return {
          ...state,
          session: { ...session, index: session.index + 1 },
        };
      }

      // Finalize only once. The done phase blocks duplicate completion.
      const attempt = {
        id: session.id,
        level: session.level,
        score: sessionScore(session),
        total: questions.length,
        answers: session.answers,
        startedAt: session.startedAt,
        completedAt: action.at,
      };

      let unlocked = [...state.unlocked];

      if (
        session.level < 3 &&
        (attempt.score / attempt.total) * 100 >= UNLOCK_PERCENT
      ) {
        unlocked = addUnique(unlocked, session.level + 1);
      }

      const completedState = {
        ...state,
        unlocked,
        history: [...state.history, attempt],
        session: { ...session, phase: 'done' },
      };

      return {
        ...completedState,
        badges: awardCompletionBadges(completedState),
      };
    }

    default:
      return state;
  }
}

/**
 * Defensive validation for locally stored data.
 * Unknown or incompatible data is not silently erased.
 */
export function validateSavedState(state) {
  const fail = () => {
    throw new Error(
      'Saved progress is incompatible or damaged. It has not been overwritten.'
    );
  };

  if (
    !state ||
    state.schemaVersion !== 1 ||
    state.contentId !== CONTENT.id ||
    typeof state.audioEnabled !== 'boolean'
  ) {
    fail();
  }

  const arrayFields = [
    'unlocked',
    'badges',
    'encounteredWordIds',
    'learnedWordIds',
    'history',
  ];

  for (const field of arrayFields) {
    if (!Array.isArray(state[field])) fail();
  }

  if (
    !state.unlocked.includes(1) ||
    state.unlocked.some((level) => ![1, 2, 3].includes(level)) ||
    state.badges.some((id) => !BADGES.some((badge) => badge.id === id)) ||
    [...state.encounteredWordIds, ...state.learnedWordIds].some(
      (id) => !WORDS[id]
    ) ||
    !Number.isInteger(state.lifetimeStars) ||
    state.lifetimeStars < 0 ||
    !Number.isInteger(state.answeredActivities) ||
    state.answeredActivities < state.lifetimeStars
  ) {
    fail();
  }

  const validAnswers = (level, answers) => {
    const questions = QUESTIONS[level];

    return (
      questions &&
      Array.isArray(answers) &&
      answers.length <= questions.length &&
      answers.every((answer, index) => {
        const question = questions[index];

        return (
          answer.questionId === question.id &&
          question.choices.some((choice) => choice.id === answer.choiceId) &&
          answer.correct === (answer.choiceId === question.answerId)
        );
      })
    );
  };

  const ids = new Set();

  for (const attempt of state.history) {
    if (
      !attempt ||
      typeof attempt.id !== 'string' ||
      ids.has(attempt.id) ||
      !validAnswers(attempt.level, attempt.answers) ||
      attempt.total !== QUESTIONS[attempt.level].length ||
      attempt.answers.length !== attempt.total ||
      attempt.score !== attempt.answers.filter((answer) => answer.correct).length
    ) {
      fail();
    }

    ids.add(attempt.id);
  }

  if (state.session) {
    const session = state.session;
    const phases = ['instructions', 'story', 'quiz', 'done'];

    if (
      typeof session.id !== 'string' ||
      !state.unlocked.includes(session.level) ||
      !validAnswers(session.level, session.answers) ||
      !phases.includes(session.phase) ||
      !Number.isInteger(session.index) ||
      session.index < 0 ||
      session.index >= QUESTIONS[session.level].length
    ) {
      fail();
    }

    if (
      ['instructions', 'story'].includes(session.phase) &&
      (session.index !== 0 || session.answers.length !== 0)
    ) {
      fail();
    }

    if (session.phase === 'story' && session.level !== 3) fail();

    if (
      session.phase === 'quiz' &&
      ![session.index, session.index + 1].includes(session.answers.length)
    ) {
      fail();
    }

    if (
      session.phase === 'done' &&
      (
        session.index !== QUESTIONS[session.level].length - 1 ||
        session.answers.length !== QUESTIONS[session.level].length ||
        !ids.has(session.id)
      )
    ) {
      fail();
    }

    if (session.phase !== 'done' && ids.has(session.id)) fail();
  }

  return state;
}