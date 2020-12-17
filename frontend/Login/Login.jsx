import React, { useState } from "react";

import "./Login.css";

export const Login = ({ onSubmit }) => {
  const [nick, setNick] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (nick.length > 0) {
      onSubmit(nick);
    }
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <input
          placeholder="Enter nickname"
          onChange={(e) => setNick(e.target.value)}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};
