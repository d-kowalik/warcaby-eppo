import React from "react";

export const Field = ({ x, y, state }) => {
  return (
    <div
      className={`field ${state} ${(x + y) % 2 === 0 ? "even" : "odd"}`}
      style={{ gridArea: `${x + 1} / ${y + 1}` }}
    ></div>
  );
};
