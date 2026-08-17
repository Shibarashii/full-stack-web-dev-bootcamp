let thirdChild = document.querySelector('ul').lastElementChild;
console.log(thirdChild);

thirdChild.innerHTML = 'Hello World';

document.querySelector('li a').style.color = 'red';
document.querySelector('button').style.backgroundColor = 'yellow';

const makeHuge = () => {
  document.querySelector('h1').classList.toggle('huge');
};
