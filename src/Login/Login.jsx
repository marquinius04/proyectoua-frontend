import { useState } from "react";
import "./Login.css";
import { LogoArtRoomDefinitivo2 } from "../LogoArtRoomDefinitivo2/LogoArtRoomDefinitivo2.jsx";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "../SignInButton/SignInButton.jsx"; // Importa el botón

export const Login = ({ className, ...props }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  return (
    <div className={`p-gina-de-login ${className}`}>
      <div className="login-container">
        <header className="login-header">
          <LogoArtRoomDefinitivo2 className="logo-art-room-definitivo-2-instance" />
          <div className="divisory-line"></div>
        </header>

        {/* Campo de Email */}
        <div className="input-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="email@example.com"
            value={usuario.email}
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
            value={usuario.password}
            onChange={handleChange}
          />
        </div>

        {/* Botón de Login */}
        <SignInButton 
          email={usuario.email} 
          password={usuario.password} 
          onLoginSuccess={(userData) => {
            // Aquí puedes manejar lo que sucede después de un login exitoso.
            console.log('Usuario logueado:', userData);
            navigate("/"); // Redirige a la página después de un login exitoso
          }}
        />

        <a href="/forgotPass" className="forgot-your-password">Forgot your password?</a>

        <p>Don't have an account?</p>
        <a href="/signUp">Sign up here</a>
      </div>
    </div>
  );
};

