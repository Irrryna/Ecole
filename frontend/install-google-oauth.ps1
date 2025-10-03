# Script PowerShell pour installer Google OAuth de manière optionnelle
Write-Host "🔧 Installation de Google OAuth..." -ForegroundColor Cyan

# Vérifier si npm est disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Installer @react-oauth/google
Write-Host "📦 Installation de @react-oauth/google..." -ForegroundColor Yellow
npm install @react-oauth/google

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Google OAuth installé avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 N'oubliez pas de configurer:" -ForegroundColor Yellow
    Write-Host "   - REACT_APP_GOOGLE_CLIENT_ID dans votre .env" -ForegroundColor White
    Write-Host "   - GOOGLE_CLIENT_ID dans votre backend .env" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Créez un projet sur: https://console.cloud.google.com/" -ForegroundColor Blue
} else {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    exit 1
}
