# AzLearn — Azerbaijani Programming Learning Platform

## Layihə haqqında
YouTube pulsuz proqramlaşdırma kurslarını strukturlaşdırılmış öyrənmə yollarına çevirən müasir veb platforma. Azərbaycanca dəstək, progress tracking, quiz, gamification və AI mentor.

---

## Tech Stack

### Backend
- **FastAPI** (Python 3.12)
- **PostgreSQL 16** (Docker)
- **Redis 7** (Docker)
- **SQLAlchemy** ORM + Alembic
- **Pydantic v2**
- **JWT Auth** (python-jose + passlib/bcrypt)

### Frontend (hələ başlanmayıb)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- TanStack Query + Zustand

### Infrastructure
- Docker Compose (local)
- Vercel (frontend — deploy üçün)
- Railway (backend — deploy üçün)

---

## Qurulum

### Tələblər
- Python 3.12
- Node.js 20+
- Docker Desktop
- Git

### Local işlətmək

```bash
# 1. Repo-nu klon et
git clone <repo-url>
cd azlearn

# 2. Docker ilə DB qaldır
docker-compose up -d

# 3. Backend qur
cd backend
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt

# 4. .env faylı yarat
# (aşağıdakı Environment Variables bölməsinə bax)

# 5. Serveri işlət
uvicorn app.main:app --reload
```

### Environment Variables (.env)
```
DATABASE_URL=postgresql://azlearn:azlearn123@localhost:5432/azlearn_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=azlearn-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Layihə Strukturu

```
azlearn/
├── docker-compose.yml
├── frontend/                  # Next.js (hələ başlanmayıb)
└── backend/
    ├── .env
    ├── venv/
    └── app/
        ├── main.py            # FastAPI app + router-lər
        ├── api/
        │   └── auth.py        # Register + Login endpoint-ləri ✓
        ├── core/
        │   ├── config.py      # Pydantic Settings ✓
        │   ├── database.py    # SQLAlchemy engine + session ✓
        │   └── security.py    # JWT + bcrypt ✓
        ├── models/
        │   ├── user.py        # User cədvəli ✓
        │   ├── course.py      # Course + Lesson cədvəlləri ✓
        │   └── progress.py    # UserProgress + QuizAttempt cədvəlləri ✓
        └── schemas/
            ├── user.py        # User Pydantic schema-ları ✓
            └── course.py      # Course + Lesson schema-ları ✓ (yarımçıq)
```

---

## DB Cədvəlləri

| Cədvəl | Təsvir | Status |
|---|---|---|
| users | İstifadəçilər, XP, level, streak | ✓ Hazır |
| courses | Kurslar | ✓ Hazır |
| lessons | Dərslər (YouTube URL, qeydlər) | ✓ Hazır |
| user_progress | Dərs tamamlama, quiz nəticəsi | ✓ Hazır |
| quiz_attempts | Quiz cəhdləri, xal | ✓ Hazır |

---

## API Endpoint-ləri

### Auth
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /auth/register | Qeydiyyat | ✓ İşləyir |
| POST | /auth/login | Giriş (JWT token) | ✓ İşləyir |

### Courses
| Method | URL | Təsvir | Status |
|---|---|---|---|
| GET | /courses | Yayımlanmış kurslar | ✓ İşləyir |
| GET | /courses/all | Bütün kurslar (auth) | ✓ İşləyir |
| POST | /courses | Kurs yarat | ✓ İşləyir |
| GET | /courses/{id} | Kurs detalları | ✓ İşləyir |
| PUT | /courses/{id} | Kurs yenilə | ✓ İşləyir |
| DELETE | /courses/{id} | Kurs sil | ✓ İşləyir |
| PATCH | /courses/{id}/publish | Yayımla / ləğv et | ✓ İşləyir |
| POST | /courses/{id}/lessons | Dərs əlavə et | ✓ İşləyir |
| GET | /courses/{id}/lessons | Dərsləri siyahıla | ✓ İşləyir |
| GET | /lessons/{id} | Dərs detalları | ✓ İşləyir |
| PUT | /lessons/{id} | Dərs yenilə | ✓ İşləyir |
| DELETE | /lessons/{id} | Dərs sil | ✓ İşləyir |

### Progress
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /progress/lesson/{id}/complete | Dərsi tamamla → XP qazandır | ✓ İşləyir |
| GET | /progress/me | Öz statistikam | ✓ İşləyir |
| GET | /progress/me/lessons | Tamamladığım dərslər | ✓ İşləyir |
| GET | /progress/leaderboard | Top 10 liderboard | ✓ İşləyir |

### Quiz
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /quizzes | Quiz yarat | ✓ İşləyir |
| GET | /quizzes/lesson/{lesson_id} | Dərsin quizi | ✓ İşləyir |
| POST | /quizzes/{id}/questions | Sual əlavə et | ✓ İşləyir |
| DELETE | /quizzes/{id}/questions/{q_id} | Sual sil | ✓ İşləyir |
| POST | /quizzes/{id}/submit | Quiz göndər → nəticə | ✓ İşləyir |

### AI Mentor (hələ yazılmayıb)
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /ai/ask | AI-ə sual ver | ⏳ |

---

## Swagger UI
```
http://127.0.0.1:8000/docs
```

---

## İrəliləyiş

### 31.05.2026
✅ Python 3.12 + virtual environment  
✅ Node.js 24  
✅ Docker Desktop  
✅ PostgreSQL + Redis (Docker Compose)  
✅ FastAPI layihə strukturu  
✅ Bütün DB modelləri + cədvəllər  
✅ JWT Auth sistemi (register + login işləyir)  
✅ TablePlus ilə DB bağlantısı  
✅ Swagger UI  

### 01.06.2026 — Backend API
✅ `api/deps.py` — JWT Bearer authentication dependency  
✅ `api/courses.py` — Kurs + Dərs tam CRUD (12 endpoint)  
✅ `models/quiz.py` — Quiz və Question SQLAlchemy modelləri  
✅ `schemas/quiz.py` — Quiz schema-ları (cavab validasiyası ilə)  
✅ `api/quiz.py` — Quiz yarat, sual əlavə et, submit + avtomatik qiymətləndirmə  
✅ `api/progress.py` — Dərs tamamlama, XP sistemi, liderboard  
✅ `main.py` — Bütün 5 router qeydiyyatda (19 endpoint)  
✅ `.gitignore` — venv, \_\_pycache\_\_, .env istisna edildi  

### 01.06.2026 — Frontend
✅ Next.js 14 (App Router) + TypeScript qurulumu  
✅ Tailwind CSS + shadcn/ui + Framer Motion  
✅ Landing səhifəsi — animated hero, feature kartları  
✅ Qeydiyyat və giriş formaları (JWT auth)  
✅ Dashboard — XP bar animasiyası, stat kartları, kurs siyahısı  
✅ Kurslar səhifəsi — axtarış, skeleton loader  
✅ Kurs detalları — dərs siyahısı, progress bar, kilit sistemi  
✅ Dərs səhifəsi — YouTube embed, tamamla + XP toast, quiz modal  
✅ Liderboard — Top 10, tac ikonları  
✅ Zustand auth state (persist + hydration guard)  
✅ TanStack Query ilə API caching  
✅ Bug fix: error mesajı object deyil string render edilir  
✅ Bug fix: Zustand hydration race condition — ağ ekran aradan qaldırıldı  
✅ Bug fix: `fetchMe` yalnız 401-də tokeni silir  
✅ `tsconfig.json` — `forceConsistentCasingInFileNames` əlavə edildi  
✅ Tailwind v4 uyğunluğu — `bg-gradient-to-r` → `bg-linear-to-r`  

---

## Roadmap

### Faza 1 — Təməl (Həftə 1–4)
- [x] Mühit qurulumu
- [x] DB schema
- [x] Auth sistemi
- [x] Kurs + Dərs API-ləri
- [x] Progress tracking
- [x] Quiz sistemi
- [x] Protected route-lar (JWT dependency)

### Faza 2 — İstifadəçi Təcrübəsi (Həftə 5–7)
- [x] XP + level sistemi
- [x] Daily streak
- [x] Dashboard
- [x] Frontend (Next.js)

### Faza 3 — AI Mentor (Həftə 8–10)
- [ ] Claude API inteqrasiyası
- [ ] Azərbaycanca sistem prompt
- [ ] Token limiti

### Faza 4 — Launch (Həftə 11–13)
- [ ] Admin panel
- [ ] Deploy (Vercel + Railway)
- [ ] Beta test

---

## Xərc Proqnozu

| | Başlanğıc | Böyüdükcə |
|---|---|---|
| Hosting | $10–15/ay | $25–50/ay |
| Claude API | $2–10/ay | $30–80/ay |
| Domain | $1–3/ay | $1–3/ay |
| **Cəmi** | **~$15–28/ay** | **~$60–130/ay** |