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
        }
        cartCountSpan.textContent = totalItems;
    }
    
    // Attacher l'événement 'click' aux boutons "Ajouter au panier"
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const user = auth.currentUser;

            if (!user) {
                showNotification("Veuillez vous connecter pour ajouter des articles.", "error");
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            const productId = productCard.dataset.id;
            
            try {
                const productDoc = await db.collection('produits').doc(productId).get();
                if (productDoc.exists) {
                    const productData = {
                        nomProduit: productDoc.data().nomProduit,
                        prix: productDoc.data().prix,
                        image: productDoc.data().image
                    };

                    const cartRef = db.collection('clients').doc(user.uid).collection('panier').doc(productId);
                    const doc = await cartRef.get();
                    
                    if (doc.exists) {
                        await cartRef.update({ quantite: firebase.firestore.FieldValue.increment(1) });
                    } else {
                        await cartRef.set({ ...productData, quantite: 1, addedAt: new Date() });
                    }
                    showNotification('Produit ajouté au panier !');
                    updateCartCount();
                } else {
                    showNotification("Produit non trouvé !", "error");
                }
            } catch (error) {
                console.error("Erreur lors de l'ajout au panier:", error);
                showNotification("Une erreur s'est produite.", "error");
            }
        }
    });

    // Mettre à jour le compteur au chargement de la page et lors d'un changement d'état de connexion
    auth.onAuthStateChanged(() => {
        updateCartCount();
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