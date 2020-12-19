import React, { useContext } from "react";

import { Login } from "../Login/Login";
import { Rooms } from "../Rooms/Rooms";
import { PlayerList } from "./PlayerList";

import { SocketContext } from "../SocketContext";

import "./HomePage.css";

export const HomePage = ({ nick, setNick }) => {
  const socket = useContext(SocketContext);

  const logIn = (nick) => {
    socket.emit("set nick", nick);
    setNick(nick);
  };

  return (
    <div className="home-page">
      {nick ? <Rooms nick={nick} /> : <Login onSubmit={logIn} />}
      <PlayerList />
    </div>
  );
};
