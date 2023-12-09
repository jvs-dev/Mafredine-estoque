import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyAjMEAVlO2ms0ZL2HxFTXMplu8ikz3mQx8",
    authDomain: "mafredine-estoque.firebaseapp.com",
    projectId: "mafredine-estoque",
    storageBucket: "mafredine-estoque.appspot.com",
    messagingSenderId: "552286796233",
    appId: "1:552286796233:web:05ca7d9fce4ea834be1018"
};
const app = initializeApp(firebaseConfig);
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail, signOut, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, setDoc, onSnapshot, query, where, updateDoc, getDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();


function loadData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            let unsub = onSnapshot(doc(db, `users`, `${user.email}`), (doc) => {
                if (doc.data().deletedAccount == true) {
                    deleteActualUser(user.email)
                }
            });
        }
    });
}


async function deleteActualUser(email) {
    let user = auth.currentUser;
    deleteUser(user).then(() => {
    }).catch((error) => {
    });
    await deleteDoc(doc(db, "users", `${email}`));
    setTimeout(() => {
        window.location.href = "index.html"
    }, 1000);
}

loadData()