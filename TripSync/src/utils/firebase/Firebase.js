// firebase.js

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDM7IjJytjoBOCFkkhaaiQnp1ROPAnxvXQ",

  authDomain: "proyecto-tripsync.firebaseapp.com",

  databaseURL: "https://proyecto-tripsync-default-rtdb.firebaseio.com",

  projectId: "proyecto-tripsync",

  storageBucket: "proyecto-tripsync.appspot.com",

  messagingSenderId: "1018911948827",

  appId: "1:1018911948827:web:d659ba6952c725bc4c78be",

  measurementId: "G-JZDH3MFL7J"

};


// Initialize Firebase

const firestore = initializeApp(firebaseConfig);

//const analytics = getAnalytics(firestore);

export default firestore;
