let difficulty = '';
let timerEnd = false;
let current = 0;
let acurracy = 0;
let score = 0;
let wpm = 0;
let wpmTime = 1;
let time = 0;
let interval = null;
let modal;

function Start() {
  modal = document.getElementById('modal');
  modal.style.display = 'none';
  difficulty = getDificulty();
  if (getMode() === 'timed') {
    time = 60;
    wpm = 0;
    current = 0;
    interval = setInterval(startTimer, 1000);
  } else {
    time = 0;
    wpm = 0;
    current = 0;
    interval = setInterval(startTimer, 1000);
    timerEnd = false;
  }
  getCorrection();
}

function getDificulty() {
  let difficulty = document.querySelector(
    'input[name="difficulty"]:checked',
  ).value;
  return difficulty;
}

function getMode() {
  let mode = document.querySelector('input[name="mode"]:checked').value;
  return mode;
}

async function generatePassage() {
  const response = await fetch('data.json');
  const dados = await response.json();

  let passage =
    dados[difficulty][Math.floor(Math.random() * dados[difficulty].length)]
      .text;
  return passage;
}

async function getCorrection() {
  const passage = document.getElementById('passage');
  const text = await generatePassage();
  const textCharacters = text.split('');

  passage.innerText = '';
  for (i = 0; i < textCharacters.length; ) {
    const span = document.createElement('span');
    span.textContent = textCharacters[i];
    span.style.color = 'black';
    span.id = `char-${i}`;
    document.getElementById('passage').appendChild(span);
    i++;
  }

  const start = document.getElementById('start');
  start.disabled = true;
  let wrong = 0;
  const edit = document.getElementById(`char-${current}`);
  edit.className = 'current';
  document.addEventListener('keydown', function keyPress(e) {
    e.preventDefault();
    if (current < textCharacters.length || timerEnd == true) {
      if (
        !/^[a-zA-Z0-9À-ÿ\s\.,;:!?\-()'"']*$/i.test(e.key) ||
        e.key === 'Shift'
      ) {
        e.preventDefault();
      } else if (e.key === textCharacters[current]) {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'correct';
        current += 1;
        const currentChar = document.getElementById(`char-${current}`);
        currentChar ? (currentChar.className = 'current') : endTest(keyPress);
        updateAccuracy(wrong, textCharacters.length);
      } else {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'wrong';
        current += 1;
        wrong += 1;
        updateAccuracy(wrong, textCharacters.length);
        const currentChar = document.getElementById(`char-${current}`);
        currentChar ? (currentChar.className = 'current') : endTest(keyPress);
      }
    } else {
      endTest(keyPress);
    }
  });
}

function calcWpm(current, wpmTime) {
  wpm = current / 5;
  const wpmElement = document.getElementById('wpm');
  wpmElement.textContent = `WPM: ${Math.round(wpm / wpmTime)}`;
}

function updateAccuracy(wrongCount, charCount) {
  score = charCount - wrongCount;
  acurracy = Math.round((score / charCount) * 100);
  const accuracyElement = document.getElementById(`accuracy`);
  accuracyElement.innerText = `Accuracy: ${acurracy}%`;
  return acurracy;
}

function startTimer() {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = `Time: ${time}`;
  if ((time >= 0) & (getMode() == 'timed')) {
    time--;
    calcWpm(current, wpmTime);
  } else if ((getMode() == 'passage') & (timerEnd == false)) {
    time++;
    calcWpm(current, wpmTime);
  } else {
    timerElement.textContent = 'Timer: 00';
    endTest();
  }
}

function endTest(keyPress) {
  document.removeEventListener('keydown', keyPress);
  passage.innerText = 'Text to type will apear hear!!!';
  timerEnd = true;
  modal.style.display = 'block';
  const start = document.getElementById('start');
  start.disabled = false;
  const finalAccuracy = document.getElementById('finalAccuracy');
  const finalScore = document.getElementById('finalScore');
  const finalWpm = document.getElementById('finalWpm');
  finalAccuracy.innerText = `Acurracy: ${acurracy}%`;
  finalScore.innerText = `Score: ${score}`;
  finalWpm.innerText = `WPM: ${wpm}`;
  clearInterval(interval);
}

function fecharModal() {
  const fecharModal = document.getElementById('modal');
  fecharModal.style.display = 'none';
}
