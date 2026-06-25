interface Person {
  name: string;
  age: number;
  email?: string;
}

const p1: Person = { name: "chan", age: 22, email: "chn@gmail.com" };
const p2: Person = { name: "Swetha", age: 22 };

console.log(p1);
console.log(p2);
