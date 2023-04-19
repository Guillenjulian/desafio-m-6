class Input extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const div = document.createElement("div");
    div.className = "contenedor";
    const style = document.createElement("style");
    const value = this.getAttribute("value") || "Click me";

    div.innerHTML = `
       
           
              <input type="text" class="input" placeholder="${value}" value="${value}" >
  
              
              `;
    style.innerHTML = `
              
              .conteiner{
                  display:flex;
                  justify-content:center;
                  aling-items:center
              }
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
customElements.define("my-input", Input);
