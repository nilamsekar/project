# Kos Abah - Bagian Tagihan (UTS Pemrograman Web)

- **Topik:** Sistem Manajemen Kos Abah (tanpa fitur Admin)
- **Kode kelompok:** A02 (kelas D4 MI 2025 A)
- **Nama / NIM:** Nilam Sekar Ayu / 25091397024
- **Anggota kelompok:** Nilam Sekar Ayu (25091397024), Moch. Albar Kesuma Andung (25091397030), Akbar Wangsa Da Lama (25091397036)
- **Folder repo:** `PWUTS_A02_25091397024`
- **Bagian yang dikerjakan:** Tagihan dan pembayaran (2.a, 2.b, 2.c)

## Deskripsi
Website untuk penghuni Kos Abah: melihat profil kos, memantau tagihan bulanan beserta riwayat pembayarannya, dan mengunggah bukti pembayaran.

## Halaman
| Item | File | Isi |
|---|---|---|
| 2.a | `index.html` | Navbar sticky, hero slider foto (auto-play + panah), profil kos, fasilitas, alur pembayaran, FAQ accordion, footer. Menu memuat 2.b dan 2.c lewat Ajax (`$.load()`). |
| 2.b | `halaman/tagihan.html` | Tagihan Saya: tagihan aktif dan riwayat lunas. |
| 2.c | `halaman/bayar.html` | Form Unggah Bukti Pembayaran. |

## Fitur interaktif 2.b
Badge 4 status, filter status, ringkasan "Total belum lunas", klik baris untuk rincian item (total dari penjumlahan item) dan riwayat pembayaran (menunggu/valid/ditolak), serta simulasi tanggal: tagihan Belum Bayar yang lewat jatuh tempo otomatis menjadi Terlambat (FR-22, TC-10).

## Validasi form 2.c (tabel `pembayaran`)
| Field | Kolom | Aturan |
|---|---|---|
| Pilih tagihan | id_tagihan | Wajib, hanya Belum Bayar atau Terlambat |
| Tanggal bayar | tgl_bayar | Wajib, tidak boleh masa depan |
| Nominal | nominal | Wajib, angka > 0 (terisi otomatis dari total tagihan) |
| Metode | metode | Wajib: tunai atau transfer |
| Bukti bayar | bukti_bayar | Wajib jika transfer, opsional jika tunai. JPG/PNG/PDF, maks 2 MB |

Setelah valid, data dikirim dengan `$.ajax` POST ke `https://httpbin.org/post`, lalu tampil "Bukti terkirim, status: Menunggu Verifikasi" (TC-11). `status_verifikasi` dan `id_verifikator` diisi sistem/Admin, bukan input penghuni.

## Teknologi
HTML5, CSS3 (flexbox, grid, media query), JavaScript, jQuery 3.7.1, Ajax.

## Cara menjalankan
Gunakan Live Server (VS Code) atau `python -m http.server` di folder ini, lalu buka `http://localhost:8000`. Jangan buka lewat `file://`.

## Catatan
- Semua data berupa data contoh di `data/tagihan.json` (mengikuti tabel `tagihan`, `tagihan_item`, `pembayaran`). Alamat (Jl. Mawar No. 12, Surabaya) dan kontak pemilik (Pak Udin, 0812-0002-3417) sudah diperbarui.
- Hero slider dan galeri memakai foto asli (`tampak-depan.jpg`, `kamar.jpg`, `area-bersama.jpg`, `teras-depan.jpg`). Logo dan ikon fasilitas (`ico-*.svg`) bergaya 3D.
- Asumsi kelompok: batas file 2 MB, format JPG/PNG/PDF, endpoint uji httpbin.org.
- Referensi proposal: FR-01, FR-17, FR-20, FR-21, FR-22; TC-10, TC-11, TC-16.
