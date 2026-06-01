# AzLearn — Azərbaycanlılar üçün Proqramlaşdırma Platforması

Azərbaycan dilində proqramlaşdırma öyrənmə platforması. Video dərslər, quiz sistemi, XP/level mexanizmi və streak tracking.

## Texnologiyalar

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Auth:** JWT (python-jose), bcrypt
- **Frontend:** _(gələcəkdə)_

## Quraşdırma

```bash
git clone https://github.com/MahammadRasulovv/azlearn.git
cd azlearn/backend

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
cp .env.example .env
# .env-i doldurun

uvicorn app.main:app --reload
```

`.env` nümunəsi:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/azlearn_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Endpoint-ləri

Swagger sənəd: `http://localhost:8000/docs`

### Auth
| Method | URL | Təsvir |
|--------|-----|--------|
| POST | `/auth/register` | Qeydiyyat |
| POST | `/auth/login` | Giriş → JWT token |

### Kurslar
| Method | URL | Təsvir |
|--------|-----|--------|
| GET | `/courses` | Yayımlanmış kurslar |
| POST | `/courses` | Kurs yarat |
| GET | `/courses/{id}` | Kurs detalları |
| PUT | `/courses/{id}` | Kurs yenilə |
| DELETE | `/courses/{id}` | Kurs sil |
| PATCH | `/courses/{id}/publish` | Yayımla / ləğv et |
| POST | `/courses/{id}/lessons` | Dərs əlavə et |
| GET | `/courses/{id}/lessons` | Dərsləri siyahıla |

### Dərslər
| Method | URL | Təsvir |
|--------|-----|--------|
| GET | `/lessons/{id}` | Dərs detalları |
| PUT | `/lessons/{id}` | Dərs yenilə |
| DELETE | `/lessons/{id}` | Dərs sil |

### Quiz
| Method | URL | Təsvir |
|--------|-----|--------|
| POST | `/quizzes` | Quiz yarat |
| GET | `/quizzes/lesson/{lesson_id}` | Dərsin quizi |
| POST | `/quizzes/{id}/questions` | Sual əlavə et |
| DELETE | `/quizzes/{id}/questions/{q_id}` | Sual sil |
| POST | `/quizzes/{id}/submit` | Quiz göndər → nəticə |

### Progress & XP
| Method | URL | Təsvir |
|--------|-----|--------|
| POST | `/progress/lesson/{id}/complete` | Dərsi tamamla → XP qazandır |
| GET | `/progress/me` | Öz statistikam |
| GET | `/progress/me/lessons` | Tamamladığım dərslər |
| GET | `/progress/leaderboard` | Top 10 liderboard |

## XP Sistemi

| Hadisə | XP |
|--------|----|
| Dərsi tamamla | `lesson.xp_reward` (default 50) |
| Quiz keç | `quiz.xp_bonus` (default 20) |
| Level yüksəl | hər 500 XP-də +1 level |

## Layihə Strukturu

```
azlearn/
└── backend/
    └── app/
        ├── api/
        │   ├── auth.py       # Qeydiyyat / giriş
        │   ├── courses.py    # Kurs + dərs CRUD
        │   ├── deps.py       # JWT dependency
        │   ├── progress.py   # Progress + XP
        │   └── quiz.py       # Quiz sistemi
        ├── core/
        │   ├── config.py
        │   ├── database.py
        │   └── security.py
        ├── models/
        │   ├── course.py
        │   ├── progress.py
        │   ├── quiz.py
        │   └── user.py
        ├── schemas/
        │   ├── course.py
        │   ├── quiz.py
        │   └── user.py
        └── main.py
```
