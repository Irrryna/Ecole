import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- Import Google OAuth de manière optionnelle ---
let GoogleOAuthProvider = null;
try {
  if (process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    const { GoogleOAuthProvider: GoogleProvider } = require('@react-oauth/google');
    GoogleOAuthProvider = GoogleProvider;
    console.log('✅ Google OAuth configuré côté frontend');
  } else {
    console.log('⚠️  REACT_APP_GOOGLE_CLIENT_ID non défini — Google OAuth désactivé');
  }
} catch (e) {
  console.warn('⚠️  @react-oauth/google non installé — Google OAuth désactivé');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu conditionnel avec ou sans Google OAuth
if (GoogleOAuthProvider && process.env.REACT_APP_GOOGLE_CLIENT_ID) {
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// analytics endpoint https://bit.ly/CRA-vitals
reportWebVitals();