document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountSpan = document.querySelector(".cart-count");

  function updateCartCount() {
    if (cartCountSpan)
      cartCountSpan.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  }

  function saveCart(newCart) {
    localStorage.setItem("cart", JSON.stringify(newCart));
    cart = newCart;
    updateCartCount();
  }

  function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsDiv = document.getElementById("cart-items");
    const cartTotalDiv = document.getElementById("cart-total");
    cartItemsDiv.innerHTML = "";
    let total = 0;

    if (cartItems.length === 0) {
      cartItemsDiv.innerHTML = "<p>Votre panier est vide.</p>";
      cartTotalDiv.innerHTML = "";
      return;
    }

    cartItems.forEach((item, idx) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      cartItemsDiv.innerHTML += `
        <div class="product-card">
          <div class="product-image">
            <img src="${
              item.image || "https://via.placeholder.com/100x100"
            }" alt="${item.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${item.name}</h3>
            <div class="product-price">${item.price.toFixed(2)} $</div>
            <div style="display:flex;align-items:center;gap:10px;">
              <button class="qty-btn" data-idx="${idx}" data-action="decrement">-</button>
              <span>Quantité : <span class="qty-value">${item.qty}</span></span>
              <button class="qty-btn" data-idx="${idx}" data-action="increment">+</button>
            </div>
            <div>Sous-total : <span class="item-total">${itemTotal.toFixed(
              2
            )} $</span></div>
            <div style="margin-top:10px;display:flex;gap:10px;">
              <button class="btn btn-primary validate-btn" data-idx="${idx}">Valider</button>
              <button class="btn btn-secondary remove-btn" data-idx="${idx}">Annuler</button>
            </div>
          </div>
        </div>
      `;
    });

    cartTotalDiv.innerHTML = `<strong>Total à payer: ${total.toFixed(
      2
    )} $</strong>`;

    // Boutons quantité
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        const action = this.getAttribute("data-action");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (action === "increment") {
          cart[idx].qty += 1;
        } else if (action === "decrement" && cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        }
        saveCart(cart);
        displayCart();
      });
    });

    // Bouton annuler (supprimer le produit)
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(idx, 1);
        saveCart(cart);
        displayCart();
      });
    });

    // Bouton valider (valider ce produit)
    document.querySelectorAll(".validate-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        showNotification(
          "Merci pour votre commande du produit : " + cart[idx].name,
          "success"
        );
        cart.splice(idx, 1); // Retire le produit validé du panier
        saveCart(cart);
        displayCart();
      });
    });
  }

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((item) => item.name === product.name);
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    showNotification("Produit ajouté au panier !", "success");
  }

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".product-card");
      const name = card.querySelector(".product-title").textContent;
      const price = parseFloat(
        card.querySelector(".product-price").textContent.replace(/[^0-9.]/g, "")
      );
      const image = card.querySelector("img")
        ? card.querySelector("img").src
        : "";
      addToCart({ name, price, image });
    });
  });

  // Affichage du panier sur panier.html
  if (window.location.pathname.includes("panier.html")) {
    displayCart();

    // Bouton annuler la commande
    const checkoutBtn = document.getElementById("checkout-btn");
    let cancelBtn = document.getElementById("cancel-btn");
    if (!cancelBtn) {
      cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Annuler la commande";
      cancelBtn.className = "btn btn-secondary";
      cancelBtn.id = "cancel-btn";
      cancelBtn.style.marginLeft = "10px";
      checkoutBtn.after(cancelBtn);
    }

    cancelBtn.addEventListener("click", function () {
      localStorage.removeItem("cart");
      displayCart();
      updateCartCount();
    });

    checkoutBtn.addEventListener("click", function () {
      showNotification("Merci pour votre commande !", "success");
      localStorage.removeItem("cart");
      displayCart();
      updateCartCount();
    });
  }

  updateCartCount();

  // Mise en surbrillance du lien actif
  const links = document.querySelectorAll("a");
  const currentPath = window.location.pathname;
  links.forEach((link) => {
    if (link.getAttribute("href") === currentPath.split("/").pop()) {
      link.classList.add("active");
    }
  });
});

// Affiche une notification moderne en haut à droite
function showNotification(message, type = "success") {
  let notif = document.createElement("div");
  notif.className = `custom-notif ${type}`;
  notif.textContent = message;
  notif.style.position = "fixed";
  notif.style.top = "30px";
  notif.style.right = "30px";
  notif.style.background = type === "success" ? "#27ae60" : "#e74c3c";
  notif.style.color = "#fff";
  notif.style.padding = "14px 24px";
  notif.style.borderRadius = "8px";
  notif.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  notif.style.zIndex = 9999;
  notif.style.fontSize = "1rem";
  notif.style.opacity = "0.95";
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, 2200);
}

document.querySelectorAll("a").forEach((link) => {
  if (
    link.href.split("/").pop() === window.location.pathname.split("/").pop()
  ) {
    link.classList.add("active");
  }
});
