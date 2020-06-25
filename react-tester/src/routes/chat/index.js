import React from "react";
import { Socket } from "phoenixjs";
import { backendUrl } from "../../config";
import { Auth } from "aws-amplify";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date(), messages: [] };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    const roomToken = 100;
    Auth.currentSession().then(({ accessToken }) => {
      console.log(accessToken);
      const socket = new Socket(`ws://${backendUrl}/socket`, {
        params: {
          userToken: window.location.search.split("=")[1],
          authorization: accessToken.jwtToken
        }
      });
      socket.connect();

      this.channel = socket.channel("chatty:lobby", {});
      this.channel.on("shout", msg => console.log("Got message", msg));

      this.channel
        .join()
        .receive("ok", ({ messages }) => console.log("catching up", messages))
        .receive("error", ({ reason }) => console.log("failed join", reason))
        .receive("timeout", () =>
          console.log("Networking issue. Still waiting...")
        );
    });
  }

  componentWillUnmount() {}

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  keyPressed(e) {
    if (e.key === "Enter") {
      console.log(this.state.value);
      this.channel
        .push("shout", { body: this.state.value })
        .receive("ok", msg => console.log("created message", msg))
        .receive("error", reasons => console.log("create failed", reasons))
        .receive("timeout", () => console.log("Networking issue..."));
    }
  }

  render() {
    return (
      <>
        <h2>Chat</h2>
        {this.state.messages.map(msg => (
          <div>
            <span>{msg.user}</span>:<span>{msg.m}</span>
          </div>
        ))}
        <input
          onChange={this.handleChange}
          onKeyPress={this.keyPressed}
          value={this.state.value}
        />
      </>
    );
  }
}
