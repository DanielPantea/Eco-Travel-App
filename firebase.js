// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth/react-native';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2sJqAgrSU2K4IioZXre1iRC1AxeCif88",
  authDomain: "eco-travel-6de5f.firebaseapp.com",
  projectId: "eco-travel-6de5f",
  storageBucket: "eco-travel-6de5f.appspot.com",
  messagingSenderId: "949283899243",
  appId: "1:949283899243:web:a1f1c1b344b2a9a2612e2e",
  measurementId: "G-ZSC5188C8V"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const database = getDatabase();
export const storage = getStorage(app)