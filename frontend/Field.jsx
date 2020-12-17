import React from "react";

import { Checker } from "./Checker";

import "./Field.css";

export const Field = ({ x, y, state }) => {
  return (
    <div
      className={`field ${(x + y) % 2 === 0 ? "even" : "odd"}`}
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    >
      <Checker state={state} />
    </div>
  );
};
