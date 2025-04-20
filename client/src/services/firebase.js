import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Web SDK configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmZpukQWW3PZ4TqW_Vv01mVYzP9UHG1fs",
  authDomain: "ghoomo-app.firebaseapp.com",
  projectId: "ghoomo-app",
  storageBucket: "ghoomo-app.appspot.com",
  messagingSenderId: "818321782848",
  appId: "1:818321782848:web:88274c85aa6c48c4c23a1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };