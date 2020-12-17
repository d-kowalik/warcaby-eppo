import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { GameLogic } from "../../common/GameLogic";
import { GameContext } from "./GameContext";
import { SetGameContext } from "./SetGameContext";
import { SocketContext } from "../SocketContext";
import { Board } from "./Board";
import { Loader } from "../Loader/Loader";

import "./Game.css";

export const Game = () => {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const history = useHistory();
  const [game, setGame] = useState(null);

  if (!location.state || !location.state.id) {
    history.push("/");
    return null;
  }

  useEffect(() => {
    socket.emit("join game", location.state.id);
    return () => {
      socket.disconnect();
      socket.connect();
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("color", (color) => {
      console.log("Creating game for player", socket.id, "color:", color);
      setGame(new GameLogic(color));
    });

    socket.on("tryMove", (data) => {
      console.log(data.map((x) => 7 - x));
      setGame(game.tryMove(...data.map((x) => 7 - x)));
    });

    return () => {
      socket.removeAllListeners("color");
      socket.removeAllListeners("tryMove");
    };
  }, [socket, game, setGame]);

  if (!game) return <Loader text="Waiting for other players..." />;

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
