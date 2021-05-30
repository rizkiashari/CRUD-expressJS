const sum = (a, b) => {
  return a + b;
}

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



test('Hello', () => {
  expect(sayHello("Hello")).toEqual("Hello");
});

test('Convert Value', () => {
  expect(convertValue(70)).toEqual("B");
});