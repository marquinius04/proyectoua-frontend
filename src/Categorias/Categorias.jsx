import "../Inicio/Inicio.css"; // Reutilizamos los estilos del header desde Inicio.css
import "./Categorias.css"; // Estilos específicos de Categorias
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Cabecera } from "../Componentes/Cabecera.jsx";

export const Categorias = ({ className, ...props }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
   const user = localStorage.getItem("user");
     setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/"); // o "/login"
  };

  const handleCategoryClick = (categoryName) => {
  // Navega a /search con el filtro de categoría en la query string
  navigate(`/search?categoria=${encodeURIComponent(categoryName)}`);
};

  
  const handleProfileClick = () => navigate("/profile");
  const handleUploadClick = () => navigate("/uploadAssets");

  const handleSignInClick = () => {
    navigate("/login"); // Redirige a la página de Login
  };

  const handleSignUpClick = () => {
    navigate("/signUp"); // Redirige a la página de Registro
  };

  const categories = [
    { name: "Animals and plants", image: "https://www.dropbox.com/scl/fi/c0ttuw8c6b8qox9q9lpvk/plankton.png?rlkey=7ekpp1tw8l760nir3cxulgswh&st=0ovzsrpb&dl&raw=1" },
    { name: "Realistic furnitures", image: "https://www.dropbox.com/scl/fi/2tn002ayj9ckzz7zlgigz/chair.png?rlkey=e80zne7r4rx3hlb68pj2x0z5s&st=cmppepsv&dl&raw=1" },
    { name: "Weapons and ammunition", image: "https://www.dropbox.com/scl/fi/fdwgn5z8ffge70nsagzcj/ak-recargando.png?rlkey=5hau068s1ien9k0fif8g04z6t&st=d67b5gth&dl&raw=1" },
    { name: "Sculpture and Art", image: "https://www.dropbox.com/scl/fi/2s91d7c5ph88nnn1ogq74/lumina.png?rlkey=3rve8t7z5a2pm4to7io41qvxz&st=niphu1ke&dl&raw=1" },
    { name: "Fantastic landscapes", image: "https://www.dropbox.com/scl/fi/h426ejua4jker77mt078t/fantasy.png?rlkey=cma3zzqhl8j99elx0uulp8j22&st=b459byqb&dl&raw=1" },
    { name: "Realistic Landscapes", image: "https://www.dropbox.com/scl/fi/wdzbyq1b2wxuly1krfss0/realistic-env.png?rlkey=wsavwzdzl4ndii6ej213cqnzx&st=63ag2kpa&dl&raw=1" },
    { name: "Cars and Vehicles", image: "https://www.dropbox.com/scl/fi/vjx476errlhj0ew8uj4su/abandoned-cars.png?rlkey=qayrjvpnn28v97dj5v9a6itni&st=1j3yyi8m&dl&raw=1" },
    { name: "Buildings and Structures", image: "https://www.dropbox.com/scl/fi/svvcr8htvsoiitkxe8qdb/desert.png?rlkey=agxxzyaimyznwyu8yg9716boe&st=oj6i9ypz&dl&raw=1" },
  ];

  return (
    <div className={`background`}>
      <Cabecera
        isLoggedIn={isLoggedIn}
        handleUploadClick={handleUploadClick}
        handleProfileClick={handleProfileClick}
        handleSignUpClick={handleSignUpClick}
        handleSignInClick={handleSignInClick}
        handleLogoutClick={handleLogoutClick}
      />

      <h1 className="categories-title">Categories</h1>
      {isMobile ? (
        <div className="login-container">
          {categories.map((category, index) => (
            <div key={index} className="card">
              <button 
                className="button" 
                tabIndex={0} // Hace que el botón sea tabulable
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCategoryClick(category.name); // Permite activar con Enter o Espacio
                  }
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-4-columns">
          {categories.map((category, index) => (
            <div
              key={index}
              className="card"
              onClick={() => handleCategoryClick(category.name)}
              style={{ cursor: "pointer" }}
              tabIndex={0} // Hace que el elemento sea tabulable
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCategoryClick(category.name); // Permite activar con Enter o Espacio
                }
              }}
            >
              <img src={category.image} alt={category.name} />
              <div className="card-title">{category.name}</div>
            </div>
          ))}
        </div>
      )}

      <footer>
        <div className="social-media">
          <SkillIconsInstagram className="skill-icons-instagram-instance" />
          <LogosYoutubeIcon className="logos-youtube-icon-instance" />
          <DeviconTwitter className="devicon-twitter-instance" />
        </div>
        <div className="copyright">Copyright © UA 2024-2025</div>
      </footer>
    </div>
  );
};