# Arahan Pengembangan Project Undangan Digital (Vite + React + TypeScript + shadcn/ui + Tailwind + Supabase)

## Tentang Project Ini

Project ini adalah **platform SaaS undangan pernikahan digital** yang memungkinkan pengguna untuk:
- Membuat, mengelola, dan membagikan undangan pernikahan digital yang elegan dan interaktif.
- Mengelola detail acara, galeri foto, RSVP, ucapan tamu, dan amplop digital.
- Memanfaatkan teknologi modern (Vite, React, TypeScript, shadcn/ui, Tailwind CSS, Supabase) untuk performa tinggi, UI konsisten, dan pengembangan yang efisien.
---

Setelah project Vite React kosong berhasil dibuat, berikut langkah besar/tahapan yang perlu dilakukan:

---

1. **Setup Tailwind CSS**
   - Integrasikan Tailwind ke project agar bisa menggunakan utility class di seluruh komponen.

2. **Setup shadcn/ui**
   - Inisialisasi shadcn/ui dan tambahkan komponen UI yang dibutuhkan (button, card, input, dsb).

3. **Setup Supabase**
   - Buat project di Supabase Dashboard.
   - Ambil URL dan anon key, lalu setup Supabase client di project.
   - Buat tabel utama: users, invitations, invitation_photos, rsvp, amplop_digital, dsb.

4. **Strukturisasi Folder Project**
   - Buat folder untuk komponen UI, halaman, fitur, hooks, types, dan lib/helper.

5. **Buat Halaman Utama (Landing Page)**
   - Tampilkan deskripsi aplikasi dan tombol login/register.

6. **Implementasi Autentikasi (Register/Login/Logout)**
   - Integrasi Supabase Auth untuk user management.
   - Buat halaman/form login dan register.

7. **Buat Dashboard User**
   - Setelah login, tampilkan dashboard user (list undangan, galeri, dsb).

8. **Fitur CRUD Undangan**
   - Flow Undangan:
     1. User login ke aplikasi.
     2. Pada dashboard, user klik tombol "Buat Undangan Baru".
     3. User diarahkan ke form pembuatan undangan yang menggunakan **step wizard** (multi-step form) agar proses input data lebih terstruktur dan mudah diikuti.
        - **Step 1:** Data Mempelai (nama mempelai pria & wanita, nama orang tua, dsb)
        - **Step 2:** Detail Acara (tanggal, waktu, lokasi akad & resepsi, maps, dsb)
        - **Step 3:** Pilihan Tema & Preview (pilih tema undangan, lihat preview singkat)
        - **Step 4:** Konfirmasi & Submit (review semua data, konfirmasi, lalu submit)
     4. Setelah submit di step terakhir, data undangan disimpan ke Supabase dan user diarahkan ke halaman detail undangan.
     5. Di halaman detail, user bisa melihat preview undangan, mengedit data (dengan step wizard juga), atau menghapus undangan.
     6. Semua undangan yang sudah dibuat user ditampilkan dalam daftar di dashboard, bisa diklik untuk melihat detail/edit/hapus.
     7. Setiap aksi (buat, edit, hapus) menampilkan notifikasi sukses/gagal.
   - Form untuk membuat, mengedit (menggunakan step wizard), melihat detail, dan menghapus undangan.
   - Tampilkan daftar undangan yang sudah dibuat oleh user.
   - Setiap undangan dapat diklik untuk melihat detail dan melakukan edit/hapus.
   - Validasi input form di setiap step wizard (misal: nama mempelai, tanggal, lokasi, dsb).
   - Simpan, update, dan hapus data undangan ke Supabase.
   - Tampilkan notifikasi sukses/gagal saat melakukan aksi CRUD.

9. **Fitur Galeri Foto**
   - Upload dan tampilkan foto galeri untuk setiap undangan.

10. **Fitur RSVP & Ucapan**
    - Form RSVP/ucapan untuk tamu undangan.
    - Tampilkan daftar ucapan di undangan.

11. **Fitur Amplop Digital**
    - Input dan tampilkan info rekening/bank untuk hadiah digital.

12. **Styling & UI Enhancement**
    - Gunakan Tailwind dan shadcn/ui untuk mempercantik tampilan.

13. **Testing & Error Handling**
    - Pastikan semua fitur berjalan baik, handle error dan loading state.

14. **Deployment**
    - Deploy ke Vercel, Netlify, atau platform lain sesuai kebutuhan.

---

**Catatan:**
- Lakukan pengembangan secara bertahap, mulai dari fitur paling dasar.
- Selalu testing setiap penambahan fitur.
- Dokumentasikan setiap perubahan penting.

---

**Selamat membangun aplikasi undangan digital modern!** 