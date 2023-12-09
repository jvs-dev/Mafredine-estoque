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
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
let transfer = document.getElementById("transfer")
let acceptUser = document.getElementById("acceptUser")
let addItem = document.getElementById("addItem")
let searchInput = document.getElementById("searchInput")
let actualUserName = ""
let actualUserEmail = ""
let actualUserWork = ""


function loadData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            let unsub = onSnapshot(doc(db, `users`, `${user.email}`), (doc) => {
                actualUserEmail = user.email
                actualUserName = doc.data().fullName
                actualUserWork = doc.data().work
                if (doc.data().admin == true) {
                    transfer.style.display = "none"
                    acceptUser.style.display = "flex"
                    addItem.style.display = "flex"
                } else {
                    if (doc.data().work == "Estoquista") {
                        transfer.style.display = "flex"
                        acceptUser.style.display = "none"
                        addItem.style.display = "flex"    
                    }
                    if (doc.data().work == "Técnico") {
                        transfer.style.display = "flex"
                        acceptUser.style.display = "none"
                        addItem.style.display = "none"    
                    }
                }
            });
        }
    });
}


searchInput.addEventListener("input", (evt) => {
    let stockSection = document.getElementById("stockSection")
    if (evt.target.value != "") {
        stockSection.innerHTML = ""
        let i = 0
        let q = query(collection(db, "items"), where("active", "==", true));
        let unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().itemName.toLocaleLowerCase().includes(evt.target.value.toLocaleLowerCase())) {
                    let stockSection = document.getElementById("stockSection")
                    let article = document.createElement("article")
                    stockSection.insertAdjacentElement("beforeend", article)
                    article.classList.add("card__stock")
                    if (Number(doc.data().inStock) + doc.data().withTecnics < Number(doc.data().quantyMin) + 1) {
                        article.classList.add("lowStock")
                    }
                    article.innerHTML = `
                        <img src="${doc.data().itemImg}" alt="" class="card__img">
                        <div class="card__div--1">
                            <h2 class="card__h2">${doc.data().itemName}</h2>
                            <div class="card__div--2">
                                <span class="card__span">Em estoque: ${Number(doc.data().inStock)}</span>
                                <span class="card__span">Com técnicos: ${doc.data().withTecnics}</span>
                                <span class="card__span">Total: ${Number(doc.data().inStock) + doc.data().withTecnics}</span>
                            </div>
                        </div>`
                    article.onclick = function () {
                        if (actualUserWork != "Técnico") {
                            window.location = "?id=" + doc.id;   
                        }
                    }
                    switch (i) {
                        case 1:
                            i = 0
                            break;
                        default:
                            i = 1
                            break;
                    }
                }
            });
        });
    } else {
        stockSection.innerHTML = ""
        loadItems()
    }
})





async function loadItems() {
    let i = 0
    let q = query(collection(db, "items"), where("active", "==", true));
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let stockSection = document.getElementById("stockSection")
            let article = document.createElement("article")
            stockSection.insertAdjacentElement("beforeend", article)
            article.classList.add("card__stock")
            if (Number(doc.data().inStock) + doc.data().withTecnics < Number(doc.data().quantyMin) + 1) {
                article.classList.add("lowStock")
                article.style.order = "-1"
            }
            article.innerHTML = `
                <img src="${doc.data().itemImg}" alt="" class="card__img">
                <div class="card__div--1">
                    <h2 class="card__h2">${doc.data().itemName}</h2>
                    <div class="card__div--2">
                        <span class="card__span">Em estoque: ${Number(doc.data().inStock)} ${doc.data().measure}.</span>
                        <span class="card__span">Com técnicos: ${doc.data().withTecnics} ${doc.data().measure}.</span>
                        <span class="card__span">Total: ${Number(doc.data().inStock) + doc.data().withTecnics} ${doc.data().measure}.</span>
                    </div>
                </div>`
            article.onclick = function () {
                if (actualUserWork != "Técnico") {
                    window.location = "?id=" + doc.id;   
                }
            }
            switch (i) {
                case 1:
                    i = 0
                    break;
                default:
                    i = 1
                    break;
            }
        });
        disable()
    });

}

let q = query(collection(db, "items"), where("active", "==", true));
let unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            let stockSection = document.getElementById("stockSection")
            stockSection.innerHTML = ""
            loadData()
        }
        if (change.type === "removed") {
            let stockSection = document.getElementById("stockSection")
            stockSection.innerHTML = ""
            loadData()
        }
        if (change.type === "added") {
            let stockSection = document.getElementById("stockSection")
            stockSection.innerHTML = ""
            loadData()
        }
    });
});


function disable() {
    setTimeout(() => {
        let offline_window = document.getElementById("main__offline")
        offline_window.style.transition = "0.5s"
        offline_window.style.opacity = "0"
        setTimeout(() => {
            offline_window.style.display = "none"
        }, 500);
    }, 1000);
}


loadData()
loadItems()



