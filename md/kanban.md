# Alur Kerja Kanban (Drag & Drop)

Dokumen ini menjelaskan bagaimana fitur papan Kanban diimplementasikan, mulai dari pengambilan data hingga fungsionalitas _drag-and-drop_ untuk memindahkan tugas antar daftar.

## 1. Struktur Data: Dari Supabase ke Tampilan Kanban

Aplikasi ini mengambil dua set data utama dari Supabase untuk membangun papan Kanban: **Lists** (Daftar) dan **Tasks** (Tugas).

- **List (Kolom Kanban)**: Setiap `List` dari database Anda direpresentasikan sebagai kolom vertikal di papan Kanban.

  - `list.id`: Digunakan sebagai `id` unik untuk setiap kolom.
  - `list.list_name`: Digunakan sebagai `name` atau judul yang ditampilkan di header kolom.

- **Task (Kartu Kanban)**: Setiap `Task` dari database Anda menjadi kartu yang dapat dipindahkan di dalam kolom.
  - `task.id`: Digunakan sebagai `id` unik untuk setiap kartu.
  - `task.list_id`: Properti kunci yang menentukan di kolom (List) mana sebuah kartu harus ditempatkan. Nilai ini harus cocok dengan `id` dari salah satu List.

Secara sederhana, aplikasi memetakan `task.list_id` ke `column.id` untuk menempatkan setiap kartu di kolom yang benar.

## 2. Mekanisme Perpindahan (Drag & Drop)

Saat Anda menyeret sebuah kartu (Task) dari satu kolom (List) ke kolom lainnya, serangkaian proses terjadi di latar belakang untuk memastikan perubahan tersebut terlihat instan dan tersimpan secara permanen.

Proses ini diatur oleh fungsi `handleDragEnd` yang dipicu setiap kali Anda selesai menyeret kartu.

### Langkah-langkah Alur Kerja `handleDragEnd`:

1.  **Mendeteksi Akhir Gerakan (Drag End)**
    Ketika Anda melepaskan kartu di sebuah kolom, _event_ `onDragEnd` dari `dnd-kit` akan aktif dan memanggil fungsi `handleDragEnd`.

2.  **Mengidentifikasi ID Penting**
    Fungsi ini segera menangkap dua ID krusial dari _event_ tersebut:

    - `active.id`: ID dari kartu (Task) yang sedang diseret.
    - `over.id`: ID dari kolom (List) tujuan tempat kartu dilepaskan.

3.  **Pembaruan State Lokal (_Optimistic Update_)**
    Untuk memberikan pengalaman pengguna yang responsif, aplikasi tidak menunggu konfirmasi dari database. Sebaliknya, state lokal di React (`tasks`) langsung diperbarui.

    - Aplikasi mencari Task yang sesuai dengan `draggedTaskId`.
    - Properti `list_id` dari Task tersebut diubah menjadi `newColumnId` (ID dari kolom tujuan).
    - React secara otomatis me-render ulang UI, sehingga kartu **langsung terlihat pindah** ke kolom baru.

4.  **Sinkronisasi dengan Supabase (Update Database)**
    Setelah memperbarui tampilan, aplikasi mengirimkan permintaan `UPDATE` ke tabel `tasks` di Supabase.

    - Perintah ini mencari baris di mana `id` cocok dengan `draggedTaskId`.
    - Kemudian, ia mengubah nilai kolom `list_id` menjadi `newColumnId`.
    - Ini memastikan perubahan tersebut disimpan secara permanen di database.

5.  **Penanganan Kegagalan (_Error Handling_)**
    Jika karena suatu alasan (misalnya, masalah jaringan) permintaan `UPDATE` ke Supabase gagal, sebuah notifikasi error akan ditampilkan. Ini memberi tahu pengguna bahwa perubahan yang mereka buat mungkin tidak tersimpan.

## Ringkasan Sederhana

Secara singkat, fungsionalitas _drag-and-drop_ pada Kanban ini adalah cara visual untuk mengubah nilai `list_id` dari sebuah `Task` di database.

- **Drag**: Mengambil `Task ID`.
- **Drop**: Mengambil `List ID` tujuan.
- **`handleDragEnd`**:
  1.  **Frontend**: Mengubah `list_id` di state React agar UI diperbarui secara instan.
  2.  **Backend**: Mengirim perintah `UPDATE` ke Supabase untuk menyimpan perubahan `list_id` secara permanen.
