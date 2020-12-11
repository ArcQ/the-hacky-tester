import React from "react";
import { Auth } from "aws-amplify";
import {
  Connection,
  BROADCAST_ACTION
} from "@knotfive/chatpi-client-js/dist/chatpi-client.modern";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date(), messages: [] };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.channelId = "cf4aeae1-cda7-41f3-adf7-9b2bb377be7d";
  }

  componentDidMount() {
    const self = this;
    Auth.currentSession().then(({ accessToken }) => {
      this.connection = new Connection({
        // url: "chatpi-dev.knotfive.com",
        url: "localhost:4000",
        apiKey: "touchbase",
        userToken: "2",
        authorizationToken: accessToken.jwtToken,
        channelIds: [this.channelId],
        onPresenceChange: (...args) => {
          console.log("p", args);
        },
        onMessageReceive: (channelId, msg) => {
          console.log(msg);
          self.state.messages.push(msg);
          self.setState({ messages: self.state.messages });
        }
      });
      this.connection.watchPresence(this.channelId);
    });
  }

  componentWillUnmount() {}

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  keyPressed(e) {
    if (e.key === "Enter") {
      this.connection
        .sendMessage({
          channelId: this.channelId,
          message: { text: this.state.value }
        })
        .then(response => console.log(response));
    }
  }

  render() {
    return (
      <>
        <h1>Chat</h1>
        {this.state.messages.map(msg => (
          <div
            key={msg.id}
            style={{ border: "1px solid black", padding: "5px 20px" }}
          >
            <p>{msg.user_id}</p>
            <b>{msg.text}</b>
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
