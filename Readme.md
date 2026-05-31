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

### Courses (hələ yazılmayıb)
| Method | URL | Təsvir | Status |
|---|---|---|---|
| GET | /courses | Bütün kurslar | ⏳ |
| GET | /courses/{id} | Kurs detalları | ⏳ |
| POST | /courses | Kurs əlavə et | ⏳ |
| GET | /courses/{id}/lessons | Dərslər | ⏳ |

### Progress (hələ yazılmayıb)
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /progress/complete | Dərsi bitir | ⏳ |
| GET | /progress/me | Mənim progressim | ⏳ |

### Quiz (hələ yazılmayıb)
| Method | URL | Təsvir | Status |
|---|---|---|---|
| POST | /quiz/submit | Quiz cavabları göndər | ⏳ |

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

## Bugünkü İrəliləyiş (31.05.2026)

✅ Python 3.12 + virtual environment  
✅ Node.js 24  
✅ Docker Desktop  
✅ PostgreSQL + Redis (Docker Compose)  
✅ FastAPI layihə strukturu  
✅ Bütün DB modelləri + cədvəllər  
✅ JWT Auth sistemi (register + login işləyir)  
✅ TablePlus ilə DB bağlantısı  
✅ Swagger UI  

---

## Roadmap

### Faza 1 — Təməl (Həftə 1–4)
- [x] Mühit qurulumu
- [x] DB schema
- [x] Auth sistemi
- [ ] Kurs + Dərs API-ləri
- [ ] Progress tracking
- [ ] Quiz sistemi
- [ ] Protected route-lar

### Faza 2 — İstifadəçi Təcrübəsi (Həftə 5–7)
- [ ] XP + level sistemi
- [ ] Daily streak
- [ ] Dashboard
- [ ] Frontend (Next.js)

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