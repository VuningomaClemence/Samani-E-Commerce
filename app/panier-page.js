document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const cartContainer = document.getElementById("cart-items-container");
  const cartSummary = document.getElementById("cart-summary");
  const emptyCartMsg = document.getElementById("empty-cart-message");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cartItems = [];

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("clients")
        .doc(user.uid)
        .collection("panier")
        .onSnapshot((snapshot) => {
          cartItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          renderCart(cartItems, user.uid);
        });
    } else {
      cartContainer.innerHTML =
        "<p>Veuillez vous connecter pour voir votre panier.</p>";
      cartSummary.style.display = "none";
      emptyCartMsg.style.display = "none";
      checkoutBtn.style.display = "none";
    }
  });

  function renderCart(items, userId) {
    if (items.length === 0) {
      cartContainer.innerHTML = "";
      cartSummary.style.display = "none";
      emptyCartMsg.style.display = "block";
      return;
    }

    cartSummary.style.display = "block";
    emptyCartMsg.style.display = "none";

    let html = "";
    let total = 0;

    items.forEach((item) => {
      const itemTotal = item.prix * item.quantite;
      total += itemTotal;
      html += `
        <div class="product-card" data-id="${item.id}">
          <div class="product-image">
            <img src="${item.image}" alt="${item.nomProduit}" />
          </div>
          <div class="product-info">
            <h3 class="product-title">${item.nomProduit}</h3>
            <div class="product-price">${item.prix.toFixed(2)} $</div>
            <div style="display:flex;align-items:center;gap:10px;margin:10px 0;">
              <button class="qty-btn" data-action="decrement">-</button>
              <span>Quantité : <span class="qty-value">${
                item.quantite
              }</span></span>
              <button class="qty-btn" data-action="increment">+</button>
            </div>
            <button class="remove-btn btn btn-secondary" style="margin-top:10px;">Retirer</button>
          </div>
        </div>
      `;
    });

    cartContainer.innerHTML = html;

    cartSummary.innerHTML = `<br /><strong>Total: ${total.toFixed(
      2
    )} $</strong>`;
  }

  // Gestion des actions (quantité, suppression)
  cartContainer.addEventListener("click", async (e) => {
    const target = e.target;
    const card = target.closest(".product-card");
    if (!card) return;
    const productId = card.getAttribute("data-id");
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = db
      .collection("clients")
      .doc(user.uid)
      .collection("panier")
      .doc(productId);

    if (target.classList.contains("remove-btn")) {
      await cartRef.delete();
    }

    if (target.classList.contains("qty-btn")) {
      const action = target.dataset.action;
      const increment = action === "increment" ? 1 : -1;
      const item = cartItems.find((it) => it.id === productId);
      if (!item) return;
      const newQty = item.quantite + increment;
      if (newQty > 0) {
        await cartRef.update({ quantite: newQty });
      }
    }
  });

  // Passer la commande
  checkoutBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Veuillez vous connecter pour passer une commande.");
      window.location.href = "login.html";
      return;
    }

    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.prix * item.quantite,
      0
    );

    // 1. Créer la commande
    const commandeRef = await db.collection("commandes").add({
      idClient: user.uid,
      dateCommande: new Date(),
      statutCommande: "En attente",
      montantTotal: total,
    });

    // 2. Ajouter les articles à la sous-collection 'items' de la commande
    const batch = db.batch();
    cartItems.forEach((item) => {
      const itemRef = commandeRef.collection("items").doc(item.id);
      batch.set(itemRef, {
        nomProduit: item.nomProduit,
        prixUnitaire: item.prix,
        quantite: item.quantite,
      });
    });
    await batch.commit();

    // 3. Vider le panier de l'utilisateur
    const cartSnapshot = await db
      .collection("clients")
      .doc(user.uid)
      .collection("panier")
      .get();
    const deleteBatch = db.batch();
    cartSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();

    alert(
      `Merci pour votre commande ! Votre numéro de commande est : ${commandeRef.id}`
    );
    window.location.href = "index.html";
  });
});
