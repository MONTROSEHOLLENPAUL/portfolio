//------------------------asynchrone---------------------------
async function test() {
  //return "x"
  return await new Promise(
    //await wait a promise
    (resolve) => {
      setTimeout(() => {
        resolve("y");
      }, 1000);
    }
  );
}

console.log(test());
//difference betwen a function  and a function asynchrone return a promise
//une function asynchrone retourne tjrs une promise
/* cas d'une promise
 pending (attente)
   fulfilled(tenue/honoree/validee)
   rejected(rejetee//annulee)
 */
test().then((result) => {
  console.log(result);
});

//setTimeout
setTimeout(
  (name) => {
    console.log("Hello " + name);
  },
  2000,
  "Paul"
);

//-----------------
let somePromise = new Promise((resolve, reject) => {
  resolve("c'est super !");
  //reject("rejeter")
});

//consommateur
somePromise
  .then((value) => {
    console.log("tenue : " + value);
  })
  .catch((error) => {
    console.log("erreur : " + error);
  });

//-----------------------------
//const p1 = Promise.resolve("Promesse 1 tenue");
//const p2 = Promise.resolve("Promesse 2 tenue")
//const p2 = Promise.reject("Promesse 2 rejete");

//let globalPromise = Promise.all(p1,p2)//toutes les promesse sont valides
//let globalPromise = Promise.any(p1,p2)//n'importe qu'elles sont valides
//let globalPromise = Promise.race(p1, p2);
//-----------------------------------------
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    //fetch effectuer une requet
    fetch(url).then((response) => {
      if (response.ok) resolve(" adresse valide: " + url);
      else reject("adesse invalide: " + url);
    }).catch(error => {
        resolve("invalide: " + error)
    });
  });
}

const url = [
    "https://api.github.com/users/MONTROSEHOLLENPAUL",
    "https://api.github.com/users/chucknorris",
    //cette url ne fonction pas MONTEROSEHOLLEN....
    //"https://api.github.com/users/MONTEROSEHOLLENPAUL",
    "https://api.github.com/users/benjamin"
]

const allUrls = url.map(url => checkUrl(url))
Promise.all(allUrls).then(results => {
    results.forEach(result => {
        console.log(result)
    })
}).catch(e => {
    console.log("error : " + e)
})
//------------------------------------------------------------
//1. recuperer les utilisateurs
function getUser(){
    return new Promise((resolve,reject) => {
        setTimeout(()=> {
            const user = {
                "username": "Brice-willice",
                "age": 73
            }
            resolve(user)
        },3000)
    })
}
//2. afficher des utilisateurs
async function printUser(){
    try{
        const userData = await getUser()
        console.log(userData.username)
        console.log(userData.age)
    }catch(error){
        console.log(error.message)
    }
}

printUser()

//--------------------------------------------------
/* setTimeout(code)
setTimeout(code, delay)

setTimeout(functionRef)
setTimeout(functionRef, delay)
setTimeout(functionRef, delay, param1)
setTimeout(functionRef, delay, param1, param2)*/
//setTimeout(functionRef, delay, param1, param2, /* …, */ paramN)

//setTimeout
setTimeout((user) => {
    console.log(user + " your message in setTimeout")
},2000, "Juninio")

/* les delais sont annules a l'aide de clearTimeout()
pour appeler une function a plusieurs reprise pensez a utiliser setInterval()
1 seconds = 1000 miliseconds
le setTimeout() n'est execute qu'une seule fois 
*/
//-------------------------------------------------
//setInterval
let count = 0;
let initId = setInterval(counter,1000)
function counter(){
    console.log(++count)
}
clearInterval(initId)
//----------------
//exo
/* Écrivez une fonction qui génère un nombre toutes les secondes, en commençant par et en terminant par .printNumbers(from, to)from to */
//setInterval()
function printNumbers(from, to){
    let current = from;
    let timerId = setInterval(function(){
        alert(current);
        if(current == to){
            clearInterval(timerId)
        }
        current++;
    },1000)
}

//printNumbers(5, 10)

clearInterval(printNumbers)

//setTimeout()
function printTimeout(from, to){
    let current = from;
    setTimeout(function go() {
        alert(current);
        if(current < to){
            setTimeout(go,1000)
        }
        current++;
    },1000)
}
//printTimeout(5,10)

clearTimeout(printTimeout)
//--------------------------------------------------------------
//callback
function message(fn){
    fn();
}

function callback(){
    console.log("im a callback")
}

message(callback)

const arr1 = [1,2,3]
function foo(arr,call){
    const newArr = [];
    for(let i = 0; i < arr.length; i++){
        newArr.push(call(arr[i]))
    }
    return newArr
}

const rlt = foo(arr1,(val) => {
    return val * 2;
})
console.log(rlt)

//------------------------------------------------------
//si la prommesse est tenue on utilise resolve ,il passe dans le then(),dans l'autre cas on utilise reject ,il passe dans le catch()
//await est utilise dans une function async
//promise
const prom = new Promise((resolve,reject) => {
  resolve(4)
})

console.log(prom)

prom.then((n) => {
  console.log("le nombre", n)
}).catch(e => {
  console.log("erreur ", e)
})

function wait(duration){
  return new Promise((resolve,reject) => {
    setTimeout(()=>{
      resolve(duration)
    },duration)
  })
}

async function main(){
  await wait(2000)
  console.log("method await")
}
main()


