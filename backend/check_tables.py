import sys, psycopg2
sys.stdout.reconfigure(encoding='utf-8')
conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
cur = conn.cursor()
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
""")
print("Butun cedveller:", [r[0] for r in cur.fetchall()])
conn.close()
