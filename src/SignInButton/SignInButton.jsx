import { useState } from "react";
import { useLocation } from "react-router-dom"; // Importamos useLocation para la detección de página
import "./SignInButton.css";

export const SignInButton = ({ className, email, password, onLoginSuccess, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation(); // Inicializamos useNavigate

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Por favor, ingresa tus credenciales.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Realiza la solicitud de login al backend
      const response = await fetch("REACT_APP_API_URL/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      console.log("Usuario logueado:", data);
      
      // Guarda el usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data));
      // Ejecuta función de éxito si está definida
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      alert("Login exitoso");
    } catch (error) {
      console.error("Error en el login:", error);
      setError(error.message);
      alert("Error en el login. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <button
        className={`sign-in-button`}
        onClick={handleSignIn}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <span className="sign-in-text">Cargando...</span>
        ) : (
          <>
            <span className="sign-in-text">
              {location.pathname === "/login" ? "Login" : "Sign In"}
            </span>
            {(location.pathname === "/" || location.pathname === "/categories" || location.pathname === "/profile" || location.pathname.startsWith("/asset/")) && ( // Condición para mostrar el icono solo en la ruta "/"
              <img className="sign-in-icon" src="https://www.dropbox.com/scl/fi/1jgcd32zei2fbennqp6xe/sign-in-icon.png?rlkey=d45utdlso2zyi9qeszor7gyp9&st=oel8eys0&raw=1" alt="Sign In Icon" />
            )}
          </>
        )}
      </button>
      {error && <div className="error-message">{error}</div>} {/* Muestra el error debajo del botón */}
    </div>
  );
};


