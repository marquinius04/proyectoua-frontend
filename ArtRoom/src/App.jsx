import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Inicio } from "./Inicio/Inicio";
import { Login } from "./Login/Login"; // Importa tu componente de Login
import { Registro } from "./Registro/Registro"; // Importa tu componente de Registro
import { Categorias } from "./Categorias/Categorias"; // Importa correctamente el componente Categorias
import { RecuperarContraseña } from "./RecuperarContraseña/RecuperarContraseña";
import { Perfil } from "./Perfil/Perfil";
import { SubirAssets } from "./SubirAssets/SubirAssets"; // Importa correctamente el componente SubirAssets
import { AssetIndividual } from "./AssetIndividual/AssetIndividual"; // Página que usará AssetIndividual
import { MisAssets } from "./MisAssets/MisAssets";
import { Busqueda } from "./Busqueda/Busqueda";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Registro />} />
        <Route path="/categories" element={<Categorias />} />
        <Route path="/forgotPass" element={<RecuperarContraseña />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="/uploadAssets" element={<SubirAssets />}></Route>
        <Route path="/asset/:id" element={<AssetIndividual />} />
        <Route path="/my-assets" element={<MisAssets />} />
        <Route path="/search" element={<Busqueda />} />
      </Routes>
    </Router>
  );
}

