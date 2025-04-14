# Planity Clone - API & Frontend

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (version 18 ou supérieure)
- **npm** (inclus avec Node.js)
- **PostgreSQL** (pour la base de données)
- **pgAdmin** (pour gérer PostgreSQL facilement)
- Un éditeur de texte comme **VS Code** (optionnel mais recommandé)

## Installation de PostgreSQL et pgAdmin

1. **Télécharger PostgreSQL :**
   - Rendez-vous sur le site officiel : [https://www.postgresql.org/download/](https://www.postgresql.org/download/).
   - Suivez les instructions pour installer PostgreSQL sur votre système d'exploitation.

2. **Installer pgAdmin :**
   - pgAdmin est inclus dans l'installation de PostgreSQL. Assurez-vous de cocher l'option pour installer pgAdmin lors de l'installation.

3. **Configurer PostgreSQL :**
   - Pendant l'installation, définissez un mot de passe pour l'utilisateur `postgres`. Notez ce mot de passe, car vous en aurez besoin pour configurer la base de données.

4. **Lancer pgAdmin :**
   - Ouvrez pgAdmin et connectez-vous avec l'utilisateur `postgres` et le mot de passe défini précédemment.

## Configuration de la base de données

1. **Créer la base de données :**
   - Dans pgAdmin, faites un clic droit sur "Databases" > "Create" > "Database".
   - Donnez le nom `planity` à la base de données et cliquez sur "Save".

2. **Importer le fichier SQL :**
   - Naviguez dans le dossier `bdd` du projet.
   - Dans pgAdmin, sélectionnez la base de données `planity`, puis cliquez sur l'onglet "Query Tool".
   - Ouvrez le fichier `Planity.sql` dans un éditeur de texte, copiez son contenu, et collez-le dans la "Query Tool".
   - Cliquez sur le bouton "Execute" (icône en forme d'éclair) pour exécuter le script SQL.

3. **Vérifier les tables :**
   - Une fois le script exécuté, vérifiez que les tables ont été créées dans la base de données `planity`.

## Configuration

1. **Cloner le projet :**
   ```sh
   git clone <URL_DU_REPO>
   cd Planity_Clone
   ```

2. **Créer un fichier `.env` dans le dossier `api` :**
   Ce fichier doit contenir les informations suivantes :
   ```
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=<votre_mot_de_passe_postgres>
   DB_NAME=planity
   DB_PORT=5432
   SECRET_KEY=<clé_secrète_pour_les_tokens_JWT>
   ```

3. **Installer les dépendances :**
   - Pour le backend :
     ```sh
     cd api
     npm install
     ```
   - Pour le frontend :
     ```sh
     cd ../frontend
     npm install
     ```

## Lancer le projet

### Backend (API)

1. Naviguez dans le dossier `api` :
   ```sh
   cd api
   ```

2. Démarrez le serveur backend avec **Nodemon** :
   ```sh
   npx nodemon index.js
   ```

3. L'API sera disponible sur `http://localhost:3001`.

### Frontend

1. Naviguez dans le dossier `frontend` :
   ```sh
   cd frontend
   ```

2. Lancez le serveur de développement :
   ```sh
   npm run dev
   ```

3. L'application sera accessible sur `http://localhost:3000`.

## Utilisation du projet

### Fonctionnalités principales

- **Inscription et Connexion :**
  - Les utilisateurs peuvent s'inscrire et se connecter pour accéder à leur compte.
  
- **Recherche de services :**
  - Recherchez des salons par catégorie (Coiffeur, Barbier, Manucure) et par ville.

- **Réservation :**
  - Prenez rendez-vous en ligne avec des professionnels de la beauté.

- **Gestion des salons :**
  - Les administrateurs peuvent créer et gérer des salons.

### Structure du projet

- **Backend (`api`) :**
  - Contient les routes API, la logique métier et les modèles pour interagir avec la base de données PostgreSQL.

- **Frontend (`frontend`) :**
  - Développé avec **Next.js**, il gère l'interface utilisateur et les interactions avec l'API.

### Stack utilisée

- **Backend :**
  - Node.js, Express.js
  - PostgreSQL
  - JWT pour l'authentification
  - Bcrypt pour le hachage des mots de passe

- **Frontend :**
  - React.js avec Next.js
  - TailwindCSS pour le style

## Notes supplémentaires

- Assurez-vous que PostgreSQL est en cours d'exécution et que la base de données est correctement configurée avant de lancer le backend.
- Si vous rencontrez des problèmes, vérifiez les logs dans la console pour des messages d'erreur détaillés.

Bon développement !
