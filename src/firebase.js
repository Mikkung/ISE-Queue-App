import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm-ydZ2FqejXHKEPWvZ_ZAQBQXwKqSfKE",
  authDomain: "isequeue.firebaseapp.com",
  projectId: "isequeue",
  // ... ของคุณ ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
