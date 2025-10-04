# Utiliser une image Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste du code source
COPY . .

# Copier le dossier 'tools' depuis la racine du projet
COPY ../tools ./tools

# Set NODE_PATH to ensure modules are found
ENV NODE_PATH=/usr/src/app/node_modules

# Exposer le port
EXPOSE 5000

# Commande de démarrage pour la production
CMD ["npm", "start"]
