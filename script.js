let difficulty = '';

function Start() {
  difficulty = getDificulty();
  getMode();
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
  let current = 0;
  let wrong = 0;
  const edit = document.getElementById(`char-${current}`);
  edit.className = 'current';
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (current < textCharacters.length) {
      if (
        !/^[a-zA-Z0-9À-ÿ\s\.,;:!?\-()'"']*$/i.test(e.key) ||
        e.key === 'Shift'
      ) {
        e.preventDefault();
      } else if (e.key === textCharacters[current]) {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'correct';
        current += 1;
        updateAccuracy(wrong, current);
      } else {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'wrong';
        current += 1;
        wrong += 1;
        updateAccuracy(wrong, current);
      }
      const edit = document.getElementById(`char-${current}`);
      edit.className = 'current';
    } else {
      return console.log('Teste Completo');
    }
  });
}

function updateAccuracy(wrongCount, charCount) {
  const score = Math.round(((charCount - wrongCount) / charCount) * 100);
  const accuracy = document.getElementById(`accuracy`);
  accuracy.innerText = `Acurracy: ${score}%`;
}
