import React from 'react';
import { useEffect } from 'react';
import '../index.css';
 // Importa el archivo CSS para estilos personalizados

 const Homeapp = () => {
  return (
    <div className="home_background">
      <div className="container_home">
        <div className="col-md-6 text-center"> {/* Corregido 'text-align-center' a 'text-center' */}
          <h5 className="text-uppercase text-muted">Sistema</h5>
          <h1 className="display-4 fw-bold">
            <span className="text-primary">HIS </span>
            <span className="display-4">MEDICAL DATA</span>
          </h1>
          <p className="text_home">
            Nuestro sistema de registros médicos está diseñado para facilitar la gestión segura y eficiente de la información clínica. Aquí podrá almacenar historiales médicos, registrar consultas, dar seguimiento a tratamientos y acceder fácilmente a exámenes y resultados.
            <br /><br />
            Cada dato es protegido bajo estrictos protocolos de seguridad, garantizando la confidencialidad y privacidad de nuestros usuarios. Además, nuestro sistema es intuitivo y accesible desde diferentes dispositivos, adaptándose tanto a pequeños consultorios como a grandes centros médicos.
            <br /><br />
            Nuestro objetivo es optimizar el tiempo de los profesionales de la salud y mejorar la calidad de atención a los pacientes, brindando información precisa y actualizada en todo momento.
            <br /><br />
            Gracias por confiar en nosotros. Estamos comprometidos con su bienestar y con hacer de la gestión médica una experiencia más simple, segura y eficaz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homeapp;