document.addEventListener('DOMContentLoaded', () => {
    // Attendre que firebase-config.js soit chargé et que l'objet firebase soit disponible
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeApp();
        }
    }, 100);

    function initializeApp() {
        const db = firebase.firestore();
        const auth = firebase.auth();

        const navAuthContainer = document.getElementById('nav-auth-container');
        const navAdminContainer = document.getElementById('nav-admin-container');
        const productGrid = document.querySelector('.product-grid');

        // Logique de l'UI globale (header, etc.)
        const navAuthButton = document.getElementById('nav-auth-btn');

        // Gérer l'état de l'authentification et l'affichage des boutons
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Utilisateur connecté
                const userDoc = await db.collection('clients').doc(user.uid).get();
                const prenom = userDoc.exists ? userDoc.data().prenom : user.email;
                
                navAuthContainer.innerHTML = `
                    <span class="welcome-message">Bonjour, ${prenom}</span>
                    <a href="#" class="btn" id="logout-btn">Déconnexion</a>
                `;
                
                const logoutBtn = document.getElementById('logout-btn');
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut();
                });

                // Vérifier si l'utilisateur est un admin
                try {
                    const adminDoc = await db.collection('admin_ids').doc('admin_ids').get();
                    if (adminDoc.exists) {
                        const adminEmails = adminDoc.data().admin_list || [];
                        if (adminEmails.includes(user.email)) {
                            navAdminContainer.style.display = 'list-item';
                        } else {
                            navAdminContainer.style.display = 'none';
                        }
                    } else {
                        console.log("Le document 'admin_ids' n'existe pas.");
                        navAdminContainer.style.display = 'none';
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification du statut admin:", error);
                    navAdminContainer.style.display = 'none';
                }

                navAuthButton.textContent = 'Déconnexion';
                navAuthButton.href = '#';
                navAuthButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        window.location.reload(); // Recharger pour rafraîchir l'état
                    });
                });
            } else {
                // Utilisateur déconnecté
                navAuthContainer.innerHTML = `
                    <a href="login.html" class="btn">Connexion</a>
                `;
                navAdminContainer.style.display = 'none';

                navAuthButton.textContent = 'Connexion';
                navAuthButton.href = 'login.html';
            }
        });

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

        // Charger les produits phares sur la page d'accueil
        const displayFeaturedProducts = async () => {
            const productGrid = document.querySelector('.products .product-grid');
            if (!productGrid) return;
            
            productGrid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

            try {
                const snapshot = await db.collection('produits').limit(4).get();
                let html = '';
                if (snapshot.empty) {
                    html = '<p>Aucun produit phare disponible pour le moment.</p>';
                } else {
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
                                    <p>${product.description || ''}</p>
                                    <div class="product-price">${product.prix} $</div>
                                    <button class="btn add-to-cart">Ajouter au panier</button>
                                </div>
                            </div>
                        `;
                    });
                }
                productGrid.innerHTML = html;
            } catch (error) {
                console.error("Erreur de chargement des produits phares:", error);
                productGrid.innerHTML = '<p>Impossible de charger les produits.</p>';
            }
        };

        // Lancer l'affichage des produits
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            displayFeaturedProducts();
        }
    }
});
