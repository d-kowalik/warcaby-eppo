import React, { useState, useContext, useEffect } from "react";

import { SocketContext } from "../SocketContext";

import "./ErrorPopup.css";

export const ErrorPopup = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState(null);

  useEffect(() => {
    socket.on("error", (message) => {
      setMessage(message);
      setDisplay(true);

      clearTimeout(timeoutRef);
      const ref = setTimeout(() => {
        setDisplay(false);
      }, 1000);
      setTimeoutRef(ref);
    });

    return () => {
      socket.removeAllListeners("error");
    };
  }, [socket, setMessage, setDisplay, timeoutRef, setTimeoutRef]);

  if (!display) return null;

  return <div className="error-popup">{message}</div>;
};
