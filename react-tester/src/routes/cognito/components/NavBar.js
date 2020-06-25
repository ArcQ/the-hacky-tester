import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <Link to="/login-cognito/profile">Profile</Link>
      <Link to="/login-cognito/external-api">ExternalApi</Link>
    </div>
  );
};

export default NavBar;
