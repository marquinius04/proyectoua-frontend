import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para la redirección
import { useLocation } from "react-router-dom"; // Importamos useLocation para la detección de página
import "./SignUpButton.css";

export const SignUpButton = ({ className, usuario, onSignUpSuccess, ...props }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inicializamos useNavigate
  const location = useLocation(); // Inicializamos useNavigate

  const handleSignUp = async () => {
    if (!usuario?.username || !usuario?.email || !usuario?.password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("REACT_APP_API_URL/api/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      });

      console.log("Datos enviados al backend:", usuario);

      if (!response.ok) {
        throw new Error("Error al registrarse");
      }

      const data = await response.json();
      console.log("Usuario registrado:", data);
      alert("Registro exitoso");

      // Llamamos a la función onSignUpSuccess pasada por props
      if (onSignUpSuccess) {
        onSignUpSuccess(data); // Aquí puedes pasar los datos del usuario o redirigir
      }

      // Redirigimos a la página de inicio logueado
      navigate("/"); // Cambia "/inicio-logueado" a la ruta correspondiente

    } catch (error) {
      console.error(error);
      alert("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`sign-up-button`}
      onClick={handleSignUp}
      disabled={loading}
      {...props}
    >
      <span className="sign-up-text">
        {location.pathname === "/signUp" ? "Create account" : "Sign Up"}
      </span>
      {(location.pathname === "/" || location.pathname === "/categories" || location.pathname === "/profile" || location.pathname.startsWith("/asset/")) && ( // Condición para mostrar el icono solo en la ruta "/"
        <img className="sign-up-icon" src="https://www.dropbox.com/scl/fi/cu54l5unhbsxmn7pztd3a/sign-up-icon.png?rlkey=30jxora6cu09z3wufmfq8ni6q&st=dmjflu71&raw=1" alt="Sign Up Icon" />
      )}
    </button>
  );
};

