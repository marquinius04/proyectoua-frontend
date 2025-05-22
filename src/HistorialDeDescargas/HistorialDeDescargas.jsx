import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HistorialDeDescargas.css";
import { Cabecera } from "../Componentes/Cabecera.jsx";

export const HistorialDeDescargas = () => {
  const [downloadedAssets, setDownloadedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSignInClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/signUp");
  const handleUploadClick = () => navigate("/uploadAssets");
  const handleProfileClick = () => navigate("/profile");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    setIsLoggedIn(!!user);

    const fetchDownloadHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${user._id}`, {
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
            const res = await fetch(`http://localhost:5000/api/recursos/${assetId}`, {
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

  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`);
  };

  return (
    <div className="mis-assets">
      <Cabecera
        isLoggedIn={isLoggedIn}
        handleUploadClick={handleUploadClick}
        handleProfileClick={handleProfileClick}
        handleSignUpClick={handleSignUpClick}
        handleSignInClick={handleSignInClick}
      />

      <div className="assets-container">
        <h1 className="assets-title">Historial de Descargas</h1>
        {loading ? (
          <div className="loading">Cargando historial...</div>
        ) : error || downloadedAssets.length === 0 ? (
          <div className="no-assets-container">
            <p className="no-assets-message">No has descargado ningún asset aún.</p>
          </div>
        ) : (
          <div className="assets-grid">
            {downloadedAssets.map((asset) => (
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
        )}
      </div>
    </div>
  );
};
