// const sum = (a, b) => {
//   return a + b;
// }

const sayHello = (a) => {
  return a;
}

function convertValue(numVal){
  let convertNum = " ";

  if(numVal>=86 && numVal <=100){
    convertNum = 'A';
  }
  else if(numVal>=70 && numVal <=85){
    convertNum = 'B';
  }
  else if(numVal>=50 && numVal <=69){
    convertNum = 'C';
  }
  else if(numVal>=30 && numVal <=49){
    convertNum = 'D';
  }
  else{
    convertNum = 'E';
  }
  return convertNum;
}

function isPrime(num) {
  if(num < 2) return false;

  for (let k = 2; k < num; k++){
    if( num % k === 0){
      return false;
    }
  }
  return true;
}

test('Hello', () => {
  expect(sayHello("Hello")).toEqual("Hello");
});

test('Convert Value', () => {
  expect(convertValue(70)).toEqual("B");
});

test('Check Prime Number', () => {
  expect(isPrime(2)).toEqual(true);
});