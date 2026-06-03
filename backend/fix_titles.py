import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
conn.autocommit = False
cur = conn.cursor()

cur.execute('SELECT id, title FROM courses ORDER BY id;')
courses = cur.fetchall()
print("Movcud kurslar:")
for c in courses:
    print(f"  id={c[0]}: {c[1]}")

updates = [
    (1, 'Python Əsasları'),
    (2, 'Web Dizayn Əsasları'),
    (3, 'Maşın Öyrənməsi'),
    (4, 'SQL Verilənlər Bazası'),
    (5, 'Süni İntellekt'),
    (6, 'Figma ilə UI/UX Dizayn'),
    (7, 'İngilis Dili A1-B2'),
    (8, 'Biznes Analitika'),
]

existing_ids = {c[0] for c in courses}

for course_id, title in updates:
    if course_id in existing_ids:
        cur.execute('UPDATE courses SET title = %s WHERE id = %s', (title, course_id))
        print(f"  OK id={course_id}")

conn.commit()
print("Tamamlandi!")

cur.execute('SELECT id, title FROM courses ORDER BY id;')
for c in cur.fetchall():
    print(f"  id={c[0]}: {c[1]}")

conn.close()
