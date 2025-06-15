document.addEventListener('DOMContentLoaded', () => {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializePromotionPage();
        }
    }, 100);

    function initializePromotionPage() {
        const db = firebase.firestore();
        const productGrid = document.querySelector('.product-grid');

        if (!productGrid) {
            console.error("La grille de produits (.product-grid) n'a pas été trouvée sur la page.");
            return;
        }

        const displayAllProducts = async () => {
            productGrid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
            const productsRef = db.collection('produits').where('promotion', '==', true);
            try {
                const snapshot = await productsRef.get();
                let html = '';
                if (snapshot.empty) {
                    html = "<p>Aucun produit trouvé dans la collection.</p>";
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
                                    <p>${product.description}</p>
                                    <div class="product-price">${product.prix} $</div>
                                    <button class="btn add-to-cart">Ajouter au panier</button>
                                </div>
                            </div>
                        `;
                    });
                }
                productGrid.innerHTML = html;
            } catch (error) {
                console.error("Erreur lors de la récupération des produits en promotion :", error);
                productGrid.innerHTML = "<p>Impossible de charger les promotions.</p>";
            }
        };

        displayAllProducts();
    }
}); 