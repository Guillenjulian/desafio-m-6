import firebase from "firebase-admin";

const variablesDeEntorno: any = process.env;
//console.log(variablesDeEntorno.API_KEY, "es la apy key");

const firebaseConfig = {
  apikey: "f6F2zLTeQ2a1rczFCB1P4I14pmKpWiGuG5CRWdTw",
  authDomain: "ppt-mod-6-desafio-default-rtdb.firebaseio.com",
  databaseURL: "https://ppt-mod-6-desafio-default-rtdb.firebaseio.com/",
};

const app = firebase.initializeApp(firebaseConfig);
const dataBase = firebase.database();

console.log(dataBase);

export { dataBase };
