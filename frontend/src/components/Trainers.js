import React, { useState, useEffect } from 'react';
import { getTrainers, addTrainer } from '../api/school';
import './Management.css';

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    expertise: '',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await getTrainers();
      setTrainers(res.data.data);
    } catch (err) {
      setError('Failed to fetch trainers.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addTrainer(formData);
      setFormData({ firstName: '', lastName: '', email: '', expertise: '' });
      fetchTrainers(); // Refresh list after adding
    } catch (err) {
      setError('Failed to add trainer. Please check the data.');
    }
  };

  return (
    <div className="management-container">
      <header className="management-header">
        <h2>Gestion des Formateurs</h2>
        <p>Ajoutez, consultez et gérez les formateurs de l'école.</p>
      </header>

      <div className="add-form">
        <h3>Ajouter un formateur</h3>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" required />
            </div>
            <div className="form-group">
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} placeholder="Expertise" required />
            </div>
          </div>
          <button type="submit" className="submit-button">Ajouter</button>
        </form>
      </div>

      <h3>Liste des formateurs</h3>
      <ul className="item-list">
        {trainers.map((trainer) => (
          <li key={trainer._id} className="item-card">
            <div className="item-card-info">
              <h4>{trainer.firstName} {trainer.lastName}</h4>
              <p>{trainer.email} - {trainer.expertise}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trainers;