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
  console.log(textCharacters);
}
