import * as admin from "firebase-admin";
//import * as serviceAccount from "../key.json";

const varEnv: any = process.env;
//pruevo si me reconoce las variables de entorno
// console.log(varEnv.DB_URl, "ESTA ES LA VARIABLE DE ENTORNO");
const firebaseConfig: any = {
  type: varEnv.TIPE,
  project_id: varEnv.PROJECT_ID,
  private_key_id: varEnv.PRIVATE_KEY_ID,
  private_key: varEnv.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: varEnv.CLIENT_EMAIL,
  client_id: varEnv.CLIENT_ID,
  auth_uri: varEnv.AUTH_URI,
  token_uri: varEnv.TOKEN_URI,
  auth_provider_X509_cert_url: varEnv.AUTH_PROVIDER_X509_CERT_URL,
  client_X509_cert_url: varEnv.CLIENT_X509_CERT_URL,
};
//console.log(firebaseConfig);

// inicializo farestore
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: varEnv.DB_URl,
});

const db = admin.firestore();
const rtdb = admin.database();
//console.log(db, "esta es la dataBase");
//console.log(rtdb, "estas es las reaalTimeDataBase");

export { db, rtdb };
