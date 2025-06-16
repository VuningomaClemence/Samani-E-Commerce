# Samani E-commerce - Projet avec Backend Firebase

Ce projet est une version améliorée du site e-commerce Samani, désormais doté d'un backend Firebase pour la gestion des produits, des utilisateurs, et des commandes.

## Étapes pour la mise en place

Suivez attentivement ces étapes pour faire fonctionner le projet en local.

### 1. Création du projet Firebase

1.  Allez sur la [console Firebase](https://console.firebase.google.com/).
2.  Cliquez sur **"Ajouter un projet"** et donnez-lui un nom (ex: "Samani-E-commerce").
3.  Une fois le projet créé, restez sur le tableau de bord.

### 2. Configuration de l'application Web

1.  Sur le tableau de bord de votre projet, cliquez sur l'icône Web **</>** pour "Ajouter une application à votre projet".
2.  Donnez un surnom à votre application (ex: "Samani Web") et cliquez sur **"Enregistrer l'application"**.
3.  Firebase vous fournira un objet de configuration `firebaseConfig`. **Copiez cet objet**.

### 3. Intégration de la configuration dans votre code

1.  Ouvrez le fichier `firebase-config.js` dans votre projet.
2.  Collez l'objet `firebaseConfig` que vous avez copié pour remplacer la configuration existante.
    ```javascript
    const firebaseConfig = {
      apiKey: "VOTRE_API_KEY",
      authDomain: "VOTRE_AUTH_DOMAIN",
      // ... et les autres clés
    };
    ```

### 4. Configuration de l'authentification

1.  Dans la console Firebase, allez dans le menu de gauche et cliquez sur **"Authentication"**.
2.  Cliquez sur **"Commencer"**.
3.  Dans l'onglet **"Méthodes de connexion"**, cliquez sur **"Adresse e-mail/Mot de passe"** et activez-le.

### 5. Configuration de Firestore Database

1.  Dans la console Firebase, allez dans le menu de gauche et cliquez sur **"Firestore Database"**.
2.  Cliquez sur **"Créer une base de données"**.
3.  Choisissez de démarrer en **"mode production"** et cliquez sur "Suivant".
4.  Choisissez l'emplacement de vos données (laissez celui par défaut si vous n'avez pas de préférence).
5.  Cliquez sur **"Activer"**.

#### 5.1. Règles de sécurité Firestore

Pour que l'application puisse lire et écrire des données, vous devez mettre à jour les règles de sécurité.
1.  Allez dans l'onglet **"Règles"** de Firestore.
2.  Remplacez le contenu par les règles suivantes. **ATTENTION : Ces règles sont permissives pour le développement. Pour la production, elles devraient être plus restrictives.**

    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Les produits sont lisibles par tout le monde
        match /produits/{productId} {
          allow read: if true;
          allow write: if false; // Personne ne peut modifier les produits depuis le client
        }

        // Chaque client peut lire et écrire ses propres données
        match /clients/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }

        // Chaque client peut gérer son propre panier
        match /clients/{userId}/panier/{productId} {
          allow read, write, delete: if request.auth != null && request.auth.uid == userId;
        }

        // Chaque client peut créer ses propres commandes
        match /commandes/{commandeId} {
            allow read, create: if request.auth != null && request.auth.uid == request.resource.data.idClient;
        }
      }
    }
    ```
3.  Cliquez sur **"Publier"**.

### 6. Peuplement de la base de données (Seeding)

Pour ajouter les produits initiaux à votre base de données.

1.  **Générez une clé de service** :
    *   Dans la console Firebase, cliquez sur l'icône d'engrenage à côté de "Présentation du projet" et allez dans **"Paramètres du projet"**.
    *   Allez dans l'onglet **"Comptes de service"**.
    *   Cliquez sur le bouton **"Générer une nouvelle clé privée"**. Un fichier JSON sera téléchargé.
2.  **Placez la clé** :
    *   Renommez ce fichier JSON en `serviceAccountKey.json`.
    *   Placez-le à la racine de votre projet.
    *   **IMPORTANT**: Assurez-vous que le nom du fichier dans `seed.js` correspond. `const serviceAccount = require('./serviceAccountKey.json');`
    *   **NE JAMAIS PARTAGER CETTE CLÉ PUBLIQUEMENT**. Ajoutez `serviceAccountKey.json` à votre fichier `.gitignore`.
3.  **Exécutez le script de seeding** :
    *   Ouvrez un terminal à la racine de votre projet.
    *   Installez la dépendance `firebase-admin` :
        ```bash
        npm install firebase-admin
        ```
    *   Exécutez le script :
        ```bash
        node seed.js
        ```
    *   Vous devriez voir les produits s'ajouter dans la console. Vérifiez votre base de données Firestore pour confirmer.

### 7. Lancement du projet

Ouvrez les fichiers `.html` (comme `index.html`) dans votre navigateur. Vous pouvez utiliser une extension comme "Live Server" dans VS Code pour un développement plus facile.

---

## Structure du Backend (Modèle de Données)

*   **`clients`** (collection)
    *   `{userId}` (document)
        *   `nom`, `prenom`, `email`, `telephone`, `adresseLivraison`
        *   **`panier`** (sous-collection)
            *   `{productId}` (document)
                *   `nomProduit`, `prix`, `quantite`, `image`

*   **`produits`** (collection)
    *   `{productId}` (document)
        *   `nomProduit`, `description`, `quantite` (en stock), `prix`, `categorie`, `image`, `pointsFidelite`

*   **`commandes`** (collection)
    *   `{commandeId}` (document)
        *   `idClient`, `dateCommande`, `statutCommande`, `montantTotal`
        *   **`items`** (sous-collection)
            *   `{productId}` (document)
                *   `nomProduit`, `prixUnitaire`, `quantite`

*   **`avisClients`** (collection)
    *   `{avisId}` (document)
        *   `idClient`, `idProduit`, `note`, `commentaire`, `dateAvis`
