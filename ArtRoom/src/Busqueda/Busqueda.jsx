import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Busqueda.css";
import { Cabecera } from "../Componentes/Cabecera.jsx";
import { SkillIconsInstagram } from "../SkillIconsInstagram/SkillIconsInstagram.jsx";
import { LogosYoutubeIcon } from "../LogosYoutubeIcon/LogosYoutubeIcon.jsx";
import { DeviconTwitter } from "../DeviconTwitter/DeviconTwitter.jsx";

export const Busqueda = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Inicializar searchQuery solo una vez con la URL al montar
  const [searchQuery, setSearchQuery] = useState(queryParams.get("q")?.toLowerCase() || "");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recursos, setRecursos] = useState([]);
  const [filteredRecursos, setFilteredRecursos] = useState([]);

  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const tipos = [...new Set(recursos.map((r) => r.tipo).filter(Boolean))];
  const categorias = [...new Set(recursos.flatMap((r) => r.tags || []).filter(Boolean))];

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    fetch("http://localhost:5000/api/recursos")
      .then((res) => res.json())
      .then((data) => {
        setRecursos(data);
      })
      .catch((err) => console.error("Error al cargar recursos:", err));
  }, []);

  useEffect(() => {
    // Filtrar usando el estado local searchQuery y filtros seleccionados
    const resultados = recursos.filter((recurso) => {
      const coincideTitulo = !searchQuery || recurso.titulo?.toLowerCase().includes(searchQuery);
      const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(recurso.tipo);
      const coincideCategoria =
        categoriasSeleccionadas.length === 0 ||
        recurso.tags?.some((tag) => categoriasSeleccionadas.includes(tag));
      return coincideTitulo && coincideTipo && coincideCategoria;
    });

    setFilteredRecursos(resultados);
  }, [recursos, searchQuery, tiposSeleccionados, categoriasSeleccionadas]);

  // Al cambiar el input, actualizamos el estado local y la URL
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value.toLowerCase());

    const params = new URLSearchParams(location.search);
    if (value.trim() === "") {
      params.delete("q");
    } else {
      params.set("q", value);
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  const toggleTipo = (tipo) => {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );
  };

  const handleSignInClick = () => navigate("/login");
  const handleSignUpClick = () => navigate("/signUp");
  const handleProfileClick = () => navigate("/profile");
  const handleUploadClick = () => navigate("/uploadAssets");
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };
  const handleAssetClick = (id) => {
    navigate(`/asset/${id}`);
  };

  return (
    <div className="pagina-busqueda">
      <div className="content">
        <Cabecera
          isLoggedIn={isLoggedIn}
          handleUploadClick={handleUploadClick}
          handleProfileClick={handleProfileClick}
          handleSignUpClick={handleSignUpClick}
          handleSignInClick={handleSignInClick}
          handleLogoutClick={handleLogoutClick}
        />

        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar recursos..."
          style={{ margin: "1em 0", padding: "0.5em", width: "100%", maxWidth: "400px" }}
        />

        <h2>Resultados de búsqueda: "{searchQuery}"</h2>

        <div className="filtros-busqueda">
          <div className="filtro-seccion">
            <h4>Tipos</h4>
            {tipos.map((tipo) => (
              <label key={tipo}>
                <input
                  type="checkbox"
                  checked={tiposSeleccionados.includes(tipo)}
                  onChange={() => toggleTipo(tipo)}
                />
                {tipo}
              </label>
            ))}
          </div>

          <div className="filtro-seccion">
            <h4>Categorías</h4>
            {categorias.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={categoriasSeleccionadas.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="assets-grid">
          {filteredRecursos.length > 0 ? (
            filteredRecursos.map((asset) => (
              <div
                key={asset._id}
                className="asset-item"
                onClick={() => handleAssetClick(asset._id)}
                style={{ cursor: "pointer" }}
              >
                <img src={asset.previewUrl || asset.archivoUrl} alt={asset.titulo} />
                <div className="asset-title">{asset.titulo}</div>
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
            ))
          ) : (
            <p>No se encontraron recursos con ese título.</p>
          )}
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
