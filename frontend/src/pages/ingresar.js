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
  const [areaInput, setAreaInput] = useState({ nombre: '', valor: '' });  // Eliminar 'tiempo'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAreaChange = (e) => {
    const { name, value } = e.target;
    setAreaInput({ ...areaInput, [name]: value });
  };

  const addArea = () => {
    if (areaInput.nombre && areaInput.valor) {  // Solo validar nombre y valor
      setAreas([...areas, { ...areaInput }]);
      setAreaInput({ nombre: '', valor: '' });  // Limpiar los campos después de agregar
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellido: '', fecha: '', ID: '' });
    setAreas([]);
    setAreaInput({ nombre: '', valor: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ID) return alert("El campo 'documento' es obligatorio.");

    const fechaSinGuiones = formData.fecha.replace(/-/g, '');

    const mediciones = {};
    areas.forEach(area => {
      mediciones[area.nombre] = area.valor;  // Solo manejar nombre y valor
    });

    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        ID: formData.ID,
        fecha: fechaSinGuiones,
        MEDICIONES: mediciones,
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
    <div className="container_ingresar">
    <div className="form-container">
      <h1 className="form-title">Sistema de Ingreso</h1>
      <form onSubmit={handleSubmit} className="form-content">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="form-input" />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="form-input" />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="form-input" />
        <input type="text" name="ID" placeholder="Documento" value={formData.ID} onChange={handleChange} className="form-input" required />

        <div className="area-section">
          <h2 className="area-title">Áreas</h2>
          <input type="text" name="nombre" placeholder="Nombre del área" value={areaInput.nombre} onChange={handleAreaChange} className="form-input" />
          <input type="text" name="valor" placeholder="Valor del área" value={areaInput.valor} onChange={handleAreaChange} className="form-input" />
          <button type="button" onClick={addArea} className="btn-add-area">Agregar Área</button>

          <ul className="area-list">
            {areas.map((area, index) => (
              <li key={index} className="area-item">{`${area.nombre} - Valor: ${area.valor}`}</li>
            ))}
          </ul>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleUpload} className="btn-upload">Subir archivos</button>
          <button type="submit" className="btn-submit">Enviar</button>
        </div>
      </form>
    </div>
  </div>
);
};

export default IngresarPaciente;





