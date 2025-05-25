// class  in js
//declaration
/*class rectangle{
    constructor(height,width){
        this.height = height;
        this.width = width;
    }
}*/

//or
//assign to a variable
let rectangle = class {
    constructor(height,width){
        this.height = height;
        this.width = width;
    } 
    get(){
       return this.height * this.width 
    }
}
//or
let rectangle2 = class rectangle2{

}
 const calc = new rectangle(2,4)
 console.log(calc.get())
//Nb: the body of a class is executed in "strict mode" even without the "use strict" directive.

//remontee des declarations
/*const p = new cube();//reference error
class cube{

}*/
//constructor : est une methode speciae qui permet de crer et d'initialiser les objets creers avec une classe.il ne peut y avoir qu'une seulr methode avec le nom "constructor" pour une classe donnee.si la classe contient plusieurs occurences d'unes methode constructor.cela provoquera une exeption "syntaxError".
//le contructor ainsi declare peut utiliser le mot-cle super afin d'appeler le constructor de la classe parente.
//methode de prototype
class rct{
    constructor(height,width){
        this.height = height;
        this.width = width;
    }
    get area(){
        return this.calcArea()
    }
    calcArea(){
        return this.height * this.width
    }
}
const carre = new rct(5,7)
console.log(carre.area)
//methode statiques
/*le mot-cle static permet de definir une methode statique pour une classe.les methodes statiques sont appelees par rapport a la classe entiere et non par rapport a la classe entiere et non par rapport a une instance donnee (ces methodes ne peuvent pas etre appelee <<depuis>> une instance) .ces methodes sont generalement utilisees sous formes d'utilitaires au sein d;application*/
class point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    static distance(a,b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.max(dx,dy)
    }
}
const p1 = new point(5,5)
const p2 = new point(10,10)
console.log(point.distance(p1,p2))
//gestion de this pour le prototype et les methodes statiques
/*lorsqu'une methode statique ou une methode liees au prototype est appelee sans valeur this, celle-ci vaudra undefined au sein de la function .il n'y aura pas d'autodetermination de this .on aura le meme resultat si on invoque ces functions dans du code non-strict car les functions liees aux classes sont executees en mode strict*/
class animal{
    crie(){
        return this;
    }
    static mange(){
        return this;
    }
}
let obj = new animal()
obj.crie()//animal{}
let crie = obj.crie;
crie()//undefined
animal.mange()//class animal
let mange = animal.mange;
mange()//undefined

/* si on ecrit le code avec des function traditionelles plutot qu'avec des classes et qu'on utilise le mode non-strict,l'autodetermination de this sera faite en function du contexte dans lequel la function a ete appele.si la valeur initial est undefined,this correspondra a l'objet global.
l'autodetermination de this n'a pas lieu en mode strict,la valeur this est passee telle quelle.
*/
/*function animal(){
    animal.prototype.crie = function(){
        return this;
    }
}

animal.mange = function(){
    return this
}

let obj = new animal();
let crie = obj.crie;
crie()//obj global
let mange = animal()
mange()//l'obj global*/

//proprites des intances
/*les proprietes des instances doivent etre definies dans les methodes de la classe
*/
/*class rectangle{
    constructor(height,width){
        this.height;
        this.width;
    }
}
/* les proprietes statiques ou les donnees relatives au prototype doivent etre definies en dehors de la declaration comportant le corps de la classe */
//rectangle.widthStatique = 20;
//rectangle.prototype.widthProto = 25;

//declaration des champs publics
/* en utilisant la syntaxe pour la declaration des champs ,on peut reecrire l'exemple precedent */
/*class rectangle{
    height = 0;
    width;
    constructor(height,width){
        this.height = height;
        this.width = width
    }
}*/
//declaration des champs prives
/*en utilisant des champs prives,on peut revoir la definition de la facons svte
 */
/*
class rectangle{
    #height = 0;
    #width;
    constructor(height,width){
        this.#height = height;
        this.#width = width;
    }
}
 */
//creer une sous classe avec extends
/* le mot-cle extend ,utilise dans les declarations ou les expresions de classe, permet de creer une classe qui herite d'une autre classe(on parle aussi de <<sous-classe>> ou de <<classe-fille>>)
 */
class animals{
    constructor(nom){
       this.nom = nom; 
    }
    parle(){
        console.log(`${this.nom} fait du bruit`)
    }
}

class chien extends animals{
    constructor(nom){
        //this.nom = nom; 
        super(nom)//appelle le constructor parent avec le parametre
    }
    parle(){
        console.log(`${this.nom} aboie.`)
    }
}
const aboie = new chien('ida')
aboie.parle()
//si on declare un constructor dans une classe fille,on doit utiliser super avant this
/*function anim(nom){
    this.nom = nom;
}
anim.prototype.crie = function(){
    console.log(`${this.nom} fait du bruit`)
}
class chien extends animal{
    crie(){
        super.crie()
        console.log(`${this.nom} aboie`)
    }
}
let c = new chien("toby")
c.crie()
/* ------------------------------------------------------ */
//a class element can be characterized by three aspect
//-kind: getter,setter,method,or field
//-location: static or instance
//-visibility: public or private
 class factoriel{
    constructor(num){
        this.num = num;
    }
    get(){
        return this
    }
    static(){
        this.num * factoriel(this.num -1)
    }

}
const fact = new factoriel(5)
console.log(fact)

