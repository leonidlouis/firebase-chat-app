import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../Firebase";

import Message from "./Message";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrivateChannel: this.props.isPrivateChannel,
      messagesRef: firebase.firestore().collection("messages"),
      privateMessagesRef: firebase.firestore().collection("privateMessages"),
      messages: [],
      messagesLoading: true,
      channel: this.props.currentChannel,
      user: this.props.currentUser,
      numUniqueUsers: "",
      searchTerm: "",
      searchLoading: false,
      searchResults: []
    };
  }

  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  displayChannelName = channel => {
    return channel
      ? `${this.state.isPrivateChannel ? `@` : `#`}${channel.name}`
      : "";
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref
      .doc(channelId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added") {
            loadedMessages.push(change.doc.data());
          }
        });
        // this is horribly inefficient
        // snap.docs.map(val => {
        //   loadedMessages.push(val.data());
        // });
        this.setState(
          {
            messages: loadedMessages,
            messagesLoading: false
          },
          () => {
            this.countUniqueUsers(loadedMessages);
          }
        );
      });
  };

  handleSearchChange = e => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({
      searchResults
    });
    setTimeout(() => {
      this.setState({ searchLoading: false });
    }, 500);
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({
      numUniqueUsers
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  render() {
    const {
      messagesRef,
      messages,
      channel,
      user,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      isPrivateChannel
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          handleSearchChange={this.handleSearchChange}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
        />

        <Segment clearing floated>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
