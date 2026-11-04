const catatanInput = document.querySelector("#catatan");
const tombolHitung = document.querySelector("#tambah-hitungan");
const jumlahHitungan = document.querySelector("#jumlah-hitungan");
const waktuAwal = document.querySelector("#waktu-awal");

const tombolPengumuman = document.querySelector("#muat-pengumuman");
const statusPengumuman = document.querySelector("#status-pengumuman");
const isiPengumuman = document.querySelector("#isi-pengumuman");

const sumberApi = document.querySelector("#sumber-api");
const tombolPeserta = document.querySelector("#ambil-peserta");
const statusPeserta = document.querySelector("#status-peserta");
const infoPeserta = document.querySelector("#info-peserta");
const daftarPeserta = document.querySelector("#daftar-peserta");

const waktuHalamanDibuka = new Date();
waktuAwal.textContent = `Waktu halaman dibuka: ${waktuHalamanDibuka.toLocaleString("id-ID", {
  dateStyle: "full",
  timeStyle: "medium"
})}`;

let hitungan = 0;
tombolHitung.addEventListener("click", () => {
  hitungan += 1;
  jumlahHitungan.textContent = String(hitungan);
});

tombolPengumuman.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  tombolPengumuman.disabled = true;
  statusPengumuman.dataset.state = "";
  statusPengumuman.textContent = "Memuat pengumuman...";
  isiPengumuman.textContent = "";

  xhr.open("GET", "pengumuman.txt", true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      isiPengumuman.textContent = xhr.responseText;
      statusPengumuman.dataset.state = "success";
      statusPengumuman.textContent = "Pengumuman berhasil dimuat.";
    } else {
      statusPengumuman.dataset.state = "error";
      statusPengumuman.textContent = `Gagal memuat pengumuman. HTTP ${xhr.status}. Periksa file pengumuman.txt dan coba lagi.`;
      isiPengumuman.textContent = "Pengumuman tidak dapat ditampilkan.";
    }
    tombolPengumuman.disabled = false;
  };

  xhr.onerror = () => {
    statusPengumuman.dataset.state = "error";
    statusPengumuman.textContent = "Gangguan jaringan saat memuat pengumuman. Periksa server lokal.";
    isiPengumuman.textContent = "Pengumuman tidak dapat ditampilkan.";
    tombolPengumuman.disabled = false;
  };

  xhr.send();
});

tombolPeserta.addEventListener("click", async () => {
  const pilihan = sumberApi.value;
  const konfigurasi = pilihan === "mock"
    ? { nama: "Mock lokal", url: "/api/users?delay=1500" }
    : { nama: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com/users" };

  tombolPeserta.disabled = true;
  statusPeserta.dataset.state = "";
  statusPeserta.textContent = `Memuat data dari ${konfigurasi.nama}...`;
  infoPeserta.textContent = `Sumber: ${konfigurasi.nama} · Data ditampilkan: 0`;
  daftarPeserta.replaceChildren();

  try {
    const response = await fetch(konfigurasi.url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format response bukan array pengguna.");
    }

    const tigaPesertaPertama = data.slice(0, 3);
    infoPeserta.textContent = `Sumber: ${konfigurasi.nama} · Data ditampilkan: ${tigaPesertaPertama.length}`;

    if (tigaPesertaPertama.length === 0) {
      statusPeserta.dataset.state = "success";
      statusPeserta.textContent = "Request berhasil, tetapi tidak ada data peserta.";
    } else {
      const fragmen = document.createDocumentFragment();
      tigaPesertaPertama.forEach((peserta) => {
        const item = document.createElement("li");
        const nama = document.createElement("strong");
        const email = document.createElement("div");
        nama.textContent = peserta.name ?? "Nama tidak tersedia";
        email.textContent = peserta.email ?? "Email tidak tersedia";
        item.append(nama, email);
        fragmen.append(item);
      });
      daftarPeserta.append(fragmen);
      statusPeserta.dataset.state = "success";
      statusPeserta.textContent = "Data peserta berhasil diambil.";
    }
  } catch (error) {
    statusPeserta.dataset.state = "error";
    if (pilihan === "eksternal") {
      statusPeserta.textContent = `Gagal mengambil API eksternal (${error.message}). Periksa koneksi internet atau pilih Mock lokal secara manual.`;
    } else {
      statusPeserta.textContent = `Gagal mengambil data dari Mock lokal: ${error.message}. Pastikan server praktikum berjalan.`;
    }
    infoPeserta.textContent = `Sumber: ${konfigurasi.nama} · Data ditampilkan: 0`;
  } finally {
    tombolPeserta.disabled = false;
  }
});
