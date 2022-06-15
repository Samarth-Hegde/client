import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB8F8veEQJjcH6tvvXOXqqFyS5wiK5cWpU",
  authDomain: "flight-booking-app-83fb7.firebaseapp.com",
  databaseURL:
    "https://flight-booking-app-83fb7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "flight-booking-app-83fb7",
  storageBucket: "flight-booking-app-83fb7.appspot.com",
  messagingSenderId: "696838491279",
  appId: "1:696838491279:web:c73ba4ea94ba71981c74fa",
};

const app = initializeApp(firebaseConfig);
export const fireBaseDataBase = getDatabase(app);
export const fireBaseAuth = getAuth(app);
