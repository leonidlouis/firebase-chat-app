import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDcq0_cikMphdJZYLoF_ic6jpSLkMZoe9U",
  authDomain: "slack-clone-app-6cbc0.firebaseapp.com",
  databaseURL: "https://slack-clone-app-6cbc0.firebaseio.com",
  projectId: "slack-clone-app-6cbc0",
  storageBucket: "slack-clone-app-6cbc0.appspot.com",
  messagingSenderId: "430261809540",
  appId: "1:430261809540:web:c8904d1fdfecc8ac"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
