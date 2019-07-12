import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBzShWEMvjm1kB_ZlYX0dNBCsCWLgRjFGE",
  authDomain: "testproject-cf2bb.firebaseapp.com",
  databaseURL: "https://testproject-cf2bb.firebaseio.com",
  projectId: "testproject-cf2bb",
  storageBucket: "testproject-cf2bb.appspot.com",
  messagingSenderId: "920961981612",
  appId: "1:920961981612:web:2b0f9e634435e2b3"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
