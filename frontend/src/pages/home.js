import React from 'react';
import { useEffect } from 'react';
import '../index.css';
 // Importa el archivo CSS para estilos personalizados

 const Homeapp = () => {
  return (
    <div className="home_background">
      <div className="container_home">
        <div className="col-md-6 text-center"> {/* Corregido 'text-align-center' a 'text-center' */}
          
          <h1 className="display-4 fw-bold">
            <span className="text-primary"><strong>JK</strong></span>
            <span className="display-4"><strong>OMPANY</strong></span>
          </h1>
          <h5 className="text-uppercase text-muted">Bases de Datos CLinicas</h5>
          <p className="text_home">
          Nuestro sistema de registros médicos permite almacenar historiales, registrar consultas y seguir tratamientos de forma segura y eficiente. Protegemos su información con altos estándares de seguridad y ofrecemos una plataforma intuitiva, accesible desde cualquier dispositivo. Optimice su tiempo y mejore la atención a sus pacientes con una gestión clínica simple, segura y eficaz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homeapp;