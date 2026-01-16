import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PortfoliForm from "../components/PortfoliForm";
import { useTranslation } from "react-i18next";

/**
 * Pàgina per editar el portfoli de l'usuari loguejat
 *
 * @returns {JSX.Element} Formulari per editar el portfoli
 */
const EditarPortfoliPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estat per guardar dades del portfoli, loading i errors
  const [portfoliData, setPortfoliData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect per carregar les dades del portfoli de l'usuari
   */
  useEffect(() => {
    const fetchPortfoli = async () => {
      try {
        const res = await axios.get("http://localhost:8085/api/portfoli/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPortfoliData(res.data.data);
      } catch (err) {
        console.error(err);
        setError(t("editarPortfoli.loadError")); // Missatge internacionalitzat
      } finally {
        setLoading(false);
      }
    };

    fetchPortfoli();
  }, [token, t]);

  /**
   * S'executa quan el formulari es guarda correctament
   */
  const handleSuccess = () => {
    navigate("/dashboard");
  };

  // Mostrem loading mentre carreguem dades
  if (loading) return <p>{t("editarPortfoli.loading")}</p>;

  // Mostrem errors si fallen les crides
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Si no hi ha portfoli, missatge d'avís
  if (!portfoliData) return <p>{t("editarPortfoli.notFound")}</p>;

  return (
    <div className="editar-portfoli-page">
      <h2>{t("editarPortfoli.title")}</h2>

      {/* Formulari reutilitzable amb dades inicials */}
      <PortfoliForm initialData={portfoliData} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditarPortfoliPage;
