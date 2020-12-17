import React, { useContext, useState } from "react";

import { GameContext } from "./GameContext";
import { Field } from "./Field";

import "./Board.css";

export const Board = () => {
  const game = useContext(GameContext);
  const [hover, setHover] = useState([]);

  return (
    <div className="board">
      {game.getFields().map((column, x) => {
        return column.map((row, y) => {
          return (
            <Field
              x={x}
              y={y}
              key={`${x}_${y}`}
              state={game.getField(x, y)}
              hover={hover}
              setHover={setHover}
            />
          );
        });
      })}
    </div>
  );
};
