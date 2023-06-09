//import { database } from "firebase-admin";
// import { initializeApp } from "firebase/app";
import firebase from "firebase";

const variablesDeEntorno: any = process.env;
//console.log(variablesDeEntorno.API_KEY, "es la apy key");

const firebaseConfig: any = {
  apikey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
};

const app = firebase.initializeApp(firebaseConfig);
const dataBase = firebase.database();

export { dataBase };
