import { state } from "../../state";
import { Router } from "@vaadin/router";

export class Result extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }
  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");

    // creo el div con los contenido de la pagina

    div.innerHTML = `
  
  <div class="contenedor">
  <my-star></my-star>
  <my-button  class="boton"    value="Volver a jugar"></my-button>
  <my-button  class="boton1"   value="Salir"></my-button>
  </div>
  `;

    style.innerHTML = `
  .contenedor {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }
  @media (max-width: 768px){
    .contenedor{
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  `;

    function handleClick() {
      const boton = div.querySelector(".boton");
      const boton1 = div.querySelector(".boton1");

      boton?.addEventListener("click", () => {
        Router.go("/play");
      });
      boton1?.addEventListener("click", () => {
        Router.go("/");
      });
    }

    div.appendChild(style);
    handleClick();
    this.shadowRoot.appendChild(div);
  }
}
customElements.define("result-page", Result);
