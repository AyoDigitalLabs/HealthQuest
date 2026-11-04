// HealthQuest - cloud.js (Phase 8)
// Connects the game to Firebase. This is a "module" file, so it is loaded
// with type="module" in index.html.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6cG99mHcMfEbrBf-WVSgy0xCGRlKkUyU",
  authDomain: "healthquest-ng.firebaseapp.com",
  projectId: "healthquest-ng",
  storageBucket: "healthquest-ng.firebasestorage.app",
  messagingSenderId: "637029806757",
  appId: "1:637029806757:web:db4a5c80e3156e9c7a134c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// The rest of the game talks to Firebase only through this small helper object.
window.HQCloud = {
  signUp: function (email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  signIn: function (email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },
  google: function () {
    return signInWithPopup(auth, new GoogleAuthProvider());
  },
  resetPassword: function (email) {
    return sendPasswordResetEmail(auth, email);
  },
  signOut: function () {
    return signOut(auth);
  },
  load: function (uid) {
    return getDoc(doc(db, "users", uid)).then(function (snap) {
      return snap.exists() ? snap.data() : null;
    });
  },
  save: function (uid, data) {
    return setDoc(doc(db, "users", uid), data);
  }
};

// Tell the game whenever someone signs in or out.
onAuthStateChanged(auth, function (user) {
  window.dispatchEvent(new CustomEvent("hq-auth", {
    detail: { user: user ? { uid: user.uid, email: user.email || "" } : null }
  }));
});

window.dispatchEvent(new Event("hq-cloud-ready"));
