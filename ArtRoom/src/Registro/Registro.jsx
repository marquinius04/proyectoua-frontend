import { useState } from "react";
import "./Registro.css";
import { LogoArtRoomDefinitivo2 } from "../LogoArtRoomDefinitivo2/LogoArtRoomDefinitivo2.jsx";
import { useNavigate } from "react-router-dom";
import { SignUpButton } from "../SignUpButton/SignUpButton.jsx";

export const Registro = ({ className, ...props }) => {
  const navigate = useNavigate();

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Estado para manejar errores
  const [error, setError] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validar antes de enviar
  const handleSignUp = () => {
    if (formData.password !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError(""); // Limpiar el error si las contraseñas coinciden
    navigate("/"); // Redirigir si todo está correcto
  };

  return (
    <div className={`p-gina-de-login ${className}`}>
      <div className="login-container">
        {/* Header: Logo y línea divisoria */}
        <header className="login-header">
          <LogoArtRoomDefinitivo2 className="logo-art-room-definitivo-2-instance" />
          <div className="divisory-line"></div>
        </header>

        {/* Campo de username */}
        <div className="input-field">
          <label className="login-label">Full name</label>
          <input
            type="text"
            name="username"
            className="login-input"
            placeholder="Name, surname..."
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* Campo de Email */}
        <div className="input-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Campo de Password */}
        <div className="input-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="password123"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Campo de Confirmar Password */}
        <div className="input-field">
          <label className="login-label">Confirm password</label>
          <input
            type="password"
            name="confirmarContrasena"
            className="login-input"
            placeholder="Same password as above"
            value={formData.confirmarContrasena}
            onChange={handleChange}
          />
        </div>

        {/* Mostrar error si las contraseñas no coinciden */}
        {error && <p className="error-message">{error}</p>}

        <div className="sign-up-container">
          {/* Botón de Crear cuenta con validación de contraseñas */}
          <SignUpButton usuario={formData} onSuccess={handleSignUp} />
        </div>
      </div>
    </div>
  );
};
