import React, { useContext } from "react";

import { Checker } from "./Checker";
import { GameContext } from "./GameContext";
import { EMPTY } from "../common/Game";

import "./Field.css";

export const Field = ({ x, y, state, hover, setHover }) => {
  const game = useContext(GameContext);

  const onMouseEnter = () => {
    setHover([[x, y]].concat(game.getPossibleMoves(x, y)));
  };

  const onMouseLeave = () => {
    setHover([]);
  };

  const isHovered = hover.filter(([hx, hy]) => hx == x && hy == y).length > 0;

  const classes = ["field"];
  classes.push((x + y) % 2 === 0 ? "even" : "odd");
  classes.push(isHovered ? "hovered" : "");

  return (
    <div
      className={classes.join(" ")}
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    >
      {state != EMPTY ? (
        <Checker
          x={x}
          y={y}
          state={state}
          disabled={state != game.getCurrentPlayer()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ) : null}
    </div>
  );
};
