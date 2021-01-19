import React from "react";
import { useHistory } from "react-router-dom";

import "./Loader.css";

export const Loader = ({ text, backButton }) => {
  const history = useHistory();

  return (
    <div className="loader-parent">
      {text ? <p className="loader-text">{text}</p> : null}
      <div className="loader" />
      {backButton ? (
        <button className="loader-back" onClick={() => history.goBack()}>
          Go back
        </button>
      ) : null}
    </div>
  );
};
