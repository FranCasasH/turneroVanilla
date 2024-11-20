import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

document.getElementById('turno-form').addEventListener('submit', agendarTurno);
document.getElementById('fecha').addEventListener('change', cargarDoctores);
document.getElementById('doctor').addEventListener('change', cargarHorarios);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, load available doctors
    cargarDoctores();
    verificarYAgregarDoctores();
  } else {
    // No user is signed in, redirect to login
    window.location.href = 'login.html';
  }
});

function cargarDoctores() {
  const fecha = document.getElementById('fecha').value;
  const diaSemana = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

  const doctorSelect = document.getElementById('doctor');
  doctorSelect.innerHTML = '<option value="">Seleccione un doctor</option>';

  const q = query(collection(db, "doctores"), where(`horarios.${diaSemana}`, "!=", null));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const doctor = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = `${doctor.nombre} (${doctor.especialidad})`;
      doctorSelect.appendChild(option);
    });
  }).catch((error) => {
    console.error("Error getting documents: ", error);
  });
}

function cargarHorarios() {
  const doctorId = document.getElementById('doctor').value;
  const fecha = document.getElementById('fecha').value;
  const diaSemana = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

  const horaSelect = document.getElementById('hora');
  horaSelect.innerHTML = '<option value="">Seleccione una hora</option>';

  if (doctorId) {
    const doctorDocRef = doc(db, "doctores", doctorId);
    getDoc(doctorDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const doctor = docSnap.data();
        const horarios = doctor.horarios[diaSemana] || [];
        horarios.forEach((hora) => {
          const option = document.createElement('option');
          option.value = hora;
          option.textContent = hora;
          horaSelect.appendChild(option);
        });
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });
  }
}

function agendarTurno(e) {
  e.preventDefault();

  const user = auth.currentUser;
  if (user) {
    const doctorId = document.getElementById('doctor').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const q = query(collection(db, "turnos"), where("doctorId", "==", doctorId), where("fecha", "==", fecha), where("hora", "==", hora), where("estado", "==", "pendiente"));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        // No hay turnos en el mismo horario, se puede agendar
        addDoc(collection(db, "turnos"), {
          userId: user.uid,
          doctorId: doctorId,
          fecha: fecha,
          hora: hora,
          estado: "pendiente"
        }).then(() => {
          console.log("Turno agendado");
          window.location.href = 'perfil.html';
        }).catch((error) => {
          console.error("Error agendando turno: ", error);
          document.getElementById('error-message').textContent = error.message;
        });
      } else {
        // Ya hay un turno en el mismo horario
        document.getElementById('error-message').textContent = "El horario seleccionado ya está ocupado.";
      }
    }).catch((error) => {
      console.error("Error verificando turnos: ", error);
    });
  }
}

async function verificarYAgregarDoctores() {
  const docRef = doc(db, "config", "doctoresAgregados");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // Agregar doctores si no se han agregado antes
    await agregarDoctor("Andres Rodriguez", "Cardiología", generarHorariosAleatorios());
    await agregarDoctor("Jano Chiambretto", "Dermatología", generarHorariosAleatorios());
    await agregarDoctor("Roman Castro", "Neurología", generarHorariosAleatorios());

    // Marcar como agregados
    await setDoc(docRef, { agregados: true });
  }
}

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