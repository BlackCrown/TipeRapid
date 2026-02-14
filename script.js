let difficulty = '';

function Start() {
  difficulty = getDificulty();
  getMode();
  checkLetters();
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
  document.getElementById('passage').innerText = passage;
  return passage;
}

async function checkLetters() {
  const text = await generatePassage();
  const textCharacters = text.split('');

  let i = 0;
  let markText = [];
  document.addEventListener('keydown', function (e) {
    e.preventDefault(e.code === 'Space');
    if (e.key === textCharacters[i]) {
      console.log('V', i);
      markText.push(textCharacters[i]);
      i = i + 1;
    } else {
      i = i;
      markText.push(`<strong>${textCharacters[i]}<strong>`);
      console.log('X', i);
    }
    document.getElementById('digitado').innerText = markText.join('');
  });
}
