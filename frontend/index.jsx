import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

import { Loader } from "./Loader/Loader";
import { Game } from "./Game/Game";
import { HomePage } from "./HomePage/HomePage";
import { ErrorPopup } from "./ErrorPopup/ErrorPopup";
import { SocketContext } from "./SocketContext";

import "./index.css";

const App = () => {
  const [nick, setNick] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.info(`Our ID: ${socket.id}`);
      setSocket(socket);
    });

    socket.on("disconnect", () => {
      setSocket(null);
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
            <Game nick={nick} />
          </Route>
          <Route path="/">
            <HomePage nick={nick} setNick={setNick} />
          </Route>
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
};

ReactDom.render(<App />, document.getElementById("app"));
