const { useEffect, useState } = React;

const skenarioGet = {
  berhasil: {
    label: "Berhasil",
    url: "/api/users?delay=1000",
    timeout: 5000
  },
  kosong: {
    label: "Data kosong",
    url: "/api/users?mode=empty&delay=1000",
    timeout: 5000
  },
  error: {
    label: "Error HTTP",
    url: "/api/users?mode=error&delay=1000",
    timeout: 5000
  },
  timeout: {
    label: "Timeout",
    url: "/api/users?delay=2500",
    timeout: 700
  }
};

function AplikasiRegistrasi() {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorGet, setErrorGet] = useState("");
  const [skenario, setSkenario] = useState("berhasil");
  const [nomorMuatUlang, setNomorMuatUlang] = useState(0);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [sedangMengirim, setSedangMengirim] = useState(false);
  const [hasilPost, setHasilPost] = useState(null);

  // GET berjalan otomatis saat awal dan setiap skenario / permintaan ulang berubah.
  useEffect(() => {
    const controller = new AbortController();
    let effectAktif = true;
    const konfigurasi = skenarioGet[skenario];

    async function ambilPeserta() {
      setLoading(true);
      setErrorGet("");
      setPeserta([]);

      try {
        const response = await axios.get(konfigurasi.url, {
          timeout: konfigurasi.timeout,
          signal: controller.signal
        });
        if (effectAktif) {
          setPeserta(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (!effectAktif || axios.isCancel(error)) return;

        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          setErrorGet(`Request timeout. Batas tunggu ${konfigurasi.timeout} ms telah tercapai.`);
        } else if (error.response) {
          const pesanServer = error.response.data?.message || "Server menolak request.";
          setErrorGet(`HTTP ${error.response.status}: ${pesanServer}`);
        } else {
          setErrorGet("Tidak dapat terhubung ke server. Pastikan server praktikum masih berjalan.");
        }
      } finally {
        if (effectAktif) setLoading(false);
      }
    }

    ambilPeserta();
    return () => {
      effectAktif = false;
      controller.abort();
    };
  }, [skenario, nomorMuatUlang]);

  async function kirimPendaftaran(event) {
    event.preventDefault();
    setHasilPost(null);

    const namaBersih = nama.trim();
    const emailBersih = email.trim();
    const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namaBersih) {
      setHasilPost({
        jenis: "error",
        pesan: "Nama wajib diisi dan tidak boleh hanya berisi spasi."
      });
      return;
    }

    if (!polaEmail.test(emailBersih)) {
      setHasilPost({
        jenis: "error",
        pesan: "Format email tidak valid. Contoh: nama@example.com."
      });
      return;
    }

    const objekData = { name: namaBersih, email: emailBersih };
    setSedangMengirim(true);

    try {
      const response = await axios.post("/api/users", objekData);
      setHasilPost({
        jenis: "success",
        status: response.status,
        data: response.data
      });
    } catch (error) {
      if (error.response) {
        setHasilPost({
          jenis: "error",
          pesan: `HTTP ${error.response.status}: ${error.response.data?.message || "Pendaftaran gagal."}`
        });
      } else {
        setHasilPost({
          jenis: "error",
          pesan: "Pendaftaran gagal karena server tidak dapat dijangkau. Periksa koneksi ke server lokal."
        });
      }
    } finally {
      setSedangMengirim(false);
    }
  }

  const sedangMemuatPeserta = loading;
  const adaPeserta = !loading && !errorGet && peserta.length > 0;
  const dataKosong = !loading && !errorGet && peserta.length === 0;

  return (
    <div className="workspace">
      <section className="practice" aria-label="Daftar peserta" aria-busy={loading}>
        <h2>Daftar peserta</h2>
        <label htmlFor="skenario-get">Skenario GET</label>
        <select
          id="skenario-get"
          value={skenario}
          onChange={(event) => setSkenario(event.target.value)}
        >
          <option value="berhasil">Berhasil</option>
          <option value="kosong">Data kosong</option>
          <option value="error">Error HTTP</option>
          <option value="timeout">Timeout</option>
        </select>
        <div className="form-actions">
          <button
            type="button"
            disabled={loading}
            onClick={() => setNomorMuatUlang((nomor) => nomor + 1)}
          >
            Muat ulang
          </button>
          <span className="field-help">Timeout mengikuti skenario yang dipilih.</span>
        </div>
        <p
          className="result"
          role="status"
          aria-live="polite"
          data-state={errorGet ? "error" : (adaPeserta ? "success" : "")}
        >
          {sedangMemuatPeserta
            ? "Memuat daftar peserta..."
            : errorGet
              ? errorGet
              : dataKosong
                ? "Request berhasil, tetapi data peserta kosong."
                : `Berhasil memuat ${peserta.length} peserta.`}
        </p>
        {adaPeserta && (
          <ul className="users">
            {peserta.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong>
                <div>{user.email}</div>
              </li>
            ))}
          </ul>
        )}
        <p className="field-help">Response GET hanya ditampilkan pada bagian ini. Hasil POST tidak mengubah daftar peserta.</p>
      </section>

      <section className="practice" aria-label="Formulir pendaftaran">
        <h2>Formulir pendaftaran</h2>
        <form onSubmit={kirimPendaftaran} noValidate>
          <label htmlFor="nama-peserta">Nama</label>
          <input
            id="nama-peserta"
            type="text"
            maxLength="80"
            value={nama}
            onChange={(event) => setNama(event.target.value)}
            placeholder="Masukkan nama lengkap"
          />

          <label htmlFor="email-peserta">Email</label>
          <input
            id="email-peserta"
            type="email"
            maxLength="120"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@example.com"
          />

          <div className="form-actions">
            <button type="submit" disabled={sedangMengirim}>
              {sedangMengirim ? "Mengirim..." : "Kirim pendaftaran"}
            </button>
            {sedangMengirim && <span className="field-help">Mengirim data ke API lokal...</span>}
          </div>
        </form>

        <div className="section-divider">
          <h2>Response POST</h2>
          {!hasilPost && (
            <p className="result" role="status">Belum ada pendaftaran yang dikirim.</p>
          )}
          {hasilPost?.jenis === "error" && (
            <p className="result" role="alert" data-state="error">{hasilPost.pesan}</p>
          )}
          {hasilPost?.jenis === "success" && (
            <div className="result" role="status" data-state="success">
              <strong>Simulasi berhasil, data tidak disimpan.</strong>
              <div className="response-data">
                <p><strong>Status HTTP:</strong> {hasilPost.status}</p>
                <p><strong>ID:</strong> {hasilPost.data.id}</p>
                <p><strong>Nama:</strong> {hasilPost.data.name}</p>
                <p><strong>Email:</strong> {hasilPost.data.email}</p>
                <p><strong>Simulated:</strong> {String(hasilPost.data.simulated)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="explanation" style={{ gridColumn: "1 / -1" }}>
        <h2>Alur program React</h2>
        <ol>
          <li><code>useState</code> menyimpan daftar peserta, status loading dan error, skenario GET, input formulir, serta status pengiriman.</li>
          <li><code>useEffect</code> menjalankan Axios GET saat komponen pertama kali tampil dan saat skenario berubah.</li>
          <li><code>AbortController</code> dan penanda effect aktif mencegah response lama mengubah tampilan setelah skenario berubah atau komponen dilepas.</li>
          <li>Axios GET membaca daftar dari <code>response.data</code>. Tombol Muat ulang menaikkan nomor request agar effect berjalan kembali.</li>
          <li>Formulir memanggil <code>preventDefault()</code>, memvalidasi nama dan email, lalu mengirim objek <code>name</code> dan <code>email</code> melalui Axios POST.</li>
          <li>Response POST ditampilkan terpisah. Server mengembalikan simulasi HTTP 201 dan tidak menambahkan pendaftar ke daftar GET.</li>
        </ol>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#root")).render(<AplikasiRegistrasi />);
