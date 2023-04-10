import { Router } from "@vaadin/router";
import { state } from "../../state";

class Form extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.connctedCallback();
  }
  connctedCallback() {
    state.suscribe(() => {
      const currenstate = state.getState();
      currenstate.player;
      currenstate.cpu;
      currenstate.userId;
      currenstate.roomId;
    });
    const form = this.querySelector(".form");
    console.log(form, "este es el form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.name.value;
      state.setNema(name);
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
      
      
      <div>
        
     
        <label class ="form-label">  Salas </label>  
      </div>
        <select class ="selectroom form-input" name ="selectroom" id :"selectroom">
          <option class ="newroom" value = "newroom">Nueva Sala</option>
          <option class ="existingroom" value = "existingroom">Sala existente</option>
        </select>
      <div class ="select-sala">
      
        <div> 
          <label class ="form-label" >  Nombre de la sala</label>
        </div>
        <input  class ="form-input " type ="text" name= "sala" placeholder= " Nombre de la sala">
      </div>
     
      <button class ="form-button" >Comenzar</button>
    
                
                </form>`;
    style.innerHTML = `
                
               
                .input{
                    color: white;
                    height:65px ;
                    font-size: 45px;
                    border: 10px solid #001997;
                    border-radius: 10px;
                    background: #fff;
                    width:300px ;
                }
                `;

    this.appendChild(div);
    this.appendChild(style);
  }
}
customElements.define("my-form", Form);
