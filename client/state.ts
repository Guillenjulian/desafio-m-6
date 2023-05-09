import { Router } from "@vaadin/router";

import { dataBase } from "./database";
import { map } from "lodash";

const API_BASE_URL: string =
  "http://localhost:3005" || "https://piedra-papel-o-tijera.onrender.com";

type jugada = "piedra" | "papel" | "tijera";
const state = {
  data: {
    name: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    choices: "",
    contrincanteName: "",
    contrincanteId: "",
    contrincanteChoice: "",
    gameUserId: "",
    fromServer: [],
    playHistory: {
      player: 0,
      cpu: 0,
      result: "",
    },
  },
  listeners: [],

  suscribe(callback: () => any) {
    this.listeners.push(callback);
  },
  init() {
    if (window.localStorage.getItem("Saved-play")) {
      const local: any = window.localStorage.getItem("state");
      console.log(local, "lo que trae la data");

      const localParceado = JSON.parse(local);
      this.setState(localParceado);
      this.listenerRoom();
    }
  },
  setState(newState) {
    this.data = newState as any;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("soy el state y e cambiado", this.data);
  },
  listenRoom(rtdbRoomId?: string) {
    //console.log("listenRoom");
    const currentState = state.getState();
    // console.log(currentState.rtdbRoomId, "currentState");
    // console.log(dataBase, "dataBase");
    const rtdrRoomId = currentState.rtdbRoomId;

    const roomsRef = dataBase.ref(`/rooms/` + rtdrRoomId);

    // console.log(roomsRef, "roomsRef");

    roomsRef.on("value", (snapshot) => {
      //   console.log(snapshot, "snapshot");

      const data = snapshot.val();
      // console.log(data, " Data desde el servidor");
      const playerList = map(data);
      currentState.fromServer = playerList;
      this.setState(currentState);
      // console.log(typeof currentState.fromServer, "playerList");
      if (playerList.length === 2) {
        //  console.log("entro al if playerList.length === 2", currentState);

        //this.stateStartInTrue();

        this.pocescheck();
      }
      // [0].start
    });
  },
  pocescheck() {
    //console.log(":::::::pocescheck::::::::::");

    const currentState = state.getState();
    //  console.log(currentState, "currentState desde  proces check");
    const fromServer = currentState.fromServer;
    const rtdbRoomId = currentState.rtdbRoomId;
    const userId = fromServer[0].userId || fromServer[1].userId;
    const contrincanteName =
      fromServer[0].contrincanteName || fromServer[1].contrincanteName;
    const name = fromServer[0].name || fromServer[1].name;
    const contrincanteId =
      fromServer[0].contrincanteId || fromServer[1].contrincanteId;

    if (currentState.fromServer.length === 2) {
      fetch(API_BASE_URL + `/addgames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: name,
          contrincanteName: contrincanteName,
          contrincanteId: contrincanteId,
          rtdbRoomId: rtdbRoomId,
        }),
      }).then((res) => {
        res.json().then((data) => {
          //      console.log(data, "data desde el star is true");
          currentState.gameUserId = data.gameUserId;
          currentState.userId = data.userId || currentState.userId;
          currentState.contrincanteId =
            data.contrincanteId || currentState.contrincanteId;
        });
      });
    }
  },
  stateStartInTrue() {
    //console.log(":::::::stateStartInTrue::::::::::");
    const currentState = state.getState();
    const fromServer = currentState.fromServer;
    const rtdbRoomId = currentState.rtdbRoomId;
    const userId = fromServer[0].userId || fromServer[1].userId;

    const contrincanteId =
      fromServer[0].contrincanteId || fromServer[1].contrincanteId;

    if (currentState.fromServer.length === 2) {
      fetch(API_BASE_URL + `/startgame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          contrincanteId: contrincanteId,
          rtdbRoomId: rtdbRoomId,
        }),
      }).then((res) => {
        res.json().then((data) => {
          //   console.log(data, "data desde el star is true");
          currentState.userId = data.userId || currentState.userId;
          currentState.contrincanteId =
            data.contrincanteId || currentState.contrincanteId;

          state.setState(currentState);
        });
      });
    }

    setTimeout(() => {
      Router.go("/play");
    }, 2000);
  },

  getState() {
    return this.data;
  },

  setName(name: string) {
    const currentState = this.getState();
    currentState.name = name;
    // console.log(currentState.name, "este es el user player");

    this.setState(currentState);
  },
  setNameContrincante(contrincanteName: string) {
    const currentState = this.getState();
    currentState.contrincanteName = contrincanteName;
    this.setState(currentState);
  },

  playerGame(name: string) {
    const currentState = this.getState();
    const nameFromState = currentState.name as string;
    if (name) {
      return fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: nameFromState,
        }),
      })
        .then((res) => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          } else {
            throw new Error("La respuesta del servidor no es JSON");
          }
        })
        .then((data) => {
          //console.log(data, "esta es la data");

          currentState.userId = data.userId;
          // console.log(
          //   currentState.userId,
          //   "este es el userId desde el servidor"
          // );

          this.setState(currentState);
        });
    } else {
      alert("El nombre no puede estar vacio");
    }
  },

  // este metodo es para  conectar y optener el id del contrincante
  twoPlayerGame(contrincanteName: string) {
    const currentState = this.getState();
    const contrincateName = currentState.contrincanteName;
    if (contrincateName) {
      return fetch(API_BASE_URL + "/signupcontrincante", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contrincanteName: contrincateName,
        }),
      })
        .then((res) => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          } else {
            throw new Error("La respuesta del servidor no es JSON");
          }
        })
        .then((data) => {
          //   console.log(data, "esta es la data");
          currentState.contrincanteId = data.contrincanteId;
          //          console.log(currentState.contrincanteId, "este es el userId");

          this.setState(currentState);
        });
    } else {
      console.error("No hay un usuario en el state");
    }
  },
  // autentifico el usuario en la sala
  signIn(name: string) {
    const currentState = this.getState();
    if (name == currentState.name) {
      return fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.exist) {
            console.log(data, "esta es la data");
            currentState.userId = data.id;

            this.setState(currentState);
            console.log(currentState.userId, "este es el userId");
          } else {
            console.log("no existe");
          }
        });
    }
  },
  // crear el star in true dentro de la sala

  askNewRoom(name: string, userId: string) {
    const currenstate = this.getState();
    const nameFromState = currenstate.name;
    const userIdFromState = currenstate.userId;
    if (currenstate.userId) {
      return fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: nameFromState,
          userId: userIdFromState,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          currenstate.roomId = data.id;
          // console.log(data.id, "esta es la data desde ask");

          const roomIdEl = currenstate.roomId;
          //console.log("estes es el roomID", roomIdEl);

          this.setState(currenstate);
          // this.accesToRoom(roomIdEl);

          // console.log("este es el currend desde el ask", currenstate);
        });
    } else {
      console.log("no hay user id");
    }
  },
  conecctsalRoom(roomId: string, userId: string) {
    const currentState = this.getState();
    return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {})
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "esta es la data");
        const rtdrRoomId = data;
      });
    this.setState(currentState);
  },
  accesToRoom(roomId: string, userId?: string, contrincanteId?: string) {
    const currentState = this.getState();
    // console.log(currentState, "este es el userId desde el acceso a la sala");

    if (
      (currentState.roomId, currentState.userId || currentState.contrincanteId)
    ) {
      return fetch(
        API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId ||
          contrincanteId,
        {}
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data, "esta es la data1");
          const rtdrRoomId = data;

          //    console.log(rtdrRoomId, "esta es el objeto de la sala");

          currentState.rtdbRoomId = data.rtdbRoomId;
          //       console.log(currentState.rtdbRoomId, "esta es la data");
          this.setState(currentState);
        });
    } else {
      console.log("no hay una sala");
    }
  },
  askExistingRoom(
    contrincanteName: string,
    contrincanteId: string,
    rtdRoomId: string
  ) {
    const currentState = this.getState();
    const nameFromState = currentState.contrincanteName;
    const userIdFromState = currentState.contrincanteId;
    const roomIdFromState = currentState.rtdRoomId;
    if (userIdFromState) {
      return fetch(API_BASE_URL + "/addplayer", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contrincanteName: contrincanteName,
          contrincanteId: contrincanteId,
          rtdbRoomId: rtdRoomId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //   console.log(data, "esta es la data");
        });
    }
    this.setState(currentState);
  },
  setMove(choice: jugada) {
    console.log("::::::setMove::::::");

    const currentState = this.getState();
    let move;

    let gamePc;

    //   console.log(currentState, "este es el currentState desde setMove");

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const makeMove = async () => {
      if (currentState.contrincanteName === "") {
        this.choiceUser(choice);
      }
      if (currentState.name === "") {
        this.choicecontrincante(choice);
      }
    };
    const makeGame = async () => {
      const rtdbRoomId = currentState.rtdbRoomId;
      const roomsRef = dataBase.ref(`/rooms/` + rtdbRoomId);

      roomsRef.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log(data, "esta es la data");

        const refchoice = map(data);
        currentState.choices = refchoice[0].choice || refchoice[1].choice;
        currentState.contrincanteChoice =
          refchoice[0].contrincanteChoice || refchoice[1].contrincanteChoice;
        if (currentState.contrincanteChoice && currentState.choices !== "") {
          this.setState(currentState);
        }
      });
    };

    makeMove().then(() => {
      this.setState(currentState);
      makeGame().then(() => {
        setTimeout(() => {
          if (
            currentState.choices !== "" &&
            currentState.contrincanteChoice !== ""
          ) {
            this.setState(currentState);
            whoWins();
          } else {
            this.setState(currentState);
          }
        }, 1500);
      });
    });

    const whoWins = async () => {
      await wait(2000);
      const userchoice = currentState.choices;
      console.log(userchoice, "este es el userchoice");

      const contrincanteChoice = currentState.contrincanteChoice;
      console.log(contrincanteChoice, "este es el contrincanteChoice");

      this.setState(currentState);

      if (currentState.contrincanteName === "") {
        move = userchoice;
        gamePc = contrincanteChoice;

        console.log(move, gamePc, "esta es si no  tiene  name");
        this.whoWin(move, gamePc);
      }
      if (currentState.name === "") {
        move = contrincanteChoice;
        gamePc = userchoice;
        console.log(move, gamePc, "esta es si no  tiene  contrincantename");
        this.whoWin(move, gamePc);
      }
    };
  },

  choicecontrincante(gamePc: jugada) {
    const currentState = this.getState();

    fetch(API_BASE_URL + "/choicecontrincante", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contrincanteChoice: gamePc,
        rtdbRoomId: currentState.rtdbRoomId,
        gameUserId: currentState.gameUserId,
        contrincanteId: currentState.contrincanteId,
      }),
    }).then((res) => res.json());

    this.setState(currentState);
  },
  choiceUser(move: jugada) {
    const currentState = this.getState();

    fetch(API_BASE_URL + "/choice", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        choice: move,
        rtdbRoomId: currentState.rtdbRoomId,
        gameUserId: currentState.gameUserId,
        userId: currentState.userId,
      }),
    });
    this.setState(currentState);
  },
  // compareChoices(choices: jugada, contrincanteChoice: jugada) {
  whoWin(move: jugada, gamePc: string) {
    const currentState = this.getState();
    const userPlay = move;
    const cpuPlay = gamePc;
    // console.log(userPlay, "este es el userPlay");
    // console.log(cpuPlay, "este es el cpuPlay");

    const jugadaGanada = [
      userPlay == "piedra" && cpuPlay == "tijera",
      userPlay == "papel" && cpuPlay == "piedra",
      userPlay == "tijera" && cpuPlay == "papel",
    ];
    if (jugadaGanada.includes(true)) {
      console.log("Ganador");

      return this.pushHistory("Ganador");
    }
    const jugadaPerdida = [
      userPlay == "piedra" && cpuPlay == "papel",
      userPlay == "papel" && cpuPlay == "tijera",
      userPlay == "tijera" && cpuPlay == "piedra",
    ];
    if (jugadaPerdida.includes(true)) {
      const resultado = "Perdedor";
      console.log("Perdedor");

      return this.pushHistory(resultado);
    }
    const jugadaEmpatada = [
      userPlay == "piedra" && cpuPlay == "piedra",
      userPlay == "papel" && cpuPlay == "papel",
      userPlay == "tijera" && cpuPlay == "tijera",
    ];
    if (jugadaEmpatada.includes(true)) {
      console.log("Empates");
      return this.pushHistory("Empates");
    }
  },
  pushHistory(
    jugada: "Ganador" | "Perdedor" | "Empates",
    playerScore: number,
    cpuScore: number
  ) {
    const currentState = this.getState();
    playerScore = currentState.playHistory.player;
    cpuScore = currentState.playHistory.cpu;

    if (jugada == "Ganador") {
      this.setState({
        ...currentState,
        playHistory: {
          player: playerScore + 1,
          cpu: cpuScore,
          result: "Ganaste",
        },
      });
    }
    if (jugada == "Perdedor") {
      this.setState({
        ...currentState,
        playHistory: {
          player: playerScore,
          cpu: cpuScore + 1,
          result: "Perdiste",
        },
      });
    }
    if (jugada == "Empates") {
      this.setState({
        ...currentState,
        playHistory: {
          player: playerScore,
          cpu: cpuScore,
          result: "Empate",
        },
      });
    }
  },

  //}
};

export { state };
