import React from 'react';
import { Link } from 'react-router-dom';

const MenuPrincipal = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-light bg-info py-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Sistema de Pacientes</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/ingresar">Ingresar Paciente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/visualizacion">Ver Paciente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/editar">Editar Paciente</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuPrincipal;




