import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="left_logo">
        <div className="logo">demo</div>
      </div>
      <div className="rightOption">
        <div className="nav__item">Connection screen</div>
        <div className="nav__item">Connection Lists</div>
        <div className="nav__item">Mapping</div>
      </div>
    </div>
  );
}

export default Navbar;
