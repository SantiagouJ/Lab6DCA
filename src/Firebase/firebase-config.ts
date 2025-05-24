import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAK8kMcqjdTTJLy8Pto9Ds4UxhSw7KNXR8",
    authDomain: "databaselab6-8c636.firebaseapp.com",
    projectId: "databaselab6-8c636",
    storageBucket: "databaselab6-8c636.firebasestorage.app",
    messagingSenderId: "562799088535",
    appId: "1:562799088535:web:6b7d45d322d197f90e6ad2",
    measurementId: "G-JJJ154H8VH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);

const registerUser = async (email: string, password: string) => {
	try {
    console.log("Registering user with email:", email);
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		console.log(userCredential.user);
		return { isRegistered: true, user: userCredential };
	} catch (error) {
		console.error(error);
		return { isRegistered: false, error: error };
	}
};

const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    return { isLoggedIn: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, error: error };
  }
}

export { app, db, auth, registerUser, loginUser};