# AzLearn — Azərbaycanca Proqramlaşdırma Platforması

Azərbaycanca strukturlaşdırılmış proqramlaşdırma kursları — YouTube embed, konspekt, quiz, XP/level sistemi və liderboard ilə.

---

## Tech Stack

### Backend
- **FastAPI** (Python 3.12)
- **PostgreSQL 16**
- **SQLAlchemy** ORM
- **Pydantic v2**
- **JWT Auth** (python-jose + passlib/bcrypt)

### Frontend
- **Next.js 16** (App Router) + React 19
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion v12**
- **TanStack Query v5** + **Zustand v5**

---

## Qurulum

### Tələblər
- Python 3.12+
- Node.js 20+
- PostgreSQL 16

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# .env faylı yarat (aşağıya bax)
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Environment Variables (`backend/.env`)

```
DATABASE_URL=postgresql://azlearn:azlearn123@localhost:5432/azlearn_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=azlearn-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Verilənlər bazasını doldur

```powershell
cd backend
# Bütün kursları (Python 53 dərs) seed et
python seed.py
python seed_python.py
python seed_quizzes.py
```

---

## Layihə Strukturu

```
azlearn/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/          # auth, courses, quiz, progress
│   │   ├── core/         # config, database, security
│   │   ├── models/       # user, course, quiz, progress
│   │   └── schemas/      # pydantic schema-lar
│   ├── seed.py           # əsas kurslar
│   ├── seed_python.py    # Python kursu 53 dərs
│   └── seed_quizzes.py   # 32 quiz, 128 sual
└── frontend/
    └── src/
        ├── app/           # Next.js App Router
        │   ├── page.tsx          # Landing
        │   ├── dashboard/        # İstifadəçi paneli
        │   ├── courses/          # Kurs siyahısı + detallar
        │   ├── lessons/[id]/     # Dərs səhifəsi
        │   ├── leaderboard/      # Liderboard
        │   ├── login/ register/  # Auth
        │   └── layout.tsx
        ├── components/
        │   ├── layout/Navbar.tsx
        │   ├── course/CourseCard.tsx
        │   ├── quiz/QuizModal.tsx
        │   └── ui/               # ProgressRing, WolfMascot, XPBar...
        ├── lib/
        │   ├── api.ts            # Axios instance
        │   ├── design.ts         # Design tokens + confetti
        │   └── utils.ts
        ├── stores/auth.ts        # Zustand auth store
        └── types/index.ts
```

---

## API Endpoint-ləri

### Auth
| Method | URL | Təsvir |
|--------|-----|--------|
| POST | `/auth/register` | Qeydiyyat |
| POST | `/auth/login` | Giriş → JWT token |
| GET | `/auth/me` | Cari istifadəçi |

### Courses
| Method | URL | Təsvir |
|--------|-----|--------|
| GET | `/courses` | Kurs siyahısı |
| GET | `/courses/{id}` | Kurs + dərslər |
| GET | `/lessons/{id}` | Dərs detalları |

### Progress
| Method | URL | Təsvir |
|--------|-----|--------|
| POST | `/progress/lesson/{id}/complete` | Dərsi tamamla → XP |
| GET | `/progress/me` | Öz statistikası |
| GET | `/progress/me/lessons` | Tamamlanan dərslər |
| GET | `/progress/leaderboard` | Top liderboard |

### Quiz
| Method | URL | Təsvir |
|--------|-----|--------|
| GET | `/quizzes/lesson/{lesson_id}` | Dərsin quizi |
| POST | `/quizzes/{id}/submit` | Quiz cavabları göndər |

**Swagger UI:** `http://localhost:8000/docs`

---

## Xüsusiyyətlər

### Dərs Axını
Hər dərs 3 addımdan ibarətdir:
1. **🎬 Video** — YouTube embed, tam ekran
2. **📒 Konspekt** — Azərbaycanca ətraflı izah + kod nümunələri
3. **📝 Quiz** — 4 seçimli suallar, keçmək üçün 60%

Növbəti dərs yalnız quiz keçildikdən sonra açılır.

### Gamification
- **XP sistemi** — hər dərs və quiz üçün XP
- **Level sistemi** — hər 500 XP-də yeni level
- **Streak** — ardıcıl öyrənmə günləri
- **Liderboard** — top istifadəçilər
- **Nailiyyətlər** — xüsusi tapşırıqları tamamlamaq

### Python Kursu
- **53 dərs** — tam YouTube playlist
- **32 quiz** — hər əsas mövzu üçün
- **128 sual** — A/B/C/D formatında
- Hər dərsdə Azərbaycanca konspekt + praktiki tapşırıqlar

---

## İrəliləyiş

### 31.05.2026 — Başlanğıc
- Python + Docker + PostgreSQL mühiti
- FastAPI layihə strukturu
- DB modelləri + JWT auth

### 01.06.2026 — Backend API
- Kurs, Dərs, Quiz, Progress tam CRUD
- XP + level + streak sistemi
- Liderboard endpoint

### 01.06.2026 — Frontend v1
- Next.js 16 + TypeScript qurulumu
- Landing, Dashboard, Kurslar, Dərs, Liderboard
- YouTube embed, Quiz modal
- Zustand + TanStack Query

### 03.06.2026 — Tam Dizayn + Məzmun
- Tam qaranlıq UI (dark theme)
- Wolf maskot + animasiyalar (Framer Motion + CSS keyframes)
- 3-addımlı dərs axını: Video → Konspekt → Quiz
- Python kursu: 53 real video (YouTube playlist)
- 32 quiz, 128 sual Azərbaycan dilində
- Azərbaycanca encoding düzəldildi
- Responsive sidebar + dərs naviqasiyası

---

## Roadmap

### Tamamlanmış
- [x] Backend API (auth, kurslar, quiz, progress)
- [x] Frontend dark UI
- [x] YouTube embed + 3-addımlı dərs axını
- [x] Python kursu — 53 dərs + 32 quiz
- [x] Gamification (XP, level, streak, liderboard)

### Növbəti
- [ ] Digər kurslar üçün məzmun (Web, SQL, ML, İngilis)
- [ ] AI Mentor (Claude API — Azərbaycan dilində)
- [ ] Admin panel
- [ ] Deploy (Vercel + Railway)
- [ ] Sertifikat sistemi

---

## Xərc Proqnozu

| | Başlanğıc | Böyüdükcə |
|---|---|---|
| Hosting | $10–15/ay | $25–50/ay |
| Claude API | $2–10/ay | $30–80/ay |
| Domain | $1–3/ay | $1–3/ay |
| **Cəmi** | **~$15–28/ay** | **~$60–130/ay** |
