// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import "../styles/crearObraForm.css";
// import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const CrearObraForm = ({ portfoliId }) => {
//   const { token } = useAuth();
//     const navigate = useNavigate(); 

//   const [albums, setAlbums] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [albumId, setAlbumId] = useState("");
//   const [categoriaId, setCategoriaId] = useState("");
//   const [titol, setTitol] = useState("");
//   const [descripcio, setDescripcio] = useState("");
//   const [fitxer, setFitxer] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Agafem àlbums i categories
//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const [categoriesRes, albumsRes] = await Promise.all([
//         axios.get("http://localhost:8085/api/categories"),
//         axios.get("http://localhost:8085/api/albums", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }),
//       ]);

//       setCategories(categoriesRes.data.data);
//       setAlbums(albumsRes.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   fetchData();
// }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!fitxer) {
//       setError("Has de pujar un fitxer");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("album_id", albumId);
//     formData.append("categoria_id", categoriaId);
//     formData.append("titol", titol);
//     formData.append("descripcio", descripcio);
//     formData.append("fitxer", fitxer);

//     setLoading(true);
//     setError(null);

//      try {
//       await axios.post("http://localhost:8085/api/obres", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Redirigim al dashboard després de crear l'obra
//       navigate("/dashboard"); 
//     } catch (err) {
//       console.error(err);
//       setError("No s'ha pogut crear l'obra");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="obra-form" onSubmit={handleSubmit}>
//       {error && <p className="obra-error">{error}</p>}

//       <label>Àlbum</label>
//             <select
//         value={albumId}
//         onChange={(e) => setAlbumId(e.target.value)}
//         required
//         >
//         <option value="">Selecciona un àlbum</option>
//         {albums.map((album) => (
//             <option key={album.id} value={album.id}>
//             {album.nom}
//             </option>
//         ))}
//         </select>

//       <label>Categoria</label>
//       <select
//         value={categoriaId}
//         onChange={(e) => setCategoriaId(e.target.value)}
//         required
//       >
//         <option value="">Selecciona una categoria</option>
//         {categories.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.nom}
//           </option>
//         ))}
//       </select>

//       <label>Títol</label>
//       <input
//         type="text"
//         value={titol}
//         onChange={(e) => setTitol(e.target.value)}
//         required
//       />

//       <label>Descripció</label>
//       <textarea
//         value={descripcio}
//         onChange={(e) => setDescripcio(e.target.value)}
//       />

//       <label>Fitxer</label>
//       <input type="file" onChange={(e) => setFitxer(e.target.files[0])} />

//       <button type="submit" disabled={loading}>
//         {loading ? "Creant..." : "Crear Obra"}
//       </button>
//     </form>
//   );
// };

// export default CrearObraForm;
