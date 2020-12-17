import React, { useContext } from "react";

import { Checker } from "./Checker";
import { GameContext } from "./GameContext";
import { SetGameContext } from "./SetGameContext";
import { SocketContext } from "./SocketContext";
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
  const setGame = useContext(SetGameContext);
  const socket = useContext(SocketContext);

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

  const onBackgroundClick = () => {
    if (!isSelectedPossible) return;
    setGame(game.tryMove(selected[0], selected[1], x, y));
    socket.emit("tryMove", [selected[0], selected[1], x, y]);
    setSelected(null);
    setSelectedPossible([]);
  };

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
      onClick={onBackgroundClick}
    >
      {state != EMPTY ? (
        <Checker
          state={state}
          disabled={
            state != game.getCurrentPlayer() ||
            game.getCurrentPlayer() !== game.getOurColor()
          }
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        />
      ) : null}
    </div>
  );
};
