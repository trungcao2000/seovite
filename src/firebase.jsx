// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAac0oAVq4kYXN8jQIfFuW_obCEZCuU8Fk",
  authDomain: "crud-cf000.firebaseapp.com",
  databaseURL: "https://crud-cf000-default-rtdb.firebaseio.com",
  projectId: "crud-cf000",
  storageBucket: "crud-cf000.firebasestorage.app",
  messagingSenderId: "310787121711",
  appId: "1:310787121711:web:acdd9a356a675699709cda",
  measurementId: "G-G0SQ2F2QQS",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
export { database, auth };
