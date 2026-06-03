# AzLearn — Frontend

Next.js 16 + React 19 + TypeScript ilə qurulmuş AzLearn platformasının frontend hissəsi.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion v12**
- **TanStack Query v5**
- **Zustand v5**
- **Axios**

## Qurulum

```bash
npm install
npm run dev
```

`http://localhost:3000` ünvanında açılır.

Backend `http://localhost:8000`-də işləməlidir (`backend/.env` faylına bax).

## Səhifələr

| Route | Təsvir |
|-------|--------|
| `/` | Landing — hero, kurslar, necə işləyir |
| `/login` | Giriş |
| `/register` | Qeydiyyat |
| `/dashboard` | İstifadəçi paneli — XP, nailiyyətlər, liderboard |
| `/courses` | Kurs siyahısı + kateqoriya filtri |
| `/courses/[id]` | Kurs detalları + curriculum |
| `/lessons/[id]` | Dərs səhifəsi (Video → Konspekt → Quiz) |
| `/leaderboard` | Liderboard |

## Dərs Axını

```
🎬 Video  →  📒 Konspekt  →  📝 Quiz  →  Növbəti dərs açılır
```

Hər addım tamamlanmadan növbəti bloklanır.

## Əsas Komponentlər

| Komponent | Məqsəd |
|-----------|--------|
| `Navbar` | Sticky qaranlıq navbar, user stats |
| `CourseCard` | Kurs kartı, hover animasiyası |
| `QuizModal` | Sual-sual quiz, nəticə ekranı |
| `ProgressRing` | SVG dairəvi progress |
| `WolfMascot` | Wolf şəkli, emoji fallback |

## Mühit Dəyişənləri

`.env.local` faylı yarat:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Build

```bash
npm run build
npm run start
```
