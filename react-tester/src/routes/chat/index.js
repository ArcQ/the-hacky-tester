import React from "react";
import { Auth } from "aws-amplify";
import {
  BROADCAST_ACTION,
  createChannel,
  sendMessageAsync
} from "@knotfive/chatpi-client-js/src/chatpi-client";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date(), messages: [] };
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  componentDidMount() {
    const self = this;
    Auth.currentSession()
      .then(({ accessToken }) =>
        createChannel({
          url: "localhost:4000",
          userToken: "2",
          authorizationToken: accessToken.jwtToken,
          channelId: "cf4aeae1-cda7-41f3-adf7-9b2bb377be7d"
        })
      )
      .then(channel => {
        self.channel = channel;
        self.channel.on(BROADCAST_ACTION, msg => {
          console.log(msg);
          self.state.messages.push(msg);
          self.setState({ messages: self.state.messages });
        });
      });
  }

  componentWillUnmount() {}

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  keyPressed(e) {
    if (e.key === "Enter") {
      sendMessageAsync({
        channel: this.channel,
        action: BROADCAST_ACTION,
        message: { text: this.state.value }
      }).then(response => console.log(response));
    }
  }

  render() {
    return (
      <>
        <h1>Chat</h1>
        {this.state.messages.map(msg => (
          <div style={{ border: "1px solid black", padding: "5px 20px" }}>
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
