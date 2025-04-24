import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPrincipal from './components/menu_principal';
import IngresarPaciente from './pages/ingresar';
import EditarPaciente from './pages/editar';
import Homeapp from './pages/home';
import VisualizacionPaciente from './pages/visualizacion';


function App() {
  return (
    <Router>
      <MenuPrincipal />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Homeapp />} />
          <Route path="/ingresar" element={<IngresarPaciente />} />
          <Route path="/editar" element={<EditarPaciente />} />
          <Route path="/visualizacion" element={<VisualizacionPaciente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


