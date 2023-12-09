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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
let body = document.querySelector("body")


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        verifyPermission(user.email)
    } else {
        body.innerHTML = ""
        window.location.href = "login-signin.html"
    }
});

function verifyPermission(email) {
    let unsub = onSnapshot(doc(db, "users", `${email}`), (doc) => {
        if (doc.data().permission == false) {
            body.classList.add("displayCenter")
            body.innerHTML = `
            <section class="alert">
                <h2 class="alert__h2"><ion-icon name="lock-closed-outline" class="alert__icon"></ion-icon>Página bloqueada
                </h2>
                <p class="alert__p">É preciso que o administrador permita seu acesso ao site para poder usa-lo, por favor
                    aguarde a
                    autorização</p>
                <div class="alert__div">
                    <button class="alert__button" id="close" type="button">Sair</button>
                    <button class="alert__button" id="await" type="button">Aguardar</button>
                </div>
            </section>
            `
            let closebtn = document.getElementById("close")
            let awaitbtn = document.getElementById("await")
            awaitbtn.onclick = function () {
                body.innerHTML = `                
                    <div class="cubeAwait">
                        <div id="square1"></div>
                        <div id="square2"></div>
                        <div id="square3"></div>
                        <div id="square4"></div>
                        <div id="square5"></div>
                    </div>`
            }
            closebtn.onclick = function () {
                window.location.href = "login-signin.html"
            }
            reload(email)
        }
    });
}

function reload(email) {
    let unsub = onSnapshot(doc(db, "users", `${email}`), (doc) => {
        if (doc.data().permission == true) {
            window.location.reload()
        }
    });
}