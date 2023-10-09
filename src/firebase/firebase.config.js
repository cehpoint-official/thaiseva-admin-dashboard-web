// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/functions"; // For Firebase Cloud Functions
// import { firebase } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const partnersCollection = collection(db, "partners");
const usersCollection = collection(db, "users");
const driversCollection = collection(db, "drivers");
const requirementsCollection = collection(db, "allRequirements");
const localServicesCollection = collection(db, "localServices");
const restaurentsCollection = collection(db, "restaurants");
const hotelsCollection = collection(db, "hotels");
const travelRequirementsCollection = collection(db, "travelRequirements");

// Use the 'firebase' instance created above to call functions
const deleteUserFromAuth = httpsCallable(
  getFunctions(app),
  "deleteUserFunction"
); // Use httpsCallable

const storage = getStorage();

export {
  app,
  db,
  partnersCollection,
  usersCollection,
  deleteUserFromAuth,
  driversCollection,
  requirementsCollection,
  localServicesCollection,
  restaurentsCollection,
  hotelsCollection,
  travelRequirementsCollection,
  storage,
};
