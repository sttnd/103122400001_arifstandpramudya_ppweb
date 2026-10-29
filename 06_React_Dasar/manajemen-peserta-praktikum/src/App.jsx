import { useMemo, useState } from "react";
import FormPeserta from "./components/FormPeserta.jsx";
import FilterPeserta from "./components/FilterPeserta.jsx";
import DaftarPeserta from "./components/DaftarPeserta.jsx";
import RingkasanPeserta from "./components/RingkasanPeserta.jsx";

const dataAwal = [
  { id: "m-1", nama: "Ani", nim: "10121001", kelas: "TI-2A", hadir: true },
  { id: "m-2", nama: "Budi", nim: "10121002", kelas: "TI-2B", hadir: false },
  { id: "m-3", nama: "Citra", nim: "10121003", kelas: "TI-2A", hadir: false },
];

const formKosong = { nama: "", nim: "", kelas: "" };

export default function App() {
  const [peserta, setPeserta] = useState(dataAwal);
  const [formData, setFormData] = useState(formKosong);
  const [editingId, setEditingId] = useState(null);
  const [pencarian, setPencarian] = useState("");
  const [filterKelas, setFilterKelas] = useState("semua");
  const [pesan, setPesan] = useState(null);

  const pesertaTerlihat = useMemo(() => {
    const kata = pencarian.trim().toLocaleLowerCase();

    return peserta.filter((item) => {
      const cocokKata =
        kata === "" ||
        item.nama.toLocaleLowerCase().includes(kata) ||
        item.nim.toLocaleLowerCase().includes(kata);

      const cocokKelas =
        filterKelas === "semua" || item.kelas === filterKelas;

      return cocokKata && cocokKelas;
    });
  }, [peserta, pencarian, filterKelas]);

  const jumlahHadir = peserta.filter((item) => item.hadir).length;
  const ringkasan = {
    total: peserta.length,
    hadir: jumlahHadir,
    belumHadir: peserta.length - jumlahHadir,
    hasil: pesertaTerlihat.length,
  };

  function resetForm() {
    setFormData(formKosong);
    setEditingId(null);
  }

  function ubahField(field, value) {
    setFormData((sebelumnya) => ({ ...sebelumnya, [field]: value }));
  }

  function mulaiEdit(item) {
    setFormData({ nama: item.nama, nim: item.nim, kelas: item.kelas });
    setEditingId(item.id);
    setPesan({
      tipe: "info",
      teks: `Mode edit aktif untuk peserta ${item.nama}.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function batalEdit() {
    resetForm();
    setPesan({ tipe: "info", teks: "Perubahan dibatalkan. Form siap untuk menambah peserta." });
  }

  function simpanPeserta(event) {
    event.preventDefault();

    const nama = formData.nama.trim();
    const nim = formData.nim.trim();
    const kelas = formData.kelas;

    setFormData({ nama, nim, kelas });

    if (!nama) {
      setPesan({ tipe: "error", teks: "Nama mahasiswa wajib diisi." });
      return;
    }

    if (nama.length < 3) {
      setPesan({ tipe: "error", teks: "Nama harus memiliki minimal 3 karakter setelah spasi dirapikan." });
      return;
    }

    if (!/^\d{8}$/.test(nim)) {
      setPesan({ tipe: "error", teks: "NIM harus terdiri dari tepat 8 digit angka." });
      return;
    }

    if (!["TI-2A", "TI-2B"].includes(kelas)) {
      setPesan({ tipe: "error", teks: "Silakan pilih kelas TI-2A atau TI-2B." });
      return;
    }

    const nimSudahDipakai = peserta.some(
      (item) => item.nim === nim && item.id !== editingId
    );

    if (nimSudahDipakai) {
      setPesan({ tipe: "error", teks: `NIM ${nim} sudah digunakan peserta lain. Gunakan NIM yang berbeda.` });
      return;
    }

    if (editingId) {
      setPeserta((sebelumnya) =>
        sebelumnya.map((item) =>
          item.id === editingId
            ? { ...item, nama, nim, kelas }
            : item
        )
      );
      resetForm();
      setPesan({ tipe: "success", teks: `Data ${nama} berhasil diperbarui.` });
      return;
    }

    const pesertaBaru = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nama,
      nim,
      kelas,
      hadir: false,
    };

    setPeserta((sebelumnya) => [...sebelumnya, pesertaBaru]);
    resetForm();
    setPesan({ tipe: "success", teks: `${nama} berhasil ditambahkan sebagai peserta baru.` });
  }

  function hapusPeserta(id) {
    const itemDihapus = peserta.find((item) => item.id === id);
    setPeserta((sebelumnya) => sebelumnya.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }

    setPesan({
      tipe: "success",
      teks: itemDihapus ? `Data ${itemDihapus.nama} berhasil dihapus.` : "Data peserta berhasil dihapus.",
    });
  }

  function ubahKehadiran(id) {
    const item = peserta.find((pesertaItem) => pesertaItem.id === id);
    setPeserta((sebelumnya) =>
      sebelumnya.map((pesertaItem) =>
        pesertaItem.id === id
          ? { ...pesertaItem, hadir: !pesertaItem.hadir }
          : pesertaItem
      )
    );

    if (item) {
      setPesan({
        tipe: "success",
        teks: `Status kehadiran ${item.nama} diubah menjadi ${item.hadir ? "belum hadir" : "hadir"}.`,
      });
    }
  }

  const pesanKosong =
    peserta.length === 0
      ? "Belum ada peserta."
      : "Peserta tidak ditemukan.";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Manajemen Peserta Praktikum">
          <span className="brand-mark">SM</span>
          <span>
            <strong>Student Management<span className="brand-dot">.</span></strong>
            <small>Praktikum</small>
          </span>
        </a>
        <span className="topbar-tag"><span className="online-dot" /> Praktikum · Modul 06</span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">DASHBOARD PRAKTIKUM</p>
          <h1>Manajemen Peserta</h1>
          <p className="page-description">
            Kelola data mahasiswa, pantau kehadiran, dan temukan peserta dengan lebih mudah.
          </p>
        </div>
        <div className="heading-date">
          <span className="date-icon">▦</span>
          <span><strong>Data praktikum</strong><small>Perbarui data secara langsung</small></span>
        </div>
      </section>

      <RingkasanPeserta ringkasan={ringkasan} />

      {pesan && (
        <div className={`alert alert-${pesan.tipe}`} role="status" aria-live="polite">
          <span className="alert-symbol">
            {pesan.tipe === "error" ? "!" : pesan.tipe === "success" ? "✓" : "i"}
          </span>
          <span>{pesan.teks}</span>
          <button className="alert-close" type="button" onClick={() => setPesan(null)} aria-label="Tutup pesan">×</button>
        </div>
      )}

      <section className="workspace">
        <aside className="form-panel panel">
          <div className="panel-heading">
            <div className="panel-icon form-icon">＋</div>
            <div>
              <h2>{editingId ? "Edit peserta" : "Tambah peserta"}</h2>
              <p>{editingId ? "Perbarui informasi peserta yang dipilih." : "Lengkapi informasi mahasiswa baru."}</p>
            </div>
          </div>
          <FormPeserta
            formData={formData}
            onFieldChange={ubahField}
            onSubmit={simpanPeserta}
            editing={Boolean(editingId)}
            onCancel={batalEdit}
          />
          <div className="form-note">
            <span className="note-icon">i</span>
            <p>Pastikan NIM terdiri dari 8 digit angka dan belum digunakan peserta lain.</p>
          </div>
        </aside>

        <section className="list-panel panel">
          <div className="list-heading">
            <div>
              <h2>Daftar peserta</h2>
              <p>Daftar mahasiswa yang terdaftar pada praktikum.</p>
            </div>
            <span className="count-pill">{peserta.length} peserta</span>
          </div>

          <FilterPeserta
            pencarian={pencarian}
            onPencarianChange={setPencarian}
            filterKelas={filterKelas}
            onFilterKelasChange={setFilterKelas}
          />

          <DaftarPeserta
            peserta={pesertaTerlihat}
            totalPeserta={peserta.length}
            pesanKosong={pesanKosong}
            onEdit={mulaiEdit}
            onHapus={hapusPeserta}
            onUbahKehadiran={ubahKehadiran}
          />

          <div className="list-footer">
            <span>Menampilkan <strong>{pesertaTerlihat.length}</strong> dari <strong>{peserta.length}</strong> peserta</span>
            <span className="footer-status"><span className="online-dot" /> Data diperbarui langsung</span>
          </div>
        </section>
      </section>

      <footer className="page-footer">
        <span>Manajemen Peserta Praktikum</span>
        <span>Arif Stand Pramudya | 103122400001</span>
      </footer>
    </main>
  );
}