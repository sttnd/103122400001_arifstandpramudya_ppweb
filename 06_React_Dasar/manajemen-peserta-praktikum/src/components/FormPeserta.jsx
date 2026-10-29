export default function FormPeserta({
  formData,
  onFieldChange,
  onSubmit,
  editing,
  onCancel,
}) {
  return (
    <form className="participant-form" onSubmit={onSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="nama">Nama mahasiswa <span className="required">*</span></label>
        <input
          id="nama"
          name="nama"
          type="text"
          placeholder="Contoh: Dina Putri"
          value={formData.nama}
          onChange={(event) => onFieldChange("nama", event.target.value)}
          autoComplete="name"
        />
        <small>Minimal 3 karakter.</small>
      </div>

      <div className="field-group">
        <label htmlFor="nim">NIM <span className="required">*</span></label>
        <input
          id="nim"
          name="nim"
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="Contoh: 00123001"
          value={formData.nim}
          onChange={(event) => onFieldChange("nim", event.target.value)}
          autoComplete="off"
        />
        <small>Masukkan tepat 8 digit angka.</small>
      </div>

      <div className="field-group">
        <label htmlFor="kelas">Kelas <span className="required">*</span></label>
        <select
          id="kelas"
          name="kelas"
          value={formData.kelas}
          onChange={(event) => onFieldChange("kelas", event.target.value)}
        >
          <option value="">Pilih kelas</option>
          <option value="TI-2A">TI-2A</option>
          <option value="TI-2B">TI-2B</option>
        </select>
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          <span>{editing ? "✓" : "＋"}</span>
          {editing ? "Simpan perubahan" : "Tambah peserta"}
        </button>
        {editing && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}