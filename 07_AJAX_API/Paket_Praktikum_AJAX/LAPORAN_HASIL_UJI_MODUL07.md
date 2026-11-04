# Laporan Praktikum Modul 07: AJAX dan Konsumsi API

## Identitas Praktikan

- Nama: ........................................................
- NIM: ..........................................................
- Kelas: ........................................................
- Tanggal pengujian: .............................................

## 1. Tujuan

Praktikum ini menerapkan komunikasi asynchronous pada halaman web. Soal 1 menggunakan XMLHttpRequest dan Fetch API. Soal 2 menggunakan Axios GET dan POST serta pengelolaan state dan effect pada React.

## 2. Implementasi Soal 1: Portal Informasi Praktikum

Program menyediakan catatan praktikan, hitungan klik, waktu awal halaman dibuka, pengumuman, dan direktori peserta.

- Event klik tombol **Muat pengumuman** membuat objek `XMLHttpRequest`, lalu mengirim GET asynchronous ke `pengumuman.txt`.
- Program memeriksa `readyState === 4` dan status HTTP. Jika request berhasil, `responseText` ditampilkan pada elemen `pre`. Jika gagal, program menampilkan status HTTP atau pesan gangguan jaringan.
- Event klik tombol **Ambil peserta** menjalankan Fetch ke `/api/users?delay=1500` atau ke `https://jsonplaceholder.typicode.com/users`, sesuai sumber yang dipilih.
- Program memeriksa `response.ok`, membaca JSON, lalu menampilkan maksimal tiga nama dan email dari response.
- Saat request berlangsung, tombol request terkait dinonaktifkan. Catatan, waktu awal, dan tombol hitungan tetap dapat digunakan.

## 3. Implementasi Soal 2: Aplikasi Registrasi Peserta React

- `useState` menyimpan daftar peserta, status loading, pesan error, skenario GET, input nama dan email, serta status dan hasil POST.
- `useEffect` menjalankan Axios GET secara otomatis saat komponen tampil dan saat skenario berubah.
- `AbortController` dan penanda effect aktif membatalkan request lama serta mencegah response lama menimpa hasil skenario terbaru.
- Axios GET membaca data melalui `response.data`. Tombol **Muat ulang** memicu request GET baru.
- Formulir mencegah reload menggunakan `preventDefault()`. Program menolak nama kosong atau hanya spasi dan memvalidasi format email.
- Axios POST mengirim objek `{ name, email }` ke `/api/users`. Response HTTP 201 ditampilkan terpisah dari daftar GET. Data POST hanya simulasi dan tidak disimpan oleh server.

## 4. Hasil Pengujian

Isi kolom hasil aktual setelah menjalankan program di browser. Lampirkan tangkapan layar pada bagian bukti.

| No. | Skenario | Hasil yang diharapkan | Hasil aktual |
|---:|---|---|---|
| 1 | Muat pengumuman, ubah isi `pengumuman.txt`, lalu muat ulang | Isi terbaru tampil melalui XHR tanpa reload halaman | Belum diuji oleh praktikan |
| 2 | Ubah sementara URL XHR menjadi `hilang.txt` | Pesan gagal dengan HTTP 404 | Belum diuji oleh praktikan |
| 3 | Ambil Mock lokal sambil mengetik catatan dan menambah hitungan tiga kali | Tiga peserta tampil; catatan, hitungan, dan waktu awal tetap terjaga | Belum diuji oleh praktikan |
| 4 | Pilih JSONPlaceholder | Maksimal tiga pengguna tampil atau pesan kegagalan eksternal yang jelas | Belum diuji oleh praktikan |
| 5 | Buka Soal 2 lalu tekan Muat ulang | GET otomatis saat awal dan GET baru saat tombol ditekan | Belum diuji oleh praktikan |
| 6 | Pilih Data kosong | Pesan data kosong dan daftar lama dibersihkan | Belum diuji oleh praktikan |
| 7 | Pilih Error HTTP | Pesan HTTP 503 dan daftar lama dibersihkan | Belum diuji oleh praktikan |
| 8 | Pilih Timeout lalu kembali ke Berhasil | Timeout terjadi pada batas 700 ms; aplikasi dapat digunakan lagi | Belum diuji oleh praktikan |
| 9 | Ganti skenario saat request masih berjalan | Hasil akhir mengikuti pilihan terbaru | Belum diuji oleh praktikan |
| 10 | Kirim Rina Praktikan dan `rina@example.com` | HTTP 201, ID 101, data sesuai input, `simulated: true`; daftar GET tetap tiga peserta | Belum diuji oleh praktikan |
| 11 | Kirim nama hanya spasi atau email tidak valid | Formulir menolak pengiriman dan menampilkan petunjuk | Belum diuji oleh praktikan |

## 5. Uji Awal Server dan API

Pemeriksaan teknis awal dilakukan terhadap server lokal menggunakan HTTP request. Hasil berikut berhasil direproduksi pada paket ini:

| Pemeriksaan | Hasil aktual |
|---|---|
| Halaman Soal 1 | HTTP 200 |
| Halaman Soal 2 | HTTP 200 |
| File `pengumuman.txt` | HTTP 200 |
| GET `/api/users?delay=0` | HTTP 200, tiga pengguna |
| GET `/api/users?mode=empty&delay=0` | HTTP 200, array kosong |
| GET `/api/users?mode=error&delay=0` | HTTP 503 |
| POST data Rina Praktikan | HTTP 201, ID 101, `simulated: true` |
| GET setelah POST | Tetap tiga pengguna awal |
| GET dengan jeda 2.500 ms dan batas tunggu 700 ms | Request melewati batas waktu 700 ms |
| File `hilang.txt` | HTTP 404 |

Pemeriksaan ini memverifikasi respons server dan endpoint. Pemeriksaan interaksi langsung di browser, termasuk ketikan saat loading dan pergantian skenario React, tetap perlu dilakukan oleh praktikan dan dibuktikan dengan tangkapan layar.

## 6. Bukti Tangkapan Layar

Tambahkan tangkapan layar berikut setelah pengujian:

1. Soal 1 saat pengumuman dan tiga peserta berhasil ditampilkan.
2. Soal 1 saat request Mock berjalan, dengan catatan terisi dan hitungan bertambah.
3. Soal 1 saat terjadi kegagalan HTTP 404 atau kegagalan API eksternal.
4. Soal 2 saat daftar peserta berhasil dimuat.
5. Soal 2 saat skenario Data kosong atau Error HTTP 503.
6. Soal 2 saat skenario Timeout.
7. Soal 2 setelah POST berhasil, menampilkan HTTP 201, ID 101, dan `simulated: true`.
8. Soal 2 saat validasi nama atau email menolak input.

## 7. Kesimpulan

Soal 1 menunjukkan bahwa XMLHttpRequest dan Fetch API dapat memperbarui bagian halaman tanpa memuat ulang seluruh halaman. Soal 2 menunjukkan bahwa Axios dapat menangani GET dan POST, sedangkan `useState` dan `useEffect` mengelola data serta siklus request pada React. Pengujian browser perlu dilengkapi dengan hasil aktual dan tangkapan layar praktikan.
