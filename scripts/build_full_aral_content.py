import json, re, pypdf

# 1. Official Words (Grade 3 ARAL)
words = [
  {
    "id": "cat", "word": "cat", "image_url": "asset://cat", "audio_url": "tts://en-US/cat",
    "definition": "A small, furry animal often kept as a pet.",
    "example_sentence": "The cat is sitting quietly on the soft mat near the door.",
    "story_context": "Mia has a small cat named Mimi. The cat sits on a mat near the door.",
    "introduced_level": 1,
    "sentence_blank": "The ____ is sitting quietly on the soft mat near the door."
  },
  {
    "id": "mat", "word": "mat", "image_url": "asset://mat", "audio_url": "tts://en-US/mat",
    "definition": "A piece of fabric placed on the floor to sit or step on.",
    "example_sentence": "The little cat likes to sleep on the clean mat every afternoon.",
    "story_context": "After playing, the cat sits on a mat near the door.",
    "introduced_level": 1,
    "sentence_blank": "The little cat likes to sleep on the clean ____ every afternoon."
  },
  {
    "id": "hat", "word": "hat", "image_url": "asset://hat", "audio_url": "tts://en-US/hat",
    "definition": "Something you wear on your head for shade or protection.",
    "example_sentence": "Ben wears his red hat when he goes outside to play.",
    "story_context": "Ben has a new red hat. He wears his hat when he goes outside.",
    "introduced_level": 1,
    "sentence_blank": "Ben wears his red ____ when he goes outside to play."
  },
  {
    "id": "rat", "word": "rat", "image_url": "asset://rat", "audio_url": "tts://en-US/rat",
    "definition": "A small furry animal with a long tail.",
    "example_sentence": "A small rat runs quickly near the box beside the kitchen.",
    "story_context": "A small rat lives near an old box. It runs quickly toward the food.",
    "introduced_level": 1,
    "sentence_blank": "A small ____ runs quickly near the box beside the kitchen."
  },
  {
    "id": "bat", "word": "bat", "image_url": "asset://bat", "audio_url": "tts://en-US/bat",
    "definition": "A flying animal that is active at night.",
    "example_sentence": "The bat flies around the trees when the sky becomes dark.",
    "story_context": "At night, the bat flies around the garden looking for food.",
    "introduced_level": 1,
    "sentence_blank": "The ____ flies around the trees when the sky becomes dark."
  },
  {
    "id": "pet", "word": "pet", "image_url": "asset://pet", "audio_url": "tts://en-US/pet",
    "definition": "A friendly animal that you care for at home.",
    "example_sentence": "I have a little pet that I feed and care for every day.",
    "story_context": "Ana has a little pet at home. She gives her pet food and clean water.",
    "introduced_level": 1,
    "sentence_blank": "I have a little ____ that I feed and care for every day."
  },
  {
    "id": "happy", "word": "happy", "image_url": "asset://happy", "audio_url": "tts://en-US/happy",
    "definition": "Feeling joyful, glad, or pleased.",
    "example_sentence": "The boy is happy because he received a new book from his mother.",
    "story_context": "Leo feels happy because he loves reading books.",
    "introduced_level": 1,
    "sentence_blank": "The boy is ____ because he received a new book from his mother."
  },
  {
    "id": "sun", "word": "sun", "image_url": "asset://sun", "audio_url": "tts://en-US/sun",
    "definition": "The bright star that gives light and warmth to the earth.",
    "example_sentence": "The bright sun shines in the sky while the children play outside.",
    "story_context": "The sun comes up early in the morning and shines in the sky.",
    "introduced_level": 1,
    "sentence_blank": "The bright ____ shines in the sky while the children play outside."
  },
  {
    "id": "sit", "word": "sit", "image_url": "asset://sit", "audio_url": "tts://en-US/sit",
    "definition": "To rest your body on a chair or on the floor.",
    "example_sentence": "Please sit on your chair and listen carefully to your teacher.",
    "story_context": "Her teacher asks her to sit on a chair in the reading corner.",
    "introduced_level": 1,
    "sentence_blank": "Please ____ on your chair and listen carefully to your teacher."
  },
  {
    "id": "set", "word": "set", "image_url": "asset://set", "audio_url": "tts://en-US/set",
    "definition": "To put or place something down carefully.",
    "example_sentence": "I set my book on the table before I start reading.",
    "story_context": "He sets the book carefully on the table before reading.",
    "introduced_level": 1,
    "sentence_blank": "I ____ my book on the table before I start reading."
  },
  {
    "id": "lit", "word": "lit", "image_url": "asset://lit", "audio_url": "tts://en-US/lit",
    "definition": "Turned on or giving off light.",
    "example_sentence": "The lamp is lit at night so that I can read my book.",
    "story_context": "The lamp is now lit, so the room becomes bright.",
    "introduced_level": 1,
    "sentence_blank": "The lamp is ____ at night so that I can read my book."
  },
  {
    "id": "little", "word": "little", "image_url": "asset://little", "audio_url": "tts://en-US/little",
    "definition": "Small in size.",
    "example_sentence": "I see a little bird sitting quietly on a branch near our house.",
    "story_context": "A little bird sits on a branch near the house and sings.",
    "introduced_level": 1,
    "sentence_blank": "I see a ____ bird sitting quietly on a branch near our house."
  },
  {
    "id": "top", "word": "top", "image_url": "asset://top", "audio_url": "tts://en-US/top",
    "definition": "The highest part or surface of something.",
    "example_sentence": "The toy is on top of the box beside the bookshelf.",
    "story_context": "He puts the toy on top of a box while cleaning.",
    "introduced_level": 1,
    "sentence_blank": "The toy is on ____ of the box beside the bookshelf."
  },
  {
    "id": "map", "word": "map", "image_url": "asset://map", "audio_url": "tts://en-US/map",
    "definition": "A drawing that shows places, roads, and directions.",
    "example_sentence": "I look at the map carefully to find the way to the park.",
    "story_context": "His father brings a map to help them find the way to the park.",
    "introduced_level": 1,
    "sentence_blank": "I look at the ____ carefully to find the way to the park."
  },
  {
    "id": "man", "word": "man", "image_url": "asset://man", "audio_url": "tts://en-US/man",
    "definition": "An adult male person.",
    "example_sentence": "The kind man walks to the store to buy some food for his family.",
    "story_context": "The kind man helps carry some of the books for the child.",
    "introduced_level": 1,
    "sentence_blank": "The kind ____ walks to the store to buy some food for his family."
  },
  {
    "id": "dog", "word": "dog", "image_url": "asset://dog", "audio_url": "tts://en-US/dog",
    "definition": "A friendly four-legged pet that barks.",
    "example_sentence": "The friendly dog runs around the yard and plays with the children.",
    "story_context": "Dan has a friendly dog named Max. Max runs around the yard.",
    "introduced_level": 1,
    "sentence_blank": "The friendly ____ runs around the yard and plays with the children."
  },
  {
    "id": "den", "word": "den", "image_url": "asset://den", "audio_url": "tts://en-US/den",
    "definition": "A cozy shelter or resting house for an animal.",
    "example_sentence": "The dog sleeps inside its small den when it wants to rest.",
    "story_context": "The dog has a small den under a tree that keeps it safe.",
    "introduced_level": 1,
    "sentence_blank": "The dog sleeps inside its small ____ when it wants to rest."
  },
  {
    "id": "dig", "word": "dig", "image_url": "asset://dig", "audio_url": "tts://en-US/dig",
    "definition": "To break up and move dirt or soil with paws or hands.",
    "example_sentence": "The dog likes to dig in the soil under the big tree.",
    "story_context": "It starts to dig with its paws in the soil under the tree.",
    "introduced_level": 1,
    "sentence_blank": "The dog likes to ____ in the soil under the big tree."
  },
  {
    "id": "egg", "word": "egg", "image_url": "asset://egg", "audio_url": "tts://en-US/egg",
    "definition": "An oval object laid by a female bird with a shell.",
    "example_sentence": "The hen has an egg in her nest near the farmer's house.",
    "story_context": "A hen sits quietly in her nest. Beside her is a small egg.",
    "introduced_level": 1,
    "sentence_blank": "The hen has an ____ in her nest near the farmer's house."
  },
  {
    "id": "hill", "word": "hill", "image_url": "asset://hill", "audio_url": "tts://en-US/hill",
    "definition": "A raised area of land smaller than a mountain.",
    "example_sentence": "We walk slowly up the hill while enjoying the trees and flowers.",
    "story_context": "Sara and her brother walk slowly up a small hill to see the view.",
    "introduced_level": 1,
    "sentence_blank": "We walk slowly up the ____ while enjoying the trees and flowers."
  }
]

# 2. Extract and compile all 20 stories from PDF
reader = pypdf.PdfReader('Words-sentence-story.pdf')
full_text = '\n'.join([p.extract_text() for p in reader.pages])
story_start = full_text.find('STORY:')
stories_text = full_text[story_start:]
blocks = stories_text.split('---')

story_metadata = [
  # (story_id, primary_word_id, associated_words, answers_and_distractors)
  ('cat', ['cat', 'mat', 'pet', 'happy'], [
    ('Mimi', ['Max', 'Leo', 'Sam']),
    ('A ball', ['A hat', 'A box', 'A book']),
    ('Every morning', ['Only at night', 'At noon', 'Every evening']),
    ('On a mat near the door', ['On top of a box', 'Under a tree', 'On a chair']),
    ('She has a playful cat', ['She found a red hat', 'She ate an egg', 'She walked up a hill'])
  ]),
  ('mat', ['mat', 'cat', 'little', 'sit'], [
    ('Tom', ['Ben', 'Dan', 'Sam']),
    ('In front of his house', ['In the kitchen', 'Under a big tree', 'On top of a hill']),
    ('Every afternoon', ['Every morning', 'Only at night', 'Only on Sunday']),
    ('He cleans the mat', ['He throws it away', 'He hides it in a box', 'He gives it away']),
    ('He wants his house neat and clean', ['His mother told him to', 'To play with his cat', 'To sell it at the store'])
  ]),
  ('hat', ['hat', 'happy', 'sun', 'little'], [
    ('Ben', ['Tom', 'Dan', 'Leo']),
    ('Red', ['Blue', 'Green', 'Yellow']),
    ('When he goes outside to play', ['When he goes to bed', 'Only when it rains', 'When he sits inside']),
    ('The wind blows it away', ['A dog takes it', 'It falls in water', 'It gets dirty']),
    ('He gets his hat back', ['He ate sweet fruits', 'He saw a little bird', 'His mother called him'])
  ]),
  ('rat', ['rat', 'top', 'pet', 'little'], [
    ('A small rat', ['A little bird', 'A friendly dog', 'A bat']),
    ('Near an old box', ['Inside a den', 'On top of a hill', 'In the garden']),
    ('Some food near the box', ['A shiny red hat', 'A little pet', 'A big cat']),
    ('Goes back to its little home', ['Runs to the park', 'Climbs a tree', 'Plays with a ball']),
    ('It feels safe inside', ['It is tired', 'It is raining', 'It sees the sun'])
  ]),
  ('bat', ['bat', 'sun', 'hill', 'little'], [
    ('A bat', ['A bird', 'A rat', 'A dog']),
    ('In a tall tree near a garden', ['Inside a den', 'Under a mat', 'In a box']),
    ('At night', ['Every morning', 'In the afternoon', 'At noon']),
    ('Food', ['A red hat', 'A clean mat', 'A toy ball']),
    ('From a safe distance', ['With a lamp', 'Inside their home', 'From the hilltop'])
  ]),
  ('pet', ['pet', 'happy', 'little', 'cat'], [
    ('Ana', ['Mia', 'Sara', 'Nina']),
    ('At home', ['In the classroom', 'Near the park', 'On the hill']),
    ('Every morning', ['Only at night', 'Once a week', 'In the evening']),
    ('Food and clean water', ['A red hat', 'A storybook', 'A shiny toy']),
    ('Her pet is playful and friendly', ['It can fly', 'It sings songs', 'It wears a hat'])
  ]),
  ('happy', ['happy', 'set', 'sit', 'little'], [
    ('Leo', ['Ben', 'Sam', 'Dan']),
    ('His mother', ['His teacher', 'His sister', 'His father']),
    ('Reads the book together', ['Plays outside', 'Walks up the hill', 'Cleans the mat']),
    ('The pictures in the book', ['Their little pet', 'The bright sun', 'The old box']),
    ('He loves reading', ['He received a toy', 'He ate an egg', 'He went to the park'])
  ]),
  ('sun', ['sun', 'happy', 'top', 'little'], [
    ('The sun', ['The lamp', 'The moon', 'The bird']),
    ('Early in the morning', ['At noon', 'Late in the evening', 'At night']),
    ('Outside with their friends', ['Inside the house', 'In the kitchen', 'Under the bed']),
    ('Under a tree', ['On a chair', 'In a den', 'Near the door']),
    ('It is bright and wonderful', ['It is too cold', 'It is dark', 'They are sad'])
  ]),
  ('sit', ['sit', 'set', 'little', 'happy'], [
    ('Nina', ['Ana', 'Mia', 'Sara']),
    ('In her classroom', ['In the garden', 'Near the store', 'At the park']),
    ('On a chair', ['On a mat', 'On the floor', 'On a box']),
    ('Opens her book and reads', ['Eats her lunch', 'Plays with a toy', 'Draws a map']),
    ('What she learned', ['A funny joke', 'A song', 'A secret'])
  ]),
  ('set', ['set', 'sit', 'happy', 'little'], [
    ('A new storybook', ['A red hat', 'A small ball', 'A toy car']),
    ('Carefully on the table', ['Inside a box', 'On the floor', 'On the mat']),
    ('His mother', ['His teacher', 'His sister', 'His father']),
    ('After lunch', ['Early in the morning', 'At night', 'On Sunday']),
    ('New words from the story', ['How to draw a map', 'How to dig', 'How to fly a bat'])
  ]),
  ('lit', ['lit', 'set', 'sit', 'little'], [
    ('In the evening', ['In the morning', 'At noon', 'In the afternoon']),
    ('The lamp beside her bed', ['The garden light', 'The kitchen stove', 'A candle']),
    ('Beside her bed', ['On top of a box', 'Under the table', 'Near the door']),
    ('So the room becomes bright', ['To play with Mimi', 'To look for a hat', 'To clean the mat']),
    ('Reads quietly', ['Eats dinner', 'Plays outside', 'Feeds her pet'])
  ]),
  ('little', ['little', 'happy', 'sun', 'top'], [
    ('A little bird', ['A small cat', 'A tiny rat', 'A bat']),
    ('On a branch near the house', ['On a mat', 'Inside a den', 'On the roof']),
    ('Every morning', ['At noon', 'At night', 'Only on Monday']),
    ('From the window', ['From the tree', 'From the garden', 'From the hill']),
    ('Happy while watching it', ['Tired and sleepy', 'Afraid', 'Sad'])
  ]),
  ('top', ['top', 'set', 'little', 'happy'], [
    ('Mark', ['Leo', 'Tom', 'Dan']),
    ('A small toy car', ['A red hat', 'A clean mat', 'A storybook']),
    ('On top of a box', ['Under the bed', 'Inside a bag', 'On a chair']),
    ('Gets the toy carefully', ['Takes a nap', 'Goes outside', 'Reads a story']),
    ('Back in his toy box', ['Under the table', 'On the bed', 'On the mat'])
  ]),
  ('map', ['map', 'top', 'man', 'hill'], [
    ('Ben', ['Dan', 'Sam', 'Tom']),
    ('His father', ['His teacher', 'His mother', 'His friend']),
    ('To find the way to the park', ['To draw pictures', 'To clean the house', 'To find a toy']),
    ('To the park', ['To the school', 'To the store', 'To the hill']),
    ('Enjoy their afternoon together', ['Buy an egg', 'Dig in the soil', 'Read a book'])
  ]),
  ('man', ['man', 'little', 'happy', 'set'], [
    ('A kind man', ['A little boy', 'A farmer', 'A teacher']),
    ('Several books', ['A toy car', 'A clean mat', 'An egg']),
    ('Help carrying the books', ['Water to drink', 'A red hat', 'A map']),
    ('Carries some of the books', ['Gives directions', 'Calls a teacher', 'Buys food']),
    ('Smiles and thanks him', ['Says goodbye', 'Gives him an apple', 'Runs away'])
  ]),
  ('dog', ['dog', 'pet', 'happy', 'den'], [
    ('Max', ['Mimi', 'Leo', 'Dan']),
    ('Around the yard', ['Inside the house', 'Up the hill', 'To the store']),
    ('Every afternoon', ['Only in the morning', 'At midnight', 'Only on Sunday']),
    ('A small ball', ['A red hat', 'A little box', 'A toy car']),
    ('Some water', ['An egg', 'A book', 'A clean mat'])
  ]),
  ('den', ['den', 'dog', 'pet', 'little'], [
    ('A small den', ['A red hat', 'A little ball', 'A new book']),
    ('Under a tree', ['Inside the house', 'On a hill', 'In the kitchen']),
    ('When it wants to rest', ['Early in the morning', 'When it wants to play', 'At noon']),
    ('It keeps the dog safe and comfortable', ['To find food', 'To hide a toy', 'To play with children']),
    ('Outside to play', ['To the store', 'Up the hill', 'To the park'])
  ]),
  ('dig', ['dig', 'dog', 'pet', 'top'], [
    ('Something interesting under soil', ['A red hat', 'A little bird', 'A clean mat']),
    ('Under a big tree', ['Inside its den', 'On the road', 'In the house']),
    ('Its paws', ['A small spade', 'A stick', 'A stone']),
    ('Its old toy', ['A shiny coin', 'A little egg', 'A bone']),
    ('Plays with it again', ['Buries it again', 'Gives it to Dan', 'Hides it in the den'])
  ]),
  ('egg', ['egg', 'pet', 'little', 'happy'], [
    ('A hen', ['A bird', 'A cat', 'A dog']),
    ('Quietly in her nest', ['On a tree branch', 'Under a mat', 'Inside a box']),
    ('A small egg', ['A toy ball', 'A little chick', 'A seed']),
    ('Every morning', ['Every afternoon', 'Only at night', 'At noon']),
    ('He is thankful for the egg', ['The hen can fly', 'The nest is clean', 'The sun is bright'])
  ]),
  ('hill', ['hill', 'little', 'happy', 'top'], [
    ('Sara and her brother', ['Mia and Mimi', 'Ben and his father', 'Dan and Max']),
    ('The path is a little steep', ['They are tired', 'It is raining', 'They are carrying books']),
    ('Green trees and colorful flowers', ['Small animals', 'Old boxes', 'Houses and cars']),
    ('The beautiful view', ['The school playground', 'A big river', 'A farm']),
    ('Proud because they reached the top', ['Tired and hungry', 'Afraid', 'Sad'])
  ])
]

compiled_stories = []

for i, b in enumerate(blocks):
    lines = [l.strip() for l in b.split('\n') if l.strip() and not l.startswith('===')]
    if i == 0:
        lines = [l for l in lines if l != 'STORY:']
    title = lines[0]
    q_idx = -1
    for idx, l in enumerate(lines):
        if 'Questions:' in l:
            q_idx = idx
            break
    passage = ' '.join(lines[1:q_idx])
    question_lines = lines[q_idx+1:]
    
    s_meta = story_metadata[i]
    primary_word = s_meta[0]
    target_words = s_meta[1]
    qa_pairs = s_meta[2]
    
    story_questions = []
    for q_num, (q_line, (correct_ans, distractors)) in enumerate(zip(question_lines, qa_pairs)):
        # clean question prompt
        prompt = re.sub(r'^\d+\.\s*', '', q_line).strip()
        choices = [correct_ans] + distractors
        story_questions.append({
            "id": f"q{i+1}-{q_num+1}",
            "category": "comprehension",
            "prompt": prompt,
            "choices": choices,
            "answer": correct_ans,
            "explanation": f"The story explains: {correct_ans}."
        })
    
    compiled_stories.append({
        "id": f"story-{i+1}-{primary_word}",
        "title": title,
        "text": passage,
        "target_word_ids": target_words,
        "questions": story_questions
    })

content = {
  "id": "lexiaral-aral-v1",
  "status": "official",
  "title": "Grade 3 ARAL English Vocabulary",
  "source": "Official Grade 3 ARAL English Curriculum, Rosario West & East Districts, SY 2026-2027",
  "words": words,
  "story": compiled_stories[0],
  "stories": compiled_stories
}

with open('assets/content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, indent=2)

print(f'Successfully built assets/content.json with {len(words)} words and {len(compiled_stories)} complete stories with {len(compiled_stories)*5} questions!')
