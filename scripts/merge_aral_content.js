const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'assets', 'content.json');
const illustrationsPath = path.join(__dirname, '..', 'src', 'illustrations.js');

const raw = fs.readFileSync(contentPath, 'utf8');
const content = JSON.parse(raw);

const newWords = [
  {
    id: "pink",
    word: "pink",
    image_url: "asset://pink",
    audio_url: "tts://en-US/pink",
    definition: "A soft, pale red or rose color.",
    example_sentence: "The fan is pink.",
    story_context: "She saw a small pink fan beside the window.",
    introduced_level: 1,
    sentence_blank: "The fan is ____."
  },
  {
    id: "fast",
    word: "fast",
    image_url: "asset://fast",
    audio_url: "tts://en-US/fast",
    definition: "Moving or able to move at high speed; quick.",
    example_sentence: "The car is fast.",
    story_context: "When Ben pushed it, the car moved very fast.",
    introduced_level: 1,
    sentence_blank: "The car is ____."
  },
  {
    id: "frog",
    word: "frog",
    image_url: "asset://frog",
    audio_url: "tts://en-US/frog",
    definition: "A small green animal with long back legs that hops and swims.",
    example_sentence: "The frog can hop.",
    story_context: "Near a small puddle, he noticed a green frog.",
    introduced_level: 1,
    sentence_blank: "The ____ can hop."
  },
  {
    id: "stop",
    word: "stop",
    image_url: "asset://stop",
    audio_url: "tts://en-US/stop",
    definition: "To finish or discontinue an action or movement.",
    example_sentence: "The boy says, \"Stop!\"",
    story_context: "Their mother reminded them to stop at the corner.",
    introduced_level: 1,
    sentence_blank: "The boy says, \"____!\""
  },
  {
    id: "back",
    word: "back",
    image_url: "asset://back",
    audio_url: "tts://en-US/back",
    definition: "Returning to an earlier place or position.",
    example_sentence: "Please come back.",
    story_context: "Her mother called her to come back home.",
    introduced_level: 1,
    sentence_blank: "Please come ____."
  },
  {
    id: "nine",
    word: "nine",
    image_url: "asset://nine",
    audio_url: "tts://en-US/nine",
    definition: "The number equivalent to the sum of eight and one; 9.",
    example_sentence: "I see nine nuts.",
    story_context: "She counted them and found nine pencils.",
    introduced_level: 1,
    sentence_blank: "I see ____ nuts."
  },
  {
    id: "nuts",
    word: "nuts",
    image_url: "asset://nuts",
    audio_url: "tts://en-US/nuts",
    definition: "Hard-shelled fruits or edible seeds from trees.",
    example_sentence: "The nuts are in the bag.",
    story_context: "Under a tree, he saw some nuts on the ground.",
    introduced_level: 1,
    sentence_blank: "The ____ are in the bag."
  },
  {
    id: "floor",
    word: "floor",
    image_url: "asset://floor",
    audio_url: "tts://en-US/floor",
    definition: "The lower surface of a room on which people stand or walk.",
    example_sentence: "The toy is on the floor.",
    story_context: "Suddenly, the book slipped from her hands and fell on the floor.",
    introduced_level: 1,
    sentence_blank: "The toy is on the ____."
  },
  {
    id: "spins",
    word: "spins",
    image_url: "asset://spins",
    audio_url: "tts://en-US/spins",
    definition: "Turns round and round quickly.",
    example_sentence: "The fan spins fast.",
    story_context: "He turned the fan on, and it spins around slowly.",
    introduced_level: 1,
    sentence_blank: "The fan ____ fast."
  },
  {
    id: "test",
    word: "test",
    image_url: "asset://test",
    audio_url: "tts://en-US/test",
    definition: "An assessment or examination of what you have learned.",
    example_sentence: "I have a reading test.",
    story_context: "Her teacher told the class that they would have a reading test.",
    introduced_level: 1,
    sentence_blank: "I have a reading ____."
  },
  {
    id: "last",
    word: "last",
    image_url: "asset://last",
    audio_url: "tts://en-US/last",
    definition: "Coming after all others in time or order; final.",
    example_sentence: "This is the last word.",
    story_context: "He read every page until he reached the last page.",
    introduced_level: 1,
    sentence_blank: "This is the ____ word."
  },
  {
    id: "stem",
    word: "stem",
    image_url: "asset://stem",
    audio_url: "tts://en-US/stem",
    definition: "The main long part of a plant that supports the leaves and flowers.",
    example_sentence: "The flower has a green stem.",
    story_context: "After several days, the flower grew a strong stem.",
    introduced_level: 1,
    sentence_blank: "The flower has a green ____."
  },
  {
    id: "mist",
    word: "mist",
    image_url: "asset://mist",
    audio_url: "tts://en-US/mist",
    definition: "A cloud of tiny water droplets in the air near the ground.",
    example_sentence: "I see mist in the morning.",
    story_context: "When he looked outside, he saw mist covering the field.",
    introduced_level: 1,
    sentence_blank: "I see ____ in the morning."
  },
  {
    id: "mill",
    word: "mill",
    image_url: "asset://mill",
    audio_url: "tts://en-US/mill",
    definition: "A building equipped with machinery for grinding grain into flour.",
    example_sentence: "The mill is near the road.",
    story_context: "While walking, they saw an old mill beside the road.",
    introduced_level: 1,
    sentence_blank: "The ____ is near the road."
  },
  {
    id: "tell",
    word: "tell",
    image_url: "asset://tell",
    audio_url: "tts://en-US/tell",
    definition: "To communicate information, facts, or a story using words.",
    example_sentence: "Please tell me a story.",
    story_context: "Lina had an interesting story to tell her classmates.",
    introduced_level: 1,
    sentence_blank: "Please ____ me a story."
  },
  {
    id: "sell",
    word: "sell",
    image_url: "asset://sell",
    audio_url: "tts://en-US/sell",
    definition: "To hand over goods or items in exchange for money.",
    example_sentence: "They sell fresh fruit.",
    story_context: "Every morning, they sell fresh fruits to their neighbors.",
    introduced_level: 1,
    sentence_blank: "They ____ fresh fruit."
  },
  {
    id: "light",
    word: "light",
    image_url: "asset://light",
    audio_url: "tts://en-US/light",
    definition: "The brightness from a lamp or the sun that makes things visible.",
    example_sentence: "Turn on the light.",
    story_context: "Suddenly, the room became dark because the light went off.",
    introduced_level: 1,
    sentence_blank: "Turn on the ____."
  },
  {
    id: "bell",
    word: "bell",
    image_url: "asset://bell",
    audio_url: "tts://en-US/bell",
    definition: "A hollow metal instrument that makes a ringing sound.",
    example_sentence: "I hear the school bell.",
    story_context: "The school bell rang early in the morning.",
    introduced_level: 1,
    sentence_blank: "I hear the school ____."
  },
  {
    id: "bath",
    word: "bath",
    image_url: "asset://bath",
    audio_url: "tts://en-US/bath",
    definition: "Washing the body with water and soap to stay clean.",
    example_sentence: "The baby takes a bath.",
    story_context: "His mother told him to take a bath before dinner.",
    introduced_level: 1,
    sentence_blank: "The baby takes a ____."
  },
  {
    id: "bark",
    word: "bark",
    image_url: "asset://bark",
    audio_url: "tts://en-US/bark",
    definition: "The sharp, loud sound that a dog makes.",
    example_sentence: "The dog can bark.",
    story_context: "Suddenly, he heard his dog bark near the gate.",
    introduced_level: 1,
    sentence_blank: "The dog can ____."
  },
  {
    id: "road",
    word: "road",
    image_url: "asset://road",
    audio_url: "tts://en-US/road",
    definition: "A paved path for cars and people to travel on.",
    example_sentence: "The car is on the road.",
    story_context: "They drove carefully along the road.",
    introduced_level: 1,
    sentence_blank: "The car is on the ____."
  },
  {
    id: "rain",
    word: "rain",
    image_url: "asset://rain",
    audio_url: "tts://en-US/rain",
    definition: "Water falling in drops from clouds in the sky.",
    example_sentence: "The rain is falling.",
    story_context: "A few minutes later, the rain began to fall.",
    introduced_level: 1,
    sentence_blank: "The ____ is falling."
  },
  {
    id: "rock",
    word: "rock",
    image_url: "asset://rock",
    audio_url: "tts://en-US/rock",
    definition: "A solid piece of mineral matter formed naturally on earth.",
    example_sentence: "I see a big rock.",
    story_context: "He noticed a large rock beside the road.",
    introduced_level: 1,
    sentence_blank: "I see a big ____."
  },
  {
    id: "round",
    word: "round",
    image_url: "asset://round",
    audio_url: "tts://en-US/round",
    definition: "Shaped like a circle or ball; curved on all sides.",
    example_sentence: "The ball is round.",
    story_context: "The ball was round and easy to roll.",
    introduced_level: 1,
    sentence_blank: "The ball is ____."
  },
  {
    id: "plant",
    word: "plant",
    image_url: "asset://plant",
    audio_url: "tts://en-US/plant",
    definition: "A living thing that grows in earth, with leaves, stems, and roots.",
    example_sentence: "The plant is growing.",
    story_context: "Lia found a small plant growing near their window.",
    introduced_level: 1,
    sentence_blank: "The ____ is growing."
  },
  {
    id: "green",
    word: "green",
    image_url: "asset://green",
    audio_url: "tts://en-US/green",
    definition: "The color of grass and healthy leaves.",
    example_sentence: "The leaf is green.",
    story_context: "He noticed a green leaf on a small plant.",
    introduced_level: 1,
    sentence_blank: "The leaf is ____."
  },
  {
    id: "black",
    word: "black",
    image_url: "asset://black",
    audio_url: "tts://en-US/black",
    definition: "The darkest color, like night with no light.",
    example_sentence: "The bag is black.",
    story_context: "He put his books inside his black bag.",
    introduced_level: 1,
    sentence_blank: "The bag is ____."
  },
  {
    id: "house",
    word: "house",
    image_url: "asset://house",
    audio_url: "tts://en-US/house",
    definition: "A building where people or families live together.",
    example_sentence: "The house is big.",
    story_context: "Ana noticed a small house with a red door.",
    introduced_level: 1,
    sentence_blank: "The ____ is big."
  }
];

const newStories = [
  {
    id: "story-21-pink",
    title: "21. Pink",
    text: "One morning, Mia went to her grandmother's house. She saw a small pink fan beside the window. Mia picked up the fan and looked at it with a smile. Her grandmother told her that the fan was a special gift. Mia turned on the fan and felt the cool air. She thanked her grandmother and placed the fan back beside the window.",
    target_word_ids: ["pink", "house"],
    questions: [
      {
        id: "q21-1",
        category: "comprehension",
        prompt: "Where did Mia go?",
        choices: ["Her grandmother's house", "The school library", "The fruit market", "The playground"],
        answer: "Her grandmother's house",
        explanation: "The story explains: Mia went to her grandmother's house."
      },
      {
        id: "q21-2",
        category: "comprehension",
        prompt: "What did Mia see?",
        choices: ["A small pink fan", "A little bird", "A red toy car", "A storybook"],
        answer: "A small pink fan",
        explanation: "The story explains: She saw a small pink fan beside the window."
      },
      {
        id: "q21-3",
        category: "comprehension",
        prompt: "What color was the fan?",
        choices: ["Pink", "Blue", "Green", "Yellow"],
        answer: "Pink",
        explanation: "The story explains: The fan was pink."
      },
      {
        id: "q21-4",
        category: "comprehension",
        prompt: "Who gave the fan to the grandmother?",
        choices: ["It was a special gift", "The school teacher", "Her friend Nina", "The farmer"],
        answer: "It was a special gift",
        explanation: "The story explains: Her grandmother told her that the fan was a special gift."
      },
      {
        id: "q21-5",
        category: "comprehension",
        prompt: "Where did Mia put the fan?",
        choices: ["Beside the window", "Under the chair", "Inside her bag", "On the table"],
        answer: "Beside the window",
        explanation: "The story explains: She placed the fan back beside the window."
      }
    ]
  },
  {
    id: "story-22-fast",
    title: "22. Fast",
    text: "One afternoon, Ben played with his toy car outside their house. He placed the car on a smooth path. When Ben pushed it, the car moved very fast. The car passed a small tree and stopped near the gate. Ben ran after it and picked it up. He laughed because he enjoyed watching his toy car move.",
    target_word_ids: ["fast"],
    questions: [
      {
        id: "q22-1",
        category: "comprehension",
        prompt: "Who played with a toy car?",
        choices: ["Ben", "Leo", "Sam", "Dan"],
        answer: "Ben",
        explanation: "The story explains: Ben played with his toy car."
      },
      {
        id: "q22-2",
        category: "comprehension",
        prompt: "Where did Ben play?",
        choices: ["Outside their house", "In the classroom", "At the park", "Inside the library"],
        answer: "Outside their house",
        explanation: "The story explains: Outside their house on a smooth path."
      },
      {
        id: "q22-3",
        category: "comprehension",
        prompt: "How did the car move?",
        choices: ["Very fast", "Very slowly", "Backwards", "In circles"],
        answer: "Very fast",
        explanation: "The story explains: The car moved very fast."
      },
      {
        id: "q22-4",
        category: "comprehension",
        prompt: "Where did the car stop?",
        choices: ["Near the gate", "Under the chair", "Beside the window", "In the puddle"],
        answer: "Near the gate",
        explanation: "The story explains: Stopped near the gate."
      },
      {
        id: "q22-5",
        category: "comprehension",
        prompt: "Why did Ben laugh?",
        choices: ["He enjoyed watching his toy car move", "He heard a funny story", "He saw a frog", "His sister told a joke"],
        answer: "He enjoyed watching his toy car move",
        explanation: "The story explains: He laughed because he enjoyed watching his toy car move."
      }
    ]
  },
  {
    id: "story-23-frog",
    title: "23. Frog",
    text: "After the rain, Leo went outside to look at the plants. Near a small puddle, he noticed a green frog. The frog jumped from one leaf to another. Leo quietly followed it because he wanted to see where it would go. The frog finally jumped into the grass and disappeared. Leo smiled and went inside to tell his mother about it.",
    target_word_ids: ["frog", "plant", "green", "rain"],
    questions: [
      {
        id: "q23-1",
        category: "comprehension",
        prompt: "When did Leo go outside?",
        choices: ["After the rain", "Early at night", "Before breakfast", "During school"],
        answer: "After the rain",
        explanation: "The story explains: After the rain, Leo went outside."
      },
      {
        id: "q23-2",
        category: "comprehension",
        prompt: "What did he see?",
        choices: ["A green frog", "A little pet", "A red hat", "A yellow bird"],
        answer: "A green frog",
        explanation: "The story explains: He noticed a green frog."
      },
      {
        id: "q23-3",
        category: "comprehension",
        prompt: "Where was the frog?",
        choices: ["Near a small puddle", "Inside the house", "Under a stone", "On the wall"],
        answer: "Near a small puddle",
        explanation: "The story explains: Near a small puddle."
      },
      {
        id: "q23-4",
        category: "comprehension",
        prompt: "What did the frog do?",
        choices: ["Jumped from leaf to leaf", "Flew into a tree", "Ran up the hill", "Swam in a pond"],
        answer: "Jumped from leaf to leaf",
        explanation: "The story explains: The frog jumped from one leaf to another."
      },
      {
        id: "q23-5",
        category: "comprehension",
        prompt: "Whom did Leo tell about the frog?",
        choices: ["His mother", "His teacher", "His father", "His sister"],
        answer: "His mother",
        explanation: "The story explains: Leo smiled and went inside to tell his mother."
      }
    ]
  },
  {
    id: "story-24-stop",
    title: "24. Stop",
    text: "One morning, Carlo was walking to school with his sister. As they crossed the street, their mother reminded them to stop at the corner. Carlo stopped and looked carefully before crossing. His sister also waited beside him. When the way was clear, they crossed the street safely. Carlo learned that stopping and looking carefully can help keep people safe.",
    target_word_ids: ["stop"],
    questions: [
      {
        id: "q24-1",
        category: "comprehension",
        prompt: "Where were Carlo and his sister going?",
        choices: ["To school", "To the market", "To the park", "To grandmother's house"],
        answer: "To school",
        explanation: "The story explains: Carlo was walking to school with his sister."
      },
      {
        id: "q24-2",
        category: "comprehension",
        prompt: "Who reminded them to stop?",
        choices: ["Their mother", "Their teacher", "The police officer", "Their father"],
        answer: "Their mother",
        explanation: "The story explains: Their mother reminded them to stop at the corner."
      },
      {
        id: "q24-3",
        category: "comprehension",
        prompt: "Where did Carlo stop?",
        choices: ["At the corner", "At the school gate", "In the middle of the road", "Under the tree"],
        answer: "At the corner",
        explanation: "The story explains: Carlo stopped and looked carefully at the corner."
      },
      {
        id: "q24-4",
        category: "comprehension",
        prompt: "What did they do when the way was clear?",
        choices: ["Crossed the street safely", "Ran back home", "Rode on a bus", "Waited for a friend"],
        answer: "Crossed the street safely",
        explanation: "The story explains: When the way was clear, they crossed the street safely."
      },
      {
        id: "q24-5",
        category: "comprehension",
        prompt: "What did Carlo learn?",
        choices: ["Stopping and looking keeps people safe", "Running makes you fast", "Always walk alone", "Playing in the street is fun"],
        answer: "Stopping and looking keeps people safe",
        explanation: "The story explains: Stopping and looking carefully can help keep people safe."
      }
    ]
  },
  {
    id: "story-25-back",
    title: "25. Back",
    text: "After school, Nina stayed outside to play with her friends. Soon, her mother called her to come back home. Nina said goodbye to her friends. She picked up her bag and walked home. Her mother welcomed her at the door. Nina helped her mother prepare their things for dinner.",
    target_word_ids: ["back", "black"],
    questions: [
      {
        id: "q25-1",
        category: "comprehension",
        prompt: "When did Nina play?",
        choices: ["After school", "Early in the morning", "During lunch time", "Late at night"],
        answer: "After school",
        explanation: "The story explains: After school, Nina stayed outside to play."
      },
      {
        id: "q25-2",
        category: "comprehension",
        prompt: "Who called Nina?",
        choices: ["Her mother", "Her father", "Her teacher", "Her friend"],
        answer: "Her mother",
        explanation: "The story explains: Her mother called her to come back home."
      },
      {
        id: "q25-3",
        category: "comprehension",
        prompt: "Where did Nina go?",
        choices: ["Back home", "To the playground", "To the store", "To the library"],
        answer: "Back home",
        explanation: "The story explains: She walked home."
      },
      {
        id: "q25-4",
        category: "comprehension",
        prompt: "What did Nina pick up?",
        choices: ["Her bag", "A red ball", "A toy car", "A storybook"],
        answer: "Her bag",
        explanation: "The story explains: She picked up her bag."
      },
      {
        id: "q25-5",
        category: "comprehension",
        prompt: "What did Nina do at home?",
        choices: ["Helped prepare things for dinner", "Went straight to bed", "Read a storybook", "Watered the plants"],
        answer: "Helped prepare things for dinner",
        explanation: "The story explains: Nina helped her mother prepare their things for dinner."
      }
    ]
  },
  {
    id: "story-26-nine",
    title: "26. Nine",
    text: "One afternoon, Nina found some pencils in her classroom. She counted them and found nine pencils. She placed the pencils neatly on the teacher's desk. Then she told her teacher about them. Her teacher thanked her for being honest. Nina felt proud because she did the right thing.",
    target_word_ids: ["nine"],
    questions: [
      {
        id: "q26-1",
        category: "comprehension",
        prompt: "What did Nina find?",
        choices: ["Some pencils", "Nine notebooks", "A toy car", "A lost coin"],
        answer: "Some pencils",
        explanation: "The story explains: Nina found some pencils in her classroom."
      },
      {
        id: "q26-2",
        category: "comprehension",
        prompt: "How many pencils were there?",
        choices: ["Nine", "Seven", "Eight", "Ten"],
        answer: "Nine",
        explanation: "The story explains: She counted them and found nine pencils."
      },
      {
        id: "q26-3",
        category: "comprehension",
        prompt: "Where did Nina put the pencils?",
        choices: ["On the teacher's desk", "Inside her bag", "In her desk drawer", "On the floor"],
        answer: "On the teacher's desk",
        explanation: "The story explains: She placed the pencils neatly on the teacher's desk."
      },
      {
        id: "q26-4",
        category: "comprehension",
        prompt: "What did she tell her teacher?",
        choices: ["About the pencils she found", "She wanted to go home", "She lost her book", "She forgot her pencil"],
        answer: "About the pencils she found",
        explanation: "The story explains: She told her teacher about them."
      },
      {
        id: "q26-5",
        category: "comprehension",
        prompt: "Why did Nina feel proud?",
        choices: ["She did the right thing", "She won a prize", "She had new shoes", "She finished first"],
        answer: "She did the right thing",
        explanation: "The story explains: Nina felt proud because she did the right thing."
      }
    ]
  },
  {
    id: "story-27-nuts",
    title: "27. Nuts",
    text: "One morning, Sam walked around the garden. Under a tree, he saw some nuts on the ground. He picked them up carefully and placed them in a small bag. Then he showed the nuts to his sister. His sister helped him count them. They kept the nuts in a safe place.",
    target_word_ids: ["nuts"],
    questions: [
      {
        id: "q27-1",
        category: "comprehension",
        prompt: "Where did Sam walk?",
        choices: ["Around the garden", "In the market", "Along the river", "Near the road"],
        answer: "Around the garden",
        explanation: "The story explains: Sam walked around the garden."
      },
      {
        id: "q27-2",
        category: "comprehension",
        prompt: "What did he see?",
        choices: ["Some nuts on the ground", "A small frog", "A red hat", "A big rock"],
        answer: "Some nuts on the ground",
        explanation: "The story explains: Under a tree, he saw some nuts on the ground."
      },
      {
        id: "q27-3",
        category: "comprehension",
        prompt: "Where were the nuts?",
        choices: ["Under a tree", "On the roof", "Inside a pot", "Near the gate"],
        answer: "Under a tree",
        explanation: "The story explains: Under a tree."
      },
      {
        id: "q27-4",
        category: "comprehension",
        prompt: "Who helped Sam count them?",
        choices: ["His sister", "His mother", "His teacher", "His friend"],
        answer: "His sister",
        explanation: "The story explains: His sister helped him count them."
      },
      {
        id: "q27-5",
        category: "comprehension",
        prompt: "Where did they keep the nuts?",
        choices: ["In a safe place", "On the floor", "In the trash", "Under the bed"],
        answer: "In a safe place",
        explanation: "The story explains: They kept the nuts in a safe place."
      }
    ]
  },
  {
    id: "story-28-floor",
    title: "28. Floor",
    text: "Mia was reading a book in her room. Suddenly, the book slipped from her hands and fell on the floor. She looked at the book and saw that it was still clean. Mia picked it up carefully. She placed it on her table. Then she continued reading her story.",
    target_word_ids: ["floor"],
    questions: [
      {
        id: "q28-1",
        category: "comprehension",
        prompt: "What was Mia doing?",
        choices: ["Reading a book in her room", "Drawing pictures", "Eating dinner", "Playing with toys"],
        answer: "Reading a book in her room",
        explanation: "The story explains: Mia was reading a book in her room."
      },
      {
        id: "q28-2",
        category: "comprehension",
        prompt: "Where did the book fall?",
        choices: ["On the floor", "On the bed", "Under the chair", "Out the window"],
        answer: "On the floor",
        explanation: "The story explains: The book slipped from her hands and fell on the floor."
      },
      {
        id: "q28-3",
        category: "comprehension",
        prompt: "Was the book still clean?",
        choices: ["Yes, it was still clean", "No, it was torn", "No, it was wet", "No, it had mud"],
        answer: "Yes, it was still clean",
        explanation: "The story explains: She looked at the book and saw that it was still clean."
      },
      {
        id: "q28-4",
        category: "comprehension",
        prompt: "Where did Mia put the book?",
        choices: ["On her table", "Inside a box", "Under the pillow", "Back on the shelf"],
        answer: "On her table",
        explanation: "The story explains: She placed it on her table."
      },
      {
        id: "q28-5",
        category: "comprehension",
        prompt: "What did she do afterward?",
        choices: ["Continued reading her story", "Went to sleep", "Called her mother", "Walked outside"],
        answer: "Continued reading her story",
        explanation: "The story explains: Then she continued reading her story."
      }
    ]
  },
  {
    id: "story-29-spins",
    title: "29. Spins",
    text: "Ben was sitting near a small electric fan. He turned the fan on, and it spins around slowly. After a few moments, the fan moved faster. Ben felt the cool air on his face. He moved his chair closer to the table. Then he continued reading his book.",
    target_word_ids: ["spins", "fast"],
    questions: [
      {
        id: "q29-1",
        category: "comprehension",
        prompt: "Where was Ben sitting?",
        choices: ["Near a small electric fan", "Beside the window", "Under a tree", "On the staircase"],
        answer: "Near a small electric fan",
        explanation: "The story explains: Ben was sitting near a small electric fan."
      },
      {
        id: "q29-2",
        category: "comprehension",
        prompt: "What did he turn on?",
        choices: ["The fan", "The lamp", "The radio", "The flashlight"],
        answer: "The fan",
        explanation: "The story explains: He turned the fan on."
      },
      {
        id: "q29-3",
        category: "comprehension",
        prompt: "What did the fan do?",
        choices: ["Spun around slowly then faster", "Fell on the floor", "Made a loud noise", "Stopped working"],
        answer: "Spun around slowly then faster",
        explanation: "The story explains: It spins around slowly, then moved faster."
      },
      {
        id: "q29-4",
        category: "comprehension",
        prompt: "What did Ben feel?",
        choices: ["Cool air on his face", "Warm sunlight", "Raindrops", "Cold mist"],
        answer: "Cool air on his face",
        explanation: "The story explains: Ben felt the cool air on his face."
      },
      {
        id: "q29-5",
        category: "comprehension",
        prompt: "What did Ben continue doing?",
        choices: ["Reading his book", "Eating his lunch", "Drawing a map", "Taking a nap"],
        answer: "Reading his book",
        explanation: "The story explains: Then he continued reading his book."
      }
    ]
  },
  {
    id: "story-30-test",
    title: "30. Test",
    text: "Lara went to school early one morning. Her teacher told the class that they would have a reading test. Lara read each word carefully before answering. She checked her answers before passing her paper. Her teacher thanked her for doing her best. Lara felt proud of herself after the test.",
    target_word_ids: ["test", "last"],
    questions: [
      {
        id: "q30-1",
        category: "comprehension",
        prompt: "Where did Lara go?",
        choices: ["To school", "To the park", "To the library", "To her friend's house"],
        answer: "To school",
        explanation: "The story explains: Lara went to school early one morning."
      },
      {
        id: "q30-2",
        category: "comprehension",
        prompt: "What kind of test did they have?",
        choices: ["A reading test", "A math test", "A science quiz", "A spelling contest"],
        answer: "A reading test",
        explanation: "The story explains: They would have a reading test."
      },
      {
        id: "q30-3",
        category: "comprehension",
        prompt: "How did Lara read the words?",
        choices: ["Carefully before answering", "Very quickly", "Without looking", "Out loud to her friend"],
        answer: "Carefully before answering",
        explanation: "The story explains: Lara read each word carefully before answering."
      },
      {
        id: "q30-4",
        category: "comprehension",
        prompt: "What did Lara do before passing her paper?",
        choices: ["Checked her answers", "Erased everything", "Gave it to a friend", "Asked for another paper"],
        answer: "Checked her answers",
        explanation: "The story explains: She checked her answers before passing her paper."
      },
      {
        id: "q30-5",
        category: "comprehension",
        prompt: "How did Lara feel?",
        choices: ["Proud of herself", "Tired and sleepy", "Worried and sad", "Angry at the test"],
        answer: "Proud of herself",
        explanation: "The story explains: Lara felt proud of herself after the test."
      }
    ]
  },
  {
    id: "story-31-last",
    title: "31. Last",
    text: "Mark borrowed a storybook from the classroom shelf. He sat quietly and began reading it. He read every page until he reached the last page. The story was about a boy and his pet. Mark enjoyed the ending very much. He returned the book to the shelf after reading.",
    target_word_ids: ["last"],
    questions: [
      {
        id: "q31-1",
        category: "comprehension",
        prompt: "What did Mark borrow?",
        choices: ["A storybook", "A colored pencil", "A drawing notebook", "A toy car"],
        answer: "A storybook",
        explanation: "The story explains: Mark borrowed a storybook."
      },
      {
        id: "q31-2",
        category: "comprehension",
        prompt: "Where did he get the book?",
        choices: ["From the classroom shelf", "From his bag", "From his teacher's desk", "From his sister"],
        answer: "From the classroom shelf",
        explanation: "The story explains: From the classroom shelf."
      },
      {
        id: "q31-3",
        category: "comprehension",
        prompt: "What page did he reach?",
        choices: ["The last page", "The tenth page", "The first page", "The middle page"],
        answer: "The last page",
        explanation: "The story explains: Until he reached the last page."
      },
      {
        id: "q31-4",
        category: "comprehension",
        prompt: "What was the story about?",
        choices: ["A boy and his pet", "A green frog", "A flying bat", "A red car"],
        answer: "A boy and his pet",
        explanation: "The story explains: The story was about a boy and his pet."
      },
      {
        id: "q31-5",
        category: "comprehension",
        prompt: "What did Mark do after reading?",
        choices: ["Returned the book to the shelf", "Put it in his bag", "Gave it to his friend", "Left it on the floor"],
        answer: "Returned the book to the shelf",
        explanation: "The story explains: He returned the book to the shelf after reading."
      }
    ]
  },
  {
    id: "story-32-stem",
    title: "32. Stem",
    text: "Lia planted a small flower in a pot. After several days, the flower grew a strong stem. Lia placed the pot near the window. She gave the plant water every morning. New leaves slowly appeared on the plant. Lia was happy to see her flower growing.",
    target_word_ids: ["stem", "plant"],
    questions: [
      {
        id: "q32-1",
        category: "comprehension",
        prompt: "What did Lia plant?",
        choices: ["A small flower", "A fruit tree", "Some nuts", "A big seed"],
        answer: "A small flower",
        explanation: "The story explains: Lia planted a small flower in a pot."
      },
      {
        id: "q32-2",
        category: "comprehension",
        prompt: "What grew strong?",
        choices: ["A strong stem", "The pot", "The flower petals", "The roots"],
        answer: "A strong stem",
        explanation: "The story explains: The flower grew a strong stem."
      },
      {
        id: "q32-3",
        category: "comprehension",
        prompt: "Where did she place the pot?",
        choices: ["Near the window", "Under her bed", "Behind the door", "In the kitchen"],
        answer: "Near the window",
        explanation: "The story explains: Lia placed the pot near the window."
      },
      {
        id: "q32-4",
        category: "comprehension",
        prompt: "What did Lia give the plant?",
        choices: ["Water every morning", "Milk", "Juice", "Fresh soil every day"],
        answer: "Water every morning",
        explanation: "The story explains: She gave the plant water every morning."
      },
      {
        id: "q32-5",
        category: "comprehension",
        prompt: "How did Lia feel?",
        choices: ["Happy to see her flower growing", "Worried about the plant", "Tired from gardening", "Sad it was small"],
        answer: "Happy to see her flower growing",
        explanation: "The story explains: Lia was happy to see her flower growing."
      }
    ]
  },
  {
    id: "story-33-mist",
    title: "33. Mist",
    text: "Ben woke up early one morning. When he looked outside, he saw mist covering the field. The trees looked blurry from his window. Ben waited for the sun to rise. As the morning became warmer, the mist slowly disappeared. Ben could finally see the field clearly.",
    target_word_ids: ["mist"],
    questions: [
      {
        id: "q33-1",
        category: "comprehension",
        prompt: "When did Ben wake up?",
        choices: ["Early one morning", "Late in the afternoon", "At night", "Around noon"],
        answer: "Early one morning",
        explanation: "The story explains: Ben woke up early one morning."
      },
      {
        id: "q33-2",
        category: "comprehension",
        prompt: "What did he see outside?",
        choices: ["Mist covering the field", "Heavy dark rain", "Snow falling", "A big fire"],
        answer: "Mist covering the field",
        explanation: "The story explains: He saw mist covering the field."
      },
      {
        id: "q33-3",
        category: "comprehension",
        prompt: "What looked blurry?",
        choices: ["The trees", "The school roof", "The toy car", "The window glass"],
        answer: "The trees",
        explanation: "The story explains: The trees looked blurry from his window."
      },
      {
        id: "q33-4",
        category: "comprehension",
        prompt: "What did Ben wait for?",
        choices: ["The sun to rise", "The rain to fall", "The school bell", "His sister to wake up"],
        answer: "The sun to rise",
        explanation: "The story explains: Ben waited for the sun to rise."
      },
      {
        id: "q33-5",
        category: "comprehension",
        prompt: "What happened to the mist?",
        choices: ["It slowly disappeared", "It turned into rain", "It got darker", "It entered his room"],
        answer: "It slowly disappeared",
        explanation: "The story explains: The mist slowly disappeared as it became warmer."
      }
    ]
  },
  {
    id: "story-34-mill",
    title: "34. Mill",
    text: "Rico went walking with his father one afternoon. While walking, they saw an old mill beside the road. Rico became curious about the old building. His father told him to stay close and observe from a safe place. They looked at the mill for a few minutes. Then they continued their walk together.",
    target_word_ids: ["mill", "road"],
    questions: [
      {
        id: "q34-1",
        category: "comprehension",
        prompt: "Who went walking with Rico?",
        choices: ["His father", "His brother", "His friend Sam", "His teacher"],
        answer: "His father",
        explanation: "The story explains: Rico went walking with his father."
      },
      {
        id: "q34-2",
        category: "comprehension",
        prompt: "What did they see?",
        choices: ["An old mill beside the road", "A new store", "A big school", "A red car"],
        answer: "An old mill beside the road",
        explanation: "The story explains: They saw an old mill beside the road."
      },
      {
        id: "q34-3",
        category: "comprehension",
        prompt: "Where was the mill?",
        choices: ["Beside the road", "On top of the hill", "Near the river", "Inside the garden"],
        answer: "Beside the road",
        explanation: "The story explains: Beside the road."
      },
      {
        id: "q34-4",
        category: "comprehension",
        prompt: "What did Rico want to know about?",
        choices: ["The old building", "The passing cars", "The tall trees", "The red bridge"],
        answer: "The old building",
        explanation: "The story explains: Rico became curious about the old building."
      },
      {
        id: "q34-5",
        category: "comprehension",
        prompt: "What did they do afterward?",
        choices: ["Continued their walk together", "Went inside the mill", "Ran back home", "Ate lunch"],
        answer: "Continued their walk together",
        explanation: "The story explains: Then they continued their walk together."
      }
    ]
  },
  {
    id: "story-35-tell",
    title: "35. Tell",
    text: "Lina had an interesting story to tell her classmates. She stood in front of the class and began speaking. Her classmates listened carefully to every part of the story. When Lina reached the funny part, everyone laughed. Lina smiled because her classmates enjoyed her story. She thanked them for listening to her.",
    target_word_ids: ["tell"],
    questions: [
      {
        id: "q35-1",
        category: "comprehension",
        prompt: "What did Lina have?",
        choices: ["An interesting story", "A new drawing book", "A box of pencils", "A small pet"],
        answer: "An interesting story",
        explanation: "The story explains: Lina had an interesting story to tell her classmates."
      },
      {
        id: "q35-2",
        category: "comprehension",
        prompt: "Whom did she tell the story to?",
        choices: ["Her classmates", "Her parents", "Her grandmother", "The principal"],
        answer: "Her classmates",
        explanation: "The story explains: To tell her classmates."
      },
      {
        id: "q35-3",
        category: "comprehension",
        prompt: "Where did she stand?",
        choices: ["In front of the class", "Beside the window", "At her desk", "Behind the door"],
        answer: "In front of the class",
        explanation: "The story explains: She stood in front of the class."
      },
      {
        id: "q35-4",
        category: "comprehension",
        prompt: "What did the classmates do?",
        choices: ["Listened carefully and laughed", "Ignored her", "Started reading books", "Walked outside"],
        answer: "Listened carefully and laughed",
        explanation: "The story explains: Her classmates listened carefully and laughed at the funny part."
      },
      {
        id: "q35-5",
        category: "comprehension",
        prompt: "Why did Lina smile?",
        choices: ["Her classmates enjoyed her story", "She was finished with school", "She won a prize", "The bell rang"],
        answer: "Her classmates enjoyed her story",
        explanation: "The story explains: Lina smiled because her classmates enjoyed her story."
      }
    ]
  },
  {
    id: "story-36-sell",
    title: "36. Sell",
    text: "A family in the village had a small fruit shop. Every morning, they sell fresh fruits to their neighbors. The children helped arrange the fruits on the table. Their parents welcomed the customers. Many people came because the fruits were fresh. The family was happy because they worked together.",
    target_word_ids: ["sell"],
    questions: [
      {
        id: "q36-1",
        category: "comprehension",
        prompt: "What did the family have?",
        choices: ["A small fruit shop", "A toy store", "A flower garden", "A bakery"],
        answer: "A small fruit shop",
        explanation: "The story explains: A family had a small fruit shop."
      },
      {
        id: "q36-2",
        category: "comprehension",
        prompt: "What did they sell?",
        choices: ["Fresh fruits", "Books and pencils", "Clothes", "Nuts and seeds"],
        answer: "Fresh fruits",
        explanation: "The story explains: They sell fresh fruits to their neighbors."
      },
      {
        id: "q36-3",
        category: "comprehension",
        prompt: "When did they sell the fruits?",
        choices: ["Every morning", "Only on weekends", "Late at night", "Every afternoon"],
        answer: "Every morning",
        explanation: "The story explains: Every morning, they sell fresh fruits."
      },
      {
        id: "q36-4",
        category: "comprehension",
        prompt: "Who arranged the fruits?",
        choices: ["The children", "The customers", "The neighbors", "The teacher"],
        answer: "The children",
        explanation: "The story explains: The children helped arrange the fruits on the table."
      },
      {
        id: "q36-5",
        category: "comprehension",
        prompt: "Why were many people coming to the shop?",
        choices: ["The fruits were fresh", "It was free", "The shop was big", "They had games"],
        answer: "The fruits were fresh",
        explanation: "The story explains: Many people came because the fruits were fresh."
      }
    ]
  },
  {
    id: "story-37-light",
    title: "37. Light",
    text: "One evening, Ana was reading in her room. Suddenly, the room became dark because the light went off. Ana stopped reading and waited for her mother. Her mother came and checked the light. Soon, the light came back on. Ana smiled and continued reading her book.",
    target_word_ids: ["light"],
    questions: [
      {
        id: "q37-1",
        category: "comprehension",
        prompt: "What was Ana doing?",
        choices: ["Reading in her room", "Sleeping in bed", "Doing homework", "Playing with toys"],
        answer: "Reading in her room",
        explanation: "The story explains: Ana was reading in her room."
      },
      {
        id: "q37-2",
        category: "comprehension",
        prompt: "What happened to the room?",
        choices: ["It became dark", "It became cold", "It filled with mist", "The window opened"],
        answer: "It became dark",
        explanation: "The story explains: The room became dark because the light went off."
      },
      {
        id: "q37-3",
        category: "comprehension",
        prompt: "Why did Ana stop reading?",
        choices: ["The light went off", "She was sleepy", "She finished the book", "Her mother called"],
        answer: "The light went off",
        explanation: "The story explains: Ana stopped reading because the light went off."
      },
      {
        id: "q37-4",
        category: "comprehension",
        prompt: "Who checked the light?",
        choices: ["Her mother", "Her brother", "Her father", "Ana herself"],
        answer: "Her mother",
        explanation: "The story explains: Her mother came and checked the light."
      },
      {
        id: "q37-5",
        category: "comprehension",
        prompt: "What did Ana do afterward?",
        choices: ["Continued reading her book", "Went to sleep", "Turned off the lamp", "Ran outside"],
        answer: "Continued reading her book",
        explanation: "The story explains: Ana smiled and continued reading her book."
      }
    ]
  },
  {
    id: "story-38-bell",
    title: "38. Bell",
    text: "The school bell rang early in the morning. The pupils quickly went to their classrooms. They placed their bags beside their chairs. Their teacher greeted them with a smile. The pupils took out their books and pencils. Soon, the teacher began the first lesson.",
    target_word_ids: ["bell"],
    questions: [
      {
        id: "q38-1",
        category: "comprehension",
        prompt: "What rang in the morning?",
        choices: ["The school bell", "An alarm clock", "A bicycle horn", "A telephone"],
        answer: "The school bell",
        explanation: "The story explains: The school bell rang early in the morning."
      },
      {
        id: "q38-2",
        category: "comprehension",
        prompt: "Where did the pupils go?",
        choices: ["To their classrooms", "To the canteen", "To the playground", "Home"],
        answer: "To their classrooms",
        explanation: "The story explains: The pupils quickly went to their classrooms."
      },
      {
        id: "q38-3",
        category: "comprehension",
        prompt: "Where did they put their bags?",
        choices: ["Beside their chairs", "On the teacher's desk", "On the floor outside", "Under the table"],
        answer: "Beside their chairs",
        explanation: "The story explains: They placed their bags beside their chairs."
      },
      {
        id: "q38-4",
        category: "comprehension",
        prompt: "Who greeted the pupils?",
        choices: ["Their teacher", "The principal", "The guard", "Their parents"],
        answer: "Their teacher",
        explanation: "The story explains: Their teacher greeted them with a smile."
      },
      {
        id: "q38-5",
        category: "comprehension",
        prompt: "What happened after they prepared their things?",
        choices: ["The teacher began the first lesson", "They played games", "They ate recess", "They went home"],
        answer: "The teacher began the first lesson",
        explanation: "The story explains: Soon, the teacher began the first lesson."
      }
    ]
  },
  {
    id: "story-39-bath",
    title: "39. Bath",
    text: "Leo spent the afternoon playing outside with his friends. When he came home, his hands and feet were dirty. His mother told him to take a bath before dinner. Leo washed his body carefully and changed his clothes. After his bath, he combed his hair. He was ready to eat dinner with his family.",
    target_word_ids: ["bath"],
    questions: [
      {
        id: "q39-1",
        category: "comprehension",
        prompt: "What did Leo do in the afternoon?",
        choices: ["Played outside with his friends", "Read a storybook", "Slept in his room", "Did his homework"],
        answer: "Played outside with his friends",
        explanation: "The story explains: Leo spent the afternoon playing outside with his friends."
      },
      {
        id: "q39-2",
        category: "comprehension",
        prompt: "Why were his hands and feet dirty?",
        choices: ["He was playing outside", "He touched ink", "He helped in the kitchen", "He dug in the yard"],
        answer: "He was playing outside",
        explanation: "The story explains: From playing outside."
      },
      {
        id: "q39-3",
        category: "comprehension",
        prompt: "What did his mother tell him to do?",
        choices: ["Take a bath before dinner", "Eat dinner immediately", "Clean his bedroom", "Read his lesson"],
        answer: "Take a bath before dinner",
        explanation: "The story explains: His mother told him to take a bath before dinner."
      },
      {
        id: "q39-4",
        category: "comprehension",
        prompt: "What did Leo put on?",
        choices: ["Clean clothes", "His school uniform", "His rain jacket", "His shoes"],
        answer: "Clean clothes",
        explanation: "The story explains: Leo washed his body carefully and changed his clothes."
      },
      {
        id: "q39-5",
        category: "comprehension",
        prompt: "What was Leo ready to do?",
        choices: ["Eat dinner with his family", "Go to sleep", "Play outside again", "Do his reading test"],
        answer: "Eat dinner with his family",
        explanation: "The story explains: He was ready to eat dinner with his family."
      }
    ]
  },
  {
    id: "story-40-bark",
    title: "40. Bark",
    text: "One afternoon, Carlo was playing near his house. Suddenly, he heard his dog bark near the gate. Carlo went to see what was happening. He noticed a cat walking outside the gate. The dog looked at the cat but stayed near its owner. Carlo gently called his dog and brought it inside.",
    target_word_ids: ["bark"],
    questions: [
      {
        id: "q40-1",
        category: "comprehension",
        prompt: "Where was Carlo playing?",
        choices: ["Near his house", "At the school playground", "At the park", "In the garden"],
        answer: "Near his house",
        explanation: "The story explains: Carlo was playing near his house."
      },
      {
        id: "q40-2",
        category: "comprehension",
        prompt: "What did he hear?",
        choices: ["His dog bark near the gate", "A car horn", "A school bell", "Someone knocking"],
        answer: "His dog bark near the gate",
        explanation: "The story explains: Suddenly, he heard his dog bark near the gate."
      },
      {
        id: "q40-3",
        category: "comprehension",
        prompt: "Where was the dog?",
        choices: ["Near the gate", "Inside the den", "Under the chair", "On top of the roof"],
        answer: "Near the gate",
        explanation: "The story explains: Near the gate."
      },
      {
        id: "q40-4",
        category: "comprehension",
        prompt: "What did Carlo see?",
        choices: ["A cat walking outside the gate", "Another dog", "A stranger", "A bird on a tree"],
        answer: "A cat walking outside the gate",
        explanation: "The story explains: He noticed a cat walking outside the gate."
      },
      {
        id: "q40-5",
        category: "comprehension",
        prompt: "What did Carlo do with the dog?",
        choices: ["Gently called it and brought it inside", "Chased the cat away", "Gave it food", "Tied it with a rope"],
        answer: "Gently called it and brought it inside",
        explanation: "The story explains: Carlo gently called his dog and brought it inside."
      }
    ]
  },
  {
    id: "story-41-road",
    title: "41. Road",
    text: "Ricky traveled with his family in their red car. They drove carefully along the road. Ricky looked through the window and saw trees and houses. After a while, they passed a small bridge. His father continued driving slowly and safely. Soon, they arrived at the place they wanted to visit.",
    target_word_ids: ["road"],
    questions: [
      {
        id: "q41-1",
        category: "comprehension",
        prompt: "Who traveled with Ricky?",
        choices: ["His family", "His classmates", "His teacher", "His neighbors"],
        answer: "His family",
        explanation: "The story explains: Ricky traveled with his family."
      },
      {
        id: "q41-2",
        category: "comprehension",
        prompt: "What did they ride in?",
        choices: ["Their red car", "A school bus", "A bicycle", "A train"],
        answer: "Their red car",
        explanation: "The story explains: In their red car."
      },
      {
        id: "q41-3",
        category: "comprehension",
        prompt: "Where did they drive?",
        choices: ["Along the road", "Through the grass", "Up a steep mountain", "Along the river"],
        answer: "Along the road",
        explanation: "The story explains: They drove carefully along the road."
      },
      {
        id: "q41-4",
        category: "comprehension",
        prompt: "What did Ricky see?",
        choices: ["Trees and houses", "A big mill", "A green frog", "A barking dog"],
        answer: "Trees and houses",
        explanation: "The story explains: Ricky looked through the window and saw trees and houses."
      },
      {
        id: "q41-5",
        category: "comprehension",
        prompt: "Where did they eventually arrive?",
        choices: ["At the place they wanted to visit", "Back home", "At the school gate", "At the hospital"],
        answer: "At the place they wanted to visit",
        explanation: "The story explains: Soon, they arrived at the place they wanted to visit."
      }
    ]
  },
  {
    id: "story-42-rain",
    title: "42. Rain",
    text: "One afternoon, dark clouds covered the sky. A few minutes later, the rain began to fall. The children quickly went inside the house. They sat near the window and watched the rain. While waiting, they read a storybook together. After some time, the rain stopped and the sky became clear.",
    target_word_ids: ["rain"],
    questions: [
      {
        id: "q42-1",
        category: "comprehension",
        prompt: "What covered the sky?",
        choices: ["Dark clouds", "Thick mist", "Bright sunlight", "Flying birds"],
        answer: "Dark clouds",
        explanation: "The story explains: Dark clouds covered the sky."
      },
      {
        id: "q42-2",
        category: "comprehension",
        prompt: "What began to fall?",
        choices: ["The rain", "Leaves", "Hail", "Snow"],
        answer: "The rain",
        explanation: "The story explains: The rain began to fall."
      },
      {
        id: "q42-3",
        category: "comprehension",
        prompt: "Where did the children go?",
        choices: ["Inside the house", "Under a tree", "To the garage", "To the park"],
        answer: "Inside the house",
        explanation: "The story explains: The children quickly went inside the house."
      },
      {
        id: "q42-4",
        category: "comprehension",
        prompt: "What did they do while waiting?",
        choices: ["Read a storybook together", "Played with toy cars", "Ate their lunch", "Took a nap"],
        answer: "Read a storybook together",
        explanation: "The story explains: While waiting, they read a storybook together."
      },
      {
        id: "q42-5",
        category: "comprehension",
        prompt: "What happened after some time?",
        choices: ["The rain stopped and the sky became clear", "It became completely dark", "The wind grew stronger", "A storm started"],
        answer: "The rain stopped and the sky became clear",
        explanation: "The story explains: After some time, the rain stopped and the sky became clear."
      }
    ]
  },
  {
    id: "story-43-rock",
    title: "43. Rock",
    text: "Ben was walking along a path with his father. He noticed a large rock beside the road. Ben stopped because he had never seen such a big rock before. His father told him not to climb on it. Ben listened and walked around the rock instead. Then they continued their walk safely.",
    target_word_ids: ["rock", "road"],
    questions: [
      {
        id: "q43-1",
        category: "comprehension",
        prompt: "Who was walking with Ben?",
        choices: ["His father", "His brother", "His friend Mark", "His dog Max"],
        answer: "His father",
        explanation: "The story explains: Ben was walking along a path with his father."
      },
      {
        id: "q43-2",
        category: "comprehension",
        prompt: "What did Ben see?",
        choices: ["A large rock beside the road", "An old mill", "A small frog", "A green plant"],
        answer: "A large rock beside the road",
        explanation: "The story explains: He noticed a large rock beside the road."
      },
      {
        id: "q43-3",
        category: "comprehension",
        prompt: "Where was the rock?",
        choices: ["Beside the road", "In the middle of the river", "On top of the hill", "Near the garden gate"],
        answer: "Beside the road",
        explanation: "The story explains: Beside the road."
      },
      {
        id: "q43-4",
        category: "comprehension",
        prompt: "What did his father tell him?",
        choices: ["Not to climb on it", "To sit on it", "To push it away", "To jump over it"],
        answer: "Not to climb on it",
        explanation: "The story explains: His father told him not to climb on it."
      },
      {
        id: "q43-5",
        category: "comprehension",
        prompt: "What did Ben do instead of climbing?",
        choices: ["Walked around the rock", "Sat down and cried", "Climbed anyway", "Threw a stick at it"],
        answer: "Walked around the rock",
        explanation: "The story explains: Ben listened and walked around the rock instead."
      }
    ]
  },
  {
    id: "story-44-round",
    title: "44. Round",
    text: "Ana received a new ball from her aunt. The ball was round and easy to roll. Ana went outside and played with her brother. She rolled the ball toward him. Her brother rolled it back to her. They continued playing until it was time to go inside.",
    target_word_ids: ["round"],
    questions: [
      {
        id: "q44-1",
        category: "comprehension",
        prompt: "Who gave Ana the ball?",
        choices: ["Her aunt", "Her mother", "Her teacher", "Her grandmother"],
        answer: "Her aunt",
        explanation: "The story explains: Ana received a new ball from her aunt."
      },
      {
        id: "q44-2",
        category: "comprehension",
        prompt: "What shape was the ball?",
        choices: ["Round", "Square", "Flat", "Oval"],
        answer: "Round",
        explanation: "The story explains: The ball was round and easy to roll."
      },
      {
        id: "q44-3",
        category: "comprehension",
        prompt: "Who played with Ana?",
        choices: ["Her brother", "Her friend Nina", "Her cousin Sam", "Her pet dog"],
        answer: "Her brother",
        explanation: "The story explains: Ana went outside and played with her brother."
      },
      {
        id: "q44-4",
        category: "comprehension",
        prompt: "What did Ana do with the ball?",
        choices: ["Rolled it toward her brother", "Kicked it over the fence", "Threw it in the basket", "Bounced it high"],
        answer: "Rolled it toward her brother",
        explanation: "The story explains: She rolled the ball toward him."
      },
      {
        id: "q44-5",
        category: "comprehension",
        prompt: "When did they stop playing?",
        choices: ["When it was time to go inside", "When the ball got lost", "When it started raining", "After one minute"],
        answer: "When it was time to go inside",
        explanation: "The story explains: They continued playing until it was time to go inside."
      }
    ]
  },
  {
    id: "story-45-plant",
    title: "45. Plant",
    text: "Lia found a small plant growing near their window. She noticed that its leaves looked fresh and healthy. She asked her mother if she could take care of it. Her mother taught her to give it enough water and sunlight. Lia followed her mother's advice every day. After several days, she was happy to see new leaves.",
    target_word_ids: ["plant", "stem", "green"],
    questions: [
      {
        id: "q45-1",
        category: "comprehension",
        prompt: "What did Lia find?",
        choices: ["A small plant", "A little bird", "A red hat", "A bag of nuts"],
        answer: "A small plant",
        explanation: "The story explains: Lia found a small plant growing near their window."
      },
      {
        id: "q45-2",
        category: "comprehension",
        prompt: "Where was the plant growing?",
        choices: ["Near their window", "In the garden corner", "Under the tree", "Beside the road"],
        answer: "Near their window",
        explanation: "The story explains: Near their window."
      },
      {
        id: "q45-3",
        category: "comprehension",
        prompt: "Whom did Lia ask for help?",
        choices: ["Her mother", "Her teacher", "Her brother", "Her father"],
        answer: "Her mother",
        explanation: "The story explains: She asked her mother if she could take care of it."
      },
      {
        id: "q45-4",
        category: "comprehension",
        prompt: "What did her mother teach her?",
        choices: ["To give it enough water and sunlight", "To put it in the dark", "To cut its leaves", "To keep it inside a box"],
        answer: "To give it enough water and sunlight",
        explanation: "The story explains: Her mother taught her to give it enough water and sunlight."
      },
      {
        id: "q45-5",
        category: "comprehension",
        prompt: "What did Lia see after several days?",
        choices: ["New leaves", "Red flowers", "Fresh fruit", "A tall stem"],
        answer: "New leaves",
        explanation: "The story explains: After several days, she was happy to see new leaves."
      }
    ]
  },
  {
    id: "story-46-green",
    title: "46. Green",
    text: "Tom was walking around the school garden with his teacher. He noticed a green leaf on a small plant. He bent down and looked at the leaf carefully. The teacher explained that leaves help plants grow. Tom became interested and looked at the other plants. He thanked his teacher for teaching him something new.",
    target_word_ids: ["green", "plant"],
    questions: [
      {
        id: "q46-1",
        category: "comprehension",
        prompt: "Where was Tom walking?",
        choices: ["Around the school garden", "In the playground", "Inside the library", "Along the street"],
        answer: "Around the school garden",
        explanation: "The story explains: Tom was walking around the school garden with his teacher."
      },
      {
        id: "q46-2",
        category: "comprehension",
        prompt: "What did he notice?",
        choices: ["A green leaf on a small plant", "A caterpillar", "A red flower", "A small frog"],
        answer: "A green leaf on a small plant",
        explanation: "The story explains: He noticed a green leaf on a small plant."
      },
      {
        id: "q46-3",
        category: "comprehension",
        prompt: "What color was the leaf?",
        choices: ["Green", "Yellow", "Brown", "Pink"],
        answer: "Green",
        explanation: "The story explains: The leaf was green."
      },
      {
        id: "q46-4",
        category: "comprehension",
        prompt: "What did the teacher explain?",
        choices: ["Leaves help plants grow", "Plants need no water", "Leaves change color quickly", "Seeds grow in the dark"],
        answer: "Leaves help plants grow",
        explanation: "The story explains: The teacher explained that leaves help plants grow."
      },
      {
        id: "q46-5",
        category: "comprehension",
        prompt: "What did Tom learn?",
        choices: ["Something new about how leaves help plants", "How to plant a tree", "How to harvest fruit", "How to trim grass"],
        answer: "Something new about how leaves help plants",
        explanation: "The story explains: Tom thanked his teacher for teaching him something new."
      }
    ]
  },
  {
    id: "story-47-black",
    title: "47. Black",
    text: "Ben was getting ready for school one morning. He put his books inside his black bag. He also placed his pencils and notebook inside it. Before leaving, he checked if he had everything he needed. His mother reminded him to take care of his school things. Ben carried his bag and happily went to school.",
    target_word_ids: ["black", "back"],
    questions: [
      {
        id: "q47-1",
        category: "comprehension",
        prompt: "Where was Ben going?",
        choices: ["To school", "To the market", "To the library", "To play outside"],
        answer: "To school",
        explanation: "The story explains: Ben was getting ready for school one morning."
      },
      {
        id: "q47-2",
        category: "comprehension",
        prompt: "What color was his bag?",
        choices: ["Black", "Red", "Blue", "Green"],
        answer: "Black",
        explanation: "The story explains: He put his books inside his black bag."
      },
      {
        id: "q47-3",
        category: "comprehension",
        prompt: "What did he put inside the bag?",
        choices: ["Books, pencils, and notebook", "Toys and games", "Lunch and water", "Clothes and shoes"],
        answer: "Books, pencils, and notebook",
        explanation: "The story explains: He put his books, pencils and notebook inside it."
      },
      {
        id: "q47-4",
        category: "comprehension",
        prompt: "What did Ben check before leaving?",
        choices: ["If he had everything he needed", "The time on the clock", "His shoes", "The weather outside"],
        answer: "If he had everything he needed",
        explanation: "The story explains: He checked if he had everything he needed."
      },
      {
        id: "q47-5",
        category: "comprehension",
        prompt: "What did his mother remind him to do?",
        choices: ["Take care of his school things", "Walk quickly", "Don't eat snacks", "Study hard"],
        answer: "Take care of his school things",
        explanation: "The story explains: His mother reminded him to take care of his school things."
      }
    ]
  },
  {
    id: "story-48-house",
    title: "48. House",
    text: "One afternoon, Ana walked with her mother around their neighborhood. As they walked, Ana noticed a small house with a red door. There were beautiful flowers beside the window. Ana stopped for a moment because she liked the flowers. Her mother told her that the house belonged to a kind family. They continued walking home while talking about the beautiful garden.",
    target_word_ids: ["house", "pink"],
    questions: [
      {
        id: "q48-1",
        category: "comprehension",
        prompt: "Whom did Ana walk with?",
        choices: ["Her mother", "Her brother", "Her father", "Her friend Nina"],
        answer: "Her mother",
        explanation: "The story explains: Ana walked with her mother."
      },
      {
        id: "q48-2",
        category: "comprehension",
        prompt: "What did Ana notice?",
        choices: ["A small house with a red door", "An old mill", "A tall tree", "A big dog"],
        answer: "A small house with a red door",
        explanation: "The story explains: Ana noticed a small house with a red door."
      },
      {
        id: "q48-3",
        category: "comprehension",
        prompt: "What color was the door?",
        choices: ["Red", "Blue", "Green", "White"],
        answer: "Red",
        explanation: "The story explains: A red door."
      },
      {
        id: "q48-4",
        category: "comprehension",
        prompt: "What was beside the window?",
        choices: ["Beautiful flowers", "A pink fan", "A bird cage", "A small bench"],
        answer: "Beautiful flowers",
        explanation: "The story explains: There were beautiful flowers beside the window."
      },
      {
        id: "q48-5",
        category: "comprehension",
        prompt: "Where did Ana and her mother go afterward?",
        choices: ["Continued walking home", "Went inside the house", "Stopped at the store", "Went to the park"],
        answer: "Continued walking home",
        explanation: "The story explains: They continued walking home while talking about the beautiful garden."
      }
    ]
  }
];

// Append new words ensuring no duplicates
const existingWordIds = new Set(content.words.map(w => w.id));
let addedWords = 0;
for (const word of newWords) {
  if (!existingWordIds.has(word.id)) {
    content.words.push(word);
    existingWordIds.add(word.id);
    addedWords++;
  }
}

// Append new stories ensuring no duplicates
if (!content.stories) content.stories = [];
const existingStoryIds = new Set(content.stories.map(s => s.id));
let addedStories = 0;
for (const story of newStories) {
  if (!existingStoryIds.has(story.id)) {
    content.stories.push(story);
    existingStoryIds.add(story.id);
    addedStories++;
  }
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
console.log(`Successfully merged content! Added ${addedWords} words (Total: ${content.words.length}) and ${addedStories} stories (Total: ${content.stories.length}).`);
