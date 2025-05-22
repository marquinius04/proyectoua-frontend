import "../Login/Login.css"; // Reutilizamos los estilos de Login.css
import { SignInButton } from "../SignInButton/SignInButton.jsx";
import { LogoArtRoomDefinitivo8 } from "../LogoArtRoomDefinitivo8/LogoArtRoomDefinitivo8.jsx";

export const RecuperarContraseña = ({ className, ...props }) => {
  return (
    <div className={`p-gina-de-login ${className}`}>
      <div className="login-container">
        <header className="login-header">
          <LogoArtRoomDefinitivo8 className="logo-art-room-definitivo-2-instance" />
          <div className="divisory-line"></div>
        </header>

        {/* Texto de instrucciones */}
        <p className="advice-text">
          To recover your password, fill in the box below. You will receive an
          email with the link to set your new password.
        </p>

        {/* Campo de entrada para el email */}
        <div className="input-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="your@email.com"
          />
        </div>

        {/* Botón de Reset Password */}
        <div className="sign-in-container">
          <button className="login-button-instance">Reset Password</button>
        </div>

        {/* Enlace para volver al login */}
        <a href="/login" className="forgot-your-password">Back to Login</a>
      </div>
    </div>
  );
};