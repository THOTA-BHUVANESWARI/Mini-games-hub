
// Tab switching logic
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(this.dataset.tab).style.display = 'block';
  }
});

// Orientation overlay for older browsers (extra fallback)
function checkOrientation() {
  const overlay = document.getElementById('rotate-overlay');
  if (window.innerHeight > window.innerWidth) {
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';
  }
}
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
checkOrientation();

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
  "DOG", "SUN", "MOON", "STAR", "CAR", "TREE", "BIRD", "BOOK", "FISH", "KING"
];
const SEQ_TARGET = 10;

let seqCurrentWord, seqCurrentIndex, seqCatcher, seqLetters, seqFrames, seqGameOver, seqWordsCleared, seqMessage;

function seqChooseWord() {
  seqCurrentWord = SEQ_WORDS[Math.floor(Math.random() * SEQ_WORDS.length)];
  seqCurrentIndex = 0;
}
function seqInitGame() {
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
  document.getElementById('seq-score').textContent = `Words Cleared: ${seqWordsCleared} / ${SEQ_TARGET}`;
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
      if (seqWordsCleared === SEQ_TARGET) {
        seqGameOver = true;
        seqMessage = `You Win! 🎉 You cleared ${SEQ_TARGET} words. Click to restart.`;
      } else {
        seqMessage = `Word "${seqCurrentWord}" cleared! Next word!`;
        seqChooseWord();
        seqLetters = [];
        seqFrames = 0;
      }
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
      {q: `What is ${a} + ${b} × 2?`, ans: a + b * 2},
      {q: `What is (${a} × ${b}) - ${b}?`, ans: (a * b) - b},
      {q: `Is ${a} even? (yes/no)`, ans: a % 2 === 0 ? "yes" : "no", type: "yesno"},
      {q: `What is the last digit of ${a * b}?`, ans: (a * b % 10).toString()},
      {q: `What is the sum of digits of ${a + b}?`, ans: ((a + b).toString().split('').reduce((s,d)=>s+parseInt(d),0)).toString()}
    ];
    let pick = crazyTypes[Math.floor(Math.random() * crazyTypes.length)];
    q = pick.q;
    ans = pick.ans;
    if (pick.type) fakeType = pick.type;
  }
  mathCurrent = q;
  mathCurrentAns = ans;
  mathQuestionDiv.textContent = q;
  mathFeedbackDiv.textContent = "";

  // Generate options
  let opts = getFakeAnswers(ans, fakeType);
  mathOptionsDiv.innerHTML = "";
  opts.forEach(option => {
    let btn = document.createElement('button');
    btn.textContent = option;
    btn.style.margin = "8px";
    btn.style.fontSize = "1.1em";
    btn.onclick = function() {
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
  {hint: "You use this to cut paper.", ans: "Scissors", opts: ["Knife", "Scissors", "Pen", "Ruler"]}
];
let fruitScore = 0, fruitCurrent;
function fruitNextQuestion() {
  fruitCurrent = fruitQuestions[Math.floor(Math.random() * fruitQuestions.length)];
  document.getElementById('fruit-hint').textContent = fruitCurrent.hint;
  let optsDiv = document.getElementById('fruit-options');
  optsDiv.innerHTML = "";
  fruitCurrent.opts.sort(() => Math.random() - 0.5);
  fruitCurrent.opts.forEach(opt => {
    let btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = function() {
      if (opt === fruitCurrent.ans) {
        fruitScore++;
        document.getElementById('fruit-feedback').textContent = "Correct! 🎉";
      } else {
        document.getElementById('fruit-feedback').textContent = `Wrong! Correct answer: ${fruitCurrent.ans}`;
      }
      document.getElementById('fruit-score').textContent = `Score: ${fruitScore}`;
      setTimeout(fruitNextQuestion, 1200);
    }
    optsDiv.appendChild(btn);
  });
  document.getElementById('fruit-feedback').textContent = "";
}
fruitNextQuestion();
/* 4. Unique Game: Color Match (Buttons show only colors, not color names) */
const colorNames = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange"];
const colorValues = {
  Red: "#ff4136", Green: "#2ecc40", Blue: "#0074D9",
  Yellow: "#f9d423", Purple: "#b10dc9", Orange: "#ff851b"
};
let colorScore = 0, colorCurrent;
function colorNextGame() {
  colorCurrent = colorNames[Math.floor(Math.random() * colorNames.length)];
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
    btn.textContent = ""; // No text shown
    btn.onclick = function() {
      if (name === colorCurrent) {
        colorScore++;
        document.getElementById('color-feedback').textContent = "Correct! 🎉";
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
colorNextGame();
