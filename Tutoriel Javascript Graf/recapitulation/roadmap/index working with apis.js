 /*fetch("https://jsonplaceholder.typicode.com/users").then(r => r.json()
    .then(body => console.log(body))
 )*/

 /*async function fetchUser(){

    const r = await fetch("https://jsonplaceholder.typicode.com/users",{
        method: 'POST',
        headers: {
        "Accept":"application/json",
        "content-type": "application/json"

    },body: JSON.stringify({title : "Mon premier titre"})})
    if(r.ok === true){
        return r.json()
    }
    throw new Error("impossible de contacter le serveur")

 }*/

 //fetchUser().then(user => console.log(user))

 //pour faire une annulation de requete
 const a = new AbortController()
 Promise.race([
    fetch("https://jsonplaceholder.typicode.com/posts/?limit=5&_delay=2000",{
        signal: a.signal
    }),
    fetch("https://jsonplaceholder.typicode.com/users/?_limit=5",{
        signal: a.signal
    })
 ]).then(r => r.json()).then(body => {
    a.abort()
    console.log(body)})

    

