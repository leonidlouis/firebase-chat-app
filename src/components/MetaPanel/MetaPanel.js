import React, { Component } from "react";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";

class MetaPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      isPrivateChannel: this.props.isPrivateChannel,
      channel: this.props.currentChannel
    };
  }

  setActiveIndex = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    });
  };

  render() {
    const { activeIndex, isPrivateChannel, channel } = this.state;

    if (isPrivateChannel) return null;

    return (
      <Segment loading={!channel}>
        <Header>About #{channel && channel.name}</Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h4">
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
