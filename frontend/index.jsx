import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

import { Loader } from "./Loader/Loader";
import { Login } from "./Login/Login";
import { Game } from "./Game/Game";
import { Rooms } from "./Rooms/Rooms";
import { ErrorPopup } from "./ErrorPopup/ErrorPopup";
import { SocketContext } from "./SocketContext";

import "./index.css";

const App = () => {
  const [nick, setNick] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.log(socket.id);
      setSocket(socket);
    });

    return () => {
      setSocket(null);
      socket.disconnect();
    };
  }, []);

  if (!socket) return <Loader text="Waiting for server..." />;

  return (
    <SocketContext.Provider value={socket}>
      <ErrorPopup />
      <Router>
        <Switch>
          <Route path="/play">
            <Game />
          </Route>
          <Route path="/">
            {nick ? <Rooms nick={nick} /> : <Login onSubmit={setNick} />}
          </Route>
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
};

ReactDom.render(<App />, document.getElementById("app"));
