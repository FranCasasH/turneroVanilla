import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3KTxYarpyN106t5-aEeR8T7lN4IuzHXA",
  authDomain: "turnero-d8808.firebaseapp.com",
  projectId: "turnero-d8808",
  storageBucket: "turnero-d8808.firebasestorage.app",
  messagingSenderId: "433904031433",
  appId: "1:433904031433:web:d746063fa2cba51f04df18",
  measurementId: "G-9LJ4YLXYN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('perfil-form').addEventListener('submit', saveProfile);
document.getElementById('agendar-turno').addEventListener('click', () => {
  window.location.href = 'index.html';
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, get user profile
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById('nombre').value = userData.nombre || '';
        document.getElementById('apellido').value = userData.apellido || '';
        document.getElementById('edad').value = userData.edad || '';
        loadTurnos(user.uid);
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });
  } else {
    // No user is signed in, redirect to login
    window.location.href = 'login.html';
  }
});

function saveProfile(e) {
  e.preventDefault();

  const user = auth.currentUser;
  if (user) {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('edad').value;

    const userDocRef = doc(db, "users", user.uid);
    setDoc(userDocRef, {
      nombre: nombre,
      apellido: apellido,
      edad: edad
    }).then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
      document.getElementById('error-message').textContent = error.message;
    });
  }
}

function loadTurnos(userId) {
  const turnosList = document.getElementById('turnos-list');
  turnosList.innerHTML = '';

  const q = query(collection(db, "turnos"), where("userId", "==", userId));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const turno = doc.data();
      const div = document.createElement('div');
      div.innerHTML = `
        <p>${turno.doctor}</p>
        <p>${turno.especialidad}</p>
        <p>${turno.fecha}</p>
        <p>${turno.hora}</p>
        <p>${turno.estado}</p>
        <button onclick="cancelarTurno('${doc.id}')">Cancelar Turno</button>
      `;
      turnosList.appendChild(div);
    });
  }).catch((error) => {
    console.error("Error getting documents: ", error);
  });
}

window.cancelarTurno = function(turnoId) {
  const turnoDocRef = doc(db, "turnos", turnoId);
  updateDoc(turnoDocRef, {
    estado: "cancelado"
  }).then(() => {
    console.log("Turno cancelado");
    loadTurnos(auth.currentUser.uid);
  }).catch((error) => {
    console.error("Error cancelando turno: ", error);
  });
}