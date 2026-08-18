let img1 = document.querySelector('.img1');
let img2 = document.querySelector('.img2');
let h1 = document.querySelector('h1');

const randomizeDice = () => {
  let randomNum = Math.floor(Math.random() * 6) + 1;
  return randomNum;
};

const player1Score = randomizeDice();
const player2Score = randomizeDice();

let result = player1Score > player2Score ? 'Player 1 Wins' : 'Player 2 Wins';
if (player1Score == player2Score) {
  result = 'Draw!';
}

console.log(`Player 1 Score: ${player1Score}`);
console.log(`Player 2 Score: ${player2Score}`);

h1.textContent = result;
img1.setAttribute('src', `images/dice${player1Score}.png`);
img2.setAttribute('src', `images/dice${player2Score}.png`);
