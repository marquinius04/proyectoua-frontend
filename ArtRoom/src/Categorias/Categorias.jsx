import "../Inicio/Inicio.css"; // Reutilizamos los estilos del header desde Inicio.css
import "./Categorias.css"; // Estilos específicos de Categorias
import { LogoArtRoomDefinitivo2 } from "../LogoArtRoomDefinitivo2/LogoArtRoomDefinitivo2.jsx";
import { SignUpButton } from "../SignUpButton/SignUpButton.jsx";
import { SignInButton } from "../SignInButton/SignInButton.jsx";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  
  const handleProfileClick = () => navigate("/profile");
  const handleUploadClick = () => navigate("/uploadAssets");

  const handleSignInClick = () => {
    navigate("/login"); // Redirige a la página de Login
  };

  const handleSignUpClick = () => {
    navigate("/signUp"); // Redirige a la página de Registro
  };

  const categories = [
    { name: "Animals and Plants", image: "https://www.dropbox.com/scl/fi/c0ttuw8c6b8qox9q9lpvk/plankton.png?rlkey=7ekpp1tw8l760nir3cxulgswh&st=0ovzsrpb&dl&raw=1" },
    { name: "Realistic Furnitures", image: "https://www.dropbox.com/scl/fi/2tn002ayj9ckzz7zlgigz/chair.png?rlkey=e80zne7r4rx3hlb68pj2x0z5s&st=cmppepsv&dl&raw=1" },
    { name: "Weapons and Ammunition", image: "https://www.dropbox.com/scl/fi/fdwgn5z8ffge70nsagzcj/ak-recargando.png?rlkey=5hau068s1ien9k0fif8g04z6t&st=d67b5gth&dl&raw=1" },
    { name: "Sculpture and Art", image: "https://www.dropbox.com/scl/fi/2s91d7c5ph88nnn1ogq74/lumina.png?rlkey=3rve8t7z5a2pm4to7io41qvxz&st=niphu1ke&dl&raw=1" },
    { name: "Fantastic Landscapes", image: "https://www.dropbox.com/scl/fi/h426ejua4jker77mt078t/fantasy.png?rlkey=cma3zzqhl8j99elx0uulp8j22&st=b459byqb&dl&raw=1" },
    { name: "Realistic Landscapes", image: "https://www.dropbox.com/scl/fi/wdzbyq1b2wxuly1krfss0/realistic-env.png?rlkey=wsavwzdzl4ndii6ej213cqnzx&st=63ag2kpa&dl&raw=1" },
    { name: "Cars and Vehicles", image: "https://www.dropbox.com/scl/fi/vjx476errlhj0ew8uj4su/abandoned-cars.png?rlkey=qayrjvpnn28v97dj5v9a6itni&st=1j3yyi8m&dl&raw=1" },
    { name: "Buildings and Structures", image: "https://www.dropbox.com/scl/fi/svvcr8htvsoiitkxe8qdb/desert.png?rlkey=agxxzyaimyznwyu8yg9716boe&st=oj6i9ypz&dl&raw=1" },
  ];

  return (
    <div className={`background`}>
      <div className="header">
        <LogoArtRoomDefinitivo2/>
        <div className="search-container">
          <img src="https://www.dropbox.com/scl/fi/ieaswykdv57270lwyk217/vector0.svg?rlkey=infc1esp7w5jleq4zlb80nr5p&st=f84l3uv2&raw=1" alt="Search Icon" className="search-icon" />
          <input type="text" placeholder="Search..." className="search-text" />
        </div>
        <div className="auth-buttons">
        {isLoggedIn ? (
            <>
              <button className="upload-icon" onClick={handleUploadClick}><img src="https://www.dropbox.com/scl/fi/o4cednhkybd1ty8xsp5x7/upload-icon.png?rlkey=0ymn2yz9rqdpuyf2hd50hoa7o&st=0t6y1zo8&dl&raw=1"></img></button>
              <button className="user-icon" onClick={handleProfileClick}><img src="https://www.dropbox.com/scl/fi/hfz5wn581d6rot1ccxuyh/user-icon.png?rlkey=hm75yyttqaw7hb8n5tk3ja3xq&st=rknzoa1v&dl&raw=1"></img></button>
            </>
          ) : (
            <>
          <SignUpButton
            className="sign-up-button" 
            onClick={handleSignUpClick}
          />
          <SignInButton
            className="sign-in-button"
            onClick={handleSignInClick}
          />
          </>
          )}
        </div>
      </div>

      <h1 className="categories-title">Categories</h1>
      {isMobile ? (
        <div className="login-container">
          {categories.map((category, index) => (
            <div key={index} className="card">
              <button className="button">
                {category.name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-4-columns">
          {categories.map((category, index) => (
            <div key={index} className="card">
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