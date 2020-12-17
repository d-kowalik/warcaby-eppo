import React, { useContext } from "react";

import { GameContext } from "./GameContext";
import "./Checker.css";

export const Checker = ({
  state,
  x,
  y,
  disabled,
  onMouseEnter,
  onMouseLeave,
}) => {
  const game = useContext(GameContext);
  return (
    <div
      className={`checker ${state} ${disabled ? "disabled" : ""}`}
      onMouseEnter={() => (disabled ? null : onMouseEnter())}
      onMouseLeave={() => (disabled ? null : onMouseLeave())}
      onClick={() => console.log(x, y, game.getPossibleMoves(x, y))}
    ></div>
  );
};
