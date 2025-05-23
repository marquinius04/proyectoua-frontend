import "./EditarAsset.css";
import { Cabecera } from "../Componentes/Cabecera.jsx";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export const EditarAsset = ({ className, ...props }) => {

  const [showSocialInput, setShowSocialInput] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialLink, setNewSocialLink] = useState("");
  const [pendingLinks, setPendingLinks] = useState([]);
  const [userAssets, setUserAssets] = useState([]); // Estado para los assets del usuario
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {assetId} = useParams();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [downloadedAssets, setDownloadedAssets] = useState([]);
  const [assetTitle, setAssetTitle] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetTags, setAssetTags] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipoArchivo, setTipoArchivo] = useState([]);

  useEffect(() => {
    // Cargar tipos de archivo desde el backend
    fetch("https://artroom-backend.onrender.com/api/tipos")
      .then((res) => res.json())
      .then((data) => setTipoArchivo(data.map((tipo) => tipo.nombre)))
      .catch((error) => console.error("Error al cargar tipos de archivo:", error));
  }, []);

  useEffect(() => {
    // Cargar categorías desde el backend
    fetch("https://artroom-backend.onrender.com/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data.map((cat) => cat.nombre)))
      .catch((error) => console.error("Error al cargar categorías:", error));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      // Aquí puedes manejar la subida del archivo si es necesario
    }
  };

  const handleDeleteAsset = async () => {
    if (!assetId) {
      console.error("Asset ID no definido");
      return;
    }
  
    const confirmed = window.confirm("¿Estás seguro de que deseas borrar este asset? Esta acción no se puede deshacer.");
    if (!confirmed) return;
  
    try {
      const response = await fetch(
        `https://artroom-backend.onrender.com/api/recursos/${assetId}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) throw new Error("Error al borrar el asset");
  
      alert("Asset borrado correctamente");
      navigate("/my-assets"); // Redirige al usuario después de borrar
    } catch (error) {
      console.error("Error al borrar el asset:", error);
      alert("Hubo un problema al borrar el asset");
    }
  };

  const handleSaveChanges = async () => {
    if (!assetId) {
      console.error("Asset ID no definido");
      return;
    }
  
    const updatedAsset = {
      titulo: assetTitle,
      descripcion: assetDescription,
      tipo: assetType,
      tags: assetTags.trim(), // Pasa un único valor como string
    };
  
    try {
      const response = await fetch(
        `https://artroom-backend.onrender.com/api/recursos/${assetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAsset),
        }
      );
  
      if (!response.ok) throw new Error("Error al guardar los cambios");
  
      alert("Asset actualizado correctamente");
      navigate("/profile");
    } catch (error) {
      console.error("Error al actualizar el asset:", error);
      alert("Hubo un problema al guardar los cambios");
    }
  };


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
        <div className="dashboard-perfil">
          <div className="arriba-perfil">
            <h2 className="edit-asset-title">Editar Asset</h2>
            <div className="asset-edit-form">
              <div className="input-container">
                <label className="input-label">Título</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Título del asset"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                />
              </div>
              <div className="input-container">
                <label className="input-label">Descripción</label>
                <textarea
                  className="textarea-field"
                  placeholder="Descripción del asset"
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                />
              </div>
              <div className="input-container">
                <label className="input-label">Categoría</label>
                <select
                  className="select-field"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                >
                  <option value="">Selecciona un tipo de archivo</option>
                  {tipoArchivo.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <label className="input-label">Tags</label>
                <select
                  className="select-field"
                  value={assetTags}
                  onChange={(e) => setAssetTags(e.target.value)}
                >
                  <option value="">Selecciona una categoría para el recurso</option>
                  {categories.map((tags) => (
                    <option key={tags} value={tags}>
                      {tags}
                    </option>
                  ))}
                </select>
              </div>
              <button className="button save-button" onClick={handleSaveChanges}>
                Guardar Cambios
              </button>
              <button className="button delete-button" onClick={handleDeleteAsset}>
                Borrar Asset
              </button>
            </div>
          </div>
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
