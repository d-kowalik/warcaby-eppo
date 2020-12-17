import React, { useState } from "react";

import { Game as GameLogic, PLAYER_1 } from "../common/Game";
import { GameContext } from "./GameContext";
import { Board } from "./Board";

import "./Game.css";

export const Game = () => {
  const [game, setGame] = useState(new GameLogic(PLAYER_1));

  return (
    <GameContext.Provider value={game}>
      <div className="game">
        <Board />
      </div>
    </GameContext.Provider>
  );
};
