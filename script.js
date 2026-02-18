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
  const typed = [];

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
  const edit = document.getElementById(`char-${current}`);
  edit.className = 'current';
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (/^[a-zA-Z\s\.\!\?\:\;\-\(\),']*$/.test(e.key)) {
      if (
        !/^[a-zA-Z0-9À-ÿ\s\.,;:!?\-()'"']*$/i.test(e.key) ||
        e.key === 'Shift'
      ) {
        e.preventDefault();
      } else if (e.key === textCharacters[current]) {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'correct';
        current += 1;
        console.log(current + 'correct');
      } else {
        const edit = document.getElementById(`char-${current}`);
        edit.className = 'wrong';
        current += 1;
        console.log(current + 'wrong');
      }
    }
    const edit = document.getElementById(`char-${current}`);
    edit.className = 'current';
  });
}

function checkLetter(char, typ) {
  if (char === typ) {
    return '<p>' + char + '</p>';
  } else return '<strong>' + char + '</strong>';
}
