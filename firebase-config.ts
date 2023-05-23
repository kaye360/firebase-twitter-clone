import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider } from "firebase/auth"
import { setPersistence } from "firebase/auth/cordova";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAHJQ_SMPBdMq379-Y2nvhbEOZyoLND4Ys",
  authDomain: "social-media-9fcff.firebaseapp.com",
  projectId: "social-media-9fcff",
  storageBucket: "social-media-9fcff.appspot.com",
  messagingSenderId: "141393493767",
  appId: "1:141393493767:web:08607f58b97d6cf0a94fa2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app);

( async () => {
  await setPersistence(auth, browserLocalPersistence)
})()