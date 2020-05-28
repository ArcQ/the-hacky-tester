import React from "react";
import { Socket } from "phoenixjs";
import { backendUrl } from "../../config";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    const roomToken = 100;
    const socket = new Socket(`ws://${backendUrl}/socket`, {
      params: { userToken: window.location.search.split("=")[1] }
    });
    socket.connect();

    // this.channel = socket.channel("room:lobby", { token: roomToken });
    this.channel = socket.channel("room:lobby", {});
    this.channel.on("new_message", msg => console.log("Got message", msg));

    this.channel
      .join()
      .receive("ok", ({ messages }) => console.log("catching up", messages))
      .receive("error", ({ reason }) => console.log("failed join", reason))
      .receive("timeout", () =>
        console.log("Networking issue. Still waiting...")
      );
  }

  componentWillUnmount() {}

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  keyPressed(e) {
    if (e.key === "Enter") {
      console.log(this.state.value);
      this.channel
        .push("new_message", { body: this.state.value })
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
