const ObresFilters = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange
}) => {
  return (
    <div className="filters-container">
      <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)}>
        <option value="">Totes les categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nom}</option>
        ))}
      </select>

      <select value={selectedTag} onChange={e => onTagChange(e.target.value)}>
        <option value="">Tots els tags</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.nom}</option>
        ))}
      </select>
    </div>
  );
};

export default ObresFilters;

