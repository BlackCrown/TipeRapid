function Start() {
  let difficulty = getDificulty();
  let mode = getMode();
  generatePassage(difficulty);
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
async function generatePassage(d) {
  const response = await fetch('data.json');
  const dados = await response.json();

  let passage = dados[d][Math.floor(Math.random() * dados[d].length)].text;

  document.getElementById('passage').innerText = passage;
}
