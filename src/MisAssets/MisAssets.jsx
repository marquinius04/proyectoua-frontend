import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MisAssets.css";
import { Cabecera } from "../Componentes/Cabecera.jsx";

export const MisAssets = () => {
  const [assets, setAssets] = useState([]); // Estado para almacenar los assets del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login"); // Redirige a la página de Login
  };

  const handleSignUpClick = () => {
    navigate("/signUp"); // Redirige a la página de Registro
  };

  const handleUploadClick = () => navigate("/uploadAssets");

  const handleProfileClick = () => navigate("/profile");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    setIsLoggedIn(!!user);

    const fetchUserAssets = async () => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user._id) {
        navigate("/login"); // Redirige al login si el usuario no está autenticado
        return;
      }

      try {
        const response = await fetch(`REACT_APP_API_URL/api/recursos/usuario/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los assets del usuario");
        }

        const data = await response.json();
        setAssets(data); // Actualiza el estado con los assets del usuario
      } catch (error) {
        console.error("Error al obtener los assets:", error);
        setError(true); // Cambia el estado de error a true
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssets();
  }, [navigate]);

  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`); // Navega a la página del asset individual
  };

  return (
    <div className="mis-assets">
      {/* Header */}
      <Cabecera
        isLoggedIn={isLoggedIn}
        handleUploadClick={handleUploadClick}
        handleProfileClick={handleProfileClick}
        handleSignUpClick={handleSignUpClick}
        handleSignInClick={handleSignInClick}
      />

      {/* Contenedor principal */}
      <div className="assets-container">
        <h1 className="assets-title">My Assets</h1>
        {loading ? (
          <div className="loading">Cargando tus assets...</div>
        ) : error || assets.length === 0 ? (
          <div className="no-assets-container">
            <p className="no-assets-message">¡Aún no has subido nada! Sube algo aquí:</p>
            <button className="upload-button" onClick={handleUploadClick}>
              Subir Asset
            </button>
          </div>
        ) : (
          <div className="assets-grid">
            {assets.map((asset) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};