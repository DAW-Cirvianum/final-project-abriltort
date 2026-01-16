import { useTranslation } from "react-i18next";

/**
 * Component per filtrar obres per categoria i tag
 *
 * @param {Object} props
 * @param {Array} props.categories Llista de categories disponibles
 * @param {Array} props.tags Llista de tags disponibles
 * @param {string|number} props.selectedCategory Categoria seleccionada actual
 * @param {string|number} props.selectedTag Tag seleccionat actual
 * @param {function} props.onCategoryChange Funció per canviar la categoria seleccionada
 * @param {function} props.onTagChange Funció per canviar el tag seleccionat
 * @returns {JSX.Element}
 */
const ObresFilters = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange
}) => {
  // Funció de traducció
  const { t } = useTranslation();

  return (
    <div className="filters-container">
      {/* Selector de categories */}
      <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)}>
        <option value="">{t("obresFilters.allCategories")}</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nom}</option>
        ))}
      </select>

      {/* Selector de tags */}
      <select value={selectedTag} onChange={e => onTagChange(e.target.value)}>
        <option value="">{t("obresFilters.allTags")}</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.nom}</option>
        ))}
      </select>
    </div>
  );
};

export default ObresFilters;
