/**
 * Content audit fixes (client revision round).
 *
 * 1. Adds the per-word `question_text` shown by the Level 1 "picture" question
 *    (see src/components/learning.jsx -> FlashcardQuestionWidget).
 * 2. Repairs story question sets whose prompts / answers / explanations drifted
 *    away from the story text they are asked about (stale template output).
 *
 * Run: node scripts/fix-content-audit.cjs   (idempotent, rewrites assets/content.json)
 */
const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '..', 'assets', 'content.json');
const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));

// ---------------------------------------------------------------- 1. Word question text
// Format: "<TARGET WORD uppercase> – <question for the picture>"
const WORD_QUESTION_TEXTS = {
  // Level 1 - Easy (20 Words)
  cat: 'What animal is this?',
  mat: 'What is on the floor?',
  hat: 'What do you wear on your head?',
  rat: 'What animal is this?',
  bat: 'What animal is this?',
  pen: 'What tool do you use to write?',
  sun: 'What shines brightly in the sky?',
  sit: 'What does the girl do?',
  run: 'What is the boy doing?',
  ran: 'What is the boy doing?',
  sad: 'How does this face feel?',
  bag: 'What do you carry your things in?',
  map: 'What drawing shows places and roads?',
  man: 'Who is in the picture?',
  dog: 'What animal is this?',
  cow: 'What animal is this?',
  dig: 'What is he doing?',
  egg: 'What is this?',
  red: 'What color is this?',
  hen: 'What animal is this?',
  pig: 'What animal is this?',

  // Level 2 - Average (15 Words)
  basket: 'What container is this?',
  moon: 'What shines in the night sky?',
  ball: 'What round toy do you play with?',
  book: 'What do you open and read?',
  bark: 'What does the dog do?',
  nest: 'Where do birds lay their eggs?',
  test: 'What is the student taking?',
  tell: 'What does the boy do?',
  pencil: 'What tool do you write or draw with?',
  candle: 'What gives light when it burns?',
  nine: 'What number is this?',
  bath: 'What does the boy take to get clean?',
  nuts: 'What crunchy food is this?',
  road: 'What do cars drive on?',
  stop: 'What does this hand sign mean?',

  // Level 3 - Difficult (15 Words)
  happy: 'How does this face feel?',
  little: 'What word describes this small bird?',
  floor: 'What part of the room do you walk on?',
  card: 'What greeting item is this?',
  switch: 'What turns the light on and off?',
  bell: 'What makes a ringing sound?',
  rain: 'What is falling from the cloud?',
  rock: 'What hard stones are these?',
  round: 'What shape is this wooden board?',
  plant: 'What is growing in the pot?',
  green: 'What color is this?',
  black: 'What color is this?',
  house: 'What building do people live in?',
  chair: 'What furniture do you sit on?',
  clock: 'What object tells the time?',
};

let questionTextsAdded = 0;
for (const word of content.words) {
  const text = WORD_QUESTION_TEXTS[word.id];
  if (!text) continue;
  word.question_text = text;
  questionTextsAdded += 1;
}

// ---------------------------------------------------------------- 2. Story question repairs
// Every prompt below is answerable only from the story text it belongs to.
const qq = (id, prompt, answer, choices, explanation) => ({
  id,
  category: 'comprehension',
  prompt,
  choices,
  answer,
  explanation,
});

const STORY_QUESTION_FIXES = {
  'story-bag': [
    qq('q-bag-1', 'What does Ana have?', 'A new red bag',
      ['A new red bag', 'A new red hat', 'A new blue pen', 'A small cat'],
      'The story says Ana has a new red bag.'),
    qq('q-bag-2', "What color is Ana's bag?", 'Red',
      ['Red', 'Yellow', 'Blue', 'Green'],
      "Ana's bag is red."),
    qq('q-bag-3', 'Who gave Ana the bag?', 'Her mother',
      ['Her mother', 'Her father', 'Her teacher', 'Her friend'],
      "Ana's mother gave her the bag."),
    qq('q-bag-4', 'What does Ana put inside her bag?', 'Her books, pencils, and lunch',
      ['Her books, pencils, and lunch', 'Only her toys', 'Only her clothes', 'A pair of shoes'],
      'Ana puts her books, pencils, and lunch inside the bag.'),
    qq('q-bag-5', 'Why does Ana take good care of her bag?', 'It helps her carry her school things',
      ['It helps her carry her school things', 'It has many pockets', 'It was a birthday gift', 'It has colorful pictures'],
      'Ana takes care of her bag because it helps her carry her school things.'),
  ],

  'story-cow': [
    qq('q-cow-1', 'What animal did Mia see?', 'A big brown cow',
      ['A big brown cow', 'A little horse', 'A pink pig', 'A friendly dog'],
      'Mia saw a big brown cow in the field near her house.'),
    qq('q-cow-2', 'What color was the cow?', 'Brown',
      ['Brown', 'Black and white', 'Pink', 'Yellow'],
      'The cow in the field was big and brown.'),
    qq('q-cow-3', 'What was the cow eating?', 'Green grass',
      ['Green grass', 'Corn and wheat', 'Apples', 'Bread'],
      'The cow was eating green grass under the warm sun.'),
    qq('q-cow-4', 'Where did the cow rest?', 'Under a small tree',
      ['Under a small tree', 'Inside a barn', 'Near the river', 'On the road'],
      'After eating, the cow walked to a small tree and rested under its shade.'),
    qq('q-cow-5', 'Why did Mia smile?', 'She enjoyed watching the gentle cow',
      ['She enjoyed watching the gentle cow', 'She was tired and sleepy', 'She felt afraid of the cow', 'She was hungry'],
      'Mia smiled because she enjoyed watching the gentle cow.'),
  ],

  'story-dig': [
    qq('q18-1', 'Where does the man work?', 'In his garden',
      ['In his garden', 'In a store', 'At school', 'Near the river'],
      'The man works in his garden every morning.'),
    qq('q18-2', 'What does the man decide to plant?', 'A small tree',
      ['A small tree', 'Some flowers', 'A vegetable', 'A big rock'],
      'One day, he decides to plant a small tree.'),
    qq('q18-3', 'What does the man use to dig a hole?', 'A shovel',
      ['A shovel', 'A spoon', 'A stick', 'His hands'],
      'He uses a shovel to dig a hole in the soil.'),
    qq('q18-4', 'What does the man put into the hole?', 'A seed',
      ['A seed', 'A rock', 'A toy', 'A small box'],
      'After digging, he puts a seed into the hole and covers it with soil.'),
    qq('q18-5', 'Why is the man happy?', 'The tree will make the garden beautiful',
      ['The tree will make the garden beautiful', 'He found a toy', 'He can go home', 'It will rain soon'],
      'He is happy because he knows the tree will make the garden beautiful.'),
  ],
};

// (remaining fixes are appended below)

Object.assign(STORY_QUESTION_FIXES, {
  'story-nine': [
    qq('q26-1', 'What did Lina and her mother pick?', 'Apples',
      ['Apples', 'Oranges', 'Pencils', 'Nuts'],
      'Lina and her mother pick apples from the garden.'),
    qq('q26-2', 'How many apples did they collect?', 'Nine',
      ['Nine', 'Seven', 'Eight', 'Ten'],
      'They collect nine red apples and put them in a basket.'),
    qq('q26-3', 'Where did they put the apples?', 'In a basket',
      ['In a basket', 'In a bag', 'On the table', 'In a box'],
      'They collect the apples and put them in a basket.'),
    qq('q26-4', 'What does Lina do to make sure there are nine apples?', 'She counts the apples one by one',
      ['She counts the apples one by one', 'She asks her mother', 'She weighs the apples', 'She hides the apples'],
      'Lina counts the apples one by one to make sure there are nine.'),
    qq('q26-5', 'Why is Lina happy?', 'She helped her mother',
      ['She helped her mother', 'She won a prize', 'She had new shoes', 'She finished first'],
      'Lina is happy because she helped her mother.'),
  ],

  'story-nuts': [
    qq('q27-1', 'What lives in the big tree?', 'A little squirrel',
      ['A little squirrel', 'A big bird', 'A small dog', 'A cat'],
      'A little squirrel lives in a big tree near the forest.'),
    qq('q27-2', 'What did the squirrel find?', 'Some nuts',
      ['Some nuts', 'Some apples', 'A ball', 'A red hat'],
      'One morning, the squirrel finds some nuts under the tree.'),
    qq('q27-3', 'Where were the nuts?', 'Under the tree',
      ['Under the tree', 'On the roof', 'Inside a pot', 'Near the gate'],
      'The squirrel finds the nuts under the tree.'),
    qq('q27-4', 'Where did the squirrel carry the nuts?', 'To a small hole in the ground',
      ['To a small hole in the ground', 'To its nest in the tree', 'To the river', 'To a farm'],
      'The squirrel carries the nuts to a small hole in the ground.'),
    qq('q27-5', 'Why did the squirrel keep the nuts?', 'It will have food when it gets hungry',
      ['It will have food when it gets hungry', 'It wanted to play with them', 'It wanted to give them away', 'It liked counting them'],
      'It keeps the nuts there for later, when it gets hungry.'),
  ],

  'story-road': [
    qq('q41-1', 'Who walked home with Mark?', 'His sister',
      ['His sister', 'His father', 'His friend', 'His teacher'],
      'Mark and his sister walk home from school.'),
    qq('q41-2', 'Where did Mark and his sister walk?', 'Along a quiet road near their house',
      ['Along a quiet road near their house', 'Through a busy market', 'Up a mountain', 'Beside the river'],
      'They walk along a quiet road near their house.'),
    qq('q41-3', 'What did Mark do before crossing?', 'He looked left and right for cars',
      ['He looked left and right for cars', 'He ran across quickly', 'He called his mother', 'He closed his eyes'],
      'Before crossing, Mark looks left and right to check for cars.'),
    qq('q41-4', 'What did Mark hold while crossing?', "His sister's hand",
      ["His sister's hand", 'His school bag', 'A red ball', 'His hat'],
      "He holds his sister's hand as they cross the road."),
    qq('q41-5', 'What did they do after reaching the other side?', 'Continued walking home safely',
      ['Continued walking home safely', 'Went back to school', 'Stopped to play', 'Rode in a car'],
      'They continue walking home safely.'),
  ],

  'story-stop': [
    qq('q24-1', 'Who was walking with Leo?', 'His father',
      ['His father', 'His mother', 'His sister', 'His teacher'],
      'Leo and his father are walking along the road.'),
    qq('q24-2', 'What did they see near the corner?', 'A red stop sign',
      ['A red stop sign', 'A green light', 'A small house', 'A big rock'],
      'They see a red stop sign near the corner.'),
    qq('q24-3', "What did Leo's father tell him to do?", 'Stop and look for cars',
      ['Stop and look for cars', 'Run across the road', 'Wait for a friend', 'Go back home'],
      'His father tells Leo to stop and look for cars before crossing.'),
    qq('q24-4', 'What did Leo do before crossing?', 'He waited until the road was clear',
      ['He waited until the road was clear', 'He crossed right away', 'He called his mother', 'He played near the sign'],
      'Leo waits until the road is clear.'),
    qq('q24-5', 'What did Leo and his father do together?', 'Crossed the road safely',
      ['Crossed the road safely', 'Walked back home', 'Sat on a bench', 'Bought some food'],
      'Then, they cross the road safely together.'),
  ],

  'story-test': [
    qq('q30-1', 'When does Mia have a test?', 'On Friday',
      ['On Friday', 'On Monday', 'On Sunday', 'Today'],
      'Mia has a test at school on Friday.'),
    qq('q30-2', 'What does Mia do to prepare for the test?', 'She studies her lessons every afternoon',
      ['She studies her lessons every afternoon', 'She plays outside', 'She reads a storybook', 'She helps her mother'],
      'She studies her lessons every afternoon to prepare.'),
    qq('q30-3', 'What does the teacher give each pupil?', 'A sheet of paper',
      ['A sheet of paper', 'A new pencil', 'A small book', 'A red ball'],
      'Her teacher gives each pupil a sheet of paper.'),
    qq('q30-4', 'What does Mia do before writing her answers?', 'She reads each question carefully',
      ['She reads each question carefully', 'She talks to her friend', 'She draws a picture', 'She closes her eyes'],
      'Mia reads each question carefully before writing her answers.'),
    qq('q30-5', 'What does Mia do when she finishes?', 'She checks her work and submits her test',
      ['She checks her work and submits her test', 'She goes home at once', 'She plays with her friend', 'She starts again'],
      'When she finishes, she checks her work and submits her test to the teacher.'),
  ],

  'story-tell': [
    qq('q35-1', 'What did Lia find?', 'A book',
      ['A book', 'A pencil', 'A bag', 'A ball'],
      'Lia finds a book under her classroom table.'),
    qq('q35-2', 'Where did Lia find the book?', 'Under her classroom table',
      ['Under her classroom table', 'Beside the door', 'In her bag', 'On the chair'],
      'Lia finds a book under her classroom table.'),
    qq('q35-3', 'What did Lia decide to do with the book?', 'Give it to her teacher',
      ['Give it to her teacher', 'Keep it at home', 'Hide it in her bag', 'Give it to a friend'],
      'She decides to tell her teacher and gives the book to her.'),
    qq('q35-4', 'What did the teacher say to Lia?', 'Thanked her for being honest',
      ['Thanked her for being honest', 'Told her to keep the book', 'Asked her to leave', 'Gave her a new book'],
      'The teacher thanks Lia for being honest.'),
    qq('q35-5', 'Why did Lia feel happy?', 'She helped her classmate',
      ['She helped her classmate', 'She got a new book', 'She won a prize', 'She finished her work'],
      'Lia feels happy because she helped her classmate.'),
  ],

  'story-pencil': [
    qq('q-pencil-1', 'What was Ben doing when his pencil fell?', 'Doing his schoolwork',
      ['Doing his schoolwork', 'Playing outside', 'Eating his lunch', 'Cleaning his desk'],
      'Ben is doing his schoolwork when his pencil falls.'),
    qq('q-pencil-2', 'Where did the pencil fall?', 'Under his chair',
      ['Under his chair', 'On the table', 'Inside his bag', 'Near the door'],
      'His pencil falls under his chair.'),
    qq('q-pencil-3', 'Who helped Ben look for the pencil?', 'His friend Ana',
      ['His friend Ana', 'His teacher', 'His brother', 'His mother'],
      'His friend Ana helps him look for the pencil.'),
    qq('q-pencil-4', 'Where did they find the pencil?', "Beside Ben's school bag",
      ["Beside Ben's school bag", 'Under the chair', "On the teacher's desk", 'Near the window'],
      "They find the pencil beside Ben's school bag."),
    qq('q-pencil-5', 'What did Ben do after finding his pencil?', 'He thanked Ana and continued writing his work',
      ['He thanked Ana and continued writing his work', 'He went home', 'He played with Ana', 'He put it in his bag'],
      'Ben picks it up, thanks Ana for helping him, and continues writing his work.'),
  ],

  'story-book': [
    qq('q-book-1', 'Who receives a new book?', 'Lara',
      ['Lara', 'Mia', 'Sara', 'Nina'],
      'Lara receives a new book.'),
    qq('q-book-2', 'Who gives Lara the book?', 'Her teacher',
      ['Her teacher', 'Her aunt', 'Her mother', 'Her grandmother'],
      'Lara receives a new book from her teacher.'),
    qq('q-book-3', 'What is the book about?', 'Animals',
      ['Animals', 'Cars and airplanes', 'Plants and trees', 'Stars in the sky'],
      'The book has an interesting story about animals.'),
    qq('q-book-4', 'When does Lara read the book?', 'Every afternoon',
      ['Every afternoon', 'Only in the morning', 'Late at night', 'During class'],
      'Every afternoon, Lara sits in a quiet place and reads a few pages.'),
    qq('q-book-5', 'Why does Lara enjoy reading?', 'It helps her learn and imagine new things',
      ['It helps her learn and imagine new things', 'It has no words', 'Her teacher asked her to', 'She has nothing else to do'],
      'Lara enjoys reading because it helps her learn and imagine new things.'),
  ],

  'story-nest': [
    qq('q-nest-1', 'What animal builds the nest?', 'A small bird',
      ['A small bird', 'A little squirrel', 'A brown hen', 'A bat'],
      'A small bird builds a nest in a tall tree near a house.'),
    qq('q-nest-2', 'Where does the bird build its nest?', 'In a tall tree near a house',
      ['In a tall tree near a house', 'On a mango branch', 'Under the house', 'Beside the road'],
      'It builds the nest in a tall tree near a house.'),
    qq('q-nest-3', 'What does the bird use to make the nest?', 'Dry grass and small twigs',
      ['Dry grass and small twigs', 'Leaves and soft feathers', 'Mud and stones', 'Paper and string'],
      'It uses dry grass and small twigs to make the nest.'),
    qq('q-nest-4', 'How many eggs does the bird lay?', 'Three small eggs',
      ['Three small eggs', 'Two blue eggs', 'Five brown eggs', 'One big egg'],
      'The bird lays three small eggs inside the nest.'),
    qq('q-nest-5', 'What comes out of the eggs?', 'Three tiny birds',
      ['Three tiny birds', 'Little chicks', 'Small frogs', 'Tiny ducks'],
      'After some days, the eggs hatch, and three tiny birds come out.'),
  ],

  'story-chair': [
    qq('q-chair-1', 'What does Ben see in his classroom?', 'A new chair',
      ['A new chair', 'A new table', 'A big clock', 'A small bag'],
      'Ben sees a new chair inside his classroom.'),
    qq('q-chair-2', 'Where is the chair?', 'Beside his desk near the window',
      ['Beside his desk near the window', 'Under his desk', 'At the back of the room', 'Beside the door'],
      'The chair is beside his desk near the window.'),
    qq('q-chair-3', 'What does Ben do while sitting on the chair?', 'He opens his book to read',
      ['He opens his book to read', 'He plays with his pencil', 'He draws on the desk', 'He takes a nap'],
      'He sits on the chair and opens his book to read.'),
    qq('q-chair-4', 'Who does Ben listen to during class?', 'His teacher',
      ['His teacher', 'His classmate', 'The principal', 'His mother'],
      'During class, Ben listens carefully to his teacher.'),
    qq('q-chair-5', 'What does Ben do with the chair after class?', 'Pushes it under his desk',
      ['Pushes it under his desk', 'Leaves it in the aisle', 'Moves it outside', 'Stacks it on the table'],
      'After class, he pushes the chair under his desk to keep the room neat.'),
  ],

  'story-candle': [
    qq('q-candle-1', 'Who are at home when the electricity goes out?', 'Anna and her mother',
      ['Anna and her mother', 'Anna and her father', 'Anna and her brother', 'Anna alone'],
      'One evening, the electricity goes out at Anna\u2019s house while she is with her mother.'),
    qq('q-candle-2', 'What does Mother use to light the dark room?', 'A candle',
      ['A candle', 'A lamp', 'A flashlight', 'A big fire'],
      'The room becomes dark, so her mother lights a candle.'),
    qq('q-candle-3', 'What does Anna read?', 'A small book',
      ['A small book', 'A long story', 'A newspaper', 'A letter'],
      'Anna sits beside her mother and reads a small book.'),
    qq('q-candle-4', 'What does the candle give them?', 'Enough light to see',
      ['Enough light to see', 'Warm water', 'New books', 'Clean air'],
      'The candle gives them enough light to see.'),
    qq('q-candle-5', 'What does Mother do with the candle after the electricity comes back?', 'She blows it out and puts it in a safe place',
      ['She blows it out and puts it in a safe place', 'She keeps it burning all night', 'She throws it away', 'She gives it to Anna'],
      'After the electricity comes back, Mother blows out the candle and puts it in a safe place.'),
  ],

  'story-card': [
    qq('q-card-1', 'Who is celebrating a birthday?', "Anna's mother",
      ["Anna's mother", "Anna's teacher", "Anna's friend", 'Anna'],
      "Anna wants to make something special for her mother's birthday."),
    qq('q-card-2', 'What does Anna make for her mother?', 'A colorful birthday card',
      ['A colorful birthday card', 'A small cake', 'A paper flower', 'A new bag'],
      'Anna makes a beautiful birthday card.'),
    qq('q-card-3', 'What does Anna use to make the card?', 'Paper and colorful crayons',
      ['Paper and colorful crayons', 'Glue and stickers', 'Scissors and tape', 'Paint and brushes'],
      'She gets a piece of paper and colorful crayons.'),
    qq('q-card-4', 'What does Anna write inside the card?', 'A kind message',
      ['A kind message', 'A short story', 'Her name only', 'A drawing'],
      'She writes a kind message inside the card.'),
    qq('q-card-5', "How does Anna's mother react to the card?", 'She smiles and thanks Anna',
      ['She smiles and thanks Anna', 'She hugs Anna warmly', 'She puts the card away', 'She asks for another one'],
      'Her mother smiles and thanks Anna for the thoughtful gift.'),
  ],

  'story-hen': [
    qq('q-hen-1', 'Where does Lina go?', "To her grandmother's farm",
      ["To her grandmother's farm", 'To the market', 'To school', 'To the park'],
      "Lina visits her grandmother's farm one morning."),
    qq('q-hen-2', 'What animal does Lina see?', 'A brown hen',
      ['A brown hen', 'A little duck', 'A white bird', 'A small chick'],
      'She sees a brown hen walking near the small chicken house.'),
    qq('q-hen-3', 'What is the hen sitting on?', 'Her eggs',
      ['Her eggs', 'Some seeds', 'A nest of twigs', 'A small rock'],
      'The hen sits quietly on her eggs to keep them warm.'),
    qq('q-hen-4', 'Why does the hen sit on the eggs?', 'To keep them warm until they hatch',
      ['To keep them warm until they hatch', 'To hide them', 'To sleep', 'To eat them'],
      'The hen sits on her eggs to keep them warm until they hatch.'),
    qq('q-hen-5', 'What comes out of the eggs?', 'Small chicks',
      ['Small chicks', 'Small ducks', 'Tiny birds', 'Frogs'],
      'After a few days, the eggs hatch into small chicks.'),
  ],

  'story-clock': [
    qq('q-clock-1', 'Where is the clock?', "On the wall of Mia's classroom",
      ["On the wall of Mia's classroom", "On the teacher's desk", 'Near the door', 'On the window sill'],
      "There is a big clock on the wall of Mia's classroom."),
    qq('q-clock-2', 'Who looks at the clock every morning?', 'Mia',
      ['Mia', 'The teacher', 'The school principal', 'The guard'],
      'Every morning, Mia looks at the clock to check the time.'),
    qq('q-clock-3', 'What does the clock tell Mia?', 'When it is time for class and recess',
      ['When it is time for class and recess', 'The temperature outside', 'What day it is', 'Who is absent'],
      'The clock helps everyone know when it is time for class and recess.'),
    qq('q-clock-4', 'What time does the teacher start the class?', "Eight o'clock in the morning",
      ["Eight o'clock in the morning", 'Seven o\u2019clock', 'Nine o\u2019clock', 'Eight-thirty'],
      'When the clock shows eight o\u2019clock, her teacher starts the class.'),
    qq('q-clock-5', 'How does the clock help the pupils?', 'It tells them when it is time for class and recess',
      ['It tells them when it is time for class and recess', 'It plays music', 'It rings loudly', 'It counts numbers'],
      'The clock helps everyone know when it is time for class and recess.'),
  ],

  'story-switch': [
    qq('q-switch-1', 'Who enters the room in the evening?', 'Ben',
      ['Ben', 'Anna', 'Mia', 'Leo'],
      'One evening, Ben enters his room.'),
    qq('q-switch-2', 'Why is the room dark?', 'It is evening and the light is off',
      ['It is evening and the light is off', 'The windows are closed', 'A curtain covers the light', 'The bulb is broken'],
      'One evening, Ben enters his room and notices that it is dark.'),
    qq('q-switch-3', 'Where does Ben find the switch?', 'On the wall',
      ['On the wall', 'On the table', 'Beside his bed', 'Near the door'],
      'Ben walks to the wall and finds the light switch.'),
    qq('q-switch-4', 'What happens when Ben flips the switch?', 'The light turns on',
      ['The light turns on', 'The door opens', 'The fan starts', 'The radio plays'],
      'He flips the switch, and the light turns on.'),
    qq('q-switch-5', 'Why does Ben smile?', 'He can now see his books clearly',
      ['He can now see his books clearly', 'He found his toy', 'He finished his work', 'He can go outside'],
      'Ben smiles because he can now see his books clearly.'),
  ],
});

// ---------------------------------------------------------------- 3. Single-question patches
// The prompt asked "say" but the story describes an action.
const QUESTION_PATCHES = [
  {
    storyId: 'story-man',
    questionId: 'q15-5',
    patch: {
      prompt: 'What does the child do to thank the man?',
      explanation: 'The child smiles and thanks the kind man.',
    },
  },
  // story-bath: the questions were written for "Leo" but the story is about Ben.
  {
    storyId: 'story-bath',
    questionId: 'q39-1',
    patch: {
      prompt: 'What did Ben do in the afternoon?',
      explanation: 'Ben spent the afternoon playing outside with his friends.',
    },
  },
  {
    storyId: 'story-bath',
    questionId: 'q39-4',
    patch: {
      prompt: 'What did Ben put on?',
      explanation: 'After his bath, Ben puts on clean clothes.',
    },
  },
  {
    storyId: 'story-bath',
    questionId: 'q39-5',
    patch: {
      prompt: 'What was Ben ready to do?',
      explanation:
        'His mother told him to take a bath before eating dinner, so he was ready to eat dinner with his family.',
    },
  },
];

// ---------------------------------------------------------------- Apply
let storyQuestionsReplaced = 0;
for (const story of content.stories) {
  const fixed = STORY_QUESTION_FIXES[story.id];
  if (!fixed) continue;
  story.questions = fixed;
  storyQuestionsReplaced += fixed.length;
}

let questionPatchesApplied = 0;
for (const { storyId, questionId, patch } of QUESTION_PATCHES) {
  const story = content.stories.find((s) => s.id === storyId);
  const question = story?.questions?.find((q) => q.id === questionId);
  if (!question) continue;
  Object.assign(question, patch);
  questionPatchesApplied += 1;
}

fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, 'utf8');

console.log(`question_text added to ${questionTextsAdded} word item(s).`);
console.log(
  `Rebuilt ${storyQuestionsReplaced} story questions across ${
    Object.keys(STORY_QUESTION_FIXES).length
  } stories.`
);
console.log(`Patched ${questionPatchesApplied} individual question(s).`);
console.log(`Wrote ${path.relative(process.cwd(), CONTENT_PATH)}.`);






