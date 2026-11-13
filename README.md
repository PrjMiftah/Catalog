# Catalog & Manajemen Brosur Promosi - PT. Fath Indah Travel Service

Aplikasi web mandiri (*standalone*) untuk katalog, publikasi, pratinjau, dan arsip brosur paket perjalanan ibadah Umrah, Haji Khusus & Furoda, Haji Terencana, Wisata Halal, dan Promo Seasonal.

---

## Fitur Utama

### Tab 1: Daftar & Arsip Brosur (`LogBrosur`)
- **Ringkasan Cepat (Quick Stats):**
  - Total Brosur Terdaftar
  - Jumlah Kategori Materi
  - Jumlah Brosur Aktif
- **Pencarian & Multi-Filter:**
  - Pencarian teks instan (nama brosur, rincian paket, wilayah, catatan)
  - Filter Wilayah (`namakanwil` dari master KanwilFathIndah)
  - Filter Kategori (`catpaket` dari master CatPaket)
  - Filter Status Brosur (Aktif, Expired, Semua Status)
- **Mode Tampilan Ganda (Dual View Mode):**
  1. **Tabel List (Tabel Lengkap):** Kolom NO, TGL UPLOAD, VALID UNTIL, WILAYAH, KATEGORI, NAMA BROSUR & RINCIAN PAKET, STATUS BROSUR, CATATAN, dan AKSI.
  2. **Listing & Live Preview (Split View):** Kartu dokumen di sisi kiri dan penampil dokumen langsung di sisi kanan dengan viewer berkas dan metadata lengkap.
- **Aksi Cepat:**
  - **Kirim via WhatsApp:** Format pesan promosi otomatis dan rapi.
  - **Buka Berkas:** Membuka berkas brosur Google Drive atau berkas lokal di tab baru.
  - **Ubah Status:** Modal untuk memperbarui status brosur antara Aktif dan Expired.
  - **Hapus Brosur:** Menghapus brosur dari sistem dengan konfirmasi keamanan.

### Tab 2: Input Brosur Baru (Formulir Pendaftaran)
- **Pilihan Wilayah & Kategori Terpadu:** Dropdown terhubung ke master data.
- **Nama Brosur Dinamis:** Dropdown Nama Brosur Master (`MnuLogBrosur`) disaring otomatis sesuai kategori yang dipilih.
- **Masa Berlaku (Valid Until):** Dilengkapi pemilih tanggal batas aktif brosur.
- **Pengambilan Berkas Komputer:** Fitur Drag & Drop berkas brosur (PDF, JPG, PNG, WEBP, DOC) dengan informasi ukuran dan tipe file.
- **Integrasi Google Drive / Upload Lokal:** Mendukung Webhook Google Apps Script auto-upload serta penyimpanan berkas lokal di server.
- **Komponen Penamaan Otomatis (Rincian Paket):**
  - a. Nama Paket
  - b. Jumlah Hari (9D, 12D, atau Customs e.g. "29 34" &rarr; "29H 34H")
  - c. Tanggal Berangkat
  - Standar format otomatis yang langsung dibuat: `[Wilayah] [Nama Paket] [Jumlah Hari] [Tanggal Berangkat]`
- **Catatan & Keterangan Tambahan**

---

## Struktur Folder Project

```
D:\PROJECT AI\Catalog
├── data/
│   ├── catpaket.json        # Master Kategori Brosur
│   ├── kanwil.json          # Master Wilayah / Kanwil
│   ├── logbrosur.json       # Database Arsip Brosur (LogBrosur)
│   └── mnulogbrosur.json    # Master Menu Brosur
├── lib/
│   └── db.js                # Database Handler (PostgreSQL + Local JSON Fallback)
├── public/
│   ├── assets/
│   │   └── logo.png         # Logo Resmi PT. Fath Indah Travel Service
│   ├── css/
│   │   └── style.css        # Tema Luxury Executive (Obsidian Slate & Champagne Gold)
│   ├── js/
│   │   └── app.js           # Logika Web Interaktif & REST API Client
│   ├── uploads/             # Direktori Berkas Brosur yang Diunggah
│   └── index.html           # Halaman Web Utama
├── .env                     # Konfigurasi Port & Database PostgreSQL
├── package.json             # Manifest & Dependensi Node.js
├── README.md                # Dokumentasi Panduan
└── server.js                # Server Web Express.js
```

---

## Cara Menjalankan Aplikasi Web

### 1. Menjalankan Server Node.js (Rekomendasi)
Buka terminal / PowerShell di direktori `D:\PROJECT AI\Catalog`:
```bash
npm start
```
Atau untuk mode pengembangan:
```bash
npm run dev
```

Buka peramban (browser) Anda di:
👉 **`http://localhost:3000`**

### 2. Konfigurasi Database
Aplikasi secara cerdas mendukung **Dual Mode**:
- Jika PostgreSQL berjalan (sesuai `.env`: database `c1_dbfindme`, user `c1_findme`), server akan otomatis menghubungkan dan menyelaraskan tabel.
- Jika database PostgreSQL belum aktif, server secara mulus menggunakan penyimpanan lokal berbasis JSON di folder `data/` tanpa hambatan atau error!

