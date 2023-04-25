import { Router } from "@vaadin/router";

import { dataBase, app } from "./database";
import { map } from "lodash";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";

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
    fromServer: [],
    playHistory: {
      player: 0,
      cpu: 0,
    },
  },
  listeners: [],

  suscribe(callback: () => any) {
    this.listeners.push(callback);
  },
  init() {
    if (window.localStorage.getItem("Saved-play")) {
      const local: any = window.localStorage.getItem("Saved-play");
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
  listenRoom() {
    return new Promise<void>((resolve, reject) => {
      console.log("listenRoom");
      const currentState = state.getState();
      console.log(currentState.rtdbRoomId, "currentState");
      // console.log(dataBase, "dataBase");

      const roomsRef = dataBase.ref(`/rooms/` + currentState.rtdrRoomId);

      // console.log(roomsRef, "roomsRef");

      roomsRef.on("value", (snapshot) => {
        console.log(snapshot, "snapshot");

        const data = snapshot.val();
        console.log(data, " Data desde el servidor");
        const playerList = map(data);
        console.log(playerList, "playerList");
      });
      resolve();
    });
  },

  getState() {
    return this.data;
  },
  // aleatoryPlayPc() {
  //   const moves = ["piedra", "papel", "tijera"];

  //   const aleatory = Math.floor(Math.random() * 3);
  //   return moves[aleatory];
  // },

  // setMove(move: jugada) {
  //   const currentState = this.getState();

  //   const gamePc = this.aleatoryPlayPc();

  //   currentState.currentGame.cpuPlay = gamePc;
  //   currentState.currentGame.userPlay = move;
  //   state.setState(currentState);
  //   this.whoWin(move, gamePc);
  // },
  // whoWin(userPlay: jugada, cpuPlay: jugada) {
  //   const jugadaGanada = [
  //     userPlay == "piedra" && cpuPlay == "tijera",
  //     userPlay == "papel" && cpuPlay == "piedra",
  //     userPlay == "tijera" && cpuPlay == "papel",
  //   ];
  //   if (jugadaGanada.includes(true)) {
  //     return this.pushHistory("Ganador");
  //   }
  //   const jugadaPerdida = [
  //     userPlay == "piedra" && cpuPlay == "papel",
  //     userPlay == "papel" && cpuPlay == "tijera",
  //     userPlay == "tijera" && cpuPlay == "piedra",
  //   ];
  //   if (jugadaPerdida.includes(true)) {
  //     return this.pushHistory("Perdedor");
  //   }
  //   const jugadaEmpatada = [
  //     userPlay == "piedra" && cpuPlay == "piedra",
  //     userPlay == "papel" && cpuPlay == "papel",
  //     userPlay == "tijera" && cpuPlay == "tijera",
  //   ];
  //   if (jugadaEmpatada.includes(true)) {
  //     return this.pushHistory("Empates");
  //   }
  // },
  // pushHistory(
  //   jugada: "Ganador" | "Perdedor" | "Empates",
  //   playerScore: number,
  //   cpuScore: number
  // ) {
  //   const currentState = this.getState();
  //   playerScore = currentState.playHistory.player;
  //   cpuScore = currentState.playHistory.cpu;

  //   if (jugada == "Ganador") {
  //     this.setState({
  //       ...currentState,
  //       playHistory: {
  //         player: playerScore + 1,
  //         cpu: cpuScore,
  //         result: "Ganaste",
  //       },
  //     });
  //   }
  //   if (jugada == "Perdedor") {
  //     this.setState({
  //       ...currentState,
  //       playHistory: {
  //         player: playerScore,
  //         cpu: cpuScore + 1,
  //         result: "Perdiste",
  //       },
  //     });
  //   }
  //   if (jugada == "Empates") {
  //     this.setState({
  //       ...currentState,
  //       playHistory: {
  //         player: playerScore,
  //         cpu: cpuScore,
  //         result: "Empate",
  //       },
  //     });
  //   }
  // },
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
          console.log(data, "esta es la data");
          currentState.contrincanteId = data.contrincanteId;
          console.log(currentState.contrincanteId, "este es el userId");

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
          console.log(data, "esta es la data");
        });
    }
    this.setState(currentState);
  },
  // CREAR SINGUP DEL CONTINCANTE  ASI ME GUARDA EL NOMBRE Y ME GENERA EL USER ID
};

export { state };
