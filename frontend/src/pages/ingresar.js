import React, { useState } from 'react';
import axios from 'axios';

const IngresarPaciente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha: '',
    ID: '',
  });

  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState({ nombre: '', valor: '', tiempo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAreaChange = (e) => {
    const { name, value } = e.target;
    setAreaInput({ ...areaInput, [name]: value });
  };

  const addArea = () => {
    if (areaInput.nombre && areaInput.valor && areaInput.tiempo) {
      setAreas([...areas, { ...areaInput }]);
      setAreaInput({ nombre: '', valor: '', tiempo: '' });
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellido: '', fecha: '', ID: '' });
    setAreas([]);
    setAreaInput({ nombre: '', valor: '', tiempo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ID) return alert("El campo 'documento' es obligatorio.");

    const fechaSinGuiones = formData.fecha.replace(/-/g, '');

    const mediciones = {};
    const tiempos = {};
    areas.forEach(area => {
      mediciones[area.nombre] = area.valor;
      tiempos[area.nombre] = area.tiempo;
    });

    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        ID: formData.ID,
        fecha: fechaSinGuiones,
        MEDICIONES: mediciones,
        TIEMPOS: tiempos
      };

      const response = await axios.post('http://127.0.0.1:5000/insertar_paciente', payload);
      alert(response.data.mensaje);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al insertar paciente.');
    }
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/cargar_archivos');
      alert(response.data.mensaje);
    } catch (error) {
      alert('Error al subir archivos.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="ID" placeholder="Documento" value={formData.ID} onChange={handleChange} className="w-full p-2 border rounded" required />

        <div className="border p-2 rounded">
          <h2 className="font-semibold mb-2">Áreas</h2>
          <input type="text" name="nombre" placeholder="Nombre del área" value={areaInput.nombre} onChange={handleAreaChange} className="w-full p-2 border rounded mb-2" />
          <input type="text" name="valor" placeholder="Valor del área" value={areaInput.valor} onChange={handleAreaChange} className="w-full p-2 border rounded mb-2" />
          <input type="text" name="tiempo" placeholder="Tiempo del área" value={areaInput.tiempo} onChange={handleAreaChange} className="w-full p-2 border rounded mb-2" />
          <button type="button" onClick={addArea} className="bg-blue-500 text-white px-4 py-2 rounded">Agregar Área</button>

          <ul className="mt-4 list-disc pl-5">
            {areas.map((area, index) => (
              <li key={index}>{`${area.nombre} - Valor: ${area.valor}, Tiempo: ${area.tiempo}`}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleUpload}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Subir archivos
          </button>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngresarPaciente;



