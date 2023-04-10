import { Router } from "@vaadin/router";

export class Welcome extends HTMLElement {
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
          <my-button class = "boton" value ="Empezar"></my-button>
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
    gap: 50px;
  
    
  }
  .manos{
    display: flex;
    gap: 50px;
  
  }
  `;

    function handleClick() {
      const boton = div.querySelector(".boton");
      boton?.addEventListener("click", () => {
        Router.go("/select");
      });
    }
    div.appendChild(style);

    handleClick();
    this.shadowRoot.appendChild(div);
  }
}
customElements.define("welcome-pages", Welcome);
