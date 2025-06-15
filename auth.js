document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Formulaire d'inscription
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nom = signupForm['signup-nom'].value;
            const prenom = signupForm['signup-prenom'].value;
            const email = signupForm['signup-email'].value;
            const password = signupForm['signup-password'].value;
            const telephone = signupForm['signup-telephone'].value;
            const adresse = signupForm['signup-adresse'].value;
            const signupError = document.getElementById('signup-error');

            auth.createUserWithEmailAndPassword(email, password)
                .then(cred => {
                    // Utilisateur créé dans Auth, maintenant on sauvegarde les infos dans Firestore
                    return db.collection('clients').doc(cred.user.uid).set({
                        nom: nom,
                        prenom: prenom,
                        email: email,
                        telephone: telephone,
                        adresseLivraison: adresse
                    });
                })
                .then(() => {
                    // Redirection vers la page d'accueil après inscription réussie
                    window.location.href = 'index.html';
                })
                .catch(err => {
                    console.error("Erreur d'inscription :", err);
                    signupError.textContent = err.message;
                });
        });
    }

    // Formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;
            const loginError = document.getElementById('login-error');

            auth.signInWithEmailAndPassword(email, password)
                .then(cred => {
                    // Redirection vers la page d'accueil après connexion réussie
                    window.location.href = 'index.html';
                })
                .catch(err => {
                    console.error("Erreur de connexion :", err);
                    loginError.textContent = "Email ou mot de passe incorrect.";
                });
        });
    }
}); 