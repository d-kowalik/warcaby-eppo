import React from "react";
import { useHistory } from "react-router-dom";

import "./Loader.css";
import { Button } from "../Button/Button";

export const Loader = ({ text, backButton }) => {
  const history = useHistory();

  return (
    <div className="loader-parent">
      {text ? <p className="loader-text">{text}</p> : null}
      <div className="loader" />
      {backButton ? (
        <Button
          text="Go back"
          color="#e91e63"
          onClick={() => history.goBack()}
        />
      ) : null}
    </div>
  );
};
