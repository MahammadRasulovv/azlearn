import sys, psycopg2
sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
conn.autocommit = False
cur = conn.cursor()

# Python kursu - freeCodeCamp Python full course (real video IDs)
cur.execute("SELECT id, order_index, title FROM lessons WHERE course_id = 1 ORDER BY order_index;")
lessons = cur.fetchall()
print("Python dersleri:")
for l in lessons:
    print(f"  id={l[0]} order={l[1]} {l[2]}")

# freeCodeCamp "Learn Python" - rfscVS0vtbw (4.5 saat)
# Mosh Python tutorial   - _uQrJ0TkZlc (6 saat)
# Corey Schafer series bölmələri:
video_map = {
    1: 'ZDa-Z5JzLYM',   # Python Giriş - Socratica
    2: 'khKv-8q7YmY',   # Dəyişənlər
    3: '9T9HkxaVKFk',   # If/else (Tech With Tim)
    4: 'OnDr4J2UXSA',   # For loops
    5: 'u-OmVr_fT4s',   # Funksiyalar (Corey)
    6: '9OeznAkyQNk',   # Listlər
    7: 'Uh2ebFW8OO0',   # Fayl əməliyyatları
    8: 'JeznW_7DlB0',   # OOP
    9: 'NIWwJbo-9_8',   # Xəta idarəsi
    10:'rfscVS0vtbw',   # Final - full course
}

cur.execute("SELECT id, order_index FROM lessons WHERE course_id = 1 ORDER BY order_index;")
rows = cur.fetchall()

for lesson_id, order in rows:
    vid = video_map.get(order, 'rfscVS0vtbw')
    url = f'https://www.youtube.com/watch?v={vid}'
    cur.execute('UPDATE lessons SET youtube_url = %s WHERE id = %s', (url, lesson_id))
    print(f"  Lesson {order} -> {vid}")

conn.commit()
print("Yenilendi!")
conn.close()
