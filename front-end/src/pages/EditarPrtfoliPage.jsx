import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PortfoliForm from "../components/PortfoliForm";

const EditarPortfoliPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [portfoliData, setPortfoliData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfoli = async () => {
      try {
        const res = await axios.get("http://localhost:8085/api/portfoli/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfoliData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("No s'ha pogut carregar el portfoli.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfoli();
  }, [token]);

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>{error}</p>;
  if (!portfoliData) return <p>No s'ha trobat el portfoli.</p>;

  return (
    <div className="editar-portfoli-page">
      <h2>Editar Portfoli</h2>
      <PortfoliForm initialData={portfoliData} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditarPortfoliPage;
