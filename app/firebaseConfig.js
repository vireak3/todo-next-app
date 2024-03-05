
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyCJ2AFZN_tSTPfoKuRvu07HA5GQ8JZWw-E",
    authDomain: "todo-c47ff.firebaseapp.com",
    projectId: "todo-c47ff",
    storageBucket: "todo-c47ff.appspot.com",
    messagingSenderId: "778002635825",
    appId: "1:778002635825:web:d25511dcb2619b2a8c4910",
    measurementId: "G-DTHS73S1FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
