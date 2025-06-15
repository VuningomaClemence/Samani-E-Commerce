// Ce script est destiné à être exécuté avec Node.js pour peupler la base de données Firestore.
// Assurez-vous d'avoir installé 'firebase-admin' via npm : npm install firebase-admin

const admin = require('firebase-admin');

// IMPORTANT : Remplacez par le chemin de votre fichier de clé de service Firebase
// 1. Allez dans la console Firebase -> Paramètres du projet -> Comptes de service
// 2. Cliquez sur "Générer une nouvelle clé privée" et téléchargez le fichier JSON.
// 3. Placez ce fichier dans votre projet (par exemple, à la racine) et mettez à jour le chemin ci-dessous.
// 4. Assurez-vous que ce fichier n'est PAS exposé publiquement (ajoutez-le à votre .gitignore).
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const produits = [
    // Chaises
    { nomProduit: "Chaise en Tissu Rembourrée", description: "Une chaise confortable pour votre salle à manger.", quantite: 50, prix: 300, categorie: "chaises", image: "https://cdn.webshopapp.com/shops/263771/files/392315824/by-boo-moderne-eetkamerstoel-grijs-stof-armleuning.jpg", pointsFidelite: 30 },
    { nomProduit: "Chaise scandinave", description: "Design épuré et confort nordique.", quantite: 40, prix: 250, categorie: "chaises", image: "https://www.mobiliernitro.com/wp-content/uploads/2020/03/chaise-patchwork-tissu-scandinave-inspiration-eames-dsw-768x768.jpg", pointsFidelite: 25 },

    // Canapés
    { nomProduit: "Canapé d'angle Scandinave", description: "Grand et élégant, parfait pour les grands salons.", quantite: 15, prix: 950, categorie: "canape", image: "https://tse4.mm.bing.net/th/id/OIP.iIx3kS1uGeQAzFepGHbjJQHaFj?r=0&w=735&h=551&rs=1&pid=ImgDetMain", pointsFidelite: 95 },
    { nomProduit: "Canapé 3 places en velours", description: "Luxe et confort avec ce canapé en velours.", quantite: 20, prix: 800, categorie: "canape", image: "https://product-images.habitat.fr/3-seater-velvet-sofa-bleu-canard-h-84-x-w-212-x-d-87-cm-717616-20201021101934_1200x1200.jpg", pointsFidelite: 80 },

    // Tables
    { nomProduit: "Table d'appoint Scandinave", description: "Petite et pratique, idéale à côté d'un canapé.", quantite: 30, prix: 200, categorie: "table", image: "https://tse4.mm.bing.net/th/id/OIP.Rw7sFaIOY5O0-C6yQ46lCQHaHa?r=0&w=1920&h=1920&rs=1&pid=ImgDetMain", pointsFidelite: 20 },
    { nomProduit: "Table à manger extensible", description: "Accueillez tous vos amis avec cette table extensible.", quantite: 10, prix: 1200, categorie: "table", image: "https://www.inside75.com/contents/refim/-c/console-extensible-stef-blanche-pietement-verre_4.jpg", pointsFidelite: 120 },

    // Armoires
    { nomProduit: "Armoire Vintage", description: "Donnez un cachet unique à votre chambre.", quantite: 12, prix: 750, categorie: "armoire", image: "https://i.pinimg.com/originals/5c/95/95/5c959539106dd00938347a51f7da6399.jpg", pointsFidelite: 75 },
    { nomProduit: "Dressing moderne", description: "Organisez vos vêtements avec style.", quantite: 8, prix: 1500, categorie: "armoire", image: "https://tse2.mm.bing.net/th/id/OIP.jpUCVJu4i6o_Lee4kz4HewHaIl?r=0&rs=1&pid=ImgDetMain", pointsFidelite: 150 },
];

const seedDatabase = async () => {
  const productsCollection = db.collection('produits');
  console.log('Début du peuplement de la base de données...');

  for (const produit of produits) {
    try {
      await productsCollection.add(produit);
      console.log(`Produit ajouté : ${produit.nomProduit}`);
    } catch (error) {
      console.error(`Erreur lors de l'ajout du produit ${produit.nomProduit}: `, error);
    }
  }

  console.log('Peuplement de la base de données terminé.');
};

seedDatabase().then(() => {
  process.exit(0);
}); 