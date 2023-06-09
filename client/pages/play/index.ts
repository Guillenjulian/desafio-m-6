import { state } from "../../state";
import { Router } from "@vaadin/router";
import { Result } from "../result";

export class Play extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render();
  }
  render() {
    const div = document.createElement("div");
    const style = document.createElement("style");
    // creo el div con los contenido de la pagina
    div.className = "contenedor";

    div.innerHTML = `
<div class="contenedor">

<div class = "cpu-componet">
<mano-piedra class = "pc-piedra"></mano-piedra>


<mano-papel  class = "pc-papel "></mano-papel>



<mano-tijera class = "pc-tijera"> </mano-tijera>
</div>

<my-contador class = "contador"></my-contador>
 


<div class = "player-componet">
<mano-piedra class = "mano-piedra"></mano-piedra>


<mano-papel  class = "mano-papel "></mano-papel>



<mano-tijera class = "mano-tijera"> </mano-tijera>
</div>




</div>
</div>
`;
    style.innerHTML = `
  .contenedor{
  height:100%;
  display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  
  }
  
    .mano{
        margin:0  20px;
    }

    .cpu-componet{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap:25px;


    }
.player-componet{
    display: flex;
    align-items:start;
    overflow:auto;
    gap: 55px;
}

.pc-piedra,
.pc-tijera,
.pc-papel{
    display: none;
    align-items: start;
    transform: rotate(180deg);
}

.mano-tijera:hover,
.mano-papel:hover,
.mano-piedra:hover{
    cursor: pointer;
    transform: translateY(-25px);
    transition: all 0.1s;
}


  `;

    const currentState = state.getState();
    const playRef = currentState.playHistory;
    // console.log(currentState.contrincanteChoice);
    // console.log(currentState.choices);

    // console.log(playRef);

    div.appendChild(style);

    // si pasado 10 segundos no se   hace movimiento vuelve a la pagina de reglas

    let counter = 10;

    const interavalidId = setInterval(() => {
      counter--;
      if (counter < 0) {
        clearInterval(interavalidId);
        console.log("termino el contador");
        alert("tu oponete no selecciono");
        setTimeout(() => {
          Router.go("/");
        }, 5000);
      }
    }, 1000);

    // se le pasa el valor de counter al componente contador
    const contadorComp = div.querySelector(".contador") as any;

    const pcTijeraEl = div.querySelector(".pc-tijera") as any;
    pcTijeraEl.style.height = "279px";
    pcTijeraEl.style.width = "87px";
    pcTijeraEl.style.objectPosition = "0px 43px";

    const pcPapelEl = div.querySelector(".pc-papel") as any;

    pcPapelEl.style.height = "279px";
    pcPapelEl.style.width = "87px";
    pcPapelEl.style.objectPosition = "0px 43px";

    const pcPiedraEl = div.querySelector(".pc-piedra") as any;
    pcPiedraEl.style.height = "279px";
    pcPiedraEl.style.width = "87px";
    pcPiedraEl.style.objectPosition = "0px 43px";

    // estilos de componentes de mano --tijera
    const manoTijeraEl = div.querySelector(".mano-tijera") as any;

    const manoTijeraElImg = manoTijeraEl.querySelector(".tijera-img") as any;
    manoTijeraElImg.style.height = "230px";
    manoTijeraElImg.style.width = "75px";
    manoTijeraElImg.style.objectPosition = "0px 43px";

    //
    const removetijerasclick = () => {
      state.setMove("tijera");
      console.log("tijera seleccionada");

      manoTijeraElImg.style.objectPosition = "0px 43px";
      manoTijeraElImg.style.transition = "all 0.5s ease-out";

      manoPiedraEl.style.opacity = "0.4";
      manoPapelEl.style.opacity = "0.4";

      // setTimeout(() => {
      //   if (state.data.contrincanteChoice == "tijera") {
      //     pcTijeraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "piedra") {
      //     pcPiedraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "papel") {
      //     pcPapelEl.style.display = "flex";
      //   }
      //   contadorComp.style.display = "none";
      //   manoPiedraEl.style.display = "none";
      //   manoPapelEl.style.display = "none";

      //   manoTijeraElImg.style.height = "280px";
      //   manoTijeraElImg.style.width = "100px";
      // }, 3000);
      clearInterval(interavalidId);

      setTimeout(() => {
        Router.go("/result");
      }, 5000);

      manoTijeraElImg.removeEventListener("click", removetijerasclick);
      manoTijeraEl.style.cursor = "default";
      manoTijeraEl.style.transform = "unset";
      manoPiedraElImg.removeEventListener("click", removetijerasclick);
      manoPiedraEl.style.cursor = "default";
      manoPiedraEl.style.transform = "unset";
      manoPapelElImg.removeEventListener("click", removetijerasclick);
      manoPapelEl.style.cursor = "default";
      manoPapelEl.style.transform = "unset";

      manoTijeraEl.removeEventListener(
        "click",

        removetijerasclick
      );
    };
    manoTijeraElImg.addEventListener("click", removetijerasclick);

    const manoPapelEl = div.querySelector(".mano-papel") as any;
    //console.log(manoPapelEl, "manoPapelEl");
    const manoPapelElImg = manoPapelEl.querySelector(".paper-img") as any;
    manoPapelElImg.style.height = "230px";
    manoPapelElImg.style.width = "75px";

    // estilos de componentes de mano --papel
    const removepapelclick = () => {
      state.setMove("papel");
      console.log("papel selecionado");

      manoPapelElImg.style.objectPosition = "0px 43px";
      manoPapelElImg.style.transition = "all 0.5s ease-out";

      manoPiedraEl.style.opacity = "0.4";
      manoTijeraEl.style.opacity = "0.4";

      // setTimeout(() => {
      //   if (state.data.choices == "tijera") {
      //     pcTijeraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "piedra") {
      //     pcPiedraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "papel") {
      //     pcPapelEl.style.display = "flex";
      //   }
      //   contadorComp.style.display = "none";
      //   manoPiedraEl.style.display = "none";
      //   manoTijeraEl.style.display = "none";

      //   manoPapelElImg.style.height = "280px";
      //   manoPapelElImg.style.width = "100px";
      // }, 3000);
      clearInterval(interavalidId);

      setTimeout(() => {
        Router.go("/result");
      }, 5000);
      // le doy estlos y remuevo elementos si pierdo con papel
      manoPapelElImg.removeEventListener("click", removepapelclick);
      manoPapelEl.style.cursor = "default";
      manoPapelEl.style.transform = "unset";
      manoPiedraElImg.removeEventListener("click", removepapelclick);
      manoPiedraEl.style.cursor = "default";
      manoPiedraEl.style.transform = "unset";

      manoTijeraElImg.removeEventListener("click", removepapelclick);
      manoTijeraEl.style.cursor = "default";
      manoTijeraEl.style.transform = "unset";
    };
    manoPapelElImg.addEventListener("click", removepapelclick);

    const manoPiedraEl = div.querySelector(".mano-piedra") as any;
    const manoPiedraElImg = manoPiedraEl.querySelector(".piedra-img") as any;
    manoPiedraElImg.style.height = "230px";
    manoPiedraElImg.style.width = "75px";
    // se agrega el evento click a la imagen de piedra y se le asigna la funcion removepiedraclick
    //
    const removepiedraclick = () => {
      state.setMove("piedra");
      console.log("piedra selecionado");
      manoPiedraElImg.style.objectPosition = "0px 43px";
      manoPiedraElImg.style.transition = "all 0.5s ease-out";

      manoPapelEl.style.opacity = "0.4";
      manoTijeraEl.style.opacity = "0.4";

      // setTimeout(() => {
      //   if (state.data.contrincanteChoice == "tijera") {
      //     pcTijeraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "piedra") {
      //     pcPiedraEl.style.display = "flex";
      //   } else if (state.data.contrincanteChoice == "papel") {
      //     pcPapelEl.style.display = "flex";
      //   }
      //   contadorComp.style.display = "none";
      //   manoPapelEl.style.display = "none";
      //   manoTijeraEl.style.display = "none";

      //   manoPiedraElImg.style.height = "280px";
      //   manoPiedraElImg.style.width = "100px";
      // }, 3000);

      clearInterval(interavalidId);

      setTimeout(() => {
        Router.go("/result");
      }, 5000);

      manoPiedraElImg.removeEventListener("click", removepiedraclick);

      manoPiedraEl.style.cursor = "default";
      manoPiedraEl.style.transform = "unset";
      manoPapelElImg.removeEventListener("click", removepiedraclick);
      manoPapelEl.style.cursor = "default";
      manoPapelEl.style.transform = "unset";
    };
    manoPiedraElImg.addEventListener("click", removepiedraclick);

    this.shadowRoot.appendChild(div);
  }
}
customElements.define("play-page", Play);
