
// Tab switching logic
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(this.dataset.tab).style.display = 'block';
    if (this.dataset.tab === "pattern") {
      showPatternQuestion(); 
    }
  }
});

/* 1. Alphabet Sequence Catcher */
const seqCanvas = document.getElementById('seq-canvas');
const seqCtx = seqCanvas.getContext('2d');
const SEQ_WIDTH = seqCanvas.width;
const SEQ_HEIGHT = seqCanvas.height;
const SEQ_PADDLE_W = 30;
const SEQ_PADDLE_H = 80;
const SEQ_LETTER_R = 28;
const SEQ_LETTER_SPEED = 4;
const SEQ_INTERVAL = 80;
const SEQ_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SEQ_WORDS = [
  "CAT", "GAME", "CODE", "WIN", "PLAY", "FUN", "JAVA", "HTML", "CSS", "JS",
  "DOG", "SUN", "MOON", "STAR", "CAR", "TREE", "BIRD", "BOOK", "FISH", "KING", "QUEEN", 
  "PRINCE", "PRINCESS", "SPACE", "ROCKET", "PLANET", "GALAXY", "COMET", "ASTEROID",
  "OCEAN", "RIVER", "MOUNTAIN", "DESERT", "FOREST", "JUNGLE", "ISLAND", "BEACH", "WIND", "RAIN",
  "SNOW", "CLOUD", "THUNDER", "LIGHTNING", "FIRE", "ICE", "STONE", "WOOD", "METAL", "GOLD",
  "SILVER", "BRONZE", "DIAMOND", "PEARL", "RUBY", "EMERALD", "SAPPHIRE", "AMETHYST", "TOPAZ", "OPAL",
  "CRYSTAL", "GEM", "JEWEL", "TREASURE", "FORTUNE", "LUCK", "HAPPY", "JOY", "LOVE", "PEACE",
  "DREAM", "HOPE", "FAITH", "TRUST", "FRIEND", "FAMILY", "HERO", "LEGEND", "MYTH", "FABLE",
  "TALE", "STORY", "ADVENTURE", "JOURNEY", "QUEST", "CHALLENGE", "MISSION", "GOAL", "TARGET", "ACHIEVE",
  "SUCCESS", "VICTORY", "TRIUMPH", "GLORY", "HONOR", "PRIDE", "COURAGE", "BRAVERY", "STRENGTH", "POWER",
  "WISDOM", "KNOWLEDGE", "INTELLIGENCE", "SKILL", "TALENT", "CREATIVITY", "IMAGINATION", "INNOVATION", "ART", "MUSIC",
  "DANCE", "THEATER", "CINEMA", "LITERATURE", "POETRY", "SCIENCE", "TECHNOLOGY", "ENGINEERING", "MATHEMATICS", "COMPUTER",
  "PROGRAMMING", "CODING", "ALGORITHM", "DATA", "INTERNET", "NETWORK", "WEB", "APP", "SOFTWARE", "HARDWARE",
  "GADGET", "DEVICE", "MACHINE", "ROBOT", "AI", "MACHINE LEARNING", "DEEP LEARNING", "NEURAL NETWORK", "BLOCKCHAIN", "CRYPTOCURRENCY",
  "BITCOIN", "ETHEREUM", "LITECOIN", "DOGECOIN", "NFT", "VIRTUAL REALITY", "AUGMENTED REALITY", "MIXED REALITY", "GAME DEVELOPMENT", "GAME DESIGN", "GAME ART",
  "GAME MUSIC", "GAME SOUND", "GAME TESTING", "GAME PROGRAMMING", "GAME ENGINE", "UNITY", "UNREAL ENGINE"
];

let seqCurrentWord, seqCurrentIndex, seqCatcher, seqLetters, seqFrames, seqGameOver, seqWordsCleared, seqMessage;
let seqWordList = [];
let seqWordIndex = 0;

function seqShuffleWords() {
  seqWordList = [...SEQ_WORDS].sort(() => Math.random() - 0.5);
  seqWordIndex = 0;
}
function seqChooseWord() {
  if (seqWordIndex >= seqWordList.length) {
    seqShuffleWords(); // Reshuffle after all words are used
  }
  seqCurrentWord = seqWordList[seqWordIndex++];
  seqCurrentIndex = 0;
}

function seqInitGame() {
  seqShuffleWords();
  seqCatcher = { x: 5, y: SEQ_HEIGHT / 2 - SEQ_PADDLE_H / 2, width: SEQ_PADDLE_W, height: SEQ_PADDLE_H };
  seqLetters = [];
  seqFrames = 0;
  seqGameOver = false;
  seqWordsCleared = 0;
  seqMessage = "";
  seqChooseWord();
  seqDrawScore();
  seqDrawTargetSequence();
  seqDrawMessage();
}

function seqDrawCatcher() {
  seqCtx.fillStyle = "#2ecc40";
  seqCtx.fillRect(seqCatcher.x, seqCatcher.y, seqCatcher.width, seqCatcher.height);
}
function seqDrawLetter(letterObj) {
  seqCtx.beginPath();
  seqCtx.arc(letterObj.x, letterObj.y, SEQ_LETTER_R, 0, 2 * Math.PI);
  seqCtx.fillStyle = "#0074D9";
  seqCtx.fill();
  seqCtx.lineWidth = 3;
  seqCtx.strokeStyle = "#fff";
  seqCtx.stroke();
  seqCtx.fillStyle = "#fff";
  seqCtx.font = "bold 30px Arial";
  seqCtx.textAlign = "center";
  seqCtx.textBaseline = "middle";
  seqCtx.fillText(letterObj.char, letterObj.x, letterObj.y);
}
function seqDrawTargetSequence() {
  let html = "";
  for (let i = 0; i < seqCurrentWord.length; i++) {
    if (i < seqCurrentIndex) {
      html += `<span style="color:#2ecc40;text-decoration:line-through;">${seqCurrentWord[i]}</span> `;
    } else if (i === seqCurrentIndex) {
      html += `<span style="color:#f9d423;text-decoration:underline;">${seqCurrentWord[i]}</span> `;
    } else {
      html += `<span>${seqCurrentWord[i]}</span> `;
    }
  }
  document.getElementById('seq-target-sequence').innerHTML = html;
}
function seqDrawScore() {
  document.getElementById('seq-score').textContent = `Words Cleared: ${seqWordsCleared}`;
}
function seqDrawMessage() {
  document.getElementById('seq-message').textContent = seqMessage;
}
function seqSpawnLetter() {
  let char = Math.random() < 0.5 ? seqCurrentWord[seqCurrentIndex] : SEQ_ALPHABET[Math.floor(Math.random() * SEQ_ALPHABET.length)];
  let y = Math.random() * (SEQ_HEIGHT - SEQ_LETTER_R * 2) + SEQ_LETTER_R;
  seqLetters.push({x: SEQ_WIDTH - SEQ_LETTER_R, y, char});
}
function seqUpdateLetters() {
  for (let letter of seqLetters) letter.x -= SEQ_LETTER_SPEED;
  seqLetters = seqLetters.filter(letter => letter.x + SEQ_LETTER_R > 0);
}
function seqIsCollision(letter) {
  let closestX = Math.max(seqCatcher.x, Math.min(letter.x, seqCatcher.x + seqCatcher.width));
  let closestY = Math.max(seqCatcher.y, Math.min(letter.y, seqCatcher.y + seqCatcher.height));
  let dx = letter.x - closestX;
  let dy = letter.y - closestY;
  return (dx * dx + dy * dy) < (SEQ_LETTER_R * SEQ_LETTER_R);
}
function seqHandleCatch(letter) {
  if (letter.char === seqCurrentWord[seqCurrentIndex]) {
    seqCurrentIndex++;
    if (seqCurrentIndex === seqCurrentWord.length) {
      seqWordsCleared++;
      seqDrawScore();
      seqMessage = `Word "${seqCurrentWord}" cleared! Next word!`;
      seqChooseWord();
      seqLetters = [];
      seqFrames = 0;
    } else {
      seqMessage = `Good! Next: ${seqCurrentWord[seqCurrentIndex]}`;
    }
  } else {
    seqCurrentIndex = 0;
    seqMessage = `Wrong letter! Sequence reset. Next: ${seqCurrentWord[seqCurrentIndex]}`;
  }
}
function seqUpdate() {
  if (seqGameOver) return;
  seqFrames++;
  if (seqFrames % SEQ_INTERVAL === 0) seqSpawnLetter();
  seqUpdateLetters();
  for (let i = seqLetters.length - 1; i >= 0; i--) {
    if (seqIsCollision(seqLetters[i])) {
      seqHandleCatch(seqLetters[i]);
      seqLetters.splice(i, 1);
    }
  }
}
function seqRender() {
  seqCtx.clearRect(0, 0, SEQ_WIDTH, SEQ_HEIGHT);
  seqDrawCatcher();
  for (let letter of seqLetters) seqDrawLetter(letter);
  seqDrawTargetSequence();
  seqDrawScore();
  seqDrawMessage();
}
function seqGameLoop() {
  seqUpdate();
  seqRender();
  requestAnimationFrame(seqGameLoop);
}
// Mouse controls for catcher
seqCanvas.addEventListener('mousemove', function(e) {
  const rect = seqCanvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  seqCatcher.y = Math.max(0, Math.min(SEQ_HEIGHT - seqCatcher.height, mouseY - seqCatcher.height / 2));
});
// Touch controls for catcher (mobile)
seqCanvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  const rect = seqCanvas.getBoundingClientRect();
  let touchY = e.touches[0].clientY - rect.top;
  seqCatcher.y = Math.max(0, Math.min(SEQ_HEIGHT - seqCatcher.height, touchY - seqCatcher.height / 2));
});
seqCanvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  const rect = seqCanvas.getBoundingClientRect();
  let touchY = e.touches[0].clientY - rect.top;
  seqCatcher.y = Math.max(0, Math.min(SEQ_HEIGHT - seqCatcher.height, touchY - seqCatcher.height / 2));
});
seqCanvas.addEventListener('click', function() {
  if (seqGameOver) {
    seqInitGame();
  }
});
seqInitGame();
seqGameLoop();

/* 2. Crazy Math Challenge (with options) */
const mathOps = ["+", "-", "×", "÷", "crazy"];
const mathQuestionDiv = document.getElementById('math-question');
const mathOptionsDiv = document.getElementById('math-options');
const mathFeedbackDiv = document.getElementById('math-feedback');
const mathScoreDiv = document.getElementById('math-score');
let mathScore = 0, mathCurrent, mathCurrentAns;

function getFakeAnswers(correct, type) {
  let arr = [];
  let used = {[correct]: true};
  if (type === "yesno") return ["yes", "no"];
  while (arr.length < 3) {
    let fake;
    if (typeof correct === "number") {
      fake = correct + Math.floor(Math.random() * 10 - 5);
      if (fake == correct) fake += 2;
    } else {
      fake = (Math.random() < 0.5) ? "yes" : "no";
    }
    if (!used[fake]) {
      arr.push(fake);
      used[fake] = true;
    }
  }
  arr.push(correct);
  arr = arr.sort(() => Math.random() - 0.5);
  return arr;
}

function mathGenerate() {
  let mathScore = 0;
let mathQuestions = [];
let mathIndex = 0;

function generateMathQuestions(count = 100) {
  mathQuestions = [];
  for (let i = 0; i < count; i++) {
    let op = mathOps[Math.floor(Math.random() * mathOps.length)];
    let a = Math.floor(Math.random() * 100) + 1;
    let b = Math.floor(Math.random() * 100) + 1;
    let q, ans, fakeType = "";

    if (op === "+") {
      q = `${a} + ${b} = ?`;
      ans = a + b;
    } else if (op === "-") {
      q = `${a} - ${b} = ?`;
      ans = a - b;
    } else if (op === "×") {
      q = `${a} × ${b} = ?`;
      ans = a * b;
    } else if (op === "÷") {
      b = Math.max(1, Math.floor(Math.random() * 12) + 1);
      a = b * (Math.floor(Math.random() * 12) + 1);
      q = `${a} ÷ ${b} = ?`;
      ans = a / b;
    } else if (op === "crazy") {
      const crazyTypes = [
        { q: `What is ${a} + ${b} × 2?`, ans: a + b * 2 },
        { q: `What is (${a} × ${b}) - ${b}?`, ans: (a * b) - b },
        { q: `Is ${a} even? (yes/no)`, ans: a % 2 === 0 ? "yes" : "no", type: "yesno" },
        { q: `What is the last digit of ${a * b}?`, ans: (a * b % 10).toString() },
        { q: `What is the sum of digits of ${a + b}?`, ans: ((a + b).toString().split('').reduce((s, d) => s + parseInt(d), 0)).toString() }
      ];
      let pick = crazyTypes[Math.floor(Math.random() * crazyTypes.length)];
      q = pick.q;
      ans = pick.ans;
      if (pick.type) fakeType = pick.type;
    }

    mathQuestions.push({ q, ans, fakeType });
  }
  mathIndex = 0;
}

function mathGenerate() {
  if (mathIndex >= mathQuestions.length) {
    generateMathQuestions();
  }

  const { q, ans, fakeType } = mathQuestions[mathIndex++];
  mathCurrent = q;
  mathCurrentAns = ans;

  mathQuestionDiv.textContent = q;
  mathFeedbackDiv.textContent = "";

  let opts = getFakeAnswers(ans, fakeType);
  mathOptionsDiv.innerHTML = "";
  opts.forEach(option => {
    let btn = document.createElement('button');
    btn.textContent = option;
    btn.style.margin = "8px";
    btn.style.fontSize = "1.1em";
    btn.onclick = function () {
      if (String(option).toLowerCase() === String(ans).toLowerCase()) {
        mathScore++;
        mathFeedbackDiv.textContent = "Correct! 🎉";
      } else {
        mathFeedbackDiv.textContent = `Wrong! Correct answer: ${ans}`;
      }
      mathScoreDiv.textContent = `Score: ${mathScore}`;
      setTimeout(mathGenerate, 1200);
    };
    mathOptionsDiv.appendChild(btn);
  });
}

generateMathQuestions();
mathGenerate();

}

mathGenerate();

/* 3. Guess the Thing/Fruit */
const fruitQuestions = [
  {hint: "This is a red fruit, often mistaken for a vegetable.", ans: "Tomato", opts: ["Apple", "Banana", "Tomato", "Strawberry"]},
  {hint: "This fruit is yellow and curved.", ans: "Banana", opts: ["Banana", "Pineapple", "Mango", "Carrot"]},
  {hint: "This is a type of bird, also a fruit.", ans: "Kiwi", opts: ["Kiwi", "Orange", "Grape", "Robin"]},
  {hint: "You find these in bunches; they're purple or green.", ans: "Grape", opts: ["Grape", "Plum", "Peach", "Cherry"]},
  {hint: "This thing helps you tell time.", ans: "Clock", opts: ["Phone", "Watch", "Clock", "Calendar"]},
  {hint: "This is used to write, but also can be an animal.", ans: "Pen", opts: ["Pen", "Pig", "Book", "Cat"]},
  {hint: "The king of the jungle.", ans: "Lion", opts: ["Tiger", "Lion", "Elephant", "Monkey"]},
  {hint: "This fruit is green inside and has a hard, brown shell.", ans: "Coconut", opts: ["Coconut", "Mango", "Avocado", "Melon"]},
  {hint: "This thing keeps your feet warm.", ans: "Socks", opts: ["Shoes", "Socks", "Hat", "Scarf"]},
  {hint: "You use this to cut paper.", ans: "Scissors", opts: ["Knife", "Scissors", "Pen", "Ruler"]},
  {hint: "This is a sweet, red fruit.", ans: "Cherry", opts: ["Apple", "Banana", "Cherry", "Grape"]},
  {hint: "This fruit is orange and often associated with Halloween.", ans: "Pumpkin", opts: ["Pumpkin", "Orange", "Peach", "Melon"]},
  {hint: "This is a type of nut, often used in desserts.", ans: "Almond", opts: ["Peanut", "Cashew", "Almond", "Walnut"]},
  {hint: "This fruit is small, red, and often used in pies.", ans: "Berry", opts: ["Berry", "Apple", "Banana", "Grape"]}, 
  {hint: "This is a type of fish, also a color.", ans: "Salmon", opts: ["Tuna", "Salmon", "Trout", "Bass"]},  
  {hint: "This fruit is often mistaken for a vegetable, and is red or green.", ans: "Pepper", opts: ["Pepper", "Tomato", "Cucumber", "Zucchini"]},
  {hint: "This is a type of fruit that is often dried and used in trail mix.", ans: "Raisin", opts: ["Raisin", "Date", "Fig", "Prune"]},
  {hint: "This fruit is yellow and often used in smoothies.", ans: "Banana", opts: ["Banana", "Mango", "Pineapple", "Papaya"]},
  {hint: "This is a type of fruit that is often used in salads.", ans: "Lettuce", opts: ["Lettuce", "Spinach", "Kale", "Cabbage"]},
  {hint: "This is a type of fruit that is often used in pies.", ans: "Apple", opts: ["Apple", "Cherry", "Peach", "Blueberry"]},
  {hint: "This is a type of fruit that is often used in smoothies.", ans: "Mango", opts: ["Mango", "Banana", "Pineapple", "Papaya"]},
  {hint: "This is a type of fruit that is often used in salads.", ans: "Cucumber", opts: ["Cucumber", "Tomato", "Pepper", "Zucchini"]},
  {hint: "This is a type of fruit that is often used in desserts.", ans: "Peach", opts: ["Peach", "Apple", "Cherry", "Blueberry"]},
  {hint: "This is a type of fruit that is often used in smoothies.", ans: "Papaya", opts: ["Papaya", "Mango", "Pineapple", "Banana"]},
  {hint: "This is a type of fruit that is often used in salads.", ans: "Tomato", opts: ["Tomato", "Cucumber", "Pepper", "Zucchini"]},
  {hint: "This is a type of fruit that is often used in desserts.", ans: "Blueberry", opts: ["Blueberry", "Apple", "Cherry", "Peach"]},
  {hint: "This is a type of fruit that is often used in smoothies.", ans: "Pineapple", opts: ["Pineapple", "Mango", "Papaya", "Banana"]}
];
let fruitScore = 0;
let fruitIndex = 0;
let shuffledFruitQuestions = [];

function shuffleFruitQuestions() {
  shuffledFruitQuestions = [...fruitQuestions].sort(() => Math.random() - 0.5);
  fruitIndex = 0;
}

function fruitNextQuestion() {
  if (fruitIndex >= shuffledFruitQuestions.length) {
    shuffleFruitQuestions();
  }
  const q = shuffledFruitQuestions[fruitIndex];
  fruitIndex++;

  document.getElementById('fruit-hint').textContent = q.hint;
  let optsDiv = document.getElementById('fruit-options');
  optsDiv.innerHTML = "";

  let shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
  shuffledOpts.forEach(opt => {
    let btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = function () {
      if (opt === q.ans) {
        fruitScore++;
        document.getElementById('fruit-feedback').textContent = "Correct! 🎉";
      } else {
        document.getElementById('fruit-feedback').textContent = `Wrong! Correct answer: ${q.ans}`;
      }
      document.getElementById('fruit-score').textContent = `Score: ${fruitScore}`;
      setTimeout(fruitNextQuestion, 1200);
    }
    optsDiv.appendChild(btn);
  });

  document.getElementById('fruit-feedback').textContent = "";
}

shuffleFruitQuestions();
fruitNextQuestion();

/* 4. Unique Game: Color Match (Buttons show only colors, not color names) */
const colorNames = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White", 
  "Gray", "Cyan", "Magenta", "Lime", "Teal", "Navy", "Maroon", "Olive", "Coral", "Gold", "Silver"];
const colorValues = {
  Red: "#ff4136", Green: "#2ecc40", Blue: "#0074D9",
  Yellow: "#f9d423", Purple: "#b10dc9", Orange: "#ff851b",
  Pink: "#ff69b4", Brown: "#8B4513", Black: "#111", White: "#fff",
  Gray: "#aaa", Cyan: "#00ffff", Magenta: "#ff00ff",
  Lime: "#00ff00", Teal: "#008080", Navy: "#000080",
  Maroon: "#800000", Olive: "#808000", Coral: "#ff7f50",
  Gold: "#ffd700", Silver: "#c0c0c0",
};
let colorScore = 0, colorCurrent;
function colorNextGame() {
let colorScore = 0;
let colorIndex = 0;
let shuffledColorNames = [];

function shuffleColors() {
  shuffledColorNames = colorNames.slice().sort(() => Math.random() - 0.5);
  colorIndex = 0;
}

function colorNextGame() {
  if (colorIndex >= shuffledColorNames.length) {
    shuffleColors();
  }
  colorCurrent = shuffledColorNames[colorIndex++];
  document.getElementById('color-instruction').innerHTML = `Click the <strong>color block</strong> for "<strong>${colorCurrent}</strong>" as fast as you can!`;

  let btnsDiv = document.getElementById('color-buttons');
  btnsDiv.innerHTML = "";

  let shuffled = colorNames.slice().sort(() => Math.random() - 0.5);
  shuffled.forEach(name => {
    let btn = document.createElement('button');
    btn.style.background = colorValues[name];
    btn.style.width = "80px";
    btn.style.height = "40px";
    btn.style.border = "none";
    btn.style.margin = "10px";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.textContent = "";
    btn.onclick = function () {
      if (name === colorCurrent) {
        colorScore++;
        document.getElementById('color-feedback').textContent = "Correct!";
      } else {
        document.getElementById('color-feedback').textContent = `Wrong! Correct was: ${colorCurrent}`;
      }
      document.getElementById('color-score').textContent = `Score: ${colorScore}`;
      setTimeout(colorNextGame, 1000);
    }
    btnsDiv.appendChild(btn);
  });

  document.getElementById('color-feedback').textContent = "";
}
shuffleColors();
colorNextGame();
}
colorNextGame();

const patternQuestions = [
  { question: "🟥 🟩 🟥 🟩 ❓", options: ["🟩", "🟥", "🟦"], answer: "🟥" },
  { question: "3, 6, 9, ❓", options: ["10", "12", "11"], answer: "12" },
  { question: "🔺 🔺 ⚫ ⚫ 🔺 ❓", options: ["🔺", "⚫", "🔵"], answer: "⚫" },
  { question: "🔵 🔵 🔴 ❓", options: ["🔴", "🟢", "🔵"], answer: "🔴" },
  { question: "1, 2, 4, ❓", options: ["6", "8", "3"], answer: "8" },
  { question: "🟨 🟥 🟨 🟥 ❓", options: ["🟥", "🟨", "🟦"], answer: "🟥" },
  { question: "A, B, D, ❓", options: ["C", "E", "F"], answer: "C" },
  { question: "🔲 🔳 🔲 ❓", options: ["🔳", "🔲", "⬛"], answer: "🔳" },
  { question: "5, 10, 15, ❓", options: ["20", "25", "30"], answer: "20" },
  { question: "🟪 🟪 🟥 ❓", options: ["🟥", "🟩", "🟦"], answer: "🟥" },
  { question: "1, 3, 5, ❓", options: ["6", "7", "8"], answer: "7" },
  { question: "🔵 🔴 🔵 ❓", options: ["🔴", "🟢", "🔵"], answer: "🔴" },
  { question: "2, 4, 6, ❓", options: ["7", "8", "10"], answer: "8" },
  { question: "🟩 🟥 🟩 ❓", options: ["🟥", "🟦", "🟩"], answer: "🟥" },
  { question: "A, C, E, ❓", options: ["B", "D", "F"], answer: "D" },
  { question: "🔳 🔲 🔳 ❓", options: ["🔲", "⬛", "🔳"], answer: "🔲" },
  { question: "3, 6, 12, ❓", options: ["9", "15", "18"], answer: "18" },
  { question: "🟦 🟥 🟦 ❓", options: ["🟥", "🟩", "🟦"], answer: "🟥" },
  { question: "1, 2, 3, ❓", options: ["4", "5", "6"], answer: "4" },
  { question: "🔴 🔵 🔴 ❓", options: ["🔵", "🟢", "🔴"], answer: "🔵" },
  { question: "5, 10, 20, ❓", options: ["15", "25", "30"], answer: "25" },
  { question: "🟨 🟥 🟨 ❓", options: ["🟥", "🟩", "🟦"], answer: "🟥" },
  { question: "A, B, C, ❓", options: ["D", "E", "F"], answer: "D" },
  { question: "🔲 🔳 🔲 ❓", options: ["🔳", "⬛", "🔲"], answer: "🔳" },
  { question: "1, 4, 9, 16, ❓", options: ["20", "25", "36"], answer: "25" }, 
  { question: "2, 4, 8, 16, ❓", options: ["18", "24", "32"], answer: "32" }, 
  { question: "Z, X, V, ❓", options: ["T", "U", "S"], answer: "T" }, 
  { question: "1, 2, 4, 7, 11, ❓", options: ["16", "17", "18"], answer: "16" },
  { question: "🌞 🌜 🌞 ❓", options: ["🌞", "🌛", "🌜"], answer: "🌜" },
  { question: "B, D, F, ❓", options: ["H", "G", "E"], answer: "H" }, 
   { question: "2, 6, 12, 20, ❓", options: ["28", "30", "32"], answer: "30" }, 
  { question: "K, J, H, E, ❓", options: ["C", "B", "A"], answer: "A" }, 
  { question: "1, 11, 21, 1211, ❓", options: ["111221", "122112", "211122"], answer: "111221" }, 
  { question: "3, 5, 9, 17, 33, ❓", options: ["49", "55", "65"], answer: "65" }, 
  { question: "5, 25, 20, 100, ❓", options: ["80", "60", "90"], answer: "80" }, 
  { question: "A, Z, B, Y, C, ❓", options: ["X", "W", "D"], answer: "X" },
  { question: "9, 27, 81, ❓", options: ["162", "243", "324"], answer: "243" },
  { question: "1, 2, 6, 24, ❓", options: ["100", "120", "150"], answer: "120" }, 
  { question: "P, Q, S, V, ❓", options: ["Z", "Y", "X"], answer: "Z" },
  { question: "0, 1, 1, 2, 3, 5, ❓", options: ["8", "9", "13"], answer: "8" }, 
  { question: "1, 2, 4, 7, 11, ❓", options: ["15", "16", "17"], answer: "16" }, 
  { question: "A, C, F, J, O, ❓", options: ["U", "T", "S"], answer: "U" }, 
  { question: "25, 16, 9, 4, ❓", options: ["2", "1", "0"], answer: "1" }, 
  { question: "Z, W, S, N, ❓", options: ["H", "I", "G"], answer: "H" }, 
  { question: "11, 13, 17, 19, ❓", options: ["23", "21", "25"], answer: "23" },
  { question: "1, 3, 6, 10, ❓", options: ["15", "21", "28"], answer: "15" }, 
  { question: "2, 3, 5, 7, ❓", options: ["11", "13", "17"], answer: "11" }, 
  { question: "A, D, G, J, ❓", options: ["M", "N", "O"], answer: "M" }, 
  { question: "1, 4, 9, 16, ❓", options: ["25", "36", "49"], answer: "25" }, 
  { question: "2, 5, 10, 17, ❓", options: ["26", "37", "50"], answer: "26" },
  { question: "3, 6, 12, 24, ❓", options: ["48", "36", "60"], answer: "36" }
];
let patternQuestionsShuffled = [];
let patternIndex = 0;
let patternScore = 0;

function shufflePatternQuestions() {
  patternQuestionsShuffled = [...patternQuestions].sort(() => Math.random() - 0.5);
  patternIndex = 0;
}

function showPatternQuestion() {
  if (patternIndex >= patternQuestionsShuffled.length) {
    shufflePatternQuestions(); // restart with new shuffle
  }
  const q = patternQuestionsShuffled[patternIndex];
  document.getElementById("pattern-question").textContent = q.question;

  const optionsDiv = document.getElementById("pattern-options");
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "game-button";
    btn.onclick = () => handlePatternAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function handlePatternAnswer(selected) {
  const correct = patternQuestionsShuffled[patternIndex].answer;
  const feedback = document.getElementById("pattern-feedback");
  if (selected === correct) {
    patternScore++;
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = `Wrong! Correct answer: ${correct}`;
  }
  document.getElementById("pattern-score").textContent = `Score: ${patternScore}`;
  setTimeout(nextPatternQuestion, 1000);
}

function nextPatternQuestion() {
  patternIndex++;
  document.getElementById("pattern-feedback").textContent = "";
  showPatternQuestion();
}

// Initial shuffle
shufflePatternQuestions();
