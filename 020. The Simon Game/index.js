const playSound = (color) => {
  let audio;
  switch (color) {
    case 'green':
      audio = new Audio('sounds/green.mp3');
      break;
    case 'red':
      audio = new Audio('sounds/red.mp3');
      break;
    case 'yellow':
      audio = new Audio('sounds/yellow.mp3');
      break;
    case 'blue':
      audio = new Audio('sounds/blue.mp3');
      break;
    case 'wrong':
      audio = new Audio('sounds/wrong.mp3');
      break;
  }
  audio.play();
};

const animatePressed = (color) => {
  const button = $('#' + color);
  button.addClass('pressed');
  setTimeout(() => {
    button.removeClass('pressed');
  }, 100);
};

const buttonPressedAnimSound = (color) => {
  animatePressed(color);
  playSound(color);
};

const generateRandomColor = () => {
  let randNum = Math.floor(Math.random() * 4) + 1;
  return colors[randNum];
};

const gameOver = () => {
  playSound('wrong');
  $('body').addClass('game-over');
  gameStarted = false;
  level = 1;
  currIndex = 0;
  levelTitle.text('Game Over, Press Any Key To Start');
  colorPattern = [];
};

// Event Listeners
const levelTitle = $('#level-title');
$(document).keydown(function (e) {
  if (!gameStarted) {
    gamePlay();
  }
});

$('.btn').click((e) => {
  const button = $(e.target);
  const buttonColor = button.attr('id');
  buttonPressedAnimSound(buttonColor);
  debugger;

  if (gameStarted) {
    if (colorPattern[currIndex] != buttonColor) {
      gameOver();
      return;
    } else {
      currIndex++;
    }
  }

  if (currIndex == colorPattern.length) {
    level++;
    setTimeout(() => {
      gamePlay();
    }, 800);
  }
});

const colors = {
  1: 'green',
  2: 'red',
  3: 'yellow',
  4: 'blue',
};

let level = 1;
let colorPattern = [];
let currIndex = 0;
let gameStarted = false;

const gamePlay = () => {
  $('body').removeClass('game-over');
  currIndex = 0;
  gameStarted = true;
  levelTitle.text('Level ' + level);

  // Generate random color
  const randomColor = generateRandomColor();
  buttonPressedAnimSound(randomColor);
  colorPattern.push(randomColor);
};
