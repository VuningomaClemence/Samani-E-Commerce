document.addEventListener('DOMContentLoaded', () => {
    // On attend que Firebase soit initialisé
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.app) {
            clearInterval(checkFirebase);
            initializeAppAdmin();
        }
    }, 100);

    function initializeAppAdmin() {
        const db = firebase.firestore();
        const addProductForm = document.getElementById('add-product-form');
        const adminMessage = document.getElementById('admin-message');
        const submitBtn = document.getElementById('add-product-btn');

        if (addProductForm) {
            addProductForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                setLoading(true);

                // Récupérer les valeurs du formulaire
                const nomProduit = document.getElementById('nomProduit').value;
                const description = document.getElementById('description').value;
                const prix = parseFloat(document.getElementById('prix').value);
                const quantite = parseInt(document.getElementById('quantite').value, 10);
                const categorie = document.getElementById('categorie').value;
                const image = document.getElementById('image').value;
                const pointsFidelite = parseInt(document.getElementById('pointsFidelite').value, 10);
                const promotion = document.getElementById('promotion').checked;

                // Valider les données
                if (!nomProduit || !description || isNaN(prix) || isNaN(quantite) || !categorie || !image) {
                    showMessage('Veuillez remplir tous les champs correctement.', 'error');
                    setLoading(false);
                    return;
                }

                try {
                    // Ajouter le produit à la collection 'produits'
                    await db.collection('produits').add({
                        nomProduit,
                        description,
                        prix,
                        quantite,
                        categorie,
                        image,
                        pointsFidelite,
                        promotion,
                        dateAjout: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    // Afficher un message de succès et vider le formulaire
                    showMessage('Produit ajouté avec succès !', 'success');
                    addProductForm.reset();

                } catch (error) {
                    console.error("Erreur lors de l'ajout du produit:", error);
                    showMessage(`Erreur: ${error.message}`, 'error');
                } finally {
                    setLoading(false);
                }
            });
        }

        function setLoading(isLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
            } else {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }

        function showMessage(message, type) {
            adminMessage.textContent = message;
            adminMessage.className = type; // 'success' ou 'error'
            adminMessage.style.display = 'block';

            setTimeout(() => {
                adminMessage.style.display = 'none';
            }, 5000);
        }
    }
}); 