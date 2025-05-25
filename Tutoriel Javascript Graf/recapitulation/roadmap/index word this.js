//----------------------this using alone-----------------
//this dans un contexte global correspond a l'objet window
console.log(this);
//output l'objet global ex: window,document,location,etc...
//this.alert("alert");
//window.alert("window");
//-------------------
//--------------------this in fonction-------------------
function thisfonction() {
  console.log(this);
}
thisfonction();
//output l'objet window
//---------------------this-in-objet-----------------------
const objet = {
  firstName: "John",
  lastName: "Doe",
  id: 5566,
  fullName: function () {
    //return this.firstName + " " + this.lastName;
    this.firstName = "Mary";
    console.log(this.firstName);
    //this.firstName output Marie
    //this output objet
  },
};
objet.fullName();
//----------------------this-in-class-------------------
class uneClass {
  constructor(name, lastName, id) {
    this.name = name;
    this.lastName = lastName;
    this.id = id;
  }
  getThis() {
    console.log(this);
    //output fait refference a ce classe
  }
}
const view = new uneClass("paul", "monterose", 23);
view.getThis();
//--------------------this-in-arrow-function---------------
const arrow = () => {
  console.log(this);
  //output objet window
};
arrow();
//-------------------------this-arrow function-in-object------------
const unObjet = {
  car: "Nissan",
  color: "gold",
  methode: () => {
    console.log(this);
    //output l'objet window
  },
};
unObjet.methode();
//--------------------this function in object-----------------------
const model = {
  car: "porsh",
  color: "white",
  no: 10750,
  methode: function () {
    console.log(this);
    //ca renvoie l'objet model
  },
};
model.methode();
//-----------------------------------------------------------------
//exo
/*Créez un objet à l’aide de trois méthodes :calculator

read() invite à entrer deux valeurs et les enregistre en tant que propriétés d’objet avec les noms et respectivement.ab
sum() Renvoie la somme des valeurs enregistrées.
mul() multiplie les valeurs enregistrées et renvoie le résultat.*/

const calculator = {
  sum() {
    return this.a + this.b;
  },
  mul() {
    return this.a * this.b;
  },
  read() {
    //this.a = +prompt("a ?", 0);
    //this.b = +prompt("b ?", 0);
  },
};
calculator.read();
//alert("your addition" + "" + calculator.sum())
//alert("your multiplication" + "" + calculator.mul())

//---------------------
let ladder = {
  step: 0,
  up() {
    this.step++;
    return this;
  },
  down() {
    this.step--;
    return this;
  },
  showStep() {
    //alert( this.step );
    return this;
  },
};

ladder.up().up().down().showStep().down().showStep(); // shows 1 then 0

/* 
ladder
  .up()
  .up()
  .down()
  .showStep() // 1
  .down()
  .showStep(); // 0 
  */
/*-------------------------enprunt function-------------------*/
let Name1 = {
  first: "Henry",
  Last: "Claude",
  age: 45,
  id: 3815,
  /*global: function(){
    console.log(`Name : ${this.first} , Last Name : ${this.Last}, age : ${this.age}, id : ${this.id}`);
  }*/
};

const global = function (born,contry , city) {
  console.log(
    `Name : ${this.first} , Last Name : ${this.Last}, age : ${this.age}, id : ${this.id}, born : ${born} , city : ${city}, contry : ${contry}`
  );
};
//methode call()
global.call(Name1, "5/10/1980", "Haiti", "Delmas");

let Name2 = {
  first: "Stephanie",
  Last: "Dupoux",
  age: 25,
  id: 9085,
};
//Name2.global();
//Name1.global.call(Name2)
//methode apply()
global.apply(Name2, ["25/01/1998", "Haiti", "Petion-ville"]);
//methode apply les param doit stocker dans une tableau
//methode bind()
let print = global.bind(Name2, "25/01/1998", "Haiti", "Petion-ville");
//console.log(print)
//difference entre le methode call() et bind() ,il faut l'appeler comme une function ()
console.log(print)
print()
console.log(1+3)
