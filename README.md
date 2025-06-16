# 📰 Artiqo - Aplikasi Artikel

**Artiqo** adalah aplikasi artikel modern yang menyediakan pengalaman membaca dan mengelola artikel secara efisien. Aplikasi ini mendukung dua peran utama: **User** dan **Admin**, masing-masing memiliki fitur dan akses khusus.

## 🌐 Link Production
🔗 [Artiqo](https://artiqo.dev.tukucode.com)
---


## 🚀 Fitur Utama

### 👤 Role: User

#### ✅ Authentication
- Login dengan validasi form
- Register dengan validasi form
- Redirect ke halaman list artikel setelah login/register sukses
- Logout dengan redirect ke halaman login

#### 📚 List Artikel
- Filter artikel berdasarkan kategori
- Searching artikel (dengan debounce 300–500ms)
- Pagination otomatis jika jumlah artikel lebih dari 10 item

#### 📰 Detail Artikel
- Tampilkan konten lengkap dari artikel
- Tampilkan maksimal 3 artikel lain dari kategori yang sama

---

### 🛠️ Role: Admin

#### ✅ Authentication
- Login dan register dengan validasi form
- Redirect ke halaman list artikel setelah login/register sukses
- Logout dengan redirect ke halaman login

#### 📂 Manajemen Kategori
- List category dengan fitur searching (debounce 300–500ms)
- Pagination jika lebih dari 10 kategori
- Create & edit category dengan form validation

#### 📄 Manajemen Artikel
- List artikel dengan filter berdasarkan kategori
- Searching artikel (dengan debounce 300–500ms)
- Pagination jika lebih dari 10 artikel
- Create & edit artikel dengan:
  - Validasi form
  - Tampilan preview sebelum submit (menggunakan fetch API)

---

## 🧪 Teknologi yang Digunakan

| Teknologi            | Keterangan                                      |
|----------------------|--------------------------------------------------|
| **Next.js**          | App Router, SSR & CSR                           |
| **Tailwind CSS**     | Styling modern dan konsisten                    |
| **shadcn/ui**        | Komponen UI siap pakai                          |
| **Axios**            | Untuk fetching data dari API                    |
| **Lucide Icons**     | Ikon ringan dan elegan                          |
| **Zod + RHF**        | Validasi form yang aman dan efisien             |
| **Zustand**          | State management minimalis dan cepat            |
| **Git + GitHub**     | Version control, mengikuti Git Flow             |

---

## 📁 Struktur Proyek (Highlight)
```bash
src/
├── app/
│   ├── auth/       # Login & Register
│   ├── (landing)/       # Artikel (list, detail) *all role access
│   └── dashboard/      # Admin (kategori, artikel)
├── components/       # Reusable components (form, UI, dll)
├── lib/              # Axios instance, helper, etc
├── stores/           # Zustand stores
├── types/            # Tipe TypeScript
```

## Cara Menjalankan Aplikasi Secara Lokal
### Clone repository ini
```bash
git clone https://github.com/tukucode/management-artikel-sp
cd management-artikel-sp
```

### Jalankan server pengembangan
```bash
npm run dev
```

💡 Catatan
- Pastikan telah menginstall Node.js versi 22.
- Gunakan .env untuk menyimpan environment variables bisa lihat contoh dari `.env.example`.
- Variabel `NEXT_PUBLIC_BASE_URL`= http://localhost:3000.
