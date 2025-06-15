document.addEventListener('DOMContentLoaded', () => {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeCategoryPage();
        }
    }, 100);

    function initializeCategoryPage() {
        const db = firebase.firestore();
        const productGrid = document.querySelector('.product-grid');
        const pageTitle = document.querySelector('.section-title');

        if (!productGrid) {
            console.error("L'élément .product-grid est introuvable.");
            return;
        }

        // Récupérer le nom de la catégorie depuis le nom du fichier HTML
        const path = window.location.pathname;
        const pageFileName = path.substring(path.lastIndexOf('/') + 1);
        const categoryName = pageFileName.replace('.html', ''); // ex: "chaises"

        if (pageTitle) {
            pageTitle.textContent = `Nos ${categoryName}`;
        }

        const displayCategoryProducts = async () => {
            const productsRef = db.collection('produits');
            try {
                const snapshot = await productsRef.where('categorie', '==', categoryName).get();
                let html = '';
                if (snapshot.empty) {
                    html = `<p>Aucun produit trouvé dans la catégorie ${categoryName}.</p>`;
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
                console.error(`Erreur lors de la récupération des produits pour la catégorie ${categoryName}:`, error);
                productGrid.innerHTML = "<p>Impossible de charger les produits.</p>";
            }
        };

        if(categoryName && categoryName !== 'collection'){
             displayCategoryProducts();
        }
    }
}); 