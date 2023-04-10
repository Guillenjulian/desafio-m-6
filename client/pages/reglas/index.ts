import { Router } from "@vaadin/router";

export class Reglas extends HTMLElement {
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
    <my-rules></my-rules>
    <my-button class = "boton" value ="Jugar"></my-button>
    <div class = "manos">
    <mano-papel  class = "mano"></mano-papel>
    <mano-piedra class = "mano"></mano-piedra>
    <mano-tijera class = "mano"></mano-tijera>
    </div>
    </div>
    `;
    style.innerHTML = `
    .contenedor{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      margin:25px ;
      gap: 20px;
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
    function handleClick() {
      const boton = div.querySelector(".boton");
      boton?.addEventListener("click", () => {
        Router.go("/play");
      });
    }

    div.appendChild(style);
    handleClick();
    this.shadowRoot.appendChild(div);
  }
}
customElements.define("reglas-page", Reglas);
