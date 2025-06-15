document.addEventListener('DOMContentLoaded', () => {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeCartPage();
        }
    }, 100);
});

function initializeCartPage() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const cartContent = document.getElementById('cart-content');

    auth.onAuthStateChanged(user => {
        if (user) {
            // Écouter les mises à jour en temps réel du panier
            db.collection('clients').doc(user.uid).collection('panier')
              .onSnapshot(snapshot => {
                  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                  renderCart(items, user.uid);
              }, error => {
                  console.error("Erreur lors de l'écoute du panier:", error);
                  cartContent.innerHTML = "<p>Impossible d'afficher le panier pour le moment.</p>";
              });
        } else {
            // Si l'utilisateur n'est pas connecté, afficher un message l'invitant à se connecter
            renderCart([], null);
        }
    });

    function renderCart(items, userId) {
        if (!userId) {
            cartContent.innerHTML = `
                <div class="empty-cart-message">
                    <h2>Connectez-vous pour voir votre panier</h2>
                    <a href="login.html" class="btn btn-primary">Se connecter</a>
                </div>`;
            return;
        }

        if (items.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart-message">
                    <h2>Votre panier est vide.</h2>
                    <a href="collection.html" class="btn btn-primary">Découvrir nos produits</a>
                </div>`;
            return;
        }

        let itemsHtml = '';
        let subtotal = 0;

        items.forEach(item => {
            const itemTotal = item.prix * item.quantite;
            subtotal += itemTotal;
            itemsHtml += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.nomProduit}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.nomProduit}</h3>
                        <p>${item.prix.toFixed(2)} $</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" title="Diminuer la quantité">-</button>
                        <input type="number" value="${item.quantite}" min="1" class="quantity-input" readonly>
                        <button class="quantity-btn increase-quantity" title="Augmenter la quantité">+</button>
                    </div>
                    <p class="cart-item-total">${itemTotal.toFixed(2)} $</p>
                    <button class="remove-item-btn" title="Supprimer l'article">&times;</button>
                </div>
            `;
        });

        const cartGridHtml = `
            <div class="cart-grid">
                <div class="cart-items-list">
                    ${itemsHtml}
                </div>
                <div class="cart-summary">
                    <h2>Résumé</h2>
                    <div class="summary-row">
                        <span>Sous-total</span>
                        <span>${subtotal.toFixed(2)} $</span>
                    </div>
                    <div class="summary-row">
                        <span>Livraison</span>
                        <span>Gratuite</span>
                    </div>
                    <hr>
                    <div class="summary-row total-row">
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)} $</span>
                    </div>
                    <button class="btn btn-primary checkout-btn">Passer la commande</button>
                </div>
            </div>
        `;
        cartContent.innerHTML = cartGridHtml;
    }

    // Gestion des événements pour les boutons du panier
    cartContent.addEventListener('click', async (e) => {
        const user = auth.currentUser;
        if (!user) return;

        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) {
             if (target.classList.contains('checkout-btn')) {
                // Logique pour passer la commande
                console.log("Passer la commande !");
                // (à implémenter)
            }
            return;
        }
        
        const productId = cartItem.dataset.id;
        const itemRef = db.collection('clients').doc(user.uid).collection('panier').doc(productId);

        if (target.classList.contains('increase-quantity')) {
            await itemRef.update({ quantite: firebase.firestore.FieldValue.increment(1) });
        }
        
        if (target.classList.contains('decrease-quantity')) {
            const doc = await itemRef.get();
            if (doc.exists && doc.data().quantite > 1) {
                await itemRef.update({ quantite: firebase.firestore.FieldValue.increment(-1) });
            }
        }

        if (target.classList.contains('remove-item-btn')) {
            await itemRef.delete();
        }
    });
} 