import psycopg2

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
cur = conn.cursor()

cur.execute('SHOW server_encoding;')
print('server_encoding:', cur.fetchone()[0])

cur.execute('SHOW client_encoding;')
print('client_encoding:', cur.fetchone()[0])

cur.execute('SELECT datcollate FROM pg_database WHERE datname = current_database();')
print('collation:', cur.fetchone()[0])

cur.execute('SELECT id, title FROM courses LIMIT 5;')
for row in cur.fetchall():
    print(f'  id={row[0]} title={repr(row[1])}')

conn.close()
