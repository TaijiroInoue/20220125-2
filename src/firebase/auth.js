import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

    authDomain: "t-career-radio.firebaseapp.com",
    projectId: "t-career-radio",
    storageBucket: "t-career-radio.appspot.com",
    messagingSenderId: "163091592469",
    appId: "1:163091592469:web:ab967afc2245ade741a51c"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const signupWithEmailAndPassword = async (email, password) => {
    try {
        const user = 
        await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification();

        alert('登録成功');

        return user;
    } catch (error) {
        alert('登録失敗');
        console.log(error);
    }
};

export const signinWithEmailAndPassword = async (email, password) => {
    try {
        const user = 
        
        await signInWithEmailAndPassword(auth, email, password);

        alert('サインイン成功');
        console.log(user);

        return user;
    } catch (error) {
        alert('サインイン失敗');
        console.log(error);
    }
};

export const signout = async () => {
    await signOut(auth);
    const user = await auth.currentUser;
    console.log('サインアウト: ', user);
};