# 🔐 Configuration Google OAuth (Optionnelle)

## Vue d'ensemble

L'authentification Google OAuth est **optionnelle** dans cette application. Le système fonctionne parfaitement sans Google OAuth, mais vous pouvez l'activer si vous le souhaitez.

## 🚀 Activation de Google OAuth

### 1. Installation des dépendances

**Frontend :**

```bash
# Option 1: Script automatique (Linux/Mac)
cd FRONTEND
./install-google-oauth.sh

# Option 2: Script automatique (Windows)
cd FRONTEND
powershell -ExecutionPolicy Bypass -File install-google-oauth.ps1

# Option 3: Installation manuelle
cd FRONTEND
npm install @react-oauth/google
```

**Backend :**

```bash
cd BACKEND
npm install google-auth-library
```

### 2. Configuration Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" ou "Google Identity"
4. Créez des identifiants OAuth 2.0 :
   - Type : Application web
   - Origines JavaScript autorisées : `http://localhost:3000`, `https://votre-domaine.com`
   - URI de redirection autorisées : `http://localhost:3000`, `https://votre-domaine.com`

### 3. Variables d'environnement

**Backend (.env) :**

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Frontend (.env) :**

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## 🔧 Fonctionnement

### Sans Google OAuth

- ✅ L'application fonctionne normalement
- ✅ Connexion par email/mot de passe uniquement
- ✅ Pas de bouton Google sur la page de connexion

### Avec Google OAuth

- ✅ Connexion par email/mot de passe
- ✅ Connexion avec Google
- ✅ Bouton Google affiché sur la page de connexion
- ✅ Création automatique de compte lors de la première connexion Google

## 🐛 Dépannage

### Problème : "Google OAuth non configuré"

**Solution :** Vérifiez que `GOOGLE_CLIENT_ID` est défini dans vos variables d'environnement.

### Problème : "google-auth-library non installée"

**Solution :** Installez la dépendance :

```bash
cd BACKEND
npm install google-auth-library
```

### Problème : Bouton Google ne s'affiche pas

**Solution :** Vérifiez que `REACT_APP_GOOGLE_CLIENT_ID` est défini et que le package est installé.

## 📊 Vérification du statut

L'API expose un endpoint pour vérifier le statut de Google OAuth :

```bash
curl http://localhost:5000/api/auth/google/status
```

**Réponse si configuré :**

```json
{
  "available": true,
  "configured": true
}
```

**Réponse si non configuré :**

```json
{
  "available": false,
  "configured": false
}
```

## 🚀 Déploiement

### Render (Backend)

1. Ajoutez `GOOGLE_CLIENT_ID` dans les variables d'environnement
2. Le backend détectera automatiquement la configuration

### Vercel/Netlify (Frontend)

1. Ajoutez `REACT_APP_GOOGLE_CLIENT_ID` dans les variables d'environnement
2. Le frontend détectera automatiquement la configuration

## 💡 Avantages de cette approche

- ✅ **Flexibilité** : Fonctionne avec ou sans Google OAuth
- ✅ **Simplicité** : Pas de configuration complexe obligatoire
- ✅ **Robustesse** : L'application ne plante pas si Google OAuth n'est pas configuré
- ✅ **Développement** : Facile de développer sans Google OAuth
- ✅ **Production** : Facile d'ajouter Google OAuth en production
