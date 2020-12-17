import React, { useContext } from "react";

import { Checker } from "./Checker";
import { GameContext } from "./GameContext";
import { EMPTY } from "../common/Game";

import "./Field.css";

export const Field = ({
  x,
  y,
  state,
  hovered,
  setHovered,
  hoveredPossible,
  setHoveredPossible,
  selected,
  setSelected,
  selectedPossible,
  setSelectedPossible,
}) => {
  const game = useContext(GameContext);

  const onMouseEnter = () => {
    setHovered([x, y]);
    setHoveredPossible(game.getPossibleMoves(x, y));
  };

  const onMouseLeave = () => {
    setHovered(null);
    setHoveredPossible([]);
  };

  const onClick = () => {
    if (selected && selected[0] == x && selected[1] == y) {
      setSelected(null);
      setSelectedPossible([]);
    } else {
      setSelected([x, y]);
      setSelectedPossible(game.getPossibleMoves(x, y));
    }
  };

  const isHovered = hovered && hovered[0] == x && hovered[1] == y;
  const isSelected = selected && selected[0] == x && selected[1] == y;
  const isHoveredPossible =
    hoveredPossible.filter(([hx, hy]) => hx == x && hy == y).length > 0;
  const isSelectedPossible =
    selectedPossible.filter(([hx, hy]) => hx == x && hy == y).length > 0;

  const classes = ["field"];
  classes.push((x + y) % 2 === 0 ? "even" : "odd");
  classes.push(isHovered ? "hovered" : "");
  classes.push(isHoveredPossible ? "hovered-possible" : "");
  classes.push(isSelected ? "selected" : "");
  classes.push(isSelectedPossible ? "selected-possible" : "");

  return (
    <div
      className={classes.join(" ")}
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    >
      {state != EMPTY ? (
        <Checker
          state={state}
          disabled={state != game.getCurrentPlayer()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        />
      ) : null}
    </div>
  );
};
