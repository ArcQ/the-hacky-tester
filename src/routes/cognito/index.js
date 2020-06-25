import React from "react";

import { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import awsconfig from "./awsconfig";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import ExternalApi from "./ExternalApi";
import Profile from "./components/Profile";

Auth.configure();

class Cognito extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    const currentConfig = Auth.configure();
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <AmplifySignOut />
        <Switch>
          <Route path="/" exact />
          <Route path="/login-cognito/external-api" component={ExternalApi} />
          <Route path="/login-cognito/profile" component={Profile} />
        </Switch>
      </div>
    );
  }
}

export default withAuthenticator(Cognito);
