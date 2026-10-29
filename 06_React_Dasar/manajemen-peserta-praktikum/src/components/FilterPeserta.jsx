export default function FilterPeserta({
  pencarian,
  onPencarianChange,
  filterKelas,
  onFilterKelasChange,
}) {
  return (
    <div className="filters">
      <label className="search-box" htmlFor="pencarian">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          id="pencarian"
          type="search"
          placeholder="Cari nama atau NIM..."
          value={pencarian}
          onChange={(event) => onPencarianChange(event.target.value)}
        />
        {pencarian && (
          <button
            type="button"
            className="clear-search"
            onClick={() => onPencarianChange("")}
            aria-label="Hapus pencarian"
          >
            ×
          </button>
        )}
      </label>

      <label className="filter-select-wrap" htmlFor="filter-kelas">
        <span className="filter-label">Kelas</span>
        <select
          id="filter-kelas"
          value={filterKelas}
          onChange={(event) => onFilterKelasChange(event.target.value)}
        >
          <option value="semua">Semua kelas</option>
          <option value="TI-2A">TI-2A</option>
          <option value="TI-2B">TI-2B</option>
        </select>
        <span className="select-chevron" aria-hidden="true">⌄</span>
      </label>
    </div>
  );
}