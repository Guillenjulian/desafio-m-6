import { Router } from "@vaadin/router";

import "./pages/page-welcome";
import "./pages/reglas";
import "./pages/play";
import "./pages/result";
import "./pages/select-sala";

import "./componet/button/index";
import "./componet/input/index";
import "./componet/form/index";

import "./componet/text-init/index";
import "./componet/mano-papel/index";
import "./componet/mano-piedra/index";
import "./componet/mano-tijera/index";
import "./componet/contador/index";
import "./componet/card-result";
import "./componet/text-rules/index";
import "./componet/text-result";

const router = new Router(document.querySelector(".root"));
//console.log(router);

const routes = [
  { path: "/", component: "welcome-pages" },
  { path: "/welcome", component: "welcome-pages" },
  { path: "/reglas", component: "reglas-page" },
  { path: "/select", component: "select-page" },
  { path: "/play", component: "play-page" },
  { path: "/result", component: "result-page" },
];

router.setRoutes(routes);
