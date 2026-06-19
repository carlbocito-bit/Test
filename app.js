const state = {
  currentPlayer: 'p1',
  p1: { health: 20, ap: 6, hand: 5 },
  p2: { health: 20, ap: 6, hand: 5 }
};

const maxValues = {
  health: 20,
  ap: 6,
  hand: 5
};

function render() {
  ['p1', 'p2'].forEach(player => {
    document.getElementById(`${player}Health`).textContent = state[player].health;
    document.getElementById(`${player}Ap`).textContent = state[player].ap;
    document.getElementById(`${player}Hand`).textContent = state[player].hand;
    document.getElementById(`${player}Card`).classList.toggle('active', state.currentPlayer === player);
  });

  const currentName = document.getElementById(`${state.currentPlayer}Name`).value || state.currentPlayer;
  document.getElementById('currentTurn').textContent = currentName;
}

function changeStat(player, stat, change) {
  const nextValue = state[player][stat] + Number(change);
  state[player][stat] = Math.max(0, Math.min(maxValues[stat], nextValue));
  render();
}

function endTurn() {
  state.currentPlayer = state.currentPlayer === 'p1' ? 'p2' : 'p1';
  state[state.currentPlayer].ap = 6;
  render();
}

function newGame() {
  state.currentPlayer = 'p1';
  state.p1 = { health: 20, ap: 6, hand: 5 };
  state.p2 = { health: 20, ap: 6, hand: 5 };
  ['p1Ally1','p1Ally2','p1Ally3','p2Ally1','p2Ally2','p2Ally3'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('rollResult').textContent = 'Roll result appears here.';
  document.getElementById('rollResult').className = 'roll-result';
  render();
}

function rollD20() {
  const die = Math.floor(Math.random() * 20) + 1;
  const bonus = Number(document.getElementById('attributeBonus').value || 0);
  const difficulty = Number(document.getElementById('difficulty').value || 0);
  const total = die + bonus;
  const resultBox = document.getElementById('rollResult');

  let message = `d20: ${die} + Bonus: ${bonus} = Total: ${total}. `;
  let className = 'roll-result';

  if (die === 20) {
    message += 'NAT 20! Critical Signature Technique effect.';
    className += ' crit';
  } else if (die === 1) {
    message += 'NAT 1! Exhaust 1 AP.';
    className += ' fail';
    changeStat(state.currentPlayer, 'ap', -1);
  } else if (total >= difficulty) {
    message += 'Success.';
    className += ' success';
  } else {
    message += 'Fail.';
    className += ' fail';
  }

  resultBox.textContent = message;
  resultBox.className = className;
}

document.querySelectorAll('[data-player]').forEach(button => {
  button.addEventListener('click', () => {
    changeStat(button.dataset.player, button.dataset.stat, button.dataset.change);
  });
});

document.getElementById('endTurnBtn').addEventListener('click', endTurn);
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('rollBtn').addEventListener('click', rollD20);
document.getElementById('p1Name').addEventListener('input', render);
document.getElementById('p2Name').addEventListener('input', render);

render();
