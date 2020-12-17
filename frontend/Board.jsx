import React, { useState } from "react";
import { Game } from "../common/Game";
import { Field } from "./Field";

export const Board = (props) => {
  const [game, setGame] = useState(new Game());
  const fields = game.getFields();
  return (
    <div className="board">
      {fields.map((column, x) => {
        return column.map((row, y) => {
          return (
            <Field x={x} y={y} key={`${x}_${y}`} state={game.getField(x, y)} />
          );
        });
      })}
    </div>
  );
};
