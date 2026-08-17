const getBmi = (weight, height) => {
  return Math.round(weight / height ** 2);
};

const bmi = getBmi(63.8, 1.57);
console.log(bmi);
