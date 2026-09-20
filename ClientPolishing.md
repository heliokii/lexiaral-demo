1. Our client wants to categorize words into difficulty so that is why they send us a new pdf file.
This is the file FINAL-WORDS-SENTENCE-STORY.pdf
I am not sure but I think there is new changes for words and sentences here. I know it is a look of work since we gotta change the words or maybe categorize based on their diffculty

2. Our client wants to have the LEARN the option select difficulty based on the words per category in the pdf file. This is what the client said, "Sir nakalimutan kopo sabihin na baka pwede po tayong  magkakaroon ng options sa learn ulit? Like meron pong EASY, AVERAGE and DIFFICULT na option. Kase kung na check nyopo ang file na sinend po ng maam reyn ay divide napo yun sa 3 levels po. 

Pero kung hindi naman po kaya ay pwede naman po na sunod sunod nalang from easy to difficult. Then lagyan nalang po siguro ng kahit unting text po na reminding na yun po ay mga easy average or difficult na words na"


3. Our client said they want the pictures per words be changed to a real image and not harcoded type. I know there is alot of work here you will need to change the hardcoded codes with those original image one by one.

Hence they provided the images. THe image per words are located in: 
C:\Users\HP LAPTOP 15s\lexiaral-demo\assets\Easy
C:\Users\HP LAPTOP 15s\lexiaral-demo\assets\Average
C:\Users\HP LAPTOP 15s\lexiaral-demo\assets\Difficult

Upon giving the prototype preview yesterday. There is many issues to fixed which includes:

1. In mobile view, when the user is in the play mode and is answering the questions like multiple choices, the multiple choice is instead arranged into one column 4 row instead of two rows and two column. The issue is shown in image assets\86471f50-374d-49e2-b318-a1096ed8c1b9.jpg.

2. Mobile Issue Text To Speech: In the mobile view, when the user is in LEARN mode, when the user click the sound icon for both faces of the flash card (picture and word & meaning), the text to speech is not working. The screenshot is shown in assets\Screenshot 2026-09-16 074158.png, Screenshot 2026-09-16 074606.png 

3. Also, I noticed that even in PLAY mode, anything with sounds icon for text to speech is not also working. Everything including those instructions tts and even questions tts in any levels that has sound icon.
Screenshot 2026-09-16 074606.png Screenshot 2026-09-16 074635.png Screenshot 2026-09-16 074651.png

4. Our client is considering to change the text to speech accent or voice. She said that it is up to us to choose options that is suitable and good to hear in this project. They also want to slow the speed  of the voice of TTS. So how do you think we execute the changing of speech or voice ? Do we use other source like bandlab or do we test other variations built in TTS muna ?
"Then yung sa ating text to speech sir baka mababago papo natin ang accent. Bawasan po  natin ng speed ang text to speech and baka may other options po ng accent. "
The screenshot showing the client request is in Screenshot 2026-09-16 075356.png

5. Maybe we should improve the UI UX Responsiveness Adaptiveness. I notice kasi na some UI UX which is looking fine in mobile view in laptop or toggle devices is not accurate to what UI UX is shown in the actual mobile phone. I want you to work on this carefully. 

In laptop or desktop view, the text to speech, bgm, and sfx is all working. I also notice that it seems netlify do have issues in bundling kasi as we experienced yesterday, yung original bgm natin na alex-morgan-kids-playground-giggles-parade-578468.mp3 is replaced with new bgm. Do you think it would be better to use vercel for deployment instead?

Yesterday din pala as we give the preview prototype https://lexiaral-demo.netlify.app/, the bgm,sfx,and tts is not working which means wala talagang sounds but you may notice here in recent commits in git graph 7200d8d51f64a445aafe7dcd30962ab72fd8b591 is naayos na ng aking teammate and is working na in prod side.


Never Execute recklessly. I want you to familiarize carefully with the issues I attached here. Check and view all the attached files for each issue for better context. Dont rush. Make sure that when in execution, you must finish the work from beginning to end. No skipping and no half-done. Dont hallucinate. Fix the issue that you will encountered.