import { Router } from "@vaadin/router";
import { state } from "../../state";

class headers extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const div = document.createElement("div");
    div.className = "contenedor_header";
    div.innerHTML = `
        
        
     <h3 class = "titulo">sala :${state.data.roomId}</h3>
        
        `;
    const style = document.createElement("style");
    style.innerHTML = `
        .contenedor_header{
          
            
        }
        .titulo{
            display: flex;
        text-align: right;
        
    }
        `;
    this.appendChild(div);
    this.appendChild(style);
  }
}
customElements.define("my-headers", headers);
