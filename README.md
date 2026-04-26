# CDMonza 🎮

Platform download game **PSP (PPSSPP)** dan **PS2 (AetherSX2)** dengan desain **Neo Brutalism Dark**.

---

## Tech Stack

- **Frontend**: React + TypeScript (TSX)
- **Styling**: CSS Custom (Neo Brutalism Dark)
- **Routing**: React Router DOM v6
- **Backend & DB**: Supabase
- **Deployment**: Vercel

---

## Setup Project

### 1. Clone & Install

```bash
git clone <repo-url> cdmonza
cd cdmonza
npm install
```

### 2. Environment Variables

Buat file `.env` dari template:

```bash
cp .env.example .env
```

Isi dengan Supabase Anon Key kamu:

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> ⚠️ **JANGAN** expose service_role key di client code!

### 3. Jalankan Development

```bash
npm run dev
```

---

## Supabase Setup

### Buat Tabel `games`

Jalankan SQL berikut di Supabase SQL Editor:

```sql
CREATE TABLE games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_size TEXT,
  platform TEXT CHECK (platform IN ('PSP', 'PS2')),
  genres TEXT[] DEFAULT '{}',
  download_link TEXT,
  cover_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Public read (everyone can read games)
CREATE POLICY "Public read games"
  ON games FOR SELECT
  USING (true);

-- Admin write (authenticated users only)
CREATE POLICY "Auth users insert games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users update games"
  ON games FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Auth users delete games"
  ON games FOR DELETE
  TO authenticated
  USING (true);
```

### Buat Admin User

Di Supabase Dashboard → **Authentication** → **Users** → **Add user**:

- Email: `monza@admin.com`
- Password: `Monza123`

### Dummy Data (Opsional)

```sql
INSERT INTO games (name, description, file_size, platform, genres, download_link, cover_url, screenshots) VALUES
(
  'God of War: Chains of Olympus',
  'Kratos kembali dalam petualangan epik sebelum game pertama. Grafis luar biasa untuk PSP.',
  '1.4 GB', 'PSP',
  ARRAY['Action', 'Adventure'],
  'https://example.com/download/gow-chains',
  'https://upload.wikimedia.org/wikipedia/en/8/87/God_of_War_Chains_of_Olympus_box_art.jpg',
  ARRAY['https://placehold.co/640x360/1a1a2e/9333ea?text=Screenshot+1']
),
(
  'Grand Theft Auto: Liberty City Stories',
  'Jelajahi Liberty City dalam versi PSP yang memukau dengan open world penuh aksi.',
  '1.1 GB', 'PSP',
  ARRAY['Action', 'Adventure', 'Open World'],
  'https://example.com/download/gta-lcs',
  'https://upload.wikimedia.org/wikipedia/en/8/8f/GTA_Liberty_City_Stories.jpg',
  ARRAY['https://placehold.co/640x360/1a1a2e/9333ea?text=Screenshot+1']
),
(
  'Shadow of the Colossus',
  'Mahakarya visual dan gameplay. Kalahkan 16 Colossus raksasa dalam dunia yang indah.',
  '3.8 GB', 'PS2',
  ARRAY['Action', 'Adventure', 'Puzzle'],
  'https://example.com/download/sotc',
  'https://upload.wikimedia.org/wikipedia/en/b/b8/Shadow_of_the_Colossus_%28artwork%29.jpg',
  ARRAY['https://placehold.co/640x360/1a1a2e/9333ea?text=Screenshot+1']
),
(
  'Dragon Ball Z: Budokai Tenkaichi 3',
  'Game fighting DBZ terbaik sepanjang masa dengan roster karakter terlengkap.',
  '4.2 GB', 'PS2',
  ARRAY['Fighting', 'Action'],
  'https://example.com/download/dbz-bt3',
  'https://upload.wikimedia.org/wikipedia/en/b/b4/Budokai_Tenkaichi_3.jpg',
  ARRAY['https://placehold.co/640x360/1a1a2e/9333ea?text=Screenshot+1']
);
```

---

## Struktur Project

```
cdmonza/
├── src/
│   ├── pages/
│   │   ├── Home.tsx          # Halaman utama (grid game, search, filter)
│   │   ├── Detail.tsx        # Halaman detail game
│   │   └── admin/
│   │       ├── Login.tsx     # Admin login
│   │       └── Dashboard.tsx # Admin dashboard + CRUD
│   ├── components/
│   │   ├── GameCard.tsx      # Card game reusable
│   │   ├── Drawer.tsx        # Sidebar filter (hamburger)
│   │   ├── Tag.tsx           # Tag neo brutalism
│   │   └── Carousel.tsx      # Screenshot carousel
│   ├── lib/
│   │   └── supabase.ts       # Supabase client + types
│   ├── styles/
│   │   └── global.css        # Semua styling
│   ├── App.tsx               # Routing
│   └── main.tsx              # Entry point
├── public/
│   └── favicon.svg
├── vercel.json               # SPA routing untuk Vercel
├── .env.example
└── package.json
```

---

## Routing

| Path | Halaman |
|------|---------|
| `/` | Home — Grid game, search, filter |
| `/game/:id` | Detail game |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard (protected) |

---

## Deploy ke Vercel

### Cara 1: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Cara 2: Via GitHub

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import repo
3. Framework: **Vite**
4. Tambahkan Environment Variable:
   - `VITE_SUPABASE_ANON_KEY` = `<anon key kamu>`
5. Deploy!

> `vercel.json` sudah dikonfigurasi untuk SPA routing (semua path diarahkan ke `index.html`).

---

## Fitur

- ✅ Grid game dengan data real dari Supabase
- ✅ Search bar (nama & deskripsi)
- ✅ Filter platform (PSP/PS2) + filter genre via drawer
- ✅ Drawer sidebar dengan slide animasi
- ✅ Detail page: poster, tags, carousel screenshot, info, download
- ✅ Notice emulator (PPSSPP/AetherSX2)
- ✅ Admin login dengan Supabase Auth
- ✅ Admin CRUD: tambah, edit, hapus game
- ✅ Loading skeleton & empty state
- ✅ Toast notifications
- ✅ Neo Brutalism Dark design
- ✅ Mobile responsive
- ✅ No tap highlight (`-webkit-tap-highlight-color: transparent`)

---

## Desain

**Neo Brutalism Dark** — Hitam/abu gelap, aksen ungu, border tebal, shadow keras.

Font:
- Display: **Barlow Condensed** (headers, tags)
- Body: **Barlow** (konten)
- Mono: **Space Mono** (label, kode)

---

## License

MIT
