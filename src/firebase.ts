// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDlrj3Jro_tKlfoOzg9nvEVPvkWiwoDo8",
  authDomain: "cc-club-portal.firebaseapp.com",
  projectId: "cc-club-portal",
  storageBucket: "cc-club-portal.firebasestorage.app",
  messagingSenderId: "47141494217",
  appId: "1:47141494217:web:855eaeee2a92766ace9c18",
  measurementId: "G-1SLXZ4J0TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export useful services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
