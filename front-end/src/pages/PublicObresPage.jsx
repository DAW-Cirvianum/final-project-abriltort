import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next"; 
import ObresFilters from "../components/ObresFilters";
import ObresGrid from "../components/ObresGrid";
import '../styles/publicObres.css';

/**
 * Pàgina pública per mostrar totes les obres amb filtres per categories i tags.
 *
 * @returns {JSX.Element} Component de pàgina pública d'obres
 */
const PublicObresPage = () => {
  const { t } = useTranslation();

  // Estat de les obres i filtres
  const [obres, setObres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  /**
   * Carrega categories i tags disponibles
   */
  useEffect(() => {
    axios.get("http://localhost:8085/api/categories")
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories([]));

    axios.get("http://localhost:8085/api/tags")
      .then(res => setTags(res.data.data || []))
      .catch(() => setTags([]));
  }, []);

  /**
   * Carrega obres públiques segons els filtres seleccionats
   */
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category_id = selectedCategory;
    if (selectedTag) params.tag_id = selectedTag;

    axios
      .get("http://localhost:8085/api/obres/public/all", { params })
      .then(res => setObres(res.data.data || []))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Títol de la pàgina */}
      <h1 className="text-3xl font-bold mb-6 text-center">{t("publicObres.title")}</h1>

      {/* Filtres reutilitzables */}
      <ObresFilters
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
      />

      {/* Llista d'obres o missatge de loading */}
      {loading 
        ? <p className="text-center">{t("publicObres.loading")}</p> 
        : <ObresGrid obres={obres} />}
    </div>
  );
};

export default PublicObresPage;
