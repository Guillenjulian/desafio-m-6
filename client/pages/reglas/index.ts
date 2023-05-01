import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Reglas extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }
  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "contenedor_reglas";
    div.innerHTML = `

    <my-headers class="header" ></my-headers>
    <my-rules></my-rules>
    <my-loading class ="loading"></my-loading>
    <my-button class = "boton" value ="Jugar"></my-button>
    <div class = "manos">
    <mano-papel  class = "mano"></mano-papel>
    <mano-piedra class = "mano"></mano-piedra>
    <mano-tijera class = "mano"></mano-tijera>
    </div>
  
    `;
    style.innerHTML = `
    .contenedor_reglas{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      margin:25px ;
      gap: 20px;
    }
    .contenedor_reglas .header{
      align-self: flex-end;
      margin-right: 45px;
     
    }
    .boton{
      display: none;
    
    }
    .loading{
      display: none;
    }

    @media (max-width: 768px){
      
      .contenedor{
  
    }
  }
    .manos{
     display: flex;
      justify-content: space-evenly;
      width: 100%;


    }
    @media (max-width: 768px){
    .manos{
      
      width: 100%;
      ;

    }
    }
    
    
    `;

    function insertButton() {
      state.suscribe(() => {
        //   console.log("estado", state.getState());
        const currentState = state.getState();
        const boton = div.querySelector(".boton") as HTMLElement;
        const loadingBar = div.querySelector(".loading") as HTMLElement;
        if (currentState.fromServer.length === 2) {
          loadingBar.style.display = "none";
          boton.style.display = "inline";
          console.log(" entro");
        } else {
          boton.style.display = "none";
          loadingBar.style.display = "inline";
          setTimeout(() => {
            Router.go("/");
          }, 60000);
          console.log("no entro");
        }
      });
    }
    function handleClick() {
      const boton = div.querySelector(".boton");
      boton?.addEventListener("click", () => {
        state.stateStartInTrue();
      });
    }

    div.appendChild(style);
    insertButton();
    handleClick();
    this.shadowRoot.appendChild(div);
  }
}
customElements.define("reglas-page", Reglas);
