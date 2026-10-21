
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC0-p5powWBb2RVj1qN3f7kBciY7BzsQco",
    authDomain: "peerlearn-8047c.firebaseapp.com",
    databaseURL: "https://peerlearn-8047c-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "peerlearn-8047c",
    storageBucket: "peerlearn-8047c.firebasestorage.app",
    messagingSenderId: "35172267232",
    appId: "1:35172267232:web:0b69b2eedb8229cb410c85",
    measurementId: "G-J3T6FJMMR6"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
export { signInAnonymously };
