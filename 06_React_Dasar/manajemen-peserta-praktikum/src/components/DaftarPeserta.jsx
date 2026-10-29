import ItemPeserta from "./ItemPeserta.jsx";

export default function DaftarPeserta({
  peserta,
  totalPeserta,
  pesanKosong,
  onEdit,
  onHapus,
  onUbahKehadiran,
}) {
  if (peserta.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <span className="empty-paper">▤</span>
          <span className="empty-search">⌕</span>
        </div>
        <h3>{pesanKosong}</h3>
        <p>
          {totalPeserta === 0
            ? "Peserta yang ditambahkan akan muncul di bagian ini."
            : "Coba ubah kata pencarian atau pilih filter kelas yang lain."}
        </p>
      </div>
    );
  }

  return (
    <div className="participant-list">
      <div className="list-column-head">
        <span>MAHASISWA</span>
        <span>KELAS</span>
        <span>KEHADIRAN</span>
        <span className="actions-heading">AKSI</span>
      </div>
      {peserta.map((item) => (
        <ItemPeserta
          key={item.id}
          peserta={item}
          onEdit={() => onEdit(item)}
          onHapus={() => onHapus(item.id)}
          onUbahKehadiran={() => onUbahKehadiran(item.id)}
        />
      ))}
    </div>
  );
}