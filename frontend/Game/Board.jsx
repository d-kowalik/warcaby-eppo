import React, { useContext, useState } from "react";

import { GameContext } from "./GameContext";
import { Field } from "./Field";

import "./Board.css";

export const Board = () => {
  const game = useContext(GameContext);
  const [hovered, setHovered] = useState(null);
  const [hoveredPossible, setHoveredPossible] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPossible, setSelectedPossible] = useState([]);

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
              hovered={hovered}
              setHovered={setHovered}
              hoveredPossible={hoveredPossible}
              setHoveredPossible={setHoveredPossible}
              selected={selected}
              setSelected={setSelected}
              selectedPossible={selectedPossible}
              setSelectedPossible={setSelectedPossible}
            />
          );
        });
      })}
    </div>
  );
};
