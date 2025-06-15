document.addEventListener('DOMContentLoaded', () => {
    // Attendre que firebase-config.js soit chargé et que l'objet firebase soit disponible
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeApp();
        }
    }, 100);

    function initializeApp() {
        const auth = firebase.auth();
        const db = firebase.firestore();

        const authContainer = document.getElementById('auth-container');
        const productGrid = document.querySelector('.product-grid');

        // --- AUTHENTICATION ---
        auth.onAuthStateChanged(user => {
            renderUI(user);
        });

        async function renderUI(user) {
            if (user) {
                // Utilisateur connecté
                const userDoc = await db.collection('clients').doc(user.uid).get();
                const prenom = userDoc.exists ? userDoc.data().prenom : user.email;
                
                authContainer.innerHTML = `
                    <span class="welcome-message">Bonjour, ${prenom}</span>
                    <button id="logout-btn" class="btn">Déconnexion</button>
                `;
                
                document.getElementById('logout-btn').addEventListener('click', () => {
                    auth.signOut().then(() => {
                        console.log('Utilisateur déconnecté');
                    });
                });
            } else {
                // Utilisateur déconnecté
                authContainer.innerHTML = `
                    <a href="login.html" class="btn">Connexion</a>
                `;
            }
        }

        // --- PRODUCT DISPLAY ---
        const displayProducts = async () => {
            if (!productGrid) {
                return; // Ne rien faire si la grille de produits n'est pas sur la page
            }

            const productsRef = db.collection('produits');
            try {
                // Limiter le nombre de produits sur la page d'accueil
                const snapshot = await productsRef.limit(4).get(); 
                let html = '';
                snapshot.forEach(doc => {
                    const product = doc.data();
                    const productId = doc.id;
                    html += `
                        <div class="product-card" data-id="${productId}">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.nomProduit}">
                            </div>
                            <div class="product-info">
                                <h3 class="product-title">${product.nomProduit}</h3>
                                <div class="product-price">${product.prix} $</div>
                                <button class="btn add-to-cart">Ajouter au panier</button>
                            </div>
                        </div>
                    `;
                });
                productGrid.innerHTML = html;
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
                productGrid.innerHTML = "<p>Impossible de charger les produits pour le moment.</p>";
            }
        };

        // Lancer l'affichage des produits
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            displayProducts();
        }
    }
});
