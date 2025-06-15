// Ce fichier gère la logique du panier d'achat

document.addEventListener('DOMContentLoaded', () => {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeCart();
        }
    }, 100);
});

function initializeCart() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Fonction pour ajouter un produit au panier
    async function addToCart(productId, productData) {
        const user = auth.currentUser;
        if (user) {
            // Utilisateur connecté : ajouter au panier Firestore
            const cartRef = db.collection('clients').doc(user.uid).collection('panier').doc(productId);
            const doc = await cartRef.get();
            if (doc.exists) {
                // Le produit est déjà dans le panier, incrémenter la quantité
                await cartRef.update({ quantite: firebase.firestore.FieldValue.increment(1) });
            } else {
                // Nouveau produit dans le panier
                await cartRef.set({ ...productData, quantite: 1, addedAt: new Date() });
            }
            showNotification('Produit ajouté au panier !');
        } else {
            // Utilisateur non connecté : utiliser localStorage
            let localCart = JSON.parse(localStorage.getItem('panier')) || {};
            if (localCart[productId]) {
                localCart[productId].quantite++;
            } else {
                localCart[productId] = { ...productData, quantite: 1 };
            }
            localStorage.setItem('panier', JSON.stringify(localCart));
            showNotification('Produit ajouté au panier !');
        }
        updateCartCount();
    }

    // Mettre à jour le compteur du panier dans la nav
    async function updateCartCount() {
        const user = auth.currentUser;
        const cartCountSpan = document.querySelector('.cart-count');
        if (!cartCountSpan) return;

        let totalItems = 0;
        if (user) {
            const snapshot = await db.collection('clients').doc(user.uid).collection('panier').get();
            snapshot.forEach(doc => {
                totalItems += doc.data().quantite;
            });
        } else {
            const localCart = JSON.parse(localStorage.getItem('panier')) || {};
            totalItems = Object.values(localCart).reduce((sum, item) => sum + item.quantite, 0);
        }
        cartCountSpan.textContent = totalItems;
    }
    
    // Attacher l'événement 'click' aux boutons "Ajouter au panier"
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            
            // On a besoin des infos du produit. Idéalement, elles sont déjà chargées.
            // Pour simplifier, on va les chercher à nouveau dans la DB.
            const productDoc = await db.collection('produits').doc(productId).get();
            if(productDoc.exists){
                const productData = {
                    nomProduit: productDoc.data().nomProduit,
                    prix: productDoc.data().prix,
                    image: productDoc.data().image
                };
                addToCart(productId, productData);
            } else {
                console.error("Produit non trouvé !");
            }
        }
    });

    // Mettre à jour le compteur au chargement de la page
    auth.onAuthStateChanged(() => {
        updateCartCount();
        // Logique de fusion du panier local vers Firestore lors de la connexion
        // (à implémenter)
    });
}

// Fonction utilitaire pour les notifications
function showNotification(message, type = 'success') {
    let notif = document.createElement('div');
    notif.className = `custom-notif ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
} 