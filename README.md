# PsyPlatform

Plateforme web de consultation psychologique : prise de rendez-vous, suivi thérapeutique, messagerie et paiements entre patients, psychologues et administrateurs.

Projet de bases de données et génie logiciel, conçu avec la méthode Merise (MCD, MLD, schéma relationnel MySQL). Encadrant : M. Yahyaoui.

**Stack :** Next.js 14 · Node.js / Express · MySQL 8 · Socket.io · JWT / Bcrypt

## Fonctionnalités

| Rôle | Ce qu'il peut faire |
|---|---|
| Patient | Rechercher un psychologue, prendre rendez-vous, payer, consulter son historique, échanger des messages, faire des tests et exercices, déposer une réclamation ou un feedback |
| Psychologue | Gérer son profil et son calendrier de disponibilités, suivre ses patients, rédiger des notes cliniques, définir des traitements et exercices, partager des ressources |
| Administrateur | Superviser la plateforme, gérer les comptes, consulter les statistiques |

Fonctionnalités transverses : notifications, messagerie en temps réel, historique d'activité pour la traçabilité.


<img width="542" height="297" alt="image" src="https://github.com/user-attachments/assets/bcf113b6-5ec2-42e7-8a79-f2d71e2afa43" />


<img width="483" height="295" alt="image" src="https://github.com/user-attachments/assets/abf66bb1-251b-4a9f-9851-aeeae5d08f97" />


<img width="501" height="312" alt="image" src="https://github.com/user-attachments/assets/a3e8e4d7-db68-4bd5-80b9-76ba43ceeafb" />

Page de connexion: 

<img width="495" height="597" alt="image" src="https://github.com/user-attachments/assets/80275d7a-66c3-4c20-bb78-b154f30e1d4b" />


Page d'inscription:

<img width="470" height="666" alt="image" src="https://github.com/user-attachments/assets/a7265977-07b2-4f30-aca0-88ff317e2eef" />


Interface Patient:

<img width="545" height="306" alt="image" src="https://github.com/user-attachments/assets/d569ea41-2580-425c-acec-44af0d0b132d" />


Interface Psychologue:

<img width="541" height="302" alt="image" src="https://github.com/user-attachments/assets/831cb0dd-c9d9-458d-964a-289c5ad8c093" />


Interface Administrateur:

<img width="550" height="300" alt="image" src="https://github.com/user-attachments/assets/02a173d3-4dac-4e44-b33c-12ec00664892" />



## Base de données

Le schéma est issu de la démarche Merise (MCD, puis MLD, puis création SQL) et compte **21 tables** :

| Domaine | Tables |
|---|---|
| Utilisateurs | `utilisateur`, `patient`, `psychologue`, `administrateur` |
| Rendez-vous | `calendrier`, `rendez_vous` |
| Consultations | `seance_therapie`, `notes_psychologue`, `historique_consultation`, `traitement` |
| Paiement | `paiement` |
| Communication | `message`, `notification` |
| Tests et exercices | `test`, `exercice`, `exercice_realise`, `type_maladie_psychologique` |
| Suivi et qualité | `reclamation`, `feedbacks`, `ressource_partagee`, `historique_activite` |

Intégrité : clés primaires et étrangères, contraintes `CHECK` (statuts, dates, heures, montants), unicité de l'email, du CIN et du numéro de licence, index sur les colonnes de recherche. Les tables sont créées dans l'ordre des dépendances des clés étrangères.

## Sécurité

- Authentification par JWT et protection des routes par middleware.
- Mots de passe hachés avec Bcrypt.
- Séparation des rôles (patient, psychologue, administrateur) : chaque patient n'accède qu'à ses données, chaque psychologue qu'à celles des patients qu'il suit.
- CORS restreint au domaine du frontend.
- Validation des entrées avec express-validator.

## Structure du projet

```
psyplatform/
├── backend/     API Node.js / Express
├── frontend/    Application Next.js
├── scripts/     Scripts .bat de démarrage local
└── docs/        Captures d'écran et rapport
```

### Prérequis

- Node.js (version LTS)
- MySQL 8.x

### 1. Base de données

Crée la base et importe le script SQL du projet :

```bash
mysql -u root -p -e "CREATE DATABASE psyplatform CHARACTER SET utf8mb4;"
mysql -u root -p psyplatform < chemin/vers/le_script.sql
```

### 2. Backend

Crée un fichier `backend/.env` (jamais commité) :

```
DB_HOST=localhost
DB_USER=ton_utilisateur
DB_PASSWORD=ton_mot_de_passe
DB_NAME=psyplatform
JWT_SECRET=une_longue_chaine_aleatoire
FRONTEND_URL=http://localhost:3000
PORT=5000
```

```bash
cd backend
npm install
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Puis ouvre http://localhost:3000.


## Perspectives

Visioconférence pour les consultations à distance, notifications automatiques par email ou SMS, application mobile, orientation et suivi des patients assistés par IA.

## Équipe

- Aya Ben Salah
- Khaoula Anjroum
- Khadija El Ouarad
- Loubna Souali
