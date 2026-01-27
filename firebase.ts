import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3H829mFzgYyQ-geBYOmFcg_VMRj52FDQ",
  authDomain: "digra-guias.firebaseapp.com",
  projectId: "digra-guias",
  storageBucket: "digra-guias.firebasestorage.app",
  messagingSenderId: "910001503784",
  appId: "1:910001503784:web:b4edcf0b2d4513445a3f1d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
