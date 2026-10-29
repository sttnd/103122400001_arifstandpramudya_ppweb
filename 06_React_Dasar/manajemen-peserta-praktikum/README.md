# Manajemen Peserta Praktikum

Aplikasi React + Vite untuk mengelola data peserta praktikum.

## Fitur
- Menambah, mengedit, dan menghapus peserta.
- Validasi nama minimal 3 karakter, NIM tepat 8 digit, kelas wajib dipilih, dan NIM tidak boleh duplikat.
- Mengubah status kehadiran.
- Mencari berdasarkan nama atau NIM dan memfilter kelas.
- Ringkasan total peserta, hadir, belum hadir, dan hasil yang sedang ditampilkan.
- Kondisi kosong untuk daftar tanpa data dan pencarian tanpa hasil.

## Persyaratan
Pasang Node.js versi 20.19+ atau 22.12+.

## Cara menjalankan
Buka terminal di folder proyek, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Vite di terminal.

## Memeriksa build
```bash
npm run build
```

Jika berhasil, Vite membuat folder `dist`. Folder `dist` dan `node_modules` tidak perlu dimasukkan ke ZIP pengumpulan.

## Catatan
Data hanya disimpan di state selama aplikasi berjalan. Memuat ulang halaman akan mengembalikan tiga data awal sesuai instruksi praktikum.
