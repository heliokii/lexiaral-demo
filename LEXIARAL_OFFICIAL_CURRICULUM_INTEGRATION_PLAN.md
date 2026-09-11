# LEXIARAL Official Curriculum Integration Plan
**Document Source:** `Words-sentence-story.pdf` (Rosario West & East Districts, SY 2026-2027)  
**Parent Specification:** `LEXIARAL_Combined_App_Structure_and_Flow-TRUEEEE.pdf`  
**Target Group:** Grade 3 Learners under DepEd ARAL English 3 Program  

---

## 1. Executive Summary

The client has submitted `Words-sentence-story.pdf`, containing the verified DepEd ARAL Grade 3 English curriculum for their undergraduate thesis research in Rosario, Batangas. 

This document replaces the 4 demo mock words (`seed`, `soil`, `water`, `sprout`) and the demo story ("Mia's Little Garden") with:
- **20 Official ARAL Vocabulary Words**
- **20 Official Contextual Sentences**
- **20 Official Reading Passages**
- **100 WH-Comprehension Questions (5 questions per story)**

This plan details the full content architecture, visual asset creation, and code execution steps to integrate all 20 items across the 3 learning levels.

---

## 2. Complete Inventory of Curriculum Data

### A. The 20 Target Vocabulary Words & Sentences
| # | Word | Category / Phonics | Target Sentence in PDF | Child-Friendly Definition |
|---|---|---|---|---|
| 1 | **Cat** | CVC short /a/ | The cat is sitting quietly on the soft mat near the door. | A small, furry animal often kept as a pet. |
| 2 | **Mat** | CVC short /a/ | The little cat likes to sleep on the clean mat every afternoon. | A piece of fabric placed on the floor to sit or step on. |
| 3 | **Hat** | CVC short /a/ | Ben wears his red hat when he goes outside to play. | Something you wear on your head for protection or style. |
| 4 | **Rat** | CVC short /a/ | A small rat runs quickly near the box beside the kitchen. | A small furry animal with a long tail. |
| 5 | **Bat** | CVC short /a/ | The bat flies around the trees when the sky becomes dark. | A flying animal that is active at night. |
| 6 | **Pet** | CVC short /e/ | I have a little pet that I feed and care for every day. | An animal that you care for and keep at home. |
| 7 | **Happy** | Sight / Adjective | The boy is happy because he received a new book from his mother. | Feeling joyful, glad, or pleased. |
| 8 | **Sun** | CVC short /u/ | The bright sun shines in the sky while the children play outside. | The bright star in the sky that gives us light and warmth. |
| 9 | **Sit** | CVC short /i/ | Please sit on your chair and listen carefully to your teacher. | To rest on a chair or on the floor. |
| 10 | **Set** | CVC short /e/ | I set my book on the table before I start reading. | To put or place something down carefully. |
| 11 | **Lit** | CVC short /i/ | The lamp is lit at night so that I can read my book. | Turned on or giving off light. |
| 12 | **Little** | Sight / Adjective | I see a little bird sitting quietly on a branch near our house. | Small in size. |
| 13 | **Top** | CVC short /o/ | The toy is on top of the box beside the bookshelf. | The highest part or surface of something. |
| 14 | **Map** | CVC short /a/ | I look at the map carefully to find the way to the park. | A drawing that shows places, roads, and directions. |
| 15 | **Man** | CVC short /a/ | The kind man walks to the store to buy some food for his family. | An adult male person. |
| 16 | **Dog** | CVC short /o/ | The friendly dog runs around the yard and plays with the children. | A friendly four-legged animal that barks and wags its tail. |
| 17 | **Den** | CVC short /e/ | The dog sleeps inside its small den when it wants to rest. | A cozy, safe shelter or small resting house for an animal. |
| 18 | **Dig** | CVC short /i/ | The dog likes to dig in the soil under the big tree. | To break up and move dirt or soil with paws or a tool. |
| 19 | **Egg** | Short /e/ | The hen has an egg in her nest near the farmer's house. | An oval object laid by a female bird with a shell. |
| 20 | **Hill** | Short /i/ | We walk slowly up the hill while enjoying the trees and flowers. | A raised area of land that is smaller than a mountain. |

---

### B. The 20 Stories and 100 Comprehension Questions
Each story in `Words-sentence-story.pdf` contextualizes one target word in a 4-to-5 sentence passage:

1. **The Cat**: Mia and Mimi the cat playing with a ball, resting on a mat, eating and drinking. (Questions 1-5).
2. **The Mat**: Tom's clean mat in front of the house, keeping it clean for his cat. (Questions 1-5).
3. **The Hat**: Ben's red hat that blows away in the wind and gets recovered. (Questions 1-5).
4. **The Rat**: A small rat finding food near an old box and returning home safely. (Questions 1-5).
5. **The Bat**: A bat sleeping by day and flying at night around a tall tree. (Questions 1-5).
6. **My Pet**: Ana's playful, small pet receiving food, water, and care. (Questions 1-5).
7. **A Happy Day**: Leo receiving a new book from his mother and reading with his sister. (Questions 1-5).
8. **The Sun**: Children enjoying the morning sun, playing outside, and resting under a tree. (Questions 1-5).
9. **Sit and Read**: Nina sitting in the reading corner, opening her book, and telling her teacher. (Questions 1-5).
10. **The Book**: Sam setting his book on the table and reading with his mother. (Questions 1-5).
11. **The Lamp**: Ana turning on the bedside lamp to read before sleeping. (Questions 1-5).
12. **The Little Bird**: A child happily watching a little bird sing on a branch. (Questions 1-5).
13. **On Top**: Mark keeping his toy car on top of a box while cleaning his room. (Questions 1-5).
14. **The Map**: Ben and his father following directions on a map to the park. (Questions 1-5).
15. **The Kind Man**: A kind man helping a tired child carry heavy books to a store. (Questions 1-5).
16. **The Dog**: Dan playing ball with his friendly dog Max and giving him water. (Questions 1-5).
17. **The Dog's Den**: A comfortable shelter under a tree where a dog rests. (Questions 1-5).
18. **Digging**: A dog digging in the soil under a tree to find an old toy. (Questions 1-5).
19. **The Egg**: A farmer checking a hen's nest and being thankful for the egg. (Questions 1-5).
20. **The Hill**: Sara and her brother walking up a scenic hill to see the beautiful view. (Questions 1-5).

---

## 3. Implementation Steps Across Codebase

### Step 1: Visual Asset Generation (`src/illustrations.js`)
Craft 20 clean, child-friendly vector SVGs in `src/illustrations.js` corresponding to each target word:
`cat`, `mat`, `hat`, `rat`, `bat`, `pet`, `happy`, `sun`, `sit`, `set`, `lit`, `little`, `top`, `map`, `man`, `dog`, `den`, `dig`, `egg`, `hill`.

### Step 2: Content Database Population (`assets/content.json` & `src/content.js`)
- Update `assets/content.json` with the 20 official word objects, definitions, audio URLs (`tts://en-US/[word]`), and sentences.
- Populate `assets/content.json` with the primary story ("The Cat") and all 20 stories in a `stories` array.
- In `src/content.js`:
  - Build question sets for Level 1 (Easy):
    - Picture-to-Word
    - Word-to-Picture
    - Listen-and-Choose
    - 2-Column Matching Pairs Activity
  - Build question sets for Level 2 (Average):
    - Complete the Sentence (`sentence_blank`)
    - Picture-Supported Sentence (`pictureSentence`)
    - Meaning in Context
    - Choose Best Use (`bestUse`)
  - Build question sets for Level 3 (Difficult):
    - Story vocabulary in context
    - WH-Comprehension questions (Who, What, When, Where, Why/How)

### Step 3: Story Selection & Reading Mode Enhancement (`src/components/learning.jsx` & `src/screens/LearningScreens.jsx`)
- Support active story switching in Level 3 so pupils and researchers can test reading across multiple ARAL stories.
- Preserve TTS read-aloud and word tapping definitions for the active story.

### Step 4: Verification & Metro Bundling
- Run schema validation (`validateContent()`).
- Verify Metro compiles cleanly on `http://localhost:8081`.
- Run browser subagent test through Level 1, Level 2, and Level 3 with the new ARAL words and stories.
