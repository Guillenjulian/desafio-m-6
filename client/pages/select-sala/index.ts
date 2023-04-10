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

    // const boton = div.querySelector(".recargar") as HTMLElement;
    // console.log(boton, " este es el container de los");

    // const botonNewgame = div.querySelector(".boton-new-game") as HTMLElement;

    // const botonExitenSala = div.querySelector(
    //   ".boton-exiten-sala"
    // ) as HTMLElement;

    // if (botonExitenSala) {
    //   botonExitenSala.addEventListener("click", () => {
    //     boton.style.display = "flex";
    //     botonNewgame.style.display = "none";

    //     console.log(botonNewgame, "clik boton exitente");
    //     // Router.go("/reglas");
    //   });
    // }
    // if (botonNewgame) {
    //   botonNewgame.addEventListener("click", (e) => {
    //     botonExitenSala.style.display = "none";
    //     boton.style.display = "flex";
    //     e.preventDefault();
    //     const target: any = e.target;

    //     target.value = name;
    //     console.log(botonExitenSala, boton, "clik boton nuevo");
    //     // Router.go("/reglas");
    //   });
    // }
    // if (boton) {
    //   boton.addEventListener("click", () => {
    //     boton.style.display = "none";
    //     botonExitenSala.style.display = "flex";
    //     botonNewgame.style.display = "flex";
    //     Router.go("/");
    //   });
    // }
    // function handleClick() {
    //   const form = div.querySelector(".container-button");
    //   console.log(form);
    //   form.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     const target: any = e.target;
    //     const name = target.name.value;
    //     console.log(name);
    //   });
    // }

    div.appendChild(style);

    // handleClick();
    this.shadowRoot.appendChild(div);
  }
}
customElements.define("select-page", Select);
