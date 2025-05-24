import { useEffect, useState } from "react";
import "./Inicio.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { Cabecera } from "../Componentes/Cabecera.jsx";

export const Inicio = ({ className, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recursos, setRecursos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecursos, setFilteredRecursos] = useState([]);

  const onSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchQuery(searchText);

    const lowercasedText = searchText.toLowerCase();
    const filtered = recursos.filter((recurso) =>
      recurso.nombre && recurso.nombre.toLowerCase().includes(lowercasedText)
    );
    setFilteredRecursos(filtered);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    // Detectar el idioma del navegador
    const userLanguage = navigator.language || navigator.userLanguage;

    // Establecer el atributo lang en la etiqueta <html>
    document.documentElement.lang = userLanguage.startsWith("es") ? "es" : "en";
    console.log("Idioma del navegador:", userLanguage);

    const user = localStorage.getItem("user"); // O usa auth context, JWT, etc.
    console.log("Usuario en Inicio:", user);
    setIsLoggedIn(!!user);

    fetch("https://artroom-backend.onrender.com/api/recursos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar recursos");
        }
        return res.json();
      })
      .then((data) => setRecursos(data))
      .catch((err) => console.error("Error al cargar recursos:", err));
  }, [location.pathname]);

  const handleSignInClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/signUp");
  const handleCategoriesClick = () => navigate("/categories");
  const handleProfileClick = () => navigate("/profile");
  const handleUploadClick = () => navigate("/uploadAssets");

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    console.log("Usuario eliminado del localStorage");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleCategoryClick = (tipo) => {
    navigate(`/search?tipo=${encodeURIComponent(tipo)}`);
  };

  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`);
  };

  const categories = ["3D", "Scripts", "Add-ons", "Sounds", "Music", "2D"];

  return (
    <div className={`p-gina-de-inicio-no-logueado ${className}`}>
      <Cabecera
        isLoggedIn={isLoggedIn}
        handleUploadClick={handleUploadClick}
        handleProfileClick={handleProfileClick}
        handleSignUpClick={handleSignUpClick}
        handleSignInClick={handleSignInClick}
        handleLogoutClick={handleLogoutClick}
        inputValue={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />

      <div className="filters-grid">
        {categories.map((tipo, index) => (
          <div
            key={index}
            className="filter-item"
            onClick={() => handleCategoryClick(tipo)}
            style={{ cursor: "pointer" }}
            tabIndex={0} // Hace que el elemento sea tabulable
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCategoryClick(tipo); // Permite activar con Enter o Espacio
              }
            }}
          >
            {tipo}
          </div>
        ))}
      </div>

      <div className="recommended-assets">
        <h2>Recommended assets</h2>
        <div className="assets-grid">
          {recursos.map((asset) => (
            <div
              key={asset._id}
              className="asset-item"
              onClick={() => handleAssetClick(asset._id)}
              style={{ cursor: "pointer" }}
              tabIndex={0} // Hace que el elemento sea tabulable
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleAssetClick(asset._id); // Permite activar con Enter o Espacio
                }
              }}
            >
              <img 
                src={asset.previewUrl || asset.archivoUrl} 
                alt={asset.titulo || "Asset preview"} // Descripción del asset
              />
              <div className="asset-title">{asset.titulo}</div>
              <div className="asset-stats">
                <div className="asset-likes">
                  <img 
                    src="https://www.dropbox.com/scl/fi/q33jkrd672q4d25su0x05/like-icon.png?rlkey=sp7h5t1wobga7jb2ctkk0tbcf&raw=1" 
                    alt="Likes icon" // Descripción del ícono de likes
                    className="stat-icon" 
                  />
                  {asset.numLikes || 0}
                </div>
                <div className="asset-views">
                  <img 
                    src="https://www.dropbox.com/scl/fi/voana9ty7p7zl13it9os8/view-icon.png?rlkey=ma0u1ziyxl1zb0fgilffd3jjx&raw=1" 
                    alt="Views icon" // Descripción del ícono de vistas
                    className="stat-icon" 
                  />
                  {asset.numVistas || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="categories-link"
        onClick={handleCategoriesClick}
        tabIndex={0} // Hace que el elemento sea tabulable
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCategoriesClick(); // Permite activar con Enter o Espacio
          }
        }}
      >
        Search by categories
      </div>

      <footer>
        <div className="social-media">
          <SkillIconsInstagram
            className="skill-icons-instagram-instance"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                console.log("Instagram icon clicked"); // Reemplaza con la acción deseada
              }
            }}
          />
          <LogosYoutubeIcon
            className="logos-youtube-icon-instance"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                console.log("YouTube icon clicked"); // Reemplaza con la acción deseada
              }
            }}
          />
          <DeviconTwitter
            className="devicon-twitter-instance"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                console.log("Twitter icon clicked"); // Reemplaza con la acción deseada
              }
            }}
          />
        </div>
        <div className="copyright">Copyright © UA 2024-2025</div>
      </footer>
    </div>
  );
};