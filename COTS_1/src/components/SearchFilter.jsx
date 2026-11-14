function SearchFilter({
  searchQuery,
  onSearch,
  selectedCategory,
  onFilter,
  resultCount,
}) {
  return (
    <div className="search-filter">
      <label className="field">
        <span>Cari nama shuttle</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Contoh: Kampus ke Stasiun"
        />
      </label>
      <label className="field">
        <span>Sesi perjalanan</span>
        <select
          value={selectedCategory}
          onChange={(event) => onFilter(event.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Pagi">Pagi</option>
          <option value="Siang">Siang</option>
          <option value="Sore">Sore</option>
        </select>
      </label>
      <p className="result-count" aria-live="polite">{resultCount} hasil</p>
    </div>
  )
}

export default SearchFilter