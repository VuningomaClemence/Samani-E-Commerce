document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const signupForm = document.getElementById('signup-form');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');

    // Fonction pour gérer l'état de chargement des boutons
    const setLoading = (button, isLoading) => {
        if (button) {
            button.disabled = isLoading;
            if (isLoading) {
                button.classList.add('loading');
            } else {
                button.classList.remove('loading');
            }
        }
    };

    // Formulaire d'inscription
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            setLoading(signupBtn, true);
            
            const nom = signupForm['signup-nom'].value;
            const prenom = signupForm['signup-prenom'].value;
            const email = signupForm['signup-email'].value;
            const password = signupForm['signup-password'].value;
            const telephone = signupForm['signup-telephone'].value;
            const adresse = signupForm['signup-adresse'].value;
            const signupError = document.getElementById('signup-error');
            signupError.textContent = '';

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
                })
                .finally(() => {
                    setLoading(signupBtn, false);
                });
        });
    }

    // Formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            setLoading(loginBtn, true);

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;
            const loginError = document.getElementById('login-error');
            loginError.textContent = '';

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    // Redirection vers la page d'accueil après connexion réussie
                    window.location.href = 'index.html';
                })
                .catch(err => {
                    console.error("Erreur de connexion :", err);
                    loginError.textContent = "Email ou mot de passe incorrect.";
                })
                .finally(() => {
                    setLoading(loginBtn, false);
                });
        });
    }
}); 