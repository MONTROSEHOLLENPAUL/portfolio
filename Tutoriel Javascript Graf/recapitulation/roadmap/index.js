const user = {
  name: "Paul",
  lastName: "Monterose",
  age: 30,
  size: 180,
};
const key = "age";
//console.log(user.name)
//console.log(user[key])

//refference
const numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const numbers2 = numbers1;
//console.log(numbers1[0])
numbers1[3] = 15;
//console.log(numbers2);
numbers2[6] = 40;
//console.log(numbers1);
//console.log(numbers2)
const numbers3 = [...numbers1];
//console.log(numbers3)
let [firstNumber, secondNumber, thirdNumber, ...otherNumbers] = numbers1;
//console.log(firstNumber,secondNumber,thirdNumber)//output 1,2,3
//console.log(otherNumbers)

const house = {
  size: 200,
  color: "white",
  adress: "delmas 75",
};
const { color, ...newhouse } = house;
//console.log(newhouse);
const ult = [
  {
    id: 1,
    name: "Jhon",
  },
  {
    id: 2,
    name: "Jane",
  },
];
for (let i = 0; i < ult.length; i++) {
  //console.log(i, ult)
}

const maxid = (arr) => {
  let maxNumber = 0;
  for (const item of arr) {
    if (item > maxNumber) {
      maxNumber = item;
    }
  }
  return maxNumber;
};
//console.log(maxid(numbers1))

const multiply = (arr) => {
  const duplic = [...arr];
  for (let i = 0; i < duplic.length; i++) {
    duplic[i] *= 2;
  }
  return duplic;
};

//console.log(multiply(numbers1))

const duplic = numbers1.map((n) => {
  return n * 2;
});
//console.log(duplic)
//of => pour les tableaux
//in => pour les objets
for (const us in user) {
  console.table(us);
}
//console.table(user)
//-------------
function factoriel(n) {
  if (n <= 2) return n;
  return n * factoriel(n - 1);
}

function racine(n) {
  return Math.sqrt(n);
}
console.log(racine(0));

function cube(n) {
  return n ** 3;
}
console.log(cube(4));
//----
function triangleIsocele(a, b, c) {
  return (a = Math.sqrt(b ** 2 + c ** 2));
}
console.log(triangleIsocele(3, 4, 8));
//-----
function time() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  console.log(`${hours}: ${minutes}: ${seconds}`);
}
time();
//-----------
function isPair(n) {
  if (n % 2 === 0) return "is pair";
  else return "is not pair";
}
console.log(isPair(2));
//----------
function ispositive(n) {
  if (n < 0) return "is negative";
  else return "is positif";
}
console.log(ispositive(3));
//----------
class episode {
  constructor(title, duration, hasbeenwatched) {
    this.title = title;
    this.duration = duration;
    this.hasbeenwatched = hasbeenwatched;
  }
}
const films = {
  fm1: {
    title: "Fast in Furious",
    duration: "1h30",
    actor: ["Vin-diesel", "Paul-walker", "The rock", "etc"],
    view: true,
  },
  fm2: {
    title: "Chaperon rouge",
    duration: "1h10",
    actor: ["Jakspower", "etc"],
    view: true,
  },
  fm3: {
    title: "365 Days",
    duration: "1h",
    actor: "inconue",
    view: false,
  },
};
const object = new episode(films.fm1.title,films.fm1.duration,films.fm1.view
)
console.log(object);
//--------
const random = Math.floor(Math.random() * 5);
console.log(random);

const age = 18;
const condition = 18 >= age ? " you're mayor" : "you're minor";
console.log(condition);

class matrix{
  constructor(height,width,element= (x,y) => undefined){
    this.height = height
    this.width = width
    this.content = []
    for(let y = 0;y < height;y++){
      for(let x = 0;x < width;x++){
        this.content[y * width + x] = element (x,y)
      }
    }
  }
  get(x,y){
    return this.content[y * this.width + x]
  }
  set(x,y,value){
    this.content[y * this.width + x] = value
  }
}

const matrice = new matrix(4,2,(x,y) => `value ${x},${y}`)
console.log(matrice)

class temperature{
  constructor(celsius){
    this.celsius = celsius
  }
  get fahrenheit(){
    return this.celsius * 1.8 + 32
  }
  set fahrenheit(value){
    this.celsius = (value - 32) / 1.8
  }
  static fromFahrenheit(value){
    return new temperature((value - 32) / 1.8)
  }
}

let temp = new temperature(22)
// this.celsius * 1.8 + 32
console.log(temp.fahrenheit)
temp.fahrenheit = 86
//this celsius = (value - 32) / 1.8
console.log(temp.celsius)

class converter{
  constructor(){
  }
}