import React, { Component } from "react";
import firebase from "../../Firebase";
import md5 from "md5";
import { setCurrentChannel, setPrivateChannel } from "../../actions/index";
import { connect } from "react-redux";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

let listener;

class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChannel: "",
      channel: null,
      user: this.props.currentUser,
      channels: [],
      channelName: "",
      channelDetails: "",
      channelsRef: firebase.firestore().collection("channels"),
      messagesRef: firebase.firestore().collection("messages"),
      notifications: [],
      modal: false,
      firstLoad: true
    };
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    listener();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addListeners = () => {
    let loadedChannels = [];
    listener = this.state.channelsRef.onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type === "added") {
          loadedChannels.push(change.doc.data());
        }
      });
      // this is horribly inefficient
      // snap.docs.map(e => {
      //   loadedChannels.push(e.data());
      // });
      this.setState(
        {
          channels: loadedChannels
        },
        () => {
          this.setFirstChannel();
        }
      );
    });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = md5(`${channelName}${channelDetails}${user.displayName}`);

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      },
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    channelsRef
      .doc(key)
      .set(newChannel)
      .then(res => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({
      channel
    });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 1 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  render() {
    const { channels, modal } = this.state;

    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "menu" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            ({channels.length}){" "}
            <Icon
              name="add"
              onClick={this.openModal}
              className="cursor-pointer"
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
