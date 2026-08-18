let drums = document.querySelectorAll('.drum');

for (const drum of drums) {
  drum.addEventListener('click', () => {
    makeSound(drum.textContent);
    buttonAnimation(drum.textContent);
  });
}

const makeSound = (key) => {
  let audio;
  switch (key) {
    case 'w':
      audio = new Audio('sounds/tom-1.mp3');
      break;
    case 'a':
      audio = new Audio('sounds/tom-2.mp3');
      break;
    case 's':
      audio = new Audio('sounds/tom-3.mp3');
      break;
    case 'd':
      audio = new Audio('sounds/tom-4.mp3');
      break;
    case 'j':
      audio = new Audio('sounds/snare.mp3');
      break;
    case 'k':
      audio = new Audio('sounds/crash.mp3');
      break;
    case 'l':
      audio = new Audio('sounds/kick-bass.mp3');
      break;
    default:
      console.log(key);
  }
  audio.play();
};

document.addEventListener('keydown', (e) => {
  makeSound(e.key);
  buttonAnimation(e.key);
});

const buttonAnimation = (currentKey) => {
  let activeButton = document.querySelector('.' + currentKey);
  activeButton.classList.add('pressed');
  setTimeout(() => activeButton.classList.remove('pressed'), 100);
};
// let audio = new Audio('sounds/tom-1.mp3');
// audio.play();
