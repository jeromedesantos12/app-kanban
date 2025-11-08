# Pemecahan Bug Drag & Drop dengan dnd-kit

Dokumen ini menjelaskan masalah yang terjadi pada fungsionalitas _drag-and-drop_ dan bagaimana cara memperbaikinya.

## 1. Masalah (The Bug)

Fungsionalitas untuk memindahkan kartu (task) antar kolom (list) hanya berfungsi dengan benar pada percobaan pertama. Ketika pengguna mencoba memindahkan kartu untuk kedua kalinya atau lebih, perubahan tersebut **tidak tersimpan di database Supabase**.

Meskipun kartu terlihat pindah di antarmuka (UI), data `list_id` di database tidak ter-update, sehingga saat halaman di-refresh, kartu akan kembali ke posisi semula.

## 2. Akar Masalah (The Root Cause)

Masalah ini disebabkan oleh ketidaksinkronan **state** antara dua event handler `dnd-kit`: `onDragOver` dan `onDragEnd`.

- **`onDragOver`**: Event ini digunakan untuk melakukan _optimistic update_ pada UI. Saat kartu digeser ke atas kolom baru, `onDragOver` mengubah `list_id` pada state `tasks` di React. Tujuannya adalah agar `dnd-kit` secara visual "memindahkan" kartu dan mengizinkannya untuk di-"drop" di kolom tersebut.
- **`onDragEnd`**: Event ini bertugas menyimpan perubahan final ke database.

**Konfliknya adalah**: `onDragEnd` dieksekusi dengan "mengingat" state `tasks` dari **sebelum** `onDragOver` berjalan.

- **Percobaan Pertama (Berhasil)**: `onDragOver` mengubah state, lalu `onDragEnd` dieksekusi. Kebetulan, `onDragEnd` mendapatkan state yang sudah ter-update dan berhasil menyimpannya.
- **Percobaan Kedua (Gagal)**: `onDragOver` mengubah state lagi. Namun, `onDragEnd` masih membaca state dari _sebelum_ percobaan kedua dimulai. Akibatnya, ia mengirim `list_id` yang lama ke database, sehingga tidak ada perubahan yang terjadi.

## 3. Solusi (The Fix)

Solusinya adalah dengan menyederhanakan alur dan menjadikan `onDragEnd` sebagai satu-satunya sumber kebenaran untuk perubahan data final.

1.  **Hapus `onDragOver`**: Logika pembaruan state yang kompleks di `onDragOver` dihapus sepenuhnya. `dnd-kit` sudah cukup pintar untuk menangani perpindahan visual dan menentukan target drop tanpa perlu kita memanipulasi state saat proses _drag_ berlangsung.

2.  **Sentralisasi Logika di `onDragEnd`**: Fungsi `onDragEnd` sekarang bertanggung jawab penuh atas pembaruan UI dan database.

    - **Identifikasi Target**: `onDragEnd` secara langsung mengidentifikasi `newColumnId` (ID list tujuan) dari `event.over`. `event` object selalu memberikan data yang paling akurat tentang posisi akhir drop.

    - **Pembaruan State (Optimistic Update)**: Setelah ID kolom baru didapatkan, `setTasks` langsung dipanggil untuk mengubah `list_id` pada task yang dipindahkan dan mengatur ulang urutan kartu menggunakan `arrayMove`. Ini membuat UI terasa instan.

    - **Pembaruan Database**: **Segera setelah** state UI diperbarui, perintah `update` dikirim ke Supabase dengan `newColumnId` yang sudah pasti benar.

    - **Rollback**: Jika update ke database gagal, state akan dikembalikan ke kondisi sebelum di-drag untuk menjaga konsistensi.

Dengan pendekatan ini, `onDragEnd` tidak lagi bergantung pada state yang mungkin "basi" dan selalu menggunakan data terbaru dari `event` object. Hasilnya, setiap perpindahan kartu, baik yang pertama maupun yang berikutnya, akan selalu tersimpan dengan benar di database.
