import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./Rooms.css";
import { SocketContext } from "../SocketContext";

export const Rooms = ({ nick }) => {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit("list rooms");
  }, []);

  useEffect(() => {
    socket.on("room available", (id, name) => {
      console.log("room created!");
      setRooms([...rooms, { id, name }]);
    });

    socket.on("room full", (id) => {
      setRooms(rooms.filter((room) => room.id != id));
    });

    return () => {
      socket.removeAllListeners("room available");
      socket.removeAllListeners("room full");
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
      <button onClick={createRoom}>Create room</button>
      {rooms.map(({ id, name }) => {
        return (
          <div className="room" key={id} onClick={() => joinRoom(id)}>
            {name}
          </div>
        );
      })}
    </div>
  );
};
