# Flow Lengkap Pembuatan Undangan Digital (Dengan Pilihan Tema & Opsi Galeri)

Panduan ini menjelaskan alur lengkap (flow) pembuatan undangan digital pada project berbasis Vite + React + Supabase, di mana user dapat memilih tema undangan sesuai keinginan **dan juga memilih apakah ingin menampilkan galeri foto pada undangan atau tidak**.

---

## 1. **User Login / Register**
- User membuka aplikasi dan login/register menggunakan email & password (Supabase Auth).
- Setelah login, user diarahkan ke dashboard pribadi.

## 2. **Akses Dashboard**
- Di dashboard, user dapat melihat daftar undangan yang sudah pernah dibuat.
- Terdapat tombol **"Buat Undangan Baru"**.

## 3. **Form Pembuatan Undangan, Pilih Tema & Opsi Galeri**
- User mengisi form detail undangan:
  - Nama mempelai pria & wanita
  - Nama panggilan (opsional)
  - Nama orang tua
  - Tanggal & waktu akad
  - Tanggal & waktu resepsi
  - Lokasi akad & resepsi
  - Cerita cinta (opsional)
  - Cover undangan (opsional)
- **User dapat memilih tema undangan** dari beberapa pilihan tema yang tersedia (misal: klasik, modern, floral, minimalis, dsb).
- **User juga dapat memilih apakah ingin menampilkan galeri foto pada undangan atau tidak** (misal: dengan checkbox "Tampilkan Galeri Foto di Undangan").
- Validasi dilakukan pada field wajib (nama, tanggal, lokasi, dsb).

## 4. **Upload Galeri Foto (Opsional, Berdasarkan Pilihan User)**
- Jika user memilih untuk menampilkan galeri foto:
  - User dapat meng-upload foto-foto ke galeri undangan.
  - Foto di-upload ke Supabase Storage, metadata disimpan ke table `invitation_photos`.
  - Foto yang sudah di-upload bisa dihapus atau diatur urutannya.
- Jika user tidak memilih menampilkan galeri, langkah upload foto bisa dilewati.

## 5. **Simpan Undangan ke Database**
- Setelah form diisi, tema dipilih, opsi galeri ditentukan, dan validasi lolos, user klik **"Simpan"**.
- Data undangan (termasuk pilihan tema dan status galeri) dikirim ke Supabase (insert ke table `invitations`).
- Jika galeri diaktifkan dan ada foto, metadata foto juga di-insert ke table `invitation_photos`.
- Sistem akan generate **slug unik** (misal: `pernikahan-budi-ana`) untuk link undangan.

## 6. **Tampilkan Preview & Link Undangan**
- Setelah berhasil disimpan, user diarahkan ke halaman preview undangan.
- Tampilkan link undangan digital yang bisa dibagikan ke tamu (misal: `/budi-ana`).
- User bisa melihat tampilan undangan sesuai tema yang dipilih, dan galeri foto akan tampil **hanya jika user mengaktifkan fitur galeri**.

## 7. **Edit/Update Undangan, Tema & Opsi Galeri**
- User dapat mengedit detail undangan, galeri, mengganti tema, maupun mengubah status galeri (aktif/nonaktif) kapan saja dari dashboard.
- Perubahan akan di-update ke database dan langsung terlihat di link undangan.

## 8. **Fitur Tambahan (Opsional)**
- **Amplop Digital:** User bisa menambah info rekening/bank untuk hadiah digital.
- **RSVP & Ucapan:** Tamu bisa mengisi RSVP dan ucapan di halaman undangan, data masuk ke table `rsvp`.
- **Statistik:** User bisa melihat statistik RSVP, jumlah tamu, dsb.

---

## **Alur Data & Interaksi Utama**

1. **Form Input & Pilih Tema & Opsi Galeri → Validasi → Simpan ke Supabase**
2. **(Jika galeri diaktifkan) Upload Foto → Supabase Storage → Simpan metadata ke DB**
3. **Generate Slug Unik → Simpan di field `slug`**
4. **Tampilkan Link Undangan → Share ke tamu**
5. **Tamu akses link → Data undangan di-fetch dari Supabase (termasuk tema & status galeri) → Render undangan**
6. **Tamu submit RSVP/Ucapan → Data masuk ke table `rsvp` → Tampil di undangan**

---

## **Ringkasan Flow**
1. Login → Dashboard → Buat Undangan Baru
2. Isi Form & Pilih Tema → Pilih Tampilkan Galeri atau Tidak → (Jika ya) Upload Galeri → Simpan
3. Generate Link → Preview (dengan tema & galeri sesuai pilihan) → Share ke tamu
4. Tamu RSVP/Ucapan → Data masuk ke dashboard user

---

**Flow ini fleksibel dan bisa dikembangkan sesuai kebutuhan bisnis, termasuk penambahan tema baru atau fitur galeri yang lebih dinamis.** 