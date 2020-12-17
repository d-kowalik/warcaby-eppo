import React, { useState } from "react";

import "./Login.css";

export const Login = ({ onSubmit }) => {
  const [nick, setNick] = useState("");

  const submit = () => {
    if (nick.length > 0) {
      onSubmit(nick);
    }
    return false;
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
