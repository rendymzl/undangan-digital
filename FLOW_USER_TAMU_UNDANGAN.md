# Flow User Tamu Mendapatkan Undangan Digital (Dengan Konfirmasi Nama & Tombol "Buka Undangan")

Panduan ini menjelaskan alur (flow) pengalaman user tamu yang menerima undangan digital pada project undangan digital berbasis Vite + React + Supabase, di mana tamu akan melihat namanya terlebih dahulu dan harus menekan tombol "Buka Undangan" sebelum dapat melihat detail undangan.

---

## 1. **Menerima Link Undangan**
- User tamu menerima link undangan digital dari pengundang (bisa via WhatsApp, email, media sosial, dsb).
- Contoh link: `https://namadomain.com/budi-ana`

## 2. **Membuka Halaman Awal (Konfirmasi Nama Tamu)**
- Ketika tamu pertama kali membuka link undangan, halaman awal akan menampilkan:
  - Nama tamu (bisa diambil dari parameter URL, query string, atau input manual jika tidak ada)
  - Pesan sambutan singkat, misal: "Halo, [Nama Tamu]!"
  - Tombol **"Buka Undangan"**
- Tamu harus menekan tombol **"Buka Undangan"** untuk melanjutkan.

## 3. **Melihat Halaman Undangan Digital**
- Setelah menekan tombol "Buka Undangan", barulah tamu diarahkan ke halaman utama undangan digital.
- Halaman undangan akan menampilkan:
  - Nama mempelai
  - Detail acara (akad, resepsi, lokasi, waktu)
  - Cerita cinta (opsional)
  - Galeri foto (jika ada)
  - Tema undangan sesuai pilihan pengundang

## 4. **Melihat Galeri Foto (Opsional)**
- Tamu dapat melihat galeri foto momen pasangan jika fitur ini diaktifkan oleh pengundang.

## 5. **Mengisi RSVP & Ucapan**
- Di bagian RSVP, tamu dapat:
  - Mengisi nama (jika belum otomatis terisi)
  - Konfirmasi kehadiran (Hadir / Tidak Hadir / Ragu)
  - Menulis ucapan atau doa untuk mempelai
- Setelah submit, data RSVP/ucapan akan tersimpan di database dan bisa langsung tampil di halaman undangan (jika diaktifkan).

## 6. **Fitur Amplop Digital (Opsional)**
- Jika pengundang mengaktifkan fitur amplop digital, tamu dapat melihat info rekening/bank untuk memberikan hadiah secara digital.
- Tamu bisa menyalin nomor rekening atau scan QR code (jika ada).

## 7. **Interaksi Lain (Opsional)**
- Tamu bisa:
  - Membuka lokasi acara di Google Maps (dari link di undangan)
  - Share undangan ke orang lain (jika diizinkan)
  - Melihat countdown waktu acara

## 8. **Selesai**
- Setelah mengisi RSVP/ucapan, tamu bisa menutup halaman atau menyimpan link undangan untuk referensi.
- Pengundang akan menerima data RSVP/ucapan di dashboard mereka.

---

## **Ringkasan Flow Tamu**
1. Terima link undangan → Klik link
2. Halaman awal: Lihat nama tamu → Klik "Buka Undangan"
3. Lihat detail undangan (tema, acara, galeri, dsb)
4. Isi RSVP & ucapan → Submit
5. (Opsional) Lihat/akses amplop digital, galeri, lokasi
6. Selesai

---

**Flow ini bisa dikembangkan sesuai kebutuhan, misal: RSVP dengan kode unik, konfirmasi via email, dsb.** 