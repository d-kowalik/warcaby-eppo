import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./Rooms.css";
import { SocketContext } from "../SocketContext";
import { Button } from "../Button/Button";

export const Rooms = ({ nick }) => {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit("list rooms");
  }, [socket]);

  useEffect(() => {
    socket.on("room available", (id, name) => {
      setRooms([...rooms, { id, name }]);
    });

    socket.on("room full", (id) => {
      setRooms(rooms.filter((room) => room.id != id));
    });

    socket.on("room deleted", (id) => {
      setRooms(rooms.filter((room) => room.id != id));
    });

    socket.on("room list", (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.removeAllListeners("room available");
      socket.removeAllListeners("room full");
      socket.removeAllListeners("room deleted");
      socket.removeAllListeners("room list");
    };
  }, [socket, rooms, setRooms]);

  const joinRoom = (id) => {
    history.push({
      pathname: "/play",
      state: { id },
    });
  };

  const createRoom = () => {
    socket.emit("create room", nick);
    joinRoom(socket.id);
  };

  return (
    <div className="rooms">
      <Button text="Create room" onClick={createRoom} color="#e91e63" />
      <h1>Existing rooms</h1>
      {rooms.map(({ id, name }) => {
        return (
          <Button
            key={id}
            text={name}
            onClick={() => joinRoom(id)}
            color="#39796b"
          />
        );
      })}
    </div>
  );
};
