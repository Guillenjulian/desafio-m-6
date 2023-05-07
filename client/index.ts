import { state } from "./state";
import "./router";

(function () {
  const root: any = document.querySelector(".root") as HTMLElement;
  // console.log(dataBase);
  state.init();
})();
