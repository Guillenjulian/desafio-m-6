import { Router } from "@vaadin/router";
import { state } from "../../state";

class Form extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.connectedCallBack();
  }
  connectedCallBack() {
    state.suscribe(() => {
      const currentState = state.getState();
      //console.log(currentState, "currentState");
    });
    const form = this.querySelector(".form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;

      const name = target.name.value as string;
      const contrincanteName = target.name.value as string;
      const roomIdEl = target.sala.value as string;
      if (roomIdEl === "") {
        state.setName(name);

        state.playerGame(name)?.then(() => {
          let userId = state.getState().userId;
          //    console.log(userId, "userId");
          state.getState().userId;
          state.askNewRoom(name, userId)?.then(() => {
            let roomId = state.getState().roomId;
            state.accesToRoom(roomId, userId)?.then(() => {
              //  console.log("esta es la data", state.getState().rtdbRoomId);
              state.listenRoom();
              Router.go("/reglas");
            });
          });
        });
      } else if (roomIdEl !== "") {
        // console.log(contrincanteName, "contrincanteName");

        state.setNameContrincante(contrincanteName);
        state.twoPlayerGame(name)?.then(() => {
          state.getState().roomId = roomIdEl;
          //  console.log(state.getState(), "este es el user player 5");

          state
            .accesToRoom(
              state.getState().roomId,
              state.getState().contrincanteId
            )
            ?.then(() => {
              //  console.log(
              //   state.getState().rtdbRoomId,
              //   "este es el user player 5"
              // );
              state
                .askExistingRoom(
                  state.getState().contrincanteName,
                  state.getState().contrincanteId,
                  state.getState().rtdbRoomId
                )

                ?.then(() => {
                  state.listenRoom();

                  Router.go("/reglas");
                });
            })
            .catch(() => {
              alert("No se pudo acceder a la sala");
            });
        });
      } else if (name == "") {
        alert("No se pudo acceder a la sala");
      }
    });
    const selectroom = this.querySelector(".selectroom") as any;
    const existingRoom = form?.querySelector(".select-sala") as HTMLElement;

    selectroom?.addEventListener("change", (e) => {
      //  console.log(selectroom, "selectroom");
      if (selectroom.value == "existingroom") {
        existingRoom.style.display = "inline";
        // console.log(existingRoom, "userId", existingRoom);
      } else {
        existingRoom.style.display = "none";
        //console.log(existingRoom, "existingRoom");
      }
    });
  }

  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");

    div.innerHTML = `
          <form class="form">
          
          <div>  
            <label class ="form-label">Tu nombre</label> 
          </div>
            <input  class ="form-input" type ="text" name="name" placeholder= "Tu Nombre">
      
         

          <div class ="select-sala">
          
            <div> 
              <label class ="form-label" >  Nombre de la sala</label>
            </div>
            <input  class ="form-input " type ="text" name= "sala" placeholder= " Nombre de la sala">
          </div>
          <div>
          <label class ="form-label">  Salas </label>  
        </div>
          <select class ="selectroom form-input" name ="selectroom" id :"selectroom">
              <option class ="newroom" value = "userId">Nueva Sala</option>
              <option class ="existingroom" value = "existingroom">Sala existente</option>
          </select>
          <my-button value="Comenzar">Comenzar</my-button>
        </form>`;
    style.innerHTML = `
                .form{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
               
                .form-input{
                    
                    height:65px ;
                    font-size: 30px;
                    border: 10px solid #001997;
                    border-radius: 10px;
                    background: #fff;
                    width:300px ;
                }
                .selectroom form-input{
                    color: black;
                    height:65px ;
                    font-size: 30px;
                    border: 10px solid #001997;
                    border-radius: 10px;
                    background: #fff;
                    width:300px ;
                    
                }
                .select-sala{
                  display: none;
                }
                `;

    this.appendChild(div);
    this.appendChild(style);
  }
}
customElements.define("my-form", Form);
