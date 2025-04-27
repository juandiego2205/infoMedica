import React, { useState } from 'react';
import axios from 'axios';

const EditarPaciente = () => {
  const [searchID, setSearchID] = useState('');
  const [pacienteData, setPacienteData] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const buscarPaciente = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/obtener_paciente/${searchID}`);
      const data = response.data;
      delete data._id;
      setPacienteData(data);
      setMensaje('');
    } catch (error) {
      setMensaje('Paciente no encontrado.');
      setPacienteData(null);
    }
  };

  const handleChange = (key, value) => {
    setPacienteData((prev) => ({ ...prev, [key]: value }));
  };

  const handleObjectChange = (key, subKey, subValue) => {
    setPacienteData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: subValue,
      },
    }));
  };

  const eliminarCampoObjeto = (key, subKey) => {
    setPacienteData((prev) => {
      const updatedObject = { ...prev[key] };
      delete updatedObject[subKey];
      return {
        ...prev,
        [key]: updatedObject,
      };
    });
  };

  const agregarCampoObjeto = (key) => {
    const nuevoCampo = prompt("Nombre del nuevo campo:");
    if (nuevoCampo) {
      const valor = prompt("Valor del nuevo campo:");
      setPacienteData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [nuevoCampo]: valor,
        },
      }));
    }
  };

  const actualizarPaciente = async () => {
    const dataToSend = { ...pacienteData };
    delete dataToSend.ID;

    try {
      await axios.put(`http://127.0.0.1:5000/actualizar_paciente/${searchID}`, dataToSend);
      setMensaje('Paciente actualizado correctamente.');
      setPacienteData(null);
      setSearchID('');
    } catch (error) {
      setMensaje('Error al actualizar el paciente.');
    }
  };

  const eliminarPaciente = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/eliminar_paciente/${searchID}`);
      setMensaje('Paciente eliminado correctamente.');
      setPacienteData(null);
      setSearchID('');
    } catch (error) {
      setMensaje('Error al eliminar el paciente.');
    }
  };

  const renderObjectFields = (key, obj) => (
    <div className="border rounded-xl p-4 mb-4 bg-gray-50 shadow-sm">
      <h3 className="text-center text-xl font-bold mb-4 text-[#008B8B]">{key.toUpperCase()}</h3>
      {Object.entries(obj).map(([subKey, subValue]) => (
        <div key={subKey} className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">{`${key} > ${subKey}`}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={subValue || ''}
              onChange={(e) => handleObjectChange(key, subKey, e.target.value)}
              className="w-[45%] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
            />
            <button
              onClick={() => eliminarCampoObjeto(key, subKey)}
              className="text-sm px-3 py-2 rounded text-white transition"
              style={{ backgroundColor: '#008B8B' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => agregarCampoObjeto(key)}
          className="text-sm px-4 py-2 rounded text-white transition"
          style={{ backgroundColor: '#008B8B' }}
        >
          + Agregar campo
        </button>
      </div>
    </div>
  );

  return (
    <div className="form-container">
    <h1 className="form-title">Editar Paciente</h1>
  
    {/* Input de búsqueda */}
    {!pacienteData && (
      <div className="search-section">
        <input
          type="text"
          placeholder="Documento (ID)"
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
          className="search-input"
        />
        <button
          onClick={buscarPaciente}
          className="search-button"
        >
          Buscar
        </button>
      </div>
    )}
  
    {/* Mensaje de error */}
    {mensaje && (
      <p className="error-message">{mensaje}</p>
    )}
  
    {/* Contenido cuando ya existe paciente */}
    {pacienteData && (
      <div className="form-content">
        
        {/* Información General */}
        <div className="info-card">
          <h2 className="section-title">Información General</h2>
          {Object.entries(pacienteData)
            .filter(([_, value]) => typeof value !== 'object' || value === null)
            .map(([key, value]) => (
              <div key={key} className="form-field">
                <label className="field-label">{key.toUpperCase()}</label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="field-input"
                />
              </div>
            ))}
        </div>
  
        {/* Diccionarios */}
        <div className="info-card">
          <h2 className="section-title">Datos Adicionales</h2>
          {Object.entries(pacienteData)
            .filter(([_, value]) => typeof value === 'object' && value !== null)
            .map(([key, value]) => (
              <div key={key}>
                {renderObjectFields(key, value)}
              </div>
            ))}
        </div>
  
      </div>
    )}
  
    {/* Botones */}
    {pacienteData && (
      <div className="form-buttons">
        <button
          onClick={actualizarPaciente}
          className="form-button update-button"
        >
          Actualizar
        </button>
        <button
          onClick={eliminarPaciente}
          className="form-button delete-button"
        >
          Eliminar
        </button>
      </div>
    )}
  </div>
  


  );
};

export default EditarPaciente;



