import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Select extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }
  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.innerHTML = `
        <div class="contenedor">
          <my-text ></my-text>
        <my-form></my-form>
        <div class = "manos">
          <mano-papel></mano-papel>
          <mano-piedra></mano-piedra>
          <mano-tijera></mano-tijera>
        </div>
      </div>  `;
    style.innerHTML = `
  .contenedor{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
  }
  
   .container-button{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
    
  }
  .boton-exiten-sala{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
  }
  .boton-new-game{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
  }

  .my-input {
    display: none;
  }
  .recargar{
    display: none;
  }
  .container-button:hover .my-input {
    display: block;
  }
 
  .boton-exiten-sala:hover .my-input {
    display: block;
  }

  .manos{
    display: flex;
    gap: 50px;
  
  }
  `;

    div.appendChild(style);

    this.shadowRoot.appendChild(div);
  }
}
customElements.define("select-page", Select);
