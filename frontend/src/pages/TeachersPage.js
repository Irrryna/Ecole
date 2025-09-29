import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const TeachersPage = () => {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    expertise: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/trainers`);
      setTeachers(response.data.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers.');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/trainers`, newTeacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Teacher added successfully!');
      setNewTeacher({ firstName: '', lastName: '', email: '', expertise: '' });
      fetchTeachers(); // Re-fetch teachers to update the list
    } catch (err) {
      console.error('Error adding teacher:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add teacher.');
    }
  };

  return (
    <div>
      <h1>Page des Professeurs</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {token && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Ajouter un nouveau professeur</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Prénom:</label>
              <input
                type="text"
                name="firstName"
                value={newTeacher.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Nom:</label>
              <input
                type="text"
                name="lastName"
                value={newTeacher.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newTeacher.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Expertise:</label>
              <input
                type="text"
                name="expertise"
                value={newTeacher.expertise}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Ajouter Professeur</button>
          </form>
        </div>
      )}

      <h2>Liste des Professeurs</h2>
      {teachers.length === 0 ? (
        <p>Aucun professeur trouvé.</p>
      ) : (
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher._id}>
              {teacher.firstName} {teacher.lastName} - {teacher.email} ({teacher.expertise})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeachersPage;