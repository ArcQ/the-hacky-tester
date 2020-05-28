import React from "react";

import { Auth0Provider, useAuth0 } from "./react-auth0-spa";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./ExternalApi";
import Profile from "./components/Profile";
import config from "./auth_config.json";
import history from "../../utils/history";

export default function Login() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      <Switch>
        <Route path="/" exact />
        <PrivateRoute path="/login/external-api" component={ExternalApi} />
        <PrivateRoute path="/login/profile" component={Profile} />
      </Switch>
    </div>
  );
}
