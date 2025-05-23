import "./Perfil.css";
import { Cabecera } from "../Componentes/Cabecera.jsx";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export const Perfil = ({ className, ...props }) => {

  const [showSocialInput, setShowSocialInput] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState("");
  const [pendingLinks, setPendingLinks] = useState([]);
  const [userAssets, setUserAssets] = useState([]); // Estado para los assets del usuario
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [downloadedAssets, setDownloadedAssets] = useState([]);


  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    setIsLoggedIn(!!user);

    const fetchDownloadHistory = async () => {
      try {
        const response = await fetch(`https://artroom-backend.onrender.com/api/usuarios/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      
        if (!response.ok) throw new Error("Error al obtener el historial de descargas");
      
        const userData = await response.json();
        const filteredIds = (userData.downloadHistory || []).filter(id => id !== null);
  
        // Aquí hacemos fetch de cada asset para obtener su info completa
        const assetsData = await Promise.all(
          filteredIds.map(async (assetId) => {
            const res = await fetch(`https://artroom-backend.onrender.com/api/recursos/${assetId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            if (!res.ok) return null;
            return res.json();
          })
        );
  
        // Filtramos los null (por si algún asset no existe)
        setDownloadedAssets(assetsData.filter(asset => asset !== null));
      } catch (err) {
        console.error("Error al obtener historial de descargas:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDownloadHistory();
  }, [navigate]);
  


  const detectSocialType = (url) => {
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("youtube.com")) return "youtube";
    return "other";
  };
  
  const handleAddLink = () => {
    const trimmedLink = newSocialLink.trim();
    if (!trimmedLink) return;
  
    // Verifica duplicados en socialLinks o pendingLinks
    const alreadyExists =
      socialLinks.some(link => link.url === trimmedLink) ||
      pendingLinks.some(link => link.url === trimmedLink);
  
    if (alreadyExists) {
      alert("Este enlace ya ha sido añadido.");
      return;
    }
  
    // Detectar tipo automáticamente
    let type = "other";
    if (trimmedLink.includes("instagram.com")) type = "instagram";
    else if (trimmedLink.includes("twitter.com")) type = "twitter";
    else if (trimmedLink.includes("youtube.com")) type = "youtube";
  
    setPendingLinks([...pendingLinks, { url: trimmedLink, type }]);
    setNewSocialLink("");
  };
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.username){
      setNombreUsuario(user.username);
    }
    const fetchUserSocialLinks = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
  
      try {
        const response = await fetch(`https://artroom-backend.onrender.com/api/usuarios/${user._id}`, {
          headers: {
            "Authorization": `Bearer ${user.token}`,
          },
        });
  
        if (!response.ok) throw new Error("Error al obtener usuario");
  
        const data = await response.json();
        setSocialLinks(data.socialLinks || []);
      } catch (err) {
        console.error("Error cargando redes sociales:", err);
      }
    };
  
    fetchUserSocialLinks();
  }, []);

  useEffect(() => {
    const fetchUserAssets = async () => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user._id) {
        navigate("/login"); // Redirige al login si el usuario no está autenticado
        return;
      }

      try {
        const response = await fetch(`https://artroom-backend.onrender.com/api/recursos/usuario/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los assets del usuario");
        }

        const data = await response.json();
        setUserAssets(data); // Actualiza el estado con los assets del usuario
      } catch (error) {
        console.error("Error al obtener los assets:", error);
        setError(true); // Cambia el estado de error a true
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssets();
  }, [navigate]);
  
  const handleSaveSocialLinks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Usuario no autenticado");
  
    const updatedLinks = [...socialLinks, ...pendingLinks];
  
    try {
      const response = await fetch(`https://artroom-backend.onrender.com/api/usuarios/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ socialLinks: updatedLinks }),
      });
  
      if (!response.ok) throw new Error("Error al guardar redes sociales");
  
      alert("Redes sociales actualizadas");
  
      setSocialLinks(updatedLinks); // mostrar los íconos
      setPendingLinks([]);          // limpiar los pendientes
      setShowSocialInput(false);    // cerrar input
      console.log("Redes sociales guardadas:", updatedLinks);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar redes sociales");
    }
  };
  

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
  
    if (!confirmed) return;
  
    const user = JSON.parse(localStorage.getItem("user")); // Asegúrate de que user._id esté disponible
  
    try {
      const response = await fetch(`https://artroom-backend.onrender.com/api/usuarios/delete-account/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
  
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was a problem deleting your account. Please try again.");
    }
  };
  

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://artroom-backend.onrender.com/api/usuarios/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}` // solo si usas JWT
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la contraseña");
      }

      alert("Contraseña actualizada correctamente");
      setShowPasswordForm(false);
      setNewPassword("");
      setRepeatPassword("");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 875);

  useEffect(() => {
   const user = localStorage.getItem("user");
     setIsLoggedIn(!!user);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 875);
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const handleProfileClick = () => navigate("/profile");

  const handleSignInClick = () => {
    navigate("/login"); // Redirige a la página de Login
  };

  const handleSignUpClick = () => {
    navigate("/signUp"); // Redirige a la página de Registro
  };

  const handleUploadClick = () => navigate("/uploadAssets");

  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`);
  };

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

      <div className="dashboard-usuario">
        <div className="dashboard-izq">
          <div className="dashboard-perfil">
            <div className="arriba-perfil">
              <img className="profile-photo" src="https://www.dropbox.com/scl/fi/hfz5wn581d6rot1ccxuyh/user-icon.png?rlkey=hm75yyttqaw7hb8n5tk3ja3xq&st=rknzoa1v&dl&raw=1"></img>
              {nombreUsuario && (
                <div className="bienvenida-usuario">
                  ¡Bienvenido/a, {nombreUsuario}!
                </div>
              )}

              <div className="social-icons-under-profile">
                {socialLinks.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="social-link-icon">
                    {link.type === "instagram" && <SkillIconsInstagram />}
                    {link.type === "twitter" && <DeviconTwitter />}
                    {link.type === "youtube" && <LogosYoutubeIcon />}
                    {link.type === "other" && <span>{link.url}</span>}
                  </a>
                ))}
              </div>

              <div className="divisory-line"></div>

            </div>
            <a href="/my-assets">My Assets</a>
            <div className="assets-grid">
              {loading ? (
                <div className="loading">Cargando tus assets...</div>
              ) : error || userAssets.length === 0 ? (
                <div className="no-assets-container">
                  <p className="no-assets-message">¡Aún no has subido nada! Sube algo aquí:</p>
                  <button className="upload-button" onClick={handleUploadClick}>
                    Subir Asset
                  </button>
                </div>
              ) : (
                userAssets.slice(0, 3).map((asset) => (
                  <div
                    key={asset._id}
                    className="asset-item"
                    onClick={handleAssetClick(asset._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={asset.previewUrl || asset.archivoUrl}
                      alt={asset.titulo}
                      className="asset-image"
                    />
                    <div className="asset-info">
                      <h2 className="asset-title">{asset.titulo}</h2>
                      <p className="asset-description">
                        {asset.descripcion || "Sin descripción"}
                      </p>
                      <div className="asset-stats">
                        <div className="asset-likes">
                          <img
                            src="https://www.dropbox.com/scl/fi/q33jkrd672q4d25su0x05/like-icon.png?rlkey=sp7h5t1wobga7jb2ctkk0tbcf&raw=1"
                            alt="Likes"
                            className="stat-icon"
                          />
                          {asset.numLikes || 0}
                        </div>
                        <div className="asset-views">
                          <img
                            src="https://www.dropbox.com/scl/fi/voana9ty7p7zl13it9os8/view-icon.png?rlkey=ma0u1ziyxl1zb0fgilffd3jjx&raw=1"
                            alt="Views"
                            className="stat-icon"
                          />
                          {asset.numVistas || 0}
                        </div>
                      </div>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/editAsset/${asset._id}`)}
                    >
                      Editar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="dashboard-historial">
            {isMobile ? (
              <button href="/downloadHistory" className="button">Download history</button>
            ) : (
              <>
                <a href="/downloadHistory">Download history</a>
                <div className="assets-grid">
                  {downloadedAssets.slice(0, 3).map((asset) => (
                    <div
                      key={asset._id}
                      className="asset-item"
                      onClick={() => handleAssetClick(asset._id)}
                    >
                      <img
                        src={asset.previewUrl || asset.archivoUrl}
                        alt={asset.titulo}
                        className="asset-image"
                      />
                      <div className="asset-info">
                        <h2 className="asset-title">{asset.titulo}</h2>
                        <div className="asset-stats">
                          <div className="asset-likes">
                            <img
                              src="https://www.dropbox.com/scl/fi/q33jkrd672q4d25su0x05/like-icon.png?rlkey=sp7h5t1wobga7jb2ctkk0tbcf&raw=1"
                              alt="Likes"
                              className="stat-icon"
                            />
                            {asset.numLikes || 0}
                          </div>
                          <div className="asset-views">
                            <img
                              src="https://www.dropbox.com/scl/fi/voana9ty7p7zl13it9os8/view-icon.png?rlkey=ma0u1ziyxl1zb0fgilffd3jjx&raw=1"
                              alt="Views"
                              className="stat-icon"
                            />
                            {asset.numVistas || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-dcha">
          {!showPasswordForm && (
            <button
              className="button"
              onClick={() => setShowPasswordForm(true)}
            >
              Change password
            </button>
          )}

          {showPasswordForm && (
            <div className="password-form">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repeat New Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              
              <div className="form-buttons">
                <button onClick={handleChangePassword} disabled={loading} className="button">
                  {loading ? "Actualizando..." : "✔"}
                </button>
                <button
                  className="button cancel-button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setRepeatPassword("");
                  }}
                >
                  X
                </button>
              </div>
            </div>
          )}
          {!showSocialInput ? (
            <button className="button" onClick={() => setShowSocialInput(true)}>
              Add social networks
            </button>
          ) : (
          <div className="social-form">
            <div className="social-input-group">
              <input
                type="text"
                className="social-input"
                placeholder="Add social link"
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
              />
              <button className="social-add-button" onClick={handleAddLink}>+</button>
            </div>

            <div className="social-button-row">
              <button className="button" onClick={handleSaveSocialLinks}>✔</button>
              <button
                className="button cancel-button"
                onClick={() => {
                  setShowSocialInput(false);
                  setNewSocialLink("");
                }}
              >
                X
              </button>
            </div>
          </div>
          )}
          <button
            className="button delete-account"
            onClick={handleDeleteAccount}
          >
            Delete account
          </button>
        </div>

      </div>

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
