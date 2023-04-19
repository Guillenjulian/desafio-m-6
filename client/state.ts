import { Router } from "@vaadin/router";
import "./database";
import { dataBase } from "./database";
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
      console.log(local, "loque trae la data");

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
    console.log("soy el state y e cambiado", this.data);
  },
  listenRoom() {
    const currentState = this.getState();
    const rtdbRefId = currentState.rtdbRoomId;
    const roomRef = dataBase.ref(rtdbRefId);
    roomRef.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      this.setState(currentState);
    });
  },
  ProcessDataContrincante() {
    const currentState = this.getState();
    currentState.fromServer.map((item: any) => {
      console.log(item);
      if (item.userId !== currentState.userId) {
        currentState.contrincanteId = item.userId;
        currentState.contrincanteName = item.name;
        currentState.contrincanteChoice = item.choice;
        this.setState(currentState);
      }
    });
  },
  stateStartIsTrue() {
    setTimeout(() => {
      const currentState = this.getState();
      if (
        location.pathname == "/saladeEspera" &&
        currentState.fromServer[0].start == true &&
        currentState.fromServer[1].start == true
      ) {
        Router.go("/play");
      }
    }, 2500);
  },
  connecteTwoPlayers() {
    const currentState = this.getState();
    if (currentState.fromServer.length == 2) {
      Router.go("/reglas");
    }
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
    console.log(currentState.name, "este es el user player");

    this.setState(currentState);
  },
  setUserId(userId: string) {
    const currentState = this.getState();
    currentState.userId = userId;
    console.log(userId, "este es el userId");

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
          console.log(data, "esta es la data");

          currentState.userId = data.userId;

          this.setState(currentState);
        });
    } else {
      console.error("No hay un usuario en el state");
    }
  },
  // autentifico el usuaario en la sala
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
  accesToRoom(roomId): any {
    const currentState = this.getState();
    console.log(currentState.userId, "este es el userId");
    console.log(currentState.roomId, "este es el roomId");

    if (roomId) {
      const { userId } = currentState.userId;

      return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {})
        .then((res) => res.json())
        .then((data) => {
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
        });
    } else {
      console.log("no hay una sala");
    }
  },
  askNewRoom(name: string, userId: string) {
    const currenstate = this.getState();
    const nameFromState = currenstate.name as string;
    const userIdFromState = currenstate.userId as string;
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
          //  console.log(data.id, "esta es la data desde ask");

          this.setState(currenstate);

          const roomIdEl = currenstate.roomId;
          //console.log("estes es el roomID", roomIdEl);

          this.accesToRoom(roomIdEl);

          //  console.log("este es el currend desde el ask", currenstate);
        });
    } else {
      console.log("no hay user id");
    }
  },
};

export { state };
