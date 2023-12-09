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


import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, getDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);


const auth = getAuth();
let createAccount = document.getElementById("createAccount")
let login = document.getElementById("login")
let helpSignin = document.getElementById("helpSignin")
let helpLogin = document.getElementById("helpLogin")
let resetEmailBtn = document.getElementById("resetEmail")
let closeResetEmailSection = document.getElementById("closeResetEmailSection")
let resetEmailSection = document.getElementById("resetEmailSection")
let showLogin = document.getElementById("showLogin")
let showSignIn = document.getElementById("showSignIn")

showLogin.onclick = function () {
    let password = document.getElementById("loginPassword")
    if (password.type != "text") {
        password.type = "text"
        showLogin.name = "eye-off-outline"
    } else {
        password.type = "password"
        showLogin.name = "eye-outline"
    }

}


login.onclick = function () {
    login.innerHTML = `
    <div class="dot-spinner">
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
    </div>`
    login.classList.add("loading")
    let email = document.getElementById("loginEmail").value
    let password = document.getElementById("loginPassword").value
    if (email != "" && password != "") {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                helpLogin.style.color = "#0f0"
                helpLogin.textContent = "Login feito com sucesso."
                window.location.href = "index.html"
            })
            .catch((error) => {
                verifyAccountData(email, password)
            });
    } else {
        helpLogin.style.color = "red"
        helpLogin.textContent = "Por favor, preencha os campos para continuar."
        login.innerHTML = `ENTRAR`
        login.classList.remove("loading")
    }
}

closeResetEmailSection.onclick = function () {
    resetEmailSection.style.display = "none"
}

resetEmailBtn.onclick = function () {
    resetEmailSection.style.display = "flex"
}

let sendResetEmail = document.getElementById("sendResetEmail")

sendResetEmail.onclick = function () {
    let email = document.getElementById("ResetEmailInput").value
    let resetEmailHelp = document.getElementById("resetEmailHelp")
    if (email != "") {
        sendResetEmail.innerHTML = `
        <div class="dot-spinner">
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
            <div class="dot-spinner__dot"></div>
        </div>`
        sendResetEmail.classList.add("loading")
        sendPasswordResetEmail(auth, email)
            .then(() => {
                resetEmailHelp.style.color = "#0f0"
                resetEmailHelp.textContent = "Um email para redefinição de senha foi enviado."
                sendResetEmail.innerHTML = `<ion-icon name="checkmark-circle" class="resetSucess"></ion-icon>`
                sendResetEmail.onclick = function () {
                    resetEmailSection.style.display = "none"
                }
            })
            .catch((error) => {
                resetEmailHelp.style.color = "red"
                resetEmailHelp.textContent = "Erro ao enviar email."
                sendResetEmail.innerHTML = `Enviar`
                sendResetEmail.classList.remove("loading")
                // ..
            });
    } else {
        resetEmailHelp.style.color = "red"
        resetEmailHelp.textContent = "Digite seu email para continuar."
    }
}

async function verifyAccountData(email, password) {
    let docRef = doc(db, "users", `${email}`);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        if (docSnap.data().deletedAccount != true) {
            if (password == docSnap.data().temporaryPassword) {
                deleteTemporaryPassword(email, password)
            } else {
                helpLogin.style.color = "red"
                helpLogin.textContent = "Erro ao fazer login, verifique seus dados e tente novamente."
                login.innerHTML = `ENTRAR`
                login.classList.remove("loading")
            }
        } else {
            await deleteDoc(doc(db, "users", `${email}`));
            helpLogin.style.color = "red"
            helpLogin.textContent = "Erro ao fazer login, verifique seus dados e tente novamente."
            login.innerHTML = `ENTRAR`
            login.classList.remove("loading")
        }
    } else {
        helpLogin.style.color = "red"
        helpLogin.textContent = "Erro ao fazer login, verifique seus dados e tente novamente."
        login.innerHTML = `ENTRAR`
        login.classList.remove("loading")
    }

}


async function deleteTemporaryPassword(email, password) {
    let cityRef = doc(db, 'users', `${email}`);
    await updateDoc(cityRef, {
        temporaryPassword: deleteField()
    });
    createNewAccount(email, password)
}




async function createNewAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            helpLogin.style.color = "#0f0"
            helpLogin.textContent = "Login feito com sucesso."
            window.location.href = "index.html"
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            let cityRef = doc(db, 'users', `${email}`);
            setDoc(cityRef, { temporaryPassword: `${password}` });
            helpLogin.style.color = "red"
            helpLogin.textContent = "Erro ao fazer login, verifique seus dados e tente novamente."
            login.innerHTML = `ENTRAR`
            login.classList.remove("loading")
        });
}