import * as express from "express";
import { db, rtdb } from "./db";
import * as cors from "cors";
import { uuidv4 } from "@firebase/util";

const port = 3005 || process.env.PORT;
const app = express();

//console.log("variables de entorno", process.env);

app.use(express.json());
app.use(cors());

///manejar las rutas q no estan declaradas
app.use(express.static("dist"));
const ROOT_PATH = __dirname.replace("server/index", "");
app.get("*", (req, res) => {
  res.sendFile(ROOT_PATH + "dist/index.html");
});

//expongo el puerto
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
app.post("/signup", function (req, res) {
  const name = req.body.name;
  console.log("valor reques nombre", name);
  console.log("valor reques ", name);

  userCol
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCol.add({ name: name }).then(function (newUserRef) {
          res.json({
            userId: newUserRef.id,
            new: true,
          });
        });
      } else {
        res.status(401).json({
          message: " existis",
        });
      }
    });
});

//Este endpoint  genera  e id que va  aser usado en el userId para genear las salas

app.post("/auth", (req, res) => {
  const { name } = req.body;
  // console.log("valor reques nombre", name);
  userCol
    .where("name", "==", name)
    .get()
    .then(function (searcheResponse) {
      if (searcheResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          userId: searcheResponse.docs[0].id,
        });
      }
    });
});

// Este enpoint crea room y devuelve un id simplificado
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;

  // console.log(userId, "este es el user id");

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
                rtdrRoomId: roomLongId,
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

//Agregar nuevo usuario a la room que ya existe

app.post("/addplayer", (req, res) => {
  console.log("desbuelve la room");
  const { name } = req.body;
  const { rtdRoomId } = req.body;
  const { userId } = req.body;
  // console.log(name, "es el nombre");
  // console.log(rtdRoomId, "es el rtdbRoomId");
  // console.log(userId, "es el user id");

  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      console.log("si existe el user id");

      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + rtdRoomId);
        roomRef
          .update({
            [userId]: {
              userId: userId,
              name: name,
              choice: "",
              online: true,
              start: false,
            },
          })
          .then(() => {
            res.json({
              message: "player add in RTDB",
            });
          });
      } else {
        res.status(401).json({
          message: "Username does not exist",
        });
      }
    });
});

//  crea  los games

app.post("/addgames", (req, res) => {
  const userIdOne = req.body.userIdOne;
  const userIdTwo = req.body.userIdTwo;
  console.log("reques a addgames");

  gamesCol
    .where("userIdOne", "==", userIdOne)
    .where("userIdTwo", "==", userIdTwo)
    .get()
    .then((serchRes) => {
      if (serchRes.empty) {
        gamesCol
          .add({
            userIdOne: userIdOne,
            userIdTwo: userIdTwo,
            [userIdOne]: 0,
            [userIdTwo]: 0,
          })
          .then((newGamesRef) => {
            res.json({
              newGamesRef: true,
            });
          });
      } else {
        res.json({
          message: "no se pudo crear el juego",
        });
      }
    });
});

// cambia los estados de los user a true en la rtdb

app.post("/startgame", (req, res) => {
  const { userId } = req.body;
  const { rtdRoomId } = req.body;
  console.log(userId, "es el user id");

  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef = rtdb.ref("rooms/" + rtdRoomId + "/" + userId);
        rommRef
          .update({
            start: true,
          })
          .then(() => {
            res.json({
              message: "start game a cambiado",
            });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

// cambia los estados de los user a false en la rtdb

app.post("/stopgame", (req, res) => {
  const { userId } = req.body;
  const { rtdRoomId } = req.body;
  console.log(userId, "es el user id");

  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef = rtdb.ref("rooms/" + rtdRoomId + "/" + userId);
        rommRef
          .update({
            start: false,
          })
          .then(() => {
            res.json({
              message: "stop game a cambiado",
            });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

// cambia el estado del usuario en la rtdb "choice :"piedra , papel o tijera"

app.post("/choice", (req, res) => {
  const { userId } = req.body;
  const { rtdRoomId } = req.body;
  const { choice } = req.body;
  console.log(userId, "es el user id");
  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef = rtdb.ref("rooms/" + rtdRoomId + "/" + userId);
        rommRef
          .update({
            choice: choice,
          })
          .then(() => {
            res.json({
              message: "choice a cambiado",
            });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

// traigo los datos de la reques del query

app.get("/rooms/:roomId", (req, res) => {
  console.log("desbuelve la room");

  const { userId } = req.query;
  const { roomId } = req.params;
  console.log(userId, "es el user id");
  console.log({ roomId }, "es el room id");

  userCol
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + roomId);
        roomRef.get().then((doc) => {
          if (doc.exists) {
            roomCol
              .doc(roomId.toString())
              .get()
              .then((doc) => {
                const data = doc.data();
                res.json({
                  data,
                });
              });
          } else {
            res.status(401).json({
              message: "no existis",
            });
          }
        });
      }
    });
});
//console.log("var ento", process.env);
// app.get("/rooms/:roomId", (req, res) => {
//   //console.log("desbuelve la room");
//   const { userid } = req.query;
//   console.log({ userid }, "es el room id");
//   res.json(userid);
// });
