import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app);

async function agregarDoctor(nombre, especialidad, horarios) {
  try {
    const docRef = await addDoc(collection(db, "doctores"), {
      nombre: nombre,
      especialidad: especialidad,
      horarios: horarios
    });
    console.log("Doctor agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error agregando doctor: ", e);
  }
}

function generarHorariosAleatorios() {
  const dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const horarios = {};

  dias.forEach(dia => {
    const horas = [];
    const numHoras = Math.floor(Math.random() * 5) + 1; // Genera entre 1 y 5 horarios
    for (let i = 0; i < numHoras; i++) {
      const hora = `${Math.floor(Math.random() * 8) + 9}:00`; // Genera horas entre 9:00 y 16:00
      horas.push(hora);
    }
    horarios[dia] = horas;
  });

  return horarios;
}

// Agregar doctores
agregarDoctor("Andres Rodriguez", "Cardiología", generarHorariosAleatorios());
agregarDoctor("Jano Chiambretto", "Dermatología", generarHorariosAleatorios());
agregarDoctor("Roman Castro", "Neurología", generarHorariosAleatorios());