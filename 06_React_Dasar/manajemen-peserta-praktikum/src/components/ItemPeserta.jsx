export default function ItemPeserta({
  peserta,
  onEdit,
  onHapus,
  onUbahKehadiran,
}) {
  const inisial = peserta.nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((bagian) => bagian[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article className="participant-row">
      <div className="student-cell">
        <div className={`avatar ${peserta.hadir ? "avatar-present" : "avatar-absent"}`}>
          {inisial}
        </div>
        <div className="student-details">
          <strong>{peserta.nama}</strong>
          <span>NIM {peserta.nim}</span>
        </div>
      </div>

      <div className="class-cell">
        <span className="class-badge">{peserta.kelas}</span>
      </div>

      <div className="attendance-cell">
        <span className={`status-badge ${peserta.hadir ? "status-present" : "status-absent"}`}>
          <span className="status-dot" />
          {peserta.hadir ? "Hadir" : "Belum hadir"}
        </span>
      </div>

      <div className="action-cell">
        <button className="icon-button edit-button" type="button" onClick={onEdit} title="Edit peserta" aria-label={`Edit ${peserta.nama}`}>
          <span aria-hidden="true">✎</span>
        </button>
        <button
          className={`icon-button attendance-button ${peserta.hadir ? "undo-button" : "check-button"}`}
          type="button"
          onClick={onUbahKehadiran}
          title={peserta.hadir ? "Batalkan hadir" : "Tandai hadir"}
          aria-label={peserta.hadir ? `Batalkan hadir ${peserta.nama}` : `Tandai hadir ${peserta.nama}`}
        >
          <span aria-hidden="true">{peserta.hadir ? "↶" : "✓"}</span>
        </button>
        <button className="icon-button delete-button" type="button" onClick={onHapus} title="Hapus peserta" aria-label={`Hapus ${peserta.nama}`}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </article>
  );
}