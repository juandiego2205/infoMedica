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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#008B8B]">EDITAR PACIENTE</h1>

      {!pacienteData && (
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            placeholder="Documento (ID)"
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
          />
          <button
            onClick={buscarPaciente}
            className="px-5 py-2 rounded-lg text-white font-medium transition"
            style={{ backgroundColor: '#008B8B' }}
          >
            Buscar
          </button>
        </div>
      )}

      {mensaje && <p className="text-sm text-red-600 mb-4">{mensaje}</p>}

      {pacienteData && (
        <div className="space-y-6">
          {/* Campos simples */}
          {Object.entries(pacienteData)
            .filter(([_, value]) => typeof value !== 'object' || value === null)
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{key.toUpperCase()}</label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-[50%] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
                />
              </div>
            ))}

          {/* Diccionarios */}
          {Object.entries(pacienteData)
            .filter(([_, value]) => typeof value === 'object' && value !== null)
            .map(([key, value]) => (
              <div key={key}>{renderObjectFields(key, value)}</div>
            ))}

          <div className="flex gap-4 justify-end">
            <button
              onClick={actualizarPaciente}
              className="px-6 py-2 rounded-lg text-white font-medium transition"
              style={{ backgroundColor: '#008B8B' }}
            >
              Actualizar
            </button>
            <button
              onClick={eliminarPaciente}
              className="px-6 py-2 rounded-lg text-white font-medium transition"
              style={{ backgroundColor: '#008B8B' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarPaciente;



