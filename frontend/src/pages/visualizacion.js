import React, { useState } from 'react';
import axios from 'axios';

const VisualizacionPaciente = () => {
  const [cedula, setCedula] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState('');

  const buscarPaciente = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/leer_paciente/${cedula}`);
      setPaciente(response.data);
      setError('');
    } catch (error) {
      console.error('Error al buscar paciente:', error);
      setPaciente(null);
      setError('Paciente no encontrado. Verifica la cédula.');
    }
  };

  const renderizarCampos = (data, prefix = '') => {
    return Object.entries(data).map(([key, value]) => {
      const campoCompleto = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        return (
          <div key={campoCompleto} className="nested-section">
            <h3 className="nested-title">{formatearCampo(campoCompleto)}</h3>
            {renderizarCampos(value, campoCompleto)}
          </div>
        );
      } else {
        return (
          <div className="form-field" key={campoCompleto}>
            <label className="field-label">{formatearCampo(campoCompleto)}</label>
            <input
              type="text"
              className="field-input"
              value={value}
              readOnly
            />
          </div>
        );
      }
    });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Visualización de Paciente</h1>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Ingrese la cédula del paciente"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        <button className="search-button" onClick={buscarPaciente}>
          Buscar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {paciente && (
        <div className="form-content">
          <div className="info-general">
            <div className="info-card">
              <h2 className="section-title">Información General</h2>
              {renderizarCampos(paciente)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función para que los campos salgan más bonitos visualmente
const formatearCampo = (campo) => {
  return campo
    .replace(/\./g, ' > ') // Cambiar puntos por flechitas
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
};

export default VisualizacionPaciente;

