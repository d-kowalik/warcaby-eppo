import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import { Game as GameLogic, PLAYER_1 } from "../common/Game";
import { GameContext } from "./GameContext";
import { SetGameContext } from "./SetGameContext";
import { SocketContext } from "./SocketContext";
import { Board } from "./Board";

import "./Game.css";

export const Game = () => {
  const [game, setGame] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      socket.emit("hello", "ready");
      console.log(socket.id);
      setSocket(socket);
    });

    return () => {
      setSocket(null);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.removeAllListeners("color");
    socket.removeAllListeners("tryMove");

    socket.on("color", (color) => {
      console.log("Creating game for player", socket.id, "color:", color);
      setGame(new GameLogic(color));
    });

    socket.on("tryMove", (data) => {
      console.log(data.map((x) => 7 - x));
      setGame(game.tryMove(...data.map((x) => 7 - x)));
    });
  }, [socket, game, setGame]);

  if (!game) return <p>Waiting for color...</p>;

  return (
    <GameContext.Provider value={game}>
      <SetGameContext.Provider value={setGame}>
        <SocketContext.Provider value={socket}>
          <div className="game">
            <Board />
          </div>
        </SocketContext.Provider>
      </SetGameContext.Provider>
    </GameContext.Provider>
  );
};
