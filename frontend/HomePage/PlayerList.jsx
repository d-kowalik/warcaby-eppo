import React, { useState, useContext, useEffect } from "react";

import { SocketContext } from "../SocketContext";

import "./PlayerList.css";

export const PlayerList = () => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.emit("get players");
  }, [socket]);

  useEffect(() => {
    socket.on("player connected", (id, name) => {
      setPlayers([
        ...players.filter((player) => player.id !== id),
        { id, name },
      ]);
    });

    socket.on("player list", (players) => {
      setPlayers(players);
    });

    socket.on("player left", (id) => {
      setPlayers(players.filter((player) => player.id !== id));
    });

    return () => {
      socket.removeAllListeners("player connected");
      socket.removeAllListeners("player left");
      socket.removeAllListeners("player list");
    };
  }, [socket, players, setPlayers]);

  return (
    <div className="player-list">
      <h1>Connected players</h1>
      {players.map((player) => (
        <div className="player-list-item" key={player.id}>
          {player.name}
        </div>
      ))}
    </div>
  );
};
