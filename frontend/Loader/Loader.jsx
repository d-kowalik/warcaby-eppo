import React from "react";

import "./Loader.css";

export const Loader = ({ text }) => {
  return (
    <div className="loader-parent">
      {text ? <p className="loader-text">{text}</p> : null}
      <div className="loader" />
    </div>
  );
};
