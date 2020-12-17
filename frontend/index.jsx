import React from "react";
import ReactDom from "react-dom";

import { Board } from "./Board";
import "./index.css";

const App = () => {
  return <Board />;
};

ReactDom.render(<App />, document.getElementById("app"));
