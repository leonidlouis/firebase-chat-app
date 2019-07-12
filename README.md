## Just Another Chat App - MockChat

A very **basic** clone of Slack.
Created purely to demonstrate an implementation of Firebase' [Firestore](https://firebase.google.com/docs/firestore) to provide a fluid, real-time chat experience.

Currently LIVE at [mockchat.utopia.id](https://mockchat.utopia.id) :smiley:

Made possible by [reedbarger's amazing udemy course](https://www.udemy.com/build-a-slack-chat-app-with-react-redux-and-firebase/).

Please note that presence tracking (knowing whether a user is online or not) is currently not **_natively available_** on the LIVE site, since it is currently not supported per Firestore's documentation. However, I've found that there **are** currently 2 possible 'workarounds'.
[1](https://firebase.google.com/docs/firestore/solutions/presence) [2](https://stackoverflow.com/a/54660444/10656406)
