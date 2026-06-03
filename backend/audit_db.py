import sys
import psycopg2
sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
cur = conn.cursor()

tables = ['courses', 'lessons', 'quizzes', 'questions', 'users']
for t in tables:
    try:
        cur.execute(f'SELECT * FROM {t} LIMIT 100;')
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        print(f"\n=== {t} ({len(rows)} row) ===")
        print("cols:", cols)
        for r in rows:
            print(dict(zip(cols, r)))
    except Exception as e:
        print(f"{t}: {e}")

conn.close()
