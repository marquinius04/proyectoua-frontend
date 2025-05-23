import "./AssetIndividual.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Cabecera } from "../Componentes/Cabecera.jsx";

export const AssetIndividual = ({ className = "", ...props }) => {
  const { id } = useParams(); // Obtiene el id de la URL
  const [asset, setAsset] = useState(null); // Estado para almacenar los datos del asset
  const [randomAssets, setRandomAssets] = useState([]); // Estado para almacenar los assets aleatorios
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [comments, setComments] = useState([]); // Estado para almacenar los comentarios
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    setIsLoggedIn(!!user);
  
    const fetchAsset = async () => {
      try {
        const response = await fetch(`https://artroom-backend.onrender.com/api/recursos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el asset");
        }
        const data = await response.json();
        setAsset(data);
  
        // Revisar si el usuario ya dio like (con user parseado)
        if (user && data.usuariosLikes && data.usuariosLikes.includes(user._id)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
  
        // Contar vista
        if (user) {
          await fetch(`https://artroom-backend.onrender.com/api/recursos/${id}/view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
          });
  
          setAsset((prev) => ({
            ...prev,
            numVistas: (prev.numVistas) + 1,
            usuariosVistos: [...(prev.usuariosVistos || []), user._id],
          }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRandomAssets = async () => {
      try {
        const response = await fetch("https://artroom-backend.onrender.com/api/recursos/random"); // Solicita 3 assets aleatorios
        if (!response.ok) {
          throw new Error("Error al obtener assets aleatorios");
        }
        const data = await response.json();
        setRandomAssets(data); // Actualiza el estado con los assets aleatorios
        console.log(data);
      } catch (error) {
        console.error("Error al obtener assets aleatorios:", error);
      }
    };

    const fetchComentarios = async () => {
      try {
        const response = await fetch(`https://artroom-backend.onrender.com/api/comentarios/recurso/${id}`);
        if (!response.ok) throw new Error("Error al obtener comentarios");
        const data = await response.json();
        // Mapear para extraer lo necesario directamente
        const parsed = data.map((c) => ({
          user: c.usuarioId?.username || "Usuario",
          text: c.texto,
        }));
        setComments(parsed);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    };
    

    fetchAsset();
    fetchRandomAssets();
    fetchComentarios();
  }, [id]); // Ejecuta el efecto cuando cambia el id

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'archivo'); // Nombre por defecto
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  if (loading) return <div>Cargando modelo...</div>; // Muestra un mensaje mientras se cargan los datos
  if (error) return <div>Error: {error}</div>; // Muestra un mensaje de error si ocurre un problema

  
  
  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`);
  };

  const handleSignInClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/signUp");
  const handleProfileClick = () => navigate("/profile");
  const handleUploadClick = () => navigate("/uploadAssets");
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    console.log("Usuario eliminado del localStorage");
    setIsLoggedIn(false);
    navigate("/");
  };

  const registrarDescarga = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
  
    if (!user || !user._id) {
      alert("Debes iniciar sesión para descargar este recurso");
      return;
    }
  
    try {
      // Registrar la descarga en el historial del usuario
      await fetch(`https://artroom-backend.onrender.com/api/usuarios/${user._id}/descargar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });      
  
      // Descargar el archivo
      handleDownload(asset.archivoUrl, `${asset.titulo || "archivo"}.zip`);
    } catch (error) {
      console.error("Error al registrar la descarga:", error);
      alert("Error al registrar la descarga");
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para dar like");
      return;
    }
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?._id) {
      alert("Usuario inválido");
      return;
    }
  
    try {
      const response = await fetch(`https://artroom-backend.onrender.com/api/recursos/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (!response.ok) throw new Error("Error al actualizar like");
  
      const data = await response.json();
  
      setAsset((prev) => {
        const wasLiked = prev.usuariosLikes?.includes(user._id);
      
        const updatedUsuariosLikes = wasLiked
          ? prev.usuariosLikes.filter((u) => u !== user._id)
          : [...(prev.usuariosLikes || []), user._id];
      
        return {
          ...prev,
          numLikes: updatedUsuariosLikes.length,
          usuariosLikes: updatedUsuariosLikes,
        };
      });
      setLiked((prev) => !prev);
      
    } catch (error) {
      console.error("Error al hacer toggle de like:", error);
    }
  };

  return (
    <div className={`asset-individual ${className}`} {...props}>
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
      <div className="asset-content">
        {/* Primera fila: Información del asset y proyectos relacionados */}
        <div className="asset-row">
          <div className="asset-info">
            <img
              src={asset.previewUrl}
              alt={asset.titulo}
              className="asset-image"
            />
            <div className="asset-stats">
              <h1>{asset.titulo}</h1>
              <h1 onClick={handleToggleLike} style={{ cursor: "pointer" }}>
                <img
                  alt="Likes"
                  className="stat-icon"
                  src={
                    liked
                      ? "https://www.dropbox.com/scl/fi/r075gjigukkyehedeidkh/like-icon3.png?rlkey=742vizuaztclbj6x1f7px29el&st=75krns60&dl&raw=1"
                      : "https://www.dropbox.com/scl/fi/q33jkrd672q4d25su0x05/like-icon.png?rlkey=sp7h5t1wobga7jb2ctkk0tbcf&st=waxwiqoe&dl&raw=1"
                  }
                />
                {asset?.numLikes}
              </h1>
              <h1>
                <img
                  alt="Views"
                  className="stat-icon"
                  src="https://www.dropbox.com/scl/fi/voana9ty7p7zl13it9os8/view-icon.png?rlkey=ma0u1ziyxl1zb0fgilffd3jjx&raw=1"
                />
                {asset?.numVistas - 1 || "Falta BD"}
              </h1>
            </div>
            <p className="asset-usuario">Subido por: {asset.usuarioId.username}</p>
            <p>{asset?.descripcion || "No tiene descripción"}</p>

            {/* Nueva sección para las tags */}
            {Array.isArray(asset.tags) && asset.tags.length > 0 && (
              <div className="asset-tags">
                <h3>Etiquetas:</h3>
                <div className="tags-container">
                  {asset.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <button className="download-button" onClick={registrarDescarga}>
            Descargar
          </button>
          </div>

          {/* Proyectos relacionados */}
          <div className="asset-related">
            <h2>Proyectos relacionados</h2>
            <div className="related-assets">
              {randomAssets.map((relatedAsset) => (
                <div
                  key={relatedAsset._id}
                  className="related-asset-item"
                  onClick={() => handleAssetClick(relatedAsset._id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={relatedAsset.previewUrl || relatedAsset.archivoUrl}
                    alt={relatedAsset.titulo}
                    className="related-asset-image"
                  />
                  <div className="related-asset-info">
                    <div className="related-asset-title">{relatedAsset.titulo}</div>
                    <div className="related-asset-user">
                      Publicado por: {relatedAsset.usuarioId.username}
                    </div>
                  </div>
                  <div className="related-asset-stats">
                    <div className="related-asset-likes">
                      <img
                        src="https://www.dropbox.com/scl/fi/q33jkrd672q4d25su0x05/like-icon.png?rlkey=sp7h5t1wobga7jb2ctkk0tbcf&raw=1"
                        alt="Likes"
                        className="stat-icon"
                      />
                      {relatedAsset.numLikes}
                    </div>
                    <div className="related-asset-views">
                      <img
                        src="https://www.dropbox.com/scl/fi/voana9ty7p7zl13it9os8/view-icon.png?rlkey=ma0u1ziyxl1zb0fgilffd3jjx&raw=1"
                        alt="Views"
                        className="stat-icon"
                      />
                      {relatedAsset.numVistas}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segunda fila: Caja de comentarios */}
        <div className="comments-section">
          <h2>Comentarios</h2>
          {isLoggedIn ? (
            <form
              className="comment-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const newComment = e.target.comment.value.trim();
                if (!newComment) return;

                try {
                  const user = JSON.parse(localStorage.getItem("user"));
                  if (!user || !user._id) {
                    throw new Error("Usuario no válido o no autenticado");
                  }

                  const response = await fetch("https://artroom-backend.onrender.com/api/comentarios", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      texto: newComment,
                      recursoId: id,
                      usuarioId: user._id,
                    }),
                  });

                  if (!response.ok) throw new Error("Error al enviar el comentario");

                  const comentarioGuardado = await response.json();

                  setComments((prevComments) => [
                    ...prevComments,
                    {
                      text: comentarioGuardado.texto,
                      user: comentarioGuardado.usuarioId?.username || user.username || "Usuario",
                    },
                  ]);

                  e.target.reset();
                } catch (error) {
                  console.error("Error al enviar comentario:", error);
                }
              }}
            >
              <textarea
                name="comment"
                className="comment-input"
                placeholder="Escribe un comentario..."
                rows="4"
              ></textarea>
              <button type="submit" className="comment-submit-button">
                Enviar
              </button>
            </form>
          ) : (
            <p className="login-message">
              Debes{" "}
              <span onClick={() => navigate("/login")} className="login-link">
                iniciar sesión
              </span>{" "}
              para comentar.
            </p>
          )}
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <p className="comment-user">{comment.user}</p>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
