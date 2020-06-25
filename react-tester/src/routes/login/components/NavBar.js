import React from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

const NavBar = isAuthenticated => {
  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
      )}

      {isAuthenticated && (
        <span>
          <Link to="/login/profile">Profile</Link>
          <Link to="/login/external-api">ExternalApi</Link>
        </span>
      )}
    </div>
  );
};

export default NavBar;
