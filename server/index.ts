import * as express from "express";
import { db, rtdb } from "./db";
import * as cors from "cors";
import { uuidv4 } from "@firebase/util";

const port = 3000 || process.env.PORT;
const app = express();

//console.log("variables de entorno:::", process.env);

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const userCol = db.collection("users");
const roomCol = db.collection("rooms");
const gamesCol = db.collection("games");

app.get("/users", (req, res) => {
  const id = uuidv4().substring(0, 6);
  console.log(
    res.json({
      message: "todo ok",
      id: id,
    })
  );
});

// Este endpoint autentifica el usuario
app.post("/signup", (req, res) => {
  const nombre = req.body.name;

  console.log("valor reques nombre", nombre);

  userCol
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCol.add({ nombre: nombre }).then((newUserRef) => {
          res.json({ id: newUserRef.id, new: true });
        });
      } else {
        userCol
          .where("nombre", "==", nombre)
          .get()
          .then((searchResponse) => {
            if (!searchResponse.empty) {
              res.json({
                yaexisteId: searchResponse.docs[0].id,
                message: "user ya registrado",
              });
            }
          });
      }
    });
});

//Este endpoint  genera  e id que va  aser usado en el userId para genear las salas
app.post("/auth", (req, res) => {
  // const email=req.body.email   optamos por contracciones en las constsantes
  const { name } = req.body;
  console.log("request a auth ");
  console.log(name);
  userCol
    ///con el where busco si hay coinsidencias con el nombre
    .where("nombre", "==", name)
    //get optengo esa lista que contenga las coincidencias
    .get()
    .then((searchResponse) => {
      //si el user no esta creado devuelvo un not found
      //empty analiza si esta la respursta con un booleano
      if (searchResponse.empty) {
        res.status(404).json({ message: "not found" });
      } //si el user existe se responde con el id del primer user encontrado
      else {
        res.json({ id: searchResponse.docs[0].id });
      }
    });
});

// Este enpoint crea room y devuelve un id simplificado
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;

  console.log(userId, "este es el user id");

  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + uuidv4());
        roomRef
          .set({
            [userId]: {
              userID: userId,
              name: name,
              choice: "",
              online: true,
              start: false,
            },
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = uuidv4().substring(0, 6);
            roomCol
              .doc(roomId.toString())
              .set({
                rtdrRoomID: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

//
