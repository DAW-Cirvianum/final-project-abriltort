import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ObraForm from "../components/ObraForm";

const EditarObraPage = () => {
  const { token } = useAuth();
  const { id } = useParams(); // ID de l'obra a editar
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [obraData, setObraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Crida concurrent: albums, categories, obra
        const [albumsRes, categoriesRes, obraRes] = await Promise.all([
          axios.get("http://localhost:8085/api/portfoli/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8085/api/categories"),
          axios.get(`http://localhost:8085/api/obres/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAlbums(albumsRes.data.data.albums || []);
        setCategories(categoriesRes.data.data || []);
        setObraData(obraRes.data.data);
      } catch (err) {
        console.error(err);
        setError("No s'ha pogut carregar l'obra, albums o categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  if (loading) return <p>Carregant formulari...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Editar Obra</h2>
      <ObraForm
        initialData={obraData}
        albums={albums}
        categories={categories}
      />
    </div>
  );
};

export default EditarObraPage;
