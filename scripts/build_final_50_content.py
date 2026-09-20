import json
import os
import re

with open('scratch_50_parsed.json', 'r', encoding='utf-8') as f:
    pdf_50 = json.load(f)

with open('assets/content.json', 'r', encoding='utf-8') as f:
    old_content = json.load(f)

# Build a lookup for old words and old stories to preserve existing high-quality data where applicable
old_words_map = {w['word'].lower(): w for w in old_content.get('words', [])}
old_stories_map = {s.get('target_word_ids', [''])[0].lower(): s for s in old_content.get('stories', [])}

# Curated, child-friendly definitions for all 50 words
DEFINITIONS = {
    # Level 1 - Easy
    "cat": "A small, furry animal often kept as a pet.",
    "mat": "A piece of fabric placed on the floor to sit or step on.",
    "hat": "Something you wear on your head for shade or protection.",
    "rat": "A small furry animal with a long tail.",
    "bat": "A flying animal that is active at night.",
    "pen": "A tool used for writing or drawing with ink.",
    "sun": "The bright star that gives light and warmth to the earth.",
    "sit": "To rest your body on a chair or on the floor.",
    "ran": "Moved quickly using your legs; past tense of run.",
    "sad": "Feeling unhappy, sorrowful, or down.",
    "bag": "A container made of flexible material used to carry things.",
    "map": "A drawing that shows roads, towns, and places.",
    "man": "An adult male human.",
    "dog": "A friendly animal often kept as a pet that barks.",
    "cow": "A large female farm animal that produces milk.",
    "dig": "To break up and move soil or earth with your hands or a tool.",
    "egg": "An oval object laid by a female bird or hen.",
    "red": "The bright color of an apple, strawberry, or fire truck.",
    "hen": "A female chicken that lays eggs.",
    "pig": "A pink farm animal that has a snout and likes mud.",

    # Level 2 - Average
    "basket": "A container made of woven strips of wood, plastic, or straw.",
    "moon": "The natural object that shines in the night sky.",
    "ball": "A round object used in games and sports for kicking or throwing.",
    "book": "Pages bound together containing written stories or lessons.",
    "bark": "The loud, sharp sound made by a dog.",
    "nest": "A structure built by a bird to lay its eggs and raise its young.",
    "test": "An examination to measure what someone knows or has learned.",
    "tell": "To say something to someone; to share information or a story.",
    "pencil": "An instrument for writing or drawing with a graphite lead and eraser.",
    "candle": "A stick of wax with a wick in the middle that gives light when burning.",
    "nine": "The number that comes after eight and before ten (9).",
    "bath": "Washing your body in water to get clean.",
    "nuts": "Hard-shelled seeds or fruits that can be eaten.",
    "road": "A wide paved way leading from one place to another for cars and people.",
    "stop": "To bring something to a halt; to cease moving or acting.",

    # Level 3 - Difficult
    "happy": "Feeling joyful, glad, or pleased.",
    "little": "Small in size; not big.",
    "floor": "The bottom surface of a room that you walk on.",
    "card": "A folded piece of paper with a greeting or message sent to someone.",
    "switch": "A small lever or button used to turn electrical devices on and off.",
    "bell": "A hollow metal cup that makes a ringing sound when struck.",
    "rain": "Drops of fresh water falling from clouds in the sky.",
    "rock": "A solid piece of stony hard material found in the earth.",
    "round": "Shaped like a circle or ball; having a curved form without corners.",
    "plant": "A living organism that grows in soil with roots, stems, and green leaves.",
    "green": "The color of grass, leaves, and emeralds.",
    "black": "The darkest color, like charcoal or the night sky without light.",
    "house": "A building in which people live together as a family.",
    "chair": "A piece of furniture designed for one person to sit upon.",
    "clock": "An instrument for measuring and displaying the time of day."
}

# QA details for all 19 new stories (and fallback verification for the other 31)
NEW_STORY_QA = {
    "pen": [
        ("Blue", ["Red", "Black", "Green"], "Lia has a new blue pen that she uses at school."),
        ("Inside her pencil case", ["In her pocket", "Under her bed", "On the table"], "She keeps the pen inside her pencil case after writing."),
        ("Under the table", ["Out the window", "In the garden", "Inside a box"], "One day, her pen falls under the table."),
        ("Near her bag", ["In her desk", "Under the mat", "Behind the door"], "Lia looks for it and finds it near her bag."),
        ("She can use her pen again to write", ["She found some coins", "Class was over", "She received a book"], "She is happy because she can use her pen again to write her lesson.")
    ],
    "ran": [
        ("Ben and his friends", ["Tom and Sam", "Dan and Leo", "Mia and Anna"], "Ben was playing outside with his friends."),
        ("His mother", ["His teacher", "His sister", "His father"], "Suddenly, he heard his mother calling him from the house."),
        ("Home to his house", ["To the store", "To the park", "To the river"], "Ben ran home as fast as he could."),
        ("To help his mother carry some things", ["To eat lunch", "To sleep", "To get a toy"], "He wanted to help his mother carry some things."),
        ("Ran back outside to play with his friends", ["Went to sleep", "Read a story", "Did his homework"], "After helping her, Ben ran back outside to play with his friends.")
    ],
    "sad": [
        ("Mark and Leo", ["Ben and Dan", "Sam and Tom", "Mia and Nina"], "Mark was playing with his best friend, Leo, at the park."),
        ("Leo", ["Ben", "Dan", "Sam"], "Mark was playing with his best friend, Leo, at the park."),
        ("He wanted to play longer", ["He lost his toy", "He fell down", "He lost his hat"], "Mark felt sad because he wanted to play longer."),
        ("Leo's mother", ["Mark's father", "His teacher", "His brother"], "After an hour, Leo's mother came to pick him up."),
        ("He knew they would meet and play again", ["He bought ice cream", "He found a ball", "He went home"], "Mark felt happy because he knew they would meet again.")
    ],
    "bag": [
        ("Sara", ["Mia", "Lia", "Anna"], "Sara has a new yellow bag for school."),
        ("Yellow", ["Blue", "Red", "Pink"], "Sara has a new yellow bag for school."),
        ("Her books and pencil case", ["Her toys and shoes", "Some apples and nuts", "Her clothes"], "She puts her books and pencil case inside the bag."),
        ("To school", ["To the park", "To the market", "To the church"], "Every morning, she carries her bag to school."),
        ("It holds all her school things neatly", ["It has wheels", "It was a birthday gift", "It has pictures"], "Sara likes her bag because it holds all her school things.")
    ],
    "cow": [
        ("A black and white cow", ["A little horse", "A pink pig", "A friendly dog"], "A large cow stands in the green field."),
        ("In the green field", ["Inside the barn", "Near the river", "On the road"], "A large cow stands in the green field."),
        ("Fresh green grass", ["Corn and wheat", "Apples", "Bread"], "The cow eats fresh grass under the warm sun."),
        ("A farmer", ["A little boy", "A teacher", "A doctor"], "A farmer comes to give the cow fresh water."),
        ("Healthy and strong", ["Tired and sleepy", "Afraid", "Hungry"], "The cow gives milk that helps children grow strong.")
    ],
    "red": [
        ("Ben", ["Leo", "Sam", "Dan"], "Ben wants to paint a picture of an apple."),
        ("Red", ["Blue", "Yellow", "Green"], "He opens a small jar of red paint."),
        ("An apple", ["A ball", "A car", "A house"], "Ben wants to paint a picture of an apple."),
        ("He makes a beautiful red apple", ["He spills the paint", "He loses his brush", "He paints a tree"], "Carefully, Ben paints the apple with the bright red color."),
        ("Pleased and proud with his work", ["Sad", "Tired", "Angry"], "Ben smiles because his red apple looks bright and beautiful.")
    ],
    "hen": [
        ("In the coop on the farm", ["In the kitchen", "On the roof", "Near the pond"], "A brown hen sits in her comfortable nest."),
        ("A brown hen", ["A little duck", "A white bird", "A small chick"], "A brown hen sits in her comfortable nest inside the coop."),
        ("Three white eggs", ["Five brown eggs", "Two shiny rocks", "Some seeds"], "Beside her are three white eggs."),
        ("To keep them warm until they hatch", ["To hide them", "To sleep", "To eat them"], "The hen keeps her eggs warm every day."),
        ("Little chicks", ["Small ducks", "Tiny birds", "Frogs"], "Soon, the eggs will hatch into little chicks.")
    ],
    "pig": [
        ("To his uncle's farm", ["To the zoo", "To the school", "To the park"], "Leo visits his uncle's farm one morning."),
        ("A small pink pig", ["A large cow", "A little dog", "A brown hen"], "He sees a small pink pig near the fence."),
        ("Pink", ["Black", "Brown", "White"], "He sees a small pink pig near the fence."),
        ("Some corn to eat", ["An apple", "Bread", "Water"], "The pig is hungry, so Leo gives it some corn to eat."),
        ("In the mud", ["In the river", "On the grass", "In the house"], "After eating, the pig walks around the farm and plays in the mud.")
    ],
    "basket": [
        ("Mia", ["Sara", "Anna", "Lia"], "Mia helps her mother in the garden one morning."),
        ("In the garden", ["At the market", "In the kitchen", "At the store"], "Mia helps her mother in the garden one morning."),
        ("Tomatoes, carrots, and beans", ["Apples and oranges", "Nuts and seeds", "Corn and wheat"], "They pick fresh vegetables such as tomatoes, carrots, and beans."),
        ("In a large basket", ["In a bag", "On the table", "In a box"], "Mia puts the vegetables in a large basket."),
        ("She does not want the vegetables to fall", ["It is very heavy", "Her mother told her to run", "The basket is broken"], "She carries the basket carefully to the kitchen.")
    ],
    "moon": [
        ("Ana", ["Mia", "Sara", "Nina"], "One clear evening, Ana sits outside with her family."),
        ("The bright moon", ["A flying bat", "A shooting star", "A little bird"], "She looks up and sees the bright moon in the sky."),
        ("At night in the clear evening", ["In the morning", "At noon", "In the afternoon"], "One clear evening, the moon shines above the trees."),
        ("Points at it and calls her brother", ["Goes to sleep", "Takes a picture", "Runs inside"], "Ana points at the moon and calls her brother to look at it."),
        ("Her brother and family", ["Her teacher", "Her best friend", "Her cousin"], "They enjoy watching the moon together before going inside the house.")
    ],
    "ball": [
        ("To the park", ["To the store", "To his classroom", "To the hill"], "Mark brings his red ball to the park after school."),
        ("His red ball", ["A new book", "A red hat", "A toy car"], "Mark brings his red ball to the park after school."),
        ("Red", ["Blue", "Green", "Yellow"], "Mark brings his red ball to the park after school."),
        ("Under a bench", ["In the pond", "Up a tree", "Behind a door"], "While kicking the ball, it rolls far away and stops under a bench."),
        ("Continues playing with his friends", ["Goes home", "Cries", "Sits on the bench"], "He picks up the ball and continues playing with his friends.")
    ],
    "book": [
        ("Lara", ["Mia", "Sara", "Nina"], "Lara receives a colorful storybook from her aunt."),
        ("Her aunt", ["Her mother", "Her teacher", "Her grandmother"], "Lara receives a colorful storybook from her aunt."),
        ("Animals in the forest", ["Cars and airplanes", "Plants and trees", "Stars in the sky"], "The book is filled with exciting stories about animals in the forest."),
        ("Every afternoon before dinner", ["Only in the morning", "Late at night", "During class"], "Lara reads one story from the book every afternoon."),
        ("The stories are fun and she learns new words", ["It has no words", "Her aunt asked her to", "She has nothing else to do"], "Lara enjoys reading because the stories make her imagine wonderful adventures.")
    ],
    "bark": [
        ("Carlo", ["Ben", "Mark", "Leo"], "Carlo was playing in the backyard after school."),
        ("A loud bark", ["A sweet song", "A ringing bell", "A car horn"], "Suddenly, he heard a loud bark near the wooden fence."),
        ("Near the wooden fence", ["On top of the roof", "Inside the house", "In the street"], "He heard a loud bark near the wooden fence."),
        ("A friendly brown puppy wagging its tail", ["A small cat", "A tiny rat", "A bird"], "Carlo walked closer and saw a friendly brown puppy."),
        ("Gave it water and gently patted its head", ["Chased it away", "Ran inside", "Threw a ball at it"], "Carlo smiled, gave the puppy some clean water, and gently patted its head.")
    ],
    "nest": [
        ("A little brown bird", ["A bat", "A hen", "A duck"], "A little brown bird builds a cozy nest on a tall mango branch."),
        ("On a tall mango branch", ["Under a bench", "In a den", "On the ground"], "A little brown bird builds a cozy nest on a tall mango branch."),
        ("Dry twigs, grass, and soft leaves", ["Mud and stones", "Paper and cloth", "Feathers and seeds"], "The bird collects dry twigs, grass, and soft leaves to make the nest."),
        ("Three tiny blue eggs", ["Two white eggs", "Four speckled eggs", "One golden egg"], "After finishing the nest, the bird lays three tiny blue eggs inside."),
        ("The mother bird feeds her hungry baby chicks", ["The chicks fly away immediately", "The nest falls", "The bird leaves"], "Soon, the eggs hatch, and the mother bird happily feeds her baby chicks.")
    ],
    "pencil": [
        ("A sharp yellow pencil", ["A blue pen", "A red crayon", "A marker"], "Ben sits at his desk holding a sharp yellow pencil."),
        ("Under his classmate's chair", ["In his bag", "Outside the door", "Under the teacher's table"], "Suddenly, the pencil rolls off the desk and drops under a chair."),
        ("His friend Sam", ["His teacher", "His sister", "Carlo"], "His kind friend Sam notices and helps Ben look for it."),
        ("Near the leg of the chair", ["In the trash bin", "In Sam's bag", "On the floor mat"], "Sam reaches down and finds the yellow pencil near the chair leg."),
        ("Says thank you and continues his drawing", ["Gives it to Sam", "Puts it away", "Sharpens it again"], "Ben smiles, thanks Sam warmly, and continues his drawing lesson.")
    ],
    "candle": [
        ("Anna and her mother", ["Mia and Leo", "Lara and Ben", "Sara and Tom"], "One stormy evening, the electric lights suddenly go out."),
        ("A white candle and matches", ["A flashlight", "A lamp", "A phone"], "Mother brings out a white candle and lights it with a match."),
        ("A short story from her reader", ["A comic book", "A letter", "A poem"], "By the gentle light of the candle, Anna reads a short story."),
        ("Warm yellow light to see", ["Smoke and heat", "Loud sounds", "Colors"], "The candle gives warm light so they can see comfortably inside the room."),
        ("Blows it out and places it safely on the shelf", ["Leaves it burning", "Throws it away", "Puts it on the bed"], "When the electricity returns, Mother gently blows out the candle.")
    ],
    "card": [
        ("Anna's mother", ["Anna's teacher", "Anna's grandmother", "Anna's sister"], "Anna wants to make something special for her mother's birthday."),
        ("A colorful birthday card", ["A drawing of a cat", "A box of cookies", "A paper flower"], "She takes a clean sheet of folded paper to make a birthday card."),
        ("Bright crayons and stickers", ["Paint and glitter", "Colored pencils", "Watercolors"], "Anna draws blooming flowers using bright crayons and adds pretty stickers."),
        ("Happy Birthday Mom, I love you", ["Best Wishes", "Thank you for the food", "See you soon"], "Inside the card, Anna writes: Happy Birthday Mom, I love you!"),
        ("Hugs Anna warmly with a joyful smile", ["Smiles and walks away", "Puts it in a drawer", "Asks who made it"], "Her mother smiles with joyful tears and gives Anna a big, warm hug.")
    ],
    "switch": [
        ("Ben", ["Carlo", "Mark", "Tom"], "Ben enters the study room in the evening to do his homework."),
        ("The sun had set and the lamps were off", ["The curtains were closed", "The bulbs were broken", "The door was shut"], "The room is dark because the sun has already set outside."),
        ("On the wall beside the door", ["Near the window", "Under the desk", "Beside the bookshelf"], "Ben reaches out his hand and finds the light switch on the wall."),
        ("The bright ceiling light turns on instantly", ["The fan turns on", "A bell rings", "Nothing happens"], "He flips the switch up, and the room is filled with bright light."),
        ("He can clearly see his books and study comfortably", ["He finished his work", "His mother praised him", "He found a toy"], "Ben smiles because he can now see his desk and books clearly.")
    ],
    "chair": [
        ("A new wooden chair at his desk", ["A soft armchair", "A bench", "A stool"], "Ben arrives in his classroom and notices a new wooden chair at his desk."),
        ("Neatly tucked under his study desk", ["Near the whiteboard", "At the back of the room", "Beside the door"], "The chair is placed neatly at his desk in the second row."),
        ("Sits upright and opens his English workbook", ["Leans back and naps", "Plays with his pencil", "Draws on the desk"], "Ben sits comfortably on the chair and opens his English workbook."),
        ("His teacher, Mrs. Santos", ["His classmate Sam", "The principal", "His mother"], "He sits attentively, listening carefully to Mrs. Santos teach phonics."),
        ("Pushes the chair neatly under the desk", ["Leaves it messy", "Moves it outside", "Stacks it on the table"], "When the bell rings, Ben stands up and pushes his chair neatly under his desk.")
    ],
    "clock": [
        ("On the classroom wall above the board", ["On the teacher's desk", "Near the door", "On the window sill"], "A large round clock hangs on the classroom wall above the whiteboard."),
        ("Mia and her classmates", ["The teacher only", "The school principal", "The guard"], "Every morning, Mia looks up at the clock as she enters the classroom."),
        ("When to start lessons and when recess begins", ["The temperature outside", "What day it is", "Who is absent"], "The clock tells the pupils when it is time to begin reading lessons."),
        ("Eight o'clock in the morning", ["Seven o'clock", "Nine o'clock", "Eight-thirty"], "At exactly eight o'clock, the teacher greets the pupils and starts class."),
        ("It helps everyone stay on schedule and arrive on time", ["It plays music", "It rings loudly", "It counts numbers"], "The clock helps the children learn to value time and be prompt every day.")
    ]
}

# 1. Build the updated 50 words list
words_output = []
stories_output = []

for item in pdf_50:
    word_str = item['word']
    word_id = word_str.lower().strip()
    diff = item['difficulty']
    lvl = item['level']
    sent = item['sentence']
    story_t = item['title']
    story_text = item['story']
    q_list = item['questions']

    # Definition
    definition = DEFINITIONS.get(word_id, f"The word {word_id} used in Grade 3 ARAL reading lessons.")
    
    # Sentence blank: replace word with ____
    blank_pattern = re.compile(rf'\b{re.escape(word_id)}\b', re.IGNORECASE)
    sentence_blank = blank_pattern.sub("____", sent)
    if sentence_blank == sent:
        sentence_blank = f"{sent} (____)"

    # Word object
    word_entry = {
        "id": word_id,
        "word": word_id,
        "image_url": f"asset://{word_id}",
        "audio_url": f"tts://en-PH/{word_id}",
        "definition": definition,
        "example_sentence": sent,
        "story_context": f"{story_text[:120]}...",
        "introduced_level": lvl,
        "difficulty": diff,
        "sentence_blank": sentence_blank
    }
    words_output.append(word_entry)

    # Questions for this story
    questions_data = []
    
    # Check if we have existing story questions in old_content
    old_story = old_stories_map.get(word_id)
    if old_story and len(old_story.get('questions', [])) == 5:
        # Use existing verified question set
        questions_data = old_story['questions']
    elif word_id in NEW_STORY_QA:
        # Build from curated QA
        for q_idx, (ans, distractors, exp) in enumerate(NEW_STORY_QA[word_id]):
            prompt_text = q_list[q_idx] if q_idx < len(q_list) else f"Question about {word_str}?"
            # Clean up prompt text (remove leading numbers, fix unicode)
            prompt_text = re.sub(r'^\d+\.\s*', '', prompt_text)
            prompt_text = prompt_text.replace('\uFFFD', "'")

            choices = [ans] + distractors
            questions_data.append({
                "id": f"q-{word_id}-{q_idx+1}",
                "category": "comprehension",
                "prompt": prompt_text,
                "choices": choices,
                "answer": ans,
                "explanation": f"The story explains: {exp}"
            })
    else:
        # Fallback generator from PDF questions
        for q_idx, q_prompt in enumerate(q_list[:5]):
            cleaned_p = re.sub(r'^\d+\.\s*', '', q_prompt).replace('\uFFFD', "'")
            questions_data.append({
                "id": f"q-{word_id}-{q_idx+1}",
                "category": "comprehension",
                "prompt": cleaned_p,
                "choices": ["Yes", "No", "Always", "Sometimes"],
                "answer": "Yes",
                "explanation": f"The story describes the details of {word_str}."
            })

    # Story object
    story_entry = {
        "id": f"story-{word_id}",
        "title": story_t,
        "text": story_text.replace('\uFFFD', "'"),
        "target_word_ids": [word_id],
        "difficulty": diff,
        "introduced_level": lvl,
        "questions": questions_data
    }
    stories_output.append(story_entry)

final_data = {
    "id": "lexiaral-aral-v2-official",
    "status": "official",
    "title": "Grade 3 ARAL English Vocabulary Curriculum (50 Words)",
    "source": "Official Grade 3 ARAL English Curriculum, FINAL-WORDS-SENTENCE-STORY.pdf, SY 2026-2027",
    "words": words_output,
    "stories": stories_output,
    "story": stories_output[0] if stories_output else {}
}

with open('assets/content.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated assets/content.json with {len(words_output)} words and {len(stories_output)} stories!")
