# Alur Otentikasi dengan Supabase Auth

Dokumen ini menjelaskan bagaimana aplikasi menangani otentikasi pengguna (status login) menggunakan dua fungsi inti dari Supabase Auth: `getSession()` dan `onAuthStateChange()`.

## 🔑 Peran Kunci Supabase Auth

Kedua fungsi ini adalah jantung dari sistem otentikasi aplikasi. Mereka bekerja sama untuk menjawab dua pertanyaan penting:

1.  **"Siapa pengguna saat ini?"** (Pengecekan awal saat aplikasi dimuat).
2.  **"Apakah status login pengguna berubah?"** (Pemantauan berkelanjutan saat aplikasi berjalan).

---

## 1. `supabase.auth.getSession()`

### Apa Fungsinya?

Fungsi ini bertugas untuk mengambil data sesi (seperti token login) yang mungkin sudah tersimpan di _local storage_ browser. Ini adalah cara tercepat untuk mengetahui apakah pengguna sudah login sebelumnya tanpa harus meminta mereka login ulang.

Anggap saja ini seperti memeriksa KTP di dompet Anda untuk verifikasi identitas awal.

### Bagaimana Ini Digunakan?

Di dalam aplikasi, `getSession()` dipanggil melalui _action_ Redux `fetchSession()`. _Action_ ini dijalankan saat komponen `ProtectedRoutes` atau `PublicRoutes` pertama kali dimuat.

```typescript
// Di dalam komponen ProtectedRoutes/PublicRoutes
useEffect(() => {
  // Hanya dijalankan sekali saat komponen pertama kali dimuat
  if (status === "idle") {
    dispatch(fetchSession()); // <-- Di sinilah getSession() dipanggil
  }
}, [dispatch, status]);
```

**Tujuannya** adalah untuk memuat status login pengguna ke dalam Redux secepat mungkin. Berdasarkan hasil dari `getSession()`, aplikasi dapat segera memutuskan apakah harus menampilkan halaman utama (jika sesi ada) atau mengarahkan ke halaman login (jika sesi tidak ada).

---

## 2. `supabase.auth.onAuthStateChange()`

### Apa Fungsinya?

Fungsi ini adalah pendengar (_listener_) yang aktif secara _real-time_. Tugasnya adalah memantau setiap perubahan status otentikasi yang terjadi di Supabase saat pengguna sedang menggunakan aplikasi.

Anggap saja ini seperti satpam yang berjaga 24 jam, siap bereaksi jika ada orang yang masuk atau keluar.

### Bagaimana Ini Digunakan?

`onAuthStateChange` ditempatkan di dalam `useEffect` pada komponen `ProtectedRoutes` dan `PublicRoutes` untuk menangani berbagai skenario secara dinamis.

```typescript
useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        dispatch(setSession(session));
        router.replace("/");
      } else if (event === "SIGNED_OUT") {
        dispatch(clearSession());
        router.replace("/login");
      }
    }
  );

  // Cleanup function untuk berhenti mendengarkan saat komponen dilepas
  return () => {
    listener.subscription.unsubscribe();
  };
}, [dispatch, router]);
```

**Tujuannya** adalah untuk bereaksi terhadap peristiwa otentikasi, seperti:

- **Pengguna Login (`SIGNED_IN`)**: Saat pengguna berhasil login, _listener_ akan menerima sesi baru. Aplikasi kemudian menyimpan sesi ini di Redux (`setSession`) dan mengarahkan pengguna ke halaman utama (`/`).
- **Pengguna Logout (`SIGNED_OUT`)**: Saat pengguna logout, _listener_ akan mendeteksi sesi yang kosong. Aplikasi akan membersihkan data sesi dari Redux (`clearSession`) dan mengarahkan pengguna kembali ke halaman login (`/login`).
- **Sesi Diperbarui (`TOKEN_REFRESHED`)**: Supabase secara otomatis memperbarui token sesi di latar belakang. _Listener_ menangkap pembaruan ini dan menyimpannya di Redux untuk menjaga pengguna tetap login.

#### Penting: Fungsi Cleanup

Bagian `return () => { listener.subscription.unsubscribe(); }` sangat krusial. Ini memastikan bahwa _listener_ berhenti berjalan ketika komponen tidak lagi ditampilkan. Tanpa ini, Anda akan memiliki banyak _listener_ yang berjalan bersamaan, menyebabkan kebocoran memori (_memory leak_) dan perilaku yang tidak terduga.

---

## 3. Kolaborasi Kedua Fungsi

`getSession()` dan `onAuthStateChange()` bekerja sama untuk menciptakan alur otentikasi yang mulus dan andal:

- **Kecepatan (Awal)**: `getSession()` memberikan keputusan cepat saat aplikasi pertama kali dimuat, mengurangi waktu tunggu pengguna.
- **Stabilitas (Berkelanjutan)**: `onAuthStateChange()` menjaga agar status login di aplikasi selalu sinkron dengan status di server Supabase secara _real-time_.
