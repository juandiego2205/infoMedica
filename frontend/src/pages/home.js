import React from 'react';
import './MenuPrincipal.css';
 // Importa el archivo CSS para estilos personalizados

const Homeapp = () => {
  return (
      <div className="Texto-Principal">
        {/* Sección principal */}
        <div className="row align-items-center">
          {/* Texto */}
          <div className="col-md-6 mb-4 text-align-center text-md-start">
            <h5 className="text-uppercase text-muted">System</h5>
            <h1 className="display-4 fw-bold"> <span className="text-primary">HIS </span>MEDICAL DATA</h1>
            <p className="text-dark-gray">
              lorem 3000 dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
  );
};

export default Homeapp;
