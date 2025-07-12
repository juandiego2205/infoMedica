import { Link } from "react-router-dom";
import { FaHome, FaUserPlus, FaEye, FaEdit } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient py-3 fixed-top shadow-lg rounded-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src="./logojk.png"
            alt="Logo"
            style={{ height: "30px", marginRight: "10px" }}
          />
          MediSys
        </Link>
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/ingresar">
                <FaUserPlus className="me-1" /> Ingresar Paciente
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/visualizacion">
                <FaEye className="me-1" /> Ver Paciente
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/editar">
                <FaEdit className="me-1" /> Editar Paciente
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}







