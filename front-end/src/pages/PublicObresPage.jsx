import { useEffect, useState } from "react";
import axios from "axios";
import ObresFilters from "../components/ObresFilters";
import ObresGrid from "../components/ObresGrid";
import '../styles/publicObres.css';

const PublicObresPage = () => {
  const [obres, setObres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    axios.get("http://localhost:8085/api/categories")
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories([]));

    axios.get("http://localhost:8085/api/tags")
      .then(res => setTags(res.data.data || []))
      .catch(() => setTags([]));
  }, []);

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
      <h1 className="text-3xl font-bold mb-6 text-center">Obres</h1>

      <ObresFilters
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
      />

      {loading ? <p className="text-center">Carregant obres...</p> : <ObresGrid obres={obres} />}
    </div>
  );
};

export default PublicObresPage;
