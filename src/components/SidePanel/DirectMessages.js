import React, { Component } from "react";
import firebase from "../../Firebase";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

let listener;

class DirectMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser,
      users: [],
      usersRef: firebase.firestore().collection("users")
    };
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = [];
    listener = this.state.usersRef.onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (
          change.type === "added" &&
          currentUserUid !== change.doc.data().uid
        ) {
          loadedUsers.push(change.doc.data());
        }
      });
      this.setState({
        users: loadedUsers
      });
    });
  };

  componentWillUnmount() {
    listener();
  }

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    console.log(user);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}${currentUserId}`
      : `${currentUserId}${userId}`;
  };

  setActiveChannel = userId => {
    this.setState({
      activeChannel: userId
    });
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            active={user.uid === activeChannel}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon name="circle" color="blue" />
            {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessages);
