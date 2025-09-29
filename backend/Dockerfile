# Utiliser une image Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneurd dz
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Le backend sera lancé par Docker Compose
