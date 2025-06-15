// Remplacez ce qui suit par la configuration de votre propre projet Firebase
// Allez sur la console Firebase (https://console.firebase.google.com/)
// Créez un nouveau projet, puis allez dans les paramètres du projet > Général
// Sous "Vos applications", cliquez sur l'icône web (</>) pour enregistrer une nouvelle application web.
// Copiez l'objet de configuration ci-dessous.

const firebaseConfig = {
  apiKey: "AIzaSyANWd0Vvfmddzg7CyOXJfa3wbRO5ML789Q",
  authDomain: "samani-452ad.firebaseapp.com",
  projectId: "samani-452ad",
  storageBucket: "samani-452ad.firebasestorage.app",
  messagingSenderId: "9036667315",
  appId: "1:9036667315:web:dbf70c120219594bab53c6"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth(); 