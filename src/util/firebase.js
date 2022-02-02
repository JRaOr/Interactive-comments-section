// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDyZPSYQbiPuSzXwq4fOr7CxyxxrnqsHJY",
    authDomain: "minegallery-4de80.firebaseapp.com",
    projectId: "minegallery-4de80",
    storageBucket: "minegallery-4de80.appspot.com",
    messagingSenderId: "458066650423",
    appId: "1:458066650423:web:c47f2d473cc1a3ba3ae6b2",
    measurementId: "G-GBGBPG1W7B"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage()

export { app , db , storage};