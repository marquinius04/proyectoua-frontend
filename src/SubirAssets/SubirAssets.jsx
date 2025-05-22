import "./SubirAssets.css";
import { LogoArtRoomDefinitivo2 } from "../LogoArtRoomDefinitivo2/LogoArtRoomDefinitivo2.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const subirArchivoDropbox = async (file) => {
  const formData = new FormData();
  formData.append("archivo", file); // 'archivo' porque multer espera ese nombre

  const response = await fetch("http://localhost:5000/api/assets/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return { url: data.url, fileName: file.name };
};

export const SubirAssets = ({ className, ...props }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Estados para categorías
  const [categories, setCategories] = useState([]); // Categorías desde el backend
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoría seleccionada

  // Estados para tipos
  const [tipos, setTipos] = useState([]); // Tipos desde el backend
  const [selectedTipo, setSelectedTipo] = useState(""); // Tipo seleccionado

  // Estados para tags
  const [tags, setTags] = useState([]); // Tags seleccionadas
  const [newTag, setNewTag] = useState(""); // Nueva tag a agregar

  const [uploadedFile, setUploadedFile] = useState(null); // Estado para almacenar la URL del archivo subido
  const [uploadedFileName, setUploadedFileName] = useState(""); // Estado para almacenar el nombre del archivo subido
  const [thumbnailFile, setThumbnailFile] = useState(null); // Estado para almacenar la URL del thumbnail
  const [thumbnailFileName, setThumbnailFileName] = useState(""); // Estado para almacenar el nombre del thumbnail

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Actualiza la categoría seleccionada
  };

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value); // Actualiza el tipo seleccionado
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim(); // Elimina espacios en blanco al inicio y al final
    if (trimmedTag !== "" && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]); // Agrega la nueva tag al estado
      setNewTag(""); // Limpia el campo de entrada
    }
  };

  // Método para manejar el cambio en el select
  const handleInputChange = (e) => {
    const value = e.target.value.trim(); // Elimina espacios en blanco
    if (value !== "") {
      setNewTag(value); // Actualiza el estado solo si el valor no está vacío
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove)); // Elimina la tag seleccionada
  };

  const handleUpload = async () => {
    const userRaw = localStorage.getItem("user");
    let user;

    try {
      user = JSON.parse(userRaw); // asegúrate de que es un objeto
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      alert("Error al obtener la sesión del usuario.");
      return;
    }

    if (!user || !user._id || !uploadedFile || !thumbnailFile) {
      alert("Debes subir archivo, thumbnail y estar logueado.");
      return;
    }

    const assetData = {
      titulo,
      descripcion,
      archivoUrl: uploadedFile,
      thumbnailUrl: thumbnailFile,
      tags: [...tags.filter(tag => tag.trim() !== ""), selectedCategory].filter(tag => tag.trim() !== ""), // Filtra cadenas vacías
      tipo: selectedTipo,
      usuarioId: user._id, // Aquí se incluye correctamente
    };

    try {
      const response = await fetch("http://localhost:5000/api/recursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });

      const data = await response.json();
      if (data.success) {
        alert("¡Asset registrado correctamente!");
        navigate("/");
      } else {
        console.error("Respuesta inesperada del backend:", data);
        alert("Error al registrar asset.");
      }
    } catch (error) {
      console.error("Error al enviar asset:", error);
      alert("Error de red al registrar asset.");
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await subirArchivoDropbox(file);
      setThumbnailFile(result.url);
      setThumbnailFileName(result.fileName);
      console.log("Thumbnail subido:", result.url);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await subirArchivoDropbox(file);
      setUploadedFile(result.url);
      setUploadedFileName(result.fileName);
      console.log("Archivo subido a Dropbox:", result.url);
    }
  };

  const handleCancelUpload = () => {
    setUploadedFile(null); // Elimina la URL del archivo subido
    setUploadedFileName(""); // Elimina el nombre del archivo subido
  };

  useEffect(() => {
    const userRaw = localStorage.getItem("user"); // Obtiene el usuario del localStorage
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch (e) {
      user = null;
    }
    setIsLoggedIn(!!user); // Actualiza el estado

    if (!user) {
      navigate("/"); // Redirige al inicio si no está logueado
      return;
    }

    // Cargar categorías desde el backend
    fetch("http://localhost:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        const nombres = data.map((cat) => cat.nombre);
        setCategories(nombres);
      })
      .catch((error) => {
        console.error("Error al cargar las categorías:", error);
      });

    // Cargar tipos desde el backend
    fetch("http://localhost:5000/api/tipos")
      .then((res) => res.json())
      .then((data) => {
        const nombres = data.map((tipo) => tipo.nombre);
        setTipos(nombres);
      })
      .catch((error) => {
        console.error("Error al cargar los tipos:", error);
      });
  }, [navigate]); // Solo depende de navigate

  return (
    <div className={`p-gina-de-subir-assets`}>
      <div className="header">
        <LogoArtRoomDefinitivo2 className="logo-art-room-definitivo-2-instance" />
        <div className="search-container">
          <img
            src="https://www.dropbox.com/scl/fi/ieaswykdv57270lwyk217/vector0.svg?rlkey=infc1esp7w5jleq4zlb80nr5p&st=f84l3uv2&raw=1"
            alt="Search Icon"
            className="search-icon"
          />
          <input type="text" className="search-text" placeholder="Search..." />
        </div>
        <div className="auth-buttons">
          <button className="upload-icon">
            <img src="https://www.dropbox.com/scl/fi/o4cednhkybd1ty8xsp5x7/upload-icon.png?rlkey=0ymn2yz9rqdpuyf2hd50hoa7o&st=0t6y1zo8&dl&raw=1"></img>
          </button>
          <button className="user-icon">
            <img src="https://www.dropbox.com/scl/fi/hfz5wn581d6rot1ccxuyh/user-icon.png?rlkey=hm75yyttqaw7hb8n5tk3ja3xq&st=rknzoa1v&dl&raw=1"></img>
          </button>
        </div>
      </div>

      <div className="subir-assets-container">
        <div className="div-izquierda">
          <div className="main-info">
            <div className="input-container">
              <label className="input-label">Title</label>
              <input
                type="text"
                className="input-field"
                placeholder="What is the name of your project?"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="input-label">Description</label>
              <input
                type="text"
                className="input-field"
                placeholder="Describe your project"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
          <div className="media-files">
            {uploadedFile ? (
              <div className="uploaded-file-container">
                <p className="uploaded-file-name">{uploadedFileName}</p>
                <button
                  className="cancel-upload-button"
                  onClick={handleCancelUpload}
                  aria-label="Cancel file upload"
                >
                  ✖
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="media-upload"
                  className="file-input"
                  accept=".mp4, .png, .jpg, .jpeg, .obj, .fbx, .glb, .gltf, .blend, .mp3, .wav, .flac, .js, .jsx, .ts, .tsx, .py, .java, .c, .cpp"
                  onChange={(e) => handleFileUpload(e)}
                />
                <label htmlFor="media-upload" className="media-upload-label">
                  <img
                    src="https://www.dropbox.com/scl/fi/msdm8luh3afl9g9qwl96o/media-upload.png?rlkey=ws5ahcdoipiueocleyrqsyolj&st=n3k2l30l&raw=1"
                    alt="media upload icon"
                  />
                </label>
                <p>Add or drag any type of media file here</p>
              </>
            )}
            {/* Select para tipos */}
            <div className="tipo-select-container">
              <select
                id="tipo-select"
                className="tipo-select"
                value={selectedTipo}
                onChange={handleTipoChange}
              >
                <option value="">Select a type...</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="button" onClick={handleUpload}>
            Upload
          </button>
        </div>

        {/* Div derecha restaurado */}
        <div className="div-derecha">
          <h1>Thumbnail</h1>
          <div className="media-rectangle">
            {thumbnailFile ? (
              <img
                src={thumbnailFile}
                alt="Uploaded thumbnail preview"
                className="uploaded-file-preview"
              />
            ) : (
              <>
                <input
                  type="file"
                  id="thumbnail-upload"
                  className="file-input"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleThumbnailUpload}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="media-upload-label"
                >
                  <img
                    src="https://www.dropbox.com/scl/fi/18y0fpk4tvf1rhxzt93gq/media-icon.svg?rlkey=wph40wpuhvkgxajjbd0441mxm&st=c2cuud3q&raw=1"
                    alt="media file icon"
                  />
                </label>
              </>
            )}
          </div>
          <button
            className="button"
            onClick={() => document.getElementById("thumbnail-upload")?.click()}
            aria-label="Upload a thumbnail image"
          >
            Upload photo
          </button>

          <h1>Tags</h1>
          <div className="tags-container">
            {tags?.map((tag, index) => (
              <div key={`${tag}-${index}`} className="tag">
                {tag}
                <button
                  className="remove-tag-button"
                  onClick={() => handleRemoveTag(index)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="add-tag-container">
            <select
              className="add-tag-select"
              value={newTag}
              onChange={handleInputChange}
              aria-label="Select a category tag to add"
            >
              <option value="">Select a category...</option>
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              className="add-tag-button"
              onClick={handleAddTag}
              aria-label="Add selected tag"
            >
              <img
                src="https://www.dropbox.com/scl/fi/w9f8fad221ofvffhg9im6/add-tag-button.svg?rlkey=30vbxlaff4cnscrajjj8f0otk&st=wgrj2bef&raw=1"
                alt="add tag button"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};