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

    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMsg = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');

    let cartItems = {}; // Pour garder une trace des articles affichés

    auth.onAuthStateChanged(user => {
        if (user) {
            // Écouter les changements en temps réel du panier Firestore
            db.collection('clients').doc(user.uid).collection('panier')
              .onSnapshot(snapshot => {
                  cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                  renderCart(cartItems, user.uid);
              });
        } else {
            // Afficher le panier depuis localStorage
            const localCart = JSON.parse(localStorage.getItem('panier')) || {};
            cartItems = Object.keys(localCart).map(id => ({ id, ...localCart[id] }));
            renderCart(cartItems, null);
        }
    });

    function renderCart(items, userId) {
        if (items.length === 0) {
            cartContainer.innerHTML = '';
            cartSummary.style.display = 'none';
            emptyCartMsg.style.display = 'block';
            return;
        }

        cartSummary.style.display = 'block';
        emptyCartMsg.style.display = 'none';
        
        let html = '';
        let total = 0;

        items.forEach(item => {
            const itemTotal = item.prix * item.quantite;
            total += itemTotal;
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.nomProduit}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.nomProduit}</h4>
                        <p>${item.prix.toFixed(2)} $</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-action="decrement">-</button>
                        <span>${item.quantite}</span>
                        <button class="qty-btn" data-action="increment">+</button>
                    </div>
                    <div class="cart-item-total">${itemTotal.toFixed(2)} $</div>
                    <button class="remove-btn">✖</button>
                </div>
            `;
        });

        cartContainer.innerHTML = html;
        cartTotalEl.textContent = `Total: ${total.toFixed(2)} $`;
    }

    // Gérer les actions dans le panier (quantité, suppression)
    cartContainer.addEventListener('click', async e => {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.dataset.id;
        const user = auth.currentUser;
        
        const cartRef = user ? db.collection('clients').doc(user.uid).collection('panier').doc(productId) : null;

        if (target.classList.contains('remove-btn')) {
            if (user) {
                await cartRef.delete();
            } else {
                let localCart = JSON.parse(localStorage.getItem('panier'));
                delete localCart[productId];
                localStorage.setItem('panier', JSON.stringify(localCart));
                // Re-render
                const updatedItems = Object.keys(localCart).map(id => ({ id, ...localCart[id] }));
                renderCart(updatedItems, null);
            }
        }

        if (target.classList.contains('qty-btn')) {
            const action = target.dataset.action;
            const increment = action === 'increment' ? 1 : -1;
            
            if (user) {
                 await cartRef.update({ quantite: firebase.firestore.FieldValue.increment(increment) });
            } else {
                let localCart = JSON.parse(localStorage.getItem('panier'));
                if (localCart[productId].quantite + increment > 0) {
                    localCart[productId].quantite += increment;
                    localStorage.setItem('panier', JSON.stringify(localCart));
                    const updatedItems = Object.keys(localCart).map(id => ({ id, ...localCart[id] }));
                    renderCart(updatedItems, null);
                }
            }
        }
    });

    // Passer la commande
    checkoutBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Veuillez vous connecter pour passer une commande.");
            window.location.href = 'login.html';
            return;
        }

        if (cartItems.length === 0) {
            alert("Votre panier est vide.");
            return;
        }

        const total = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

        // 1. Créer la commande
        const commandeRef = await db.collection('commandes').add({
            idClient: user.uid,
            dateCommande: new Date(),
            statutCommande: 'En attente',
            montantTotal: total
        });

        // 2. Ajouter les articles à la sous-collection 'items' de la commande
        const batch = db.batch();
        cartItems.forEach(item => {
            const itemRef = commandeRef.collection('items').doc(item.id);
            batch.set(itemRef, {
                nomProduit: item.nomProduit,
                prixUnitaire: item.prix,
                quantite: item.quantite
            });
        });
        await batch.commit();

        // 3. Vider le panier de l'utilisateur
        const cartSnapshot = await db.collection('clients').doc(user.uid).collection('panier').get();
        const deleteBatch = db.batch();
        cartSnapshot.docs.forEach(doc => {
            deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();

        alert(`Merci pour votre commande ! Votre numéro de commande est : ${commandeRef.id}`);
        window.location.href = 'index.html';
    });
} 