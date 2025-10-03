#!/bin/bash

# Script pour installer Google OAuth de manière optionnelle
echo "🔧 Installation de Google OAuth..."

# Vérifier si npm est disponible
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Installer @react-oauth/google
echo "📦 Installation de @react-oauth/google..."
npm install @react-oauth/google

if [ $? -eq 0 ]; then
    echo "✅ Google OAuth installé avec succès!"
    echo ""
    echo "📝 N'oubliez pas de configurer:"
    echo "   - REACT_APP_GOOGLE_CLIENT_ID dans votre .env"
    echo "   - GOOGLE_CLIENT_ID dans votre backend .env"
    echo ""
    echo "🔗 Créez un projet sur: https://console.cloud.google.com/"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi
