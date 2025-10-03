import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [message, setMessage] = useState('Vérification de votre e-mail...');
  const [error, setError] = useState(false);
  const API = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API}/auth/verify-email/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'La vérification a échoué.');
        }

        setMessage(data.message);
        setError(false);
      } catch (err) {
        setMessage(err.message);
        setError(true);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, API]);

  return (
    <div className="container section narrow">
      <div className="card" style={{textAlign: 'center'}}>
        <h1>Vérification de l'e-mail</h1>
        <p style={{color: error ? '#b42318' : '#128a5a', marginBlock: 24}}>{message}</p>
        {!error && (
          <p>
            <Link to="/login" className="btn">
              Aller à la page de connexion
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
