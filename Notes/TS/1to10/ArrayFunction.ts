let num: number[] = [1, 2, 3];

function sumofArray(num: number[]): string {
  let sum: number = 0;
  for (let n of num) {
    sum += n;
  }
  return `Sum of Array ${sum}`;
}

console.log(sumofArray(num));
