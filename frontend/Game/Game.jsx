import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { GameLogic, NO_WIN_YET } from "../../common/GameLogic";
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
  const [enemyName, setEnemyName] = useState("loading...");

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

  const giveUp = () => {
    history.push("/");
  };

  useEffect(() => {
    socket.on("game ready", ({ color, enemyName }) => {
      setGame(new GameLogic(color));
      setEnemyName(enemyName);
    });

    socket.on("try move", (data) => {
      const newGame = game.tryMove(...data.map((x) => 7 - x));
      setGame(newGame);
      const winner = newGame.checkWinCondition();
      if (winner != NO_WIN_YET) {
        socket.emit("game won", winner);
      }
    });

    socket.on("game won", (winner) => {
      if (winner == game.getOurColor()) {
        alert("You won!");
      } else if (winner == game.getEnemyPlayer()) {
        alert("You lost :(");
      } else {
        alert("Tie!");
      }

      history.push("/");
    });

    return () => {
      socket.removeAllListeners("game ready");
      socket.removeAllListeners("try move");
      socket.removeAllListeners("game won");
    };
  }, [socket, game, setGame, setEnemyName]);

  if (!game) return <Loader text="Waiting for other players..." />;

  const turn =
    game.getCurrentPlayer() == game.getOurColor()
      ? "Your turn"
      : "Enemy's turn";

  return (
    <GameContext.Provider value={game}>
      <SetGameContext.Provider value={setGame}>
        <div className="game">
          <button onClick={giveUp}>Give up</button>
          <Board />
          <p>
            Enemy: {enemyName} / {turn}
          </p>
        </div>
      </SetGameContext.Provider>
    </GameContext.Provider>
  );
};
