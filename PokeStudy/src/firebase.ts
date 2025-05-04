// other imports
import withFirebaseAuth from 'react-with-firebase-auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
// Our web app's Firebase configuration (example)
const firebaseConfig = {

    apiKey: "AIzaSyCoIJsze3LrCJQAOb0Kp_hlEt95LCGKyEk",
  
    authDomain: "pokestudy-fb83e.firebaseapp.com",
  
    projectId: "pokestudy-fb83e",
  
    storageBucket: "pokestudy-fb83e.firebasestorage.app",
  
    messagingSenderId: "933774237487",
  
    appId: "1:933774237487:web:56143d60498b33c47a4bda"
  
  };
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

const auth = getAuth(app);

const providers = {
    googleProvider: new GoogleAuthProvider(),
  };
  
  const createComponentWithAuth = withFirebaseAuth({
    providers,
    firebaseAppAuth: auth,
  });
  
  const signInWithGoogle = () => {
    signInWithPopup(auth, providers.googleProvider);
  };
  
  const signOutFirebase = () => {
    signOut(auth);
  };
  
  export {
    db,
    auth,
    createComponentWithAuth,
    signInWithGoogle,
    signOutFirebase as signOut,
  };