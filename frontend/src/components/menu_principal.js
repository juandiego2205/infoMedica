import React from 'react';
import { Link } from 'react-router-dom';

const MenuPrincipal = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-light bg-transparence py-3">
      <div className="container-fluid">
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
          <ul className="navbar-nav me-auto"> {/* Cambié ms-auto a me-auto para alinear a la izquierda */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
              <img src="./logojk.png" alt="Logo" style={{ height: '20px', marginTop: '0', marginBottom: '0', padding: '0' }} />

              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/ingresar">Ingresar Paciente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/visualizacion">Ver Paciente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/editar">Editar Paciente</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuPrincipal;





