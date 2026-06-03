"""
AzLearn — tam seed script.
Mövcud kurs/dərs/quiz/sual datasını silir, yenisini əlavə edir.
"""
import sys
import psycopg2
from psycopg2.extras import execute_values

sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
conn.autocommit = False
cur = conn.cursor()

print("Köhnə data silinir...")
cur.execute("DELETE FROM questions;")
cur.execute("DELETE FROM quiz_attempts;")
cur.execute("DELETE FROM quizzes;")
cur.execute("DELETE FROM user_progress;")
cur.execute("DELETE FROM lessons;")
cur.execute("DELETE FROM courses;")
cur.execute("SELECT setval('courses_id_seq', 1, false);")
cur.execute("SELECT setval('lessons_id_seq', 1, false);")
cur.execute("SELECT setval('quizzes_id_seq', 1, false);")
cur.execute("SELECT setval('questions_id_seq', 1, false);")

# ── KURSLAR ──────────────────────────────────────────────────────────────────
courses = [
    # (title, description, category, difficulty)
    (
        'Python ilə Proqramlaşdırma',
        'Sıfırdan Python öyrən: dəyişənlər, funksiyalar, OOP və real layihələr',
        'Proqramlaşdırma', 'beginner'
    ),
    (
        'Web Dizayn Əsasları',
        'HTML, CSS və JavaScript ilə müasir veb səhifələr yarat',
        'Veb Dizayn', 'beginner'
    ),
    (
        'SQL və Verilənlər Bazası',
        'PostgreSQL ilə verilənlər bazası əsaslarından optimallaşdırmaya qədər',
        'Proqramlaşdırma', 'intermediate'
    ),
    (
        'Maşın Öyrənməsi',
        'TensorFlow və Scikit-learn ilə süni intellekt modelləri qur',
        'Proqramlaşdırma', 'advanced'
    ),
    (
        'İngilis Dili A1-B2',
        'Danışıq, yazı, qrammatika — tam kurs',
        'Dillər', 'beginner'
    ),
]

cur.executemany(
    """INSERT INTO courses (title, description, category, difficulty, is_published)
       VALUES (%s, %s, %s, %s, true)""",
    courses
)

cur.execute("SELECT id, title FROM courses ORDER BY id;")
course_rows = cur.fetchall()
print(f"{len(course_rows)} kurs əlavə edildi.")
for r in course_rows:
    print(f"  id={r[0]}: {r[1]}")

cid = {r[1]: r[0] for r in course_rows}

# ── DƏRSLƏR ──────────────────────────────────────────────────────────────────
# (course_title, order, lesson_title, description, youtube_url, xp)
lessons = [
    # Python
    ('Python ilə Proqramlaşdırma', 1,  'Pythona Giriş',              'Python nədir, niyə öyrənməli?',         'https://youtu.be/rfscVS0vtbw', 50),
    ('Python ilə Proqramlaşdırma', 2,  'Dəyişənlər və Məlumat Tipləri','int, str, float, bool',               'https://youtu.be/rfscVS0vtbw', 60),
    ('Python ilə Proqramlaşdırma', 3,  'Şərt İfadələri',              'if, elif, else konstruksiyaları',       'https://youtu.be/rfscVS0vtbw', 60),
    ('Python ilə Proqramlaşdırma', 4,  'Dövrələr',                    'for və while dövrələri',                'https://youtu.be/rfscVS0vtbw', 70),
    ('Python ilə Proqramlaşdırma', 5,  'Funksiyalar',                 'def, parametrlər, qaytarma dəyəri',    'https://youtu.be/rfscVS0vtbw', 80),
    ('Python ilə Proqramlaşdırma', 6,  'Siyahılar və Lüğətlər',       'list, dict, set, tuple',               'https://youtu.be/rfscVS0vtbw', 80),
    ('Python ilə Proqramlaşdırma', 7,  'Fayl Əməliyyatları',          'Fayl oxumaq və yazmaq',                'https://youtu.be/rfscVS0vtbw', 90),
    ('Python ilə Proqramlaşdırma', 8,  'Obyekt Yönümlü Proqramlaşdırma','class, miras, polimorfizm',         'https://youtu.be/rfscVS0vtbw', 100),
    ('Python ilə Proqramlaşdırma', 9,  'Xəta İdarəsi',                'try, except, finally',                 'https://youtu.be/rfscVS0vtbw', 90),
    ('Python ilə Proqramlaşdırma', 10, 'Final Layihə: Kalkulyator',   'Bütün bilikləri tətbiq et',            'https://youtu.be/rfscVS0vtbw', 150),

    # Web Dizayn
    ('Web Dizayn Əsasları', 1, 'HTML Əsasları',             'Teqlər, atributlar, struktur',          'https://youtu.be/pQN-pnXPaVg', 50),
    ('Web Dizayn Əsasları', 2, 'CSS ilə Stillər',           'Seçicilər, rənglər, şriftlər',          'https://youtu.be/pQN-pnXPaVg', 60),
    ('Web Dizayn Əsasları', 3, 'Flexbox Layout',            'Müasir layout texnikası',               'https://youtu.be/pQN-pnXPaVg', 70),
    ('Web Dizayn Əsasları', 4, 'CSS Grid',                  'Grid sistemi ilə mürəkkəb layoutlar',   'https://youtu.be/pQN-pnXPaVg', 70),
    ('Web Dizayn Əsasları', 5, 'JavaScript Əsasları',       'Dəyişənlər, funksiyalar, hadisələr',    'https://youtu.be/pQN-pnXPaVg', 80),
    ('Web Dizayn Əsasları', 6, 'DOM Manipulyasiyası',       'HTML elementlərini JS ilə dəyiş',       'https://youtu.be/pQN-pnXPaVg', 80),
    ('Web Dizayn Əsasları', 7, 'Responsiv Dizayn',          'Media queries, mobil uyğunluq',         'https://youtu.be/pQN-pnXPaVg', 90),
    ('Web Dizayn Əsasları', 8, 'Final Layihə: Portfolio',   'Şəxsi portfolio sayt yarat',            'https://youtu.be/pQN-pnXPaVg', 150),

    # SQL
    ('SQL və Verilənlər Bazası', 1, 'Verilənlər Bazasına Giriş', 'Relational DB nədir?',              'https://youtu.be/HXV3zeQKqGY', 60),
    ('SQL və Verilənlər Bazası', 2, 'SELECT Sorğuları',          'Məlumat seçmək',                   'https://youtu.be/HXV3zeQKqGY', 70),
    ('SQL və Verilənlər Bazası', 3, 'Filtrasiya: WHERE',         'Şərtli seçim',                     'https://youtu.be/HXV3zeQKqGY', 70),
    ('SQL və Verilənlər Bazası', 4, 'Cədvəlləri Birləşdirmək',   'JOIN əməliyyatları',               'https://youtu.be/HXV3zeQKqGY', 90),
    ('SQL və Verilənlər Bazası', 5, 'Qruplaşdırma: GROUP BY',    'Aggregasiya funksiyaları',         'https://youtu.be/HXV3zeQKqGY', 90),
    ('SQL və Verilənlər Bazası', 6, 'Data Daxil etmək və Silmək','INSERT, UPDATE, DELETE',           'https://youtu.be/HXV3zeQKqGY', 80),
    ('SQL və Verilənlər Bazası', 7, 'İndekslər və Optimallaşdırma','Sorğu sürətini artır',           'https://youtu.be/HXV3zeQKqGY', 100),

    # ML
    ('Maşın Öyrənməsi', 1, 'ML-ə Giriş',                    'Supervised vs Unsupervised',            'https://youtu.be/GwIo3gDZCVQ', 80),
    ('Maşın Öyrənməsi', 2, 'NumPy və Pandas',                'Məlumat emalı kitabxanaları',          'https://youtu.be/GwIo3gDZCVQ', 90),
    ('Maşın Öyrənməsi', 3, 'Xətti Reqressiya',               'Ən sadə ML modeli',                   'https://youtu.be/GwIo3gDZCVQ', 100),
    ('Maşın Öyrənməsi', 4, 'Klassifikasiya Modelləri',        'Logistic regression, SVM',            'https://youtu.be/GwIo3gDZCVQ', 100),
    ('Maşın Öyrənməsi', 5, 'Neyron Şəbəkələr',               'Deep Learning əsasları',              'https://youtu.be/GwIo3gDZCVQ', 120),
    ('Maşın Öyrənməsi', 6, 'Final Layihə: Şəkil Tanıma',     'CNN ilə şəkil klasifikasiyası',       'https://youtu.be/GwIo3gDZCVQ', 200),

    # İngilis
    ('İngilis Dili A1-B2', 1, 'Əlifba və Tələffüz',           'İngilis hərfləri və səsləri',         'https://youtu.be/oBDMOCfantA', 40),
    ('İngilis Dili A1-B2', 2, 'Özünü Təqdim Et',              'Hello, my name is...',                'https://youtu.be/oBDMOCfantA', 50),
    ('İngilis Dili A1-B2', 3, 'Hal-Hazırki Zaman',            'Present Simple & Continuous',         'https://youtu.be/oBDMOCfantA', 60),
    ('İngilis Dili A1-B2', 4, 'Keçmiş Zaman',                 'Past Simple & Perfect',               'https://youtu.be/oBDMOCfantA', 60),
    ('İngilis Dili A1-B2', 5, 'Gələcək Zaman',                'Will, going to, Present Continuous',  'https://youtu.be/oBDMOCfantA', 60),
    ('İngilis Dili A1-B2', 6, 'Gündəlik Söhbətlər',           'İş, alış-veriş, restoran',            'https://youtu.be/oBDMOCfantA', 70),
    ('İngilis Dili A1-B2', 7, 'Biznes İngilis',               'Email, görüş, prezentasiya',          'https://youtu.be/oBDMOCfantA', 80),
    ('İngilis Dili A1-B2', 8, 'IELTS Hazırlığı',              'Reading, Writing, Listening, Speaking','https://youtu.be/oBDMOCfantA', 100),
]

lesson_data = [
    (cid[ct], o, lt, ld, yu, xp)
    for ct, o, lt, ld, yu, xp in lessons
    if ct in cid
]

execute_values(
    cur,
    """INSERT INTO lessons (course_id, order_index, title, description, youtube_url, xp_reward)
       VALUES %s""",
    lesson_data
)

cur.execute("SELECT id, course_id, title FROM lessons ORDER BY course_id, order_index;")
lesson_rows = cur.fetchall()
print(f"\n{len(lesson_rows)} ders elave edildi.")

# lesson title → id mapping (ilk dərs hər kurs üçün)
lid = {r[2]: r[0] for r in lesson_rows}

# ── QUİZLƏR ─────────────────────────────────────────────────────────────────
# Hər kursun ilk dərsi üçün quiz
quizzes = [
    ('Python ilə Proqramlaşdırma', 'Pythona Giriş',          'Python Əsasları Quiz',         60, 50),
    ('Python ilə Proqramlaşdırma', 'Dəyişənlər və Məlumat Tipləri','Məlumat Tipləri Quiz',   60, 50),
    ('Python ilə Proqramlaşdırma', 'Şərt İfadələri',          'if/else Quiz',                60, 50),
    ('Python ilə Proqramlaşdırma', 'Funksiyalar',             'Funksiyalar Quiz',             60, 60),
    ('Web Dizayn Əsasları',        'HTML Əsasları',           'HTML Quiz',                    60, 50),
    ('Web Dizayn Əsasları',        'CSS ilə Stillər',         'CSS Quiz',                     60, 50),
    ('Web Dizayn Əsasları',        'JavaScript Əsasları',     'JavaScript Quiz',              60, 60),
    ('SQL və Verilənlər Bazası',   'SELECT Sorğuları',        'SELECT Quiz',                  60, 60),
    ('SQL və Verilənlər Bazası',   'Cədvəlləri Birləşdirmək', 'JOIN Quiz',                    60, 70),
    ('Maşın Öyrənməsi',            'ML-ə Giriş',              'ML Əsasları Quiz',             60, 80),
    ('İngilis Dili A1-B2',         'Hal-Hazırki Zaman',       'Present Tense Quiz',           60, 50),
    ('İngilis Dili A1-B2',         'Keçmiş Zaman',            'Past Tense Quiz',              60, 50),
]

quiz_data = [
    (lid[lt], qt, ps, xb)
    for _, lt, qt, ps, xb in quizzes
    if lt in lid
]

execute_values(
    cur,
    "INSERT INTO quizzes (lesson_id, title, pass_score, xp_bonus) VALUES %s",
    quiz_data
)

cur.execute("SELECT id, lesson_id, title FROM quizzes ORDER BY id;")
quiz_rows = cur.fetchall()
print(f"{len(quiz_rows)} quiz elave edildi.")
qid = {r[2]: r[0] for r in quiz_rows}

# ── SUALLAR ─────────────────────────────────────────────────────────────────
questions = [
    # Python Əsasları Quiz
    ('Python Əsasları Quiz',
     'Python proqramlaşdırma dili kim tərəfindən yaradılıb?',
     'James Gosling', 'Guido van Rossum', 'Bjarne Stroustrup', 'Dennis Ritchie', 'b'),
    ('Python Əsasları Quiz',
     'Python hansı növ dildir?',
     'Kompilyasiya edilən', 'İnterpretatif', 'Maşın dili', 'Assembly', 'b'),
    ('Python Əsasları Quiz',
     'Python faylının uzantısı nədir?',
     '.py', '.java', '.cpp', '.js', 'a'),
    ('Python Əsasları Quiz',
     'Python-da şərh (comment) yazmaq üçün hansı simvol istifadə edilir?',
     '//', '#', '/*', '--', 'b'),

    # Məlumat Tipləri Quiz
    ('Məlumat Tipləri Quiz',
     'Python-da tam ədəd tipi necə adlanır?',
     'integer', 'int', 'number', 'whole', 'b'),
    ('Məlumat Tipləri Quiz',
     '"True" və "False" hansı tip məlumatdır?',
     'string', 'int', 'bool', 'float', 'c'),
    ('Məlumat Tipləri Quiz',
     'x = 3.14 — bu hansı tip məlumata aiddir?',
     'int', 'str', 'bool', 'float', 'd'),
    ('Məlumat Tipləri Quiz',
     'Python-da sətir (text) tipi necə adlanır?',
     'text', 'char', 'str', 'string', 'c'),

    # if/else Quiz
    ('if/else Quiz',
     'Şərt doğru olduqda hansı blok icra edilir?',
     'else', 'elif', 'if', 'for', 'c'),
    ('if/else Quiz',
     '"elif" nə deməkdir?',
     'else if', 'end if', 'else loop', 'empty if', 'a'),
    ('if/else Quiz',
     'Bütün şərtlər yanlış olarsa hansı blok icra edilir?',
     'if', 'elif', 'else', 'for', 'c'),

    # Funksiyalar Quiz
    ('Funksiyalar Quiz',
     'Python-da funksiya yaratmaq üçün hansı açar söz istifadə edilir?',
     'function', 'fun', 'def', 'func', 'c'),
    ('Funksiyalar Quiz',
     'Funksiyadan dəyər qaytarmaq üçün hansı açar söz istifadə edilir?',
     'give', 'send', 'output', 'return', 'd'),
    ('Funksiyalar Quiz',
     'Funksiya çağırılmadan icra edilirmi?',
     'Bəli, həmişə', 'Bəli, fayl açılarkən', 'Xeyr, çağırılmalıdır', 'Bəli, avtomatik', 'c'),

    # HTML Quiz
    ('HTML Quiz',
     'HTML-in tam adı nədir?',
     'Hyper Text Markup Language', 'High Tech Modern Language',
     'Hyper Transfer Markup Logic', 'Home Tool Markup Language', 'a'),
    ('HTML Quiz',
     'HTML-də başlıq yaratmaq üçün hansı teq istifadə edilir?',
     '<head>', '<title>', '<h1>', '<header>', 'c'),
    ('HTML Quiz',
     'Şəkil əlavə etmək üçün hansı teq istifadə edilir?',
     '<picture>', '<img>', '<image>', '<src>', 'b'),
    ('HTML Quiz',
     'HTML faylı hansı teqlə başlayır?',
     '<body>', '<html>', '<head>', '<!DOCTYPE html>', 'd'),

    # CSS Quiz
    ('CSS Quiz',
     'Mətnin rəngini dəyişmək üçün hansı xüsusiyyət istifadə edilir?',
     'font-color', 'text-color', 'color', 'foreground', 'c'),
    ('CSS Quiz',
     'CSS-də şərh (comment) necə yazılır?',
     '// şərh', '# şərh', '/* şərh */', '<!-- şərh -->', 'c'),
    ('CSS Quiz',
     'Elementlər arasındakı daxili boşluq hansı xüsusiyyətlə idarə olunur?',
     'margin', 'border', 'padding', 'spacing', 'c'),

    # JavaScript Quiz
    ('JavaScript Quiz',
     'JavaScript-də dəyişən elan etmək üçün hansı açar söz istifadə edilir?',
     'var, let, const', 'dim, var', 'int, str', 'declare', 'a'),
    ('JavaScript Quiz',
     'Konsolda çap etmək üçün hansı funksiya istifadə edilir?',
     'print()', 'echo()', 'console.log()', 'write()', 'c'),
    ('JavaScript Quiz',
     'JavaScript-də massiv necə yaradılır?',
     '{}', '()', '[]', '<>', 'c'),

    # SELECT Quiz
    ('SELECT Quiz',
     'SQL-də bütün sütunları seçmək üçün hansı simvol istifadə edilir?',
     '@', '%', '*', '&', 'c'),
    ('SELECT Quiz',
     'Cədvəlin ilk 10 sətirini seçmək üçün hansı açar söz istifadə edilir?',
     'FIRST 10', 'TOP 10', 'LIMIT 10', 'FETCH 10', 'c'),
    ('SELECT Quiz',
     'Nəticəni sıralamaq üçün hansı açar söz istifadə edilir?',
     'SORT BY', 'ORDER BY', 'ARRANGE BY', 'GROUP BY', 'b'),

    # JOIN Quiz
    ('JOIN Quiz',
     'İki cədvəldəki uyğun sətirləri birləşdirmək üçün hansı JOIN istifadə edilir?',
     'LEFT JOIN', 'FULL JOIN', 'RIGHT JOIN', 'INNER JOIN', 'd'),
    ('JOIN Quiz',
     'Sol cədvəlin bütün sətirləri + sağdan uyğun olanlar — hansı JOIN?',
     'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN', 'a'),

    # ML Əsasları Quiz
    ('ML Əsasları Quiz',
     'Nəzarətli öyrənmə (Supervised Learning) nədir?',
     'Model etiketli data ilə öyrənir', 'Model heç bir data olmadan öyrənir',
     'Model yalnız şəkilləri öyrənir', 'Model oyun oynayır', 'a'),
    ('ML Əsasları Quiz',
     'Ən sadə ML modeli hansıdır?',
     'Neyron şəbəkə', 'Random Forest', 'Xətti Reqressiya', 'CNN', 'c'),
    ('ML Əsasları Quiz',
     'Modelin bilinməyən datada nə qədər yaxşı işlədiyini yoxlamaq nə adlanır?',
     'Training', 'Testing', 'Overfitting', 'Preprocessing', 'b'),

    # Present Tense Quiz
    ('Present Tense Quiz',
     '"He ___ every day." — boşluğa nə gəlir? (runs/run)',
     'run', 'running', 'ran', 'runs', 'd'),
    ('Present Tense Quiz',
     'Present Continuous zamanı bildirmək üçün nə işlədilir?',
     'am/is/are + V-ing', 'did + V', 'will + V', 'have + V3', 'a'),
    ('Present Tense Quiz',
     '"I ___ English." — (study/studies)',
     'studies', 'studying', 'study', 'studied', 'c'),

    # Past Tense Quiz
    ('Past Tense Quiz',
     '"She ___ to school yesterday." (go-nun keçmiş zamanı)',
     'goed', 'goes', 'going', 'went', 'd'),
    ('Past Tense Quiz',
     'Past Simple zamanında düzgün fe\'l forması hansıdır?',
     'V + ing', 'V + ed / 2-ci forma', 'will + V', 'have + V3', 'b'),
    ('Past Tense Quiz',
     '"Did you ___ the movie?" boşluğa nə gəlir?',
     'watched', 'watches', 'watching', 'watch', 'd'),
]

question_data = [
    (qid[qt], qtext, a, b, c, d, ans)
    for qt, qtext, a, b, c, d, ans in questions
    if qt in qid
]

execute_values(
    cur,
    """INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
       VALUES %s""",
    question_data
)

cur.execute("SELECT COUNT(*) FROM questions;")
print(f"{cur.fetchone()[0]} sual elave edildi.")

conn.commit()
print("\nSeed tamamlandi!")
print(f"  {len(course_rows)} kurs")
print(f"  {len(lesson_rows)} ders")
print(f"  {len(quiz_rows)} quiz")
print(f"  {len(question_data)} sual")

conn.close()
