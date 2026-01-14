import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ObraForm from "../components/ObraForm";

const CrearObraPage = ({ obraId }) => {
  const { token } = useAuth();

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
        // Crida concurrent per albums i categories
        const [albumsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:8085/api/portfoli/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8085/api/categories"),
        ]);

        console.log("Portfoli response:", albumsRes.data);
        setAlbums(albumsRes.data.data.albums || []);
        setCategories(categoriesRes.data.data || []);

        // Si estem editant, carregar obra
        if (obraId) {
          const obraRes = await axios.get(`http://localhost:8085/api/obres/${obraId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setObraData(obraRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError("No s'ha pogut carregar dades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, obraId]);

  const handleSuccess = (novaObra) => {
    console.log("Obra guardada:", novaObra);
  };

  if (loading) return <p>Carregant formulari...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>{obraId ? "Editar obra" : "Crear nova obra"}</h2>
      <ObraForm
        initialData={obraData}
        albums={albums}
        categories={categories}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CrearObraPage;
