import React, { useState } from 'react';
import Trainers from './Trainers';
import Classes from './Classes';
import Students from './Students';
import './Dashboard.css';

function Dashboard() {
  const [activeView, setActiveView] = useState('trainers'); // Default view

  const renderView = () => {
    switch (activeView) {
      case 'trainers':
        return <Trainers />;
      case 'classes':
        return <Classes />;
      case 'students':
        return <Students />;
      default:
        return <Trainers />;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Tableau de Bord</h1>
        <ul>
          <li>
            <button onClick={() => setActiveView('trainers')} className={activeView === 'trainers' ? 'active' : ''}>
              Formateurs
            </button>
          </li>
          <li>
            <button onClick={() => setActiveView('classes')} className={activeView === 'classes' ? 'active' : ''}>
              Classes
            </button>
          </li>
          <li>
            <button onClick={() => setActiveView('students')} className={activeView === 'students' ? 'active' : ''}>
              Élèves
            </button>
          </li>
        </ul>
      </nav>
      <main className="dashboard-content">
        {renderView()}
      </main>
    </div>
  );
}

export default Dashboard;