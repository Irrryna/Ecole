import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getStudents } from '../api/school'; // Still need to fetch students
import './Management.css';

function Classes() {
  const { token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // Keep students for assignment
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ // For adding new class
    name: '',
    students: [],
  });
  const [editingClassId, setEditingClassId] = useState(null); // ID of class being edited
  const [editFormData, setEditFormData] = useState({ // For editing existing class
    name: '',
    students: [],
  });

  useEffect(() => {
    fetchClasses();
    fetchStudents(); // Fetch students for assignment
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/classes`);
      setClasses(response.data.data);
    } catch (err) {
      console.error('Error fetching classes:', err.response?.data || err.message);
      setError('Failed to fetch classes.');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getStudents(); // Assuming getStudents is still valid and returns { data: { data: [...] } }
      setStudents(res.data.data);
    } catch (err) {
      console.error('Error fetching students:', err.response?.data || err.message);
      setError('Failed to fetch students.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleStudentSelect = (e) => {
    const selectedStudents = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, students: selectedStudents });
  };

  const handleEditStudentSelect = (e) => {
    const selectedStudents = Array.from(e.target.selectedOptions, option => option.value);
    setEditFormData({ ...editFormData, students: selectedStudents });
  };

  const handleSubmit = async (e) => { // Add new class
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/classes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Class added successfully!');
      setFormData({ name: '', students: [] });
      fetchClasses();
    } catch (err) {
      console.error('Error adding class:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add class.');
    }
  };

  const handleEditClick = (classItem) => {
    setEditingClassId(classItem._id);
    setEditFormData({
      name: classItem.name,
      students: classItem.students.map(s => s._id), // Map to IDs for select
    });
  };

  const handleUpdateSubmit = async (e) => { // Update existing class
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/classes/${editingClassId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Class updated successfully!');
      setEditingClassId(null);
      setEditFormData({ name: '', students: [] });
      fetchClasses();
    } catch (err) {
      console.error('Error updating class:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update class.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setError('');
      setSuccess('');
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/classes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Class deleted successfully!');
        fetchClasses();
      } catch (err) {
        console.error('Error deleting class:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to delete class.');
      }
    }
  };

  return (
    <div className="management-container">
      <header className="management-header">
        <h2>Gestion des Classes</h2>
        <p>Créez et gérez les classes de l'école.</p>
      </header>

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      {token && !editingClassId && ( // Show add form if logged in and not editing
        <div className="add-form">
          <h3>Ajouter une classe</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom de la classe" required />
              </div>
              <div className="form-group">
                <select multiple name="students" value={formData.students} onChange={handleStudentSelect}>
                  <option value="" disabled>Sélectionner des élèves</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>{student.firstName} {student.lastName}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="submit-button">Ajouter</button>
          </form>
        </div>
      )}

      {token && editingClassId && ( // Show edit form if logged in and editing
        <div className="edit-form">
          <h3>Modifier la classe</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} placeholder="Nom de la classe" required />
              </div>
              <div className="form-group">
                <select multiple name="students" value={editFormData.students} onChange={handleEditStudentSelect}>
                  <option value="" disabled>Sélectionner des élèves</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>{student.firstName} {student.lastName}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="submit-button">Mettre à jour</button>
            <button type="button" className="cancel-button" onClick={() => setEditingClassId(null)}>Annuler</button>
          </form>
        </div>
      )}

      <h3>Liste des classes</h3>
      <ul className="item-list">
        {classes.length === 0 ? (
          <p>Aucune classe trouvée.</p>
        ) : (
          classes.map((item) => (
            <li key={item._id} className="item-card">
              <div className="item-card-info">
                <h4>{item.name}</h4>
                <p>Nombre d'élèves: {item.students ? item.students.length : 0}</p>
                {item.students && item.students.length > 0 && (
                  <p>Élèves: {item.students.map(s => `${s.firstName} ${s.lastName}`).join(', ')}</p>
                )}
              </div>
              {token && ( // Show edit/delete buttons if logged in
                <div className="item-actions">
                  <button onClick={() => handleEditClick(item)} className="edit-button">Modifier</button>
                  <button onClick={() => handleDelete(item._id)} className="delete-button">Supprimer</button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Classes;