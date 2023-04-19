import { Router } from "@vaadin/router";
import { state } from "../../state";

export class WaitingRoom extends HTMLElement {
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
         <h1>Sala de espera</h1>
</div>
        `;
    style.innerHTML = ``;
    this.shadowRoot.appendChild(div);
    div.appendChild(style);
  }
}
customElements.define("select-WaitingRoom", WaitingRoom);
