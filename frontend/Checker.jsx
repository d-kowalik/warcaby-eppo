import React, { useContext } from "react";

import { GameContext } from "./GameContext";
import "./Checker.css";

export const Checker = ({
  state,
  disabled,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const game = useContext(GameContext);
  return (
    <div
      className={`checker ${state} ${disabled ? "disabled" : ""}`}
      onMouseEnter={() => (disabled ? null : onMouseEnter())}
      onMouseLeave={() => (disabled ? null : onMouseLeave())}
      onClick={() => (disabled ? null : onClick())}
    ></div>
  );
};
