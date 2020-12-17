import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { Game as GameLogic, PLAYER_1 } from "../common/Game";
import { GameContext } from "./GameContext";
import { SetGameContext } from "./SetGameContext";
import { Board } from "./Board";

import "./Game.css";

export const Game = () => {
  const [game, setGame] = useState(new GameLogic(PLAYER_1));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.log(socket.id);
      setSocket(socket);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.removeAllListeners("tryMove");
    socket.on("tryMove", (data) => {
      console.log(data);
      setGame(game.tryMove(...data));
    });
  }, [socket, game, setGame]);

  return (
    <GameContext.Provider value={game}>
      <SetGameContext.Provider value={setGame}>
        <div className="game">
          <Board />
        </div>
      </SetGameContext.Provider>
    </GameContext.Provider>
  );
};
