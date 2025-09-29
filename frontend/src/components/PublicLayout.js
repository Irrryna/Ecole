import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="page-content">
        <Outlet /> {/* Le contenu des routes imbriquées s'affichera ici */}
      </main>
    </div>
  );
};

export default PublicLayout;
