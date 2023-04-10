class TextInit extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");

    div.innerHTML = `
            <div class="container">
            <h1 class = "title">
            Piedra, 
            <br>
            Papel <p class = "letra">ó</p>
            <br>
            tijeta
            <br>

            
            </h1>
            </div>`;
    style.innerHTML = `
            .container{
                display:flex;
                justify-content:center;
                aling-items:center
            }
            .title{
               color: #009048;;
                font-size: 80px;
                font-weight: 700;
                font-family: 'Odibee Sans', cursive;
                text-align: center;
                margin: 25px auto;

            }
            .letra{
              display:inline;
              color: #5cb080;
            }
            `;

    this.appendChild(div);
    this.appendChild(style);
  }
}
customElements.define("my-text", TextInit);
