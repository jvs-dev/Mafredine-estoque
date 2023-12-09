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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
let openCloseNav = document.getElementById("openCloseNav")
let navMobile = document.getElementById("navMobile")
let addItemsBtn = document.createElement("a")
let acceptUserBtn = document.createElement("a")
let transferMobile = document.getElementById("transferMobile")
let tecnicsMobile = document.getElementById("tecnicsMobile")


function loadData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            let unsub = onSnapshot(doc(db, `users`, `${user.email}`), (doc) => {
                if (doc.data().admin == true) {
                    navMobile.insertAdjacentElement("afterbegin", addItemsBtn)
                    navMobile.insertAdjacentElement("afterbegin", acceptUserBtn)
                    acceptUserBtn.innerHTML = `<i class="bi bi-person-vcard navMobile__icon">`
                    acceptUserBtn.classList.add("navMobile__a")
                    addItemsBtn.innerHTML = `<i class="bi bi-plus-circle navMobile__icon">`
                    addItemsBtn.classList.add("navMobile__a")
                    acceptUserBtn.href = "accept-user.html"
                    addItemsBtn.href = "add-item.html"
                    navMobile.classList.add("userAdmin")
                    transferMobile.style.display = "none"
                    transferMobile.innerHTML = ""
                    transferMobile.href = ""
                    if (window.location.href.indexOf("accept-user") !== -1) {
                        acceptUserBtn.classList.add("active")
                    }
                    if (window.location.href.indexOf("add-item") !== -1) {
                        addItemsBtn.classList.add("active")
                    }
                } else {
                    if (doc.data().createAccountPermission == true) {
                        navMobile.insertAdjacentElement("afterbegin", addItemsBtn)
                        navMobile.insertAdjacentElement("afterbegin", acceptUserBtn)
                        acceptUserBtn.innerHTML = `<i class="bi bi-person-vcard navMobile__icon">`
                        acceptUserBtn.classList.add("navMobile__a")
                        addItemsBtn.innerHTML = `<i class="bi bi-plus-circle navMobile__icon">`
                        addItemsBtn.classList.add("navMobile__a")
                        if (window.location.href.indexOf("add-item") !== -1) {
                            addItemsBtn.classList.add("active")
                        }
                        if (window.location.href.indexOf("accept-user") !== -1) {
                            acceptUserBtn.classList.add("active")
                        }
                        acceptUserBtn.href = "accept-user.html"
                        addItemsBtn.href = "add-item.html"
                        navMobile.classList.add("userStockPermission")
                        transferMobile.style.display = "flex"
                        loadRequests(user.email)
                    } else {
                        if (doc.data().work == "Estoquista") {
                            navMobile.insertAdjacentElement("afterbegin", addItemsBtn)
                            addItemsBtn.innerHTML = `<i class="bi bi-plus-circle navMobile__icon">`
                            addItemsBtn.classList.add("navMobile__a")
                            if (window.location.href.indexOf("add-item") !== -1) {
                                addItemsBtn.classList.add("active")
                            }
                            addItemsBtn.href = "add-item.html"
                            navMobile.classList.add("userStock")
                            transferMobile.style.display = "flex"
                            loadRequests(user.email)
                        } else {
                            transferMobile.style.display = "flex"
                            tecnicsMobile.style.display = "none"
                            tecnicsMobile.innerHTML = ""
                            tecnicsMobile.href = ""
                            loadRequests(user.email)
                        }
                    }
                }
            });
        }
    });
}

function loadRequests(actualUser) {
    let q = query(collection(db, "transfers"), where("reciverEmail", "==", `${actualUser}`));
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().status == "Pendente") {
                transferMobile.classList.add("awaiting")
            }
        })
    })
}

loadData()














openCloseNav.onclick = function () {
    navMobile.classList.toggle("active")
}

