const name1 = prompt('What is your name?');
const name2 = prompt("What is your lover's name?");

const loveCalculator = (name1, name2) => {
  const result = Math.floor(Math.random() * 100) + 1;
  return `${name1} + ${name2} = ${result}%`;
};

loveCalculator(name1, name2);
