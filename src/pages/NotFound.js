import React from "react";
import { Link } from "react-router-dom";
import { GlobalStyle } from "../styles/global";

/**
 * Page not found (404) componenet
 */
const NotFound = () => {
  return (
    <div className="not-found" style={notFoundStyle}>
      <GlobalStyle />
      <h1>404</h1>
      <h2>Document not found</h2>
      <p>
        <Link style={notFoundLinkStyle} to="/">Return to homepage</Link>
      </p>
    </div>
  );
};

const notFoundStyle = {
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "50vh",
  alignItems: "center",
};
const notFoundLinkStyle = {
  color: "white"
};

export default NotFound;
