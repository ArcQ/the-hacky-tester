import React from "react";
import { Socket } from "phoenixjs";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    const roomToken = 100;
    console.log(window.location.search.split("=")[1]);
    const socket = new Socket("ws://localhost:4000/socket", {
      params: { userToken: window.location.search.split("=")[1] }
    });
    socket.connect();

    // this.channel = socket.channel("room:lobby", { token: roomToken });
    this.channel = socket.channel("room:lobby", {});
    this.channel.on("new_message", msg => console.log("Got message", msg));

    this.channel
      .join()
      .receive("ok", ({ messages, ...blah }) =>
        console.log("catching up", messages, blah)
      )
      .receive("error", ({ reason }) => console.log("failed join", reason))
      .receive("timeout", () =>
        console.log("Networking issue. Still waiting...")
      );
  }

  componentWillUnmount() {}

  handleChange(e) {
    console.log(e.target.value);
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
        <input
          onChange={this.handleChange}
          onKeyPress={this.keyPressed}
          value={this.state.value}
        />
      </>
    );
  }
}
