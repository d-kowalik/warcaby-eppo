import React from "react";

import "./Button.css";

export const Button = ({ text, color, radius, width, onClick }) => {
  return (
    <button
      className="btn"
      onClick={onClick || (() => {})}
      style={{
        backgroundColor: color,
        borderRadius: radius || 0,
        width: width || "initial",
      }}
    >
      {text}
    </button>
  );
};
