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
app.use(express.static("./dist"));
const ROOT_PATH = __dirname.replace("server/index", "");

//expongo el puerto
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const userCol = db.collection("users");
const roomCol = db.collection("rooms");
const gamesCol = db.collection("games");

// Este endpoint autentifica el usuario
app.post("/signup", function (req, res) {
  const name = req.body.name;
  // console.log("valor reques nombre", name);
  // console.log("valor reques ", name);

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
        userCol
          .where("name", "==", name)
          .get()
          .then((searchResponse) => {
            res.json({
              userId: searchResponse.docs[0].id,

              new: false,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
});

app.post("/signupcontrincante", function (req, res) {
  const contrincanteName = req.body.contrincanteName;
  // console.log("valor reques nombre", name);
  // console.log("valor reques ", name);

  userCol
    .where("contrincanteName", "==", contrincanteName)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCol
          .add({ contrincanteName: contrincanteName })
          .then(function (newUserRef) {
            res.json({
              contrincanteId: newUserRef.id,
              new: true,
            });
          });
      } else {
        userCol
          .where("contrincanteName", "==", contrincanteName)
          .get()
          .then((searchResponse) => {
            res.json({
              contrincanteId: searchResponse.docs[0].id,

              new: false,
            });
          })
          .catch((error) => {
            console.log(error);
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
        console.log("si existe el user id");

        const roomRef = rtdb.ref("rooms/" + uuidv4());
        roomRef
          .set({
            [userId]: {
              userId: userId,
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
                rtdbRoomId: roomLongId,
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
  const { contrincanteName } = req.body;

  const { contrincanteId } = req.body;
  const { rtdbRoomId } = req.body;

  userCol
    .doc(contrincanteId.toString())
    .get()
    .then((doc) => {
      // console.log("si existe el user id");
      //   console.log(doc.exists);

      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + rtdbRoomId);
        roomRef
          .update({
            [contrincanteId]: {
              contrincanteName: contrincanteName,
              contrincanteId: contrincanteId,
              contrincanteChoice: "",
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
  const userId = req.body.userId;
  const name = req.body.name;
  const contrincanteName = req.body.contrincanteName;
  const contrincanteId = req.body.contrincanteId;

  //  console.log("reques a addgames");

  gamesCol
    .where("userIdOne", "==", contrincanteId)
    .where("userIdTwo", "==", userId)
    .get()
    .then((serchRes) => {
      if (serchRes.empty) {
        gamesCol
          .add({
            name: name,
            userId: userId,
            contrincanteId: contrincanteId,
            contrincanteName: contrincanteName,
            choice: "",
            contrincanteChoice: "",
          })
          .then((newGamesRef) => {
            res.json({
              gameUserId: newGamesRef.id,
              newGamesRef: true,
              message: "game created",
            });
          });
      } else {
        res.json({
          message: "no se pudo crear el juego",
        });
      }
    });
});
// Generar un  metho para unit las 2 array

// cambia los estados de los user a true en la rtdb

app.post("/startgame", (req, res) => {
  // console.log("reques a startgame");

  const { userId, contrincanteId, rtdbRoomId } = req.body;
  // console.log(userId, "es el user id1");
  // console.log(contrincanteId, "es el contrincante id1");
  // console.log(rtdbRoomId, "es el rtdb room id1");

  userCol
    .doc(userId.toString() && contrincanteId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userRef = rtdb.ref("rooms/" + rtdbRoomId + "/" + userId);
        const contrincanteRef = rtdb.ref(
          "rooms/" + rtdbRoomId + "/" + contrincanteId
        );

        // Actualiza ambos nodos utilizando el método "update" de Firebase Realtime Database
        const updates = {};
        updates["start"] = true;

        return Promise.all([
          userRef.update(updates),
          contrincanteRef.update(updates),
        ]);
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    })
    .then(() => {
      res.json({
        message: "start game a cambiado",
        userId: userId,
        contrincanteId: contrincanteId,
      });
    })
    .catch((error) => {
      console.error(
        "Error al actualizar datos en Firebase Realtime Database: ",
        error
      );
      res.status(500).json({
        message: "Error al actualizar datos en Firebase Realtime Database",
      });
    });
});

// cambia los estados de los user a false en la rtdb

app.post("/stopgame", (req, res) => {
  const { userId } = req.body;
  const { rtdRoomId } = req.body;
  const { contrincanteId } = req.body;
  console.log(userId, "es el user id");

  gamesCol
    .doc(userId.toString() || contrincanteId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef = rtdb.ref(
          "rooms/" + rtdRoomId + "/" + userId || contrincanteId
        );
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
  //  console.log("reques a choice");

  const userId = req.body.userId;
  const rtdbRoomId = req.body.rtdbRoomId;
  const choice = req.body.choice;
  const gameUserId = req.body.gameUserId;
  console.log(userId, "es el user id");
  console.log(rtdbRoomId, "es el rtdb room id");
  console.log(choice, "es el choice");

  gamesCol
    .doc(gameUserId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef2 = rtdb.ref("/rooms/" + rtdbRoomId + "/" + userId);

        rommRef2
          .update({
            choice: choice,
          })
          .then(() => {
            res.json({
              message: "choice a cambiado",
              choice: choice,
            });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});
app.post("/choicecontrincante", (req, res) => {
  console.log("reques a choice contrincante");

  const contrincanteId = req.body.contrincanteId;
  const rtdbRoomId = req.body.rtdbRoomId;

  const contrincanteChoice = req.body.contrincanteChoice;
  const gameUserId = req.body.gameUserId;

  gamesCol
    .doc(gameUserId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const rommRef = rtdb.ref("/rooms/" + rtdbRoomId + "/" + contrincanteId);

        rommRef
          .update({
            contrincanteChoice: contrincanteChoice,
          })

          .then(() => {
            res.json({
              message: "choice a cambiado",
              //    contrincanteChoice: contrincanteChoice,
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
  // console.log("desbuelve la room");

  const { userId } = req.query;
  const { roomId } = req.params;
  // console.log({ userId }, "es el user id");
  // console.log({ roomId }, "es el room id");

  userCol
    .doc(userId.toString())
    .get()
    .then(function (doc) {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + roomId);
        roomRef.get().then((doc) => {
          if (doc.exists) {
            roomCol
              .doc(roomId.toString())
              .get()
              .then((doc) => {
                const data = doc.data();
                //  console.log("data", data);

                res.json(data);
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
// crear metodo para que me genere un  usuario en contrincante y me de el id
app.get("*", (req, res) => {
  res.sendFile(ROOT_PATH + "dist/index.html");
});
