import React from "react";
import ReactDom from "react-dom";

import { Game } from "./Game";

import "./index.css";

const App = () => {
  return <Game />;
};

ReactDom.render(<App />, document.getElementById("app"));
