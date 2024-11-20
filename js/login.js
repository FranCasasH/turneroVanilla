import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

document.getElementById('login-form').addEventListener('submit', login);

function login(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login exitoso
      console.log('Login exitoso');
      window.location.href = 'index.html'; // Redirigir a la página principal
    })
    .catch((error) => {
      // Error en el login
      const errorMessage = error.message;
      console.log(errorMessage);
      switch (errorMessage) {
        case 'Firebase: Error (auth/too-many-requests).':
          document.getElementById('error-message').textContent = "Demasiados intentos. Intenta más tarde.";
          break;
          
        case 'Firebase: Error (auth/user-not-found).':
          document.getElementById('error-message').textContent = "El usuario no existe";
          break;
            
        case 'Firebase: Error (auth/wrong-password).':
          document.getElementById('error-message').textContent = "Contraseña incorrecta";
          break;
              
        case 'Firebase: Error (auth/invalid-credential).':
          document.getElementById('error-message').textContent = "Email o contraseña incorrectos";
          break;

        default:
          document.getElementById('error-message').textContent = "Error desconocido. Intenta nuevamente.";
          break;
      }
    });
}