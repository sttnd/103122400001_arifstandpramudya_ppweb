const kartuRingkasan = [
  {
    key: "total",
    label: "Total peserta",
    description: "Semua peserta terdaftar",
    icon: "◎",
    className: "stat-total",
  },
  {
    key: "hadir",
    label: "Hadir",
    description: "Sudah hadir",
    icon: "✓",
    className: "stat-present",
  },
  {
    key: "belumHadir",
    label: "Belum hadir",
    description: "Belum melakukan presensi",
    icon: "◷",
    className: "stat-absent",
  },
  {
    key: "hasil",
    label: "Hasil ditampilkan",
    description: "Sesuai pencarian dan filter",
    icon: "▤",
    className: "stat-results",
  },
];

export default function RingkasanPeserta({ ringkasan }) {
  return (
    <section className="stats-grid" aria-label="Ringkasan peserta">
      {kartuRingkasan.map((kartu) => (
        <article className={`stat-card ${kartu.className}`} key={kartu.key}>
          <div className="stat-top">
            <span className="stat-label">{kartu.label}</span>
            <span className="stat-icon" aria-hidden="true">{kartu.icon}</span>
          </div>
          <div className="stat-value">{ringkasan[kartu.key]}</div>
          <div className="stat-description">{kartu.description}</div>
        </article>
      ))}
    </section>
  );
}