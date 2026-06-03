"""Python kursu quizleri - her esasl derse 4 sual"""
import sys, psycopg2
from psycopg2.extras import execute_values
sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
conn.autocommit = False
cur = conn.cursor()

# Lesson title -> id map
cur.execute("SELECT id, order_index, title FROM lessons WHERE course_id = (SELECT id FROM courses WHERE title ILIKE '%python%' LIMIT 1) ORDER BY order_index;")
rows = cur.fetchall()
lid = {r[1]: r[0] for r in rows}  # order -> id
print(f"{len(rows)} ders tapildi")

# Kohne quizleri sil
lesson_ids = [r[0] for r in rows]
if lesson_ids:
    cur.execute("DELETE FROM questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id = ANY(%s));", (lesson_ids,))
    cur.execute("DELETE FROM quizzes WHERE lesson_id = ANY(%s);", (lesson_ids,))
print("Kohne quizler silindi.")

# (lesson_order, quiz_title, pass_score, xp_bonus, questions)
# questions: (text, a, b, c, d, correct)
QUIZZES = [

(1, "Python Giris Quiz", 60, 40, [
    ("Python proqramlasdirma dili kim terefinden yaradilmishdir?",
     "James Gosling", "Guido van Rossum", "Bjarne Stroustrup", "Dennis Ritchie", "b"),
    ("Python hansı nov dildir?",
     "Kompilyasiya edilen", "Interpretativ", "Mashin dili", "Assembly", "b"),
    ("Python faylinin uzantisi nedir?",
     ".java", ".cpp", ".py", ".js", "c"),
    ("Python-da sherh (comment) yazmaq ucun hansi simvol istifade edilir?",
     "//", "/*", "--", "#", "d"),
]),

(2, "Deyishenler ve Operatorlar Quiz", 60, 40, [
    ("x = 5 + 3 * 2 neye beraber olur?",
     "16", "11", "13", "10", "b"),
    ("10 // 3 neye beraber olur?",
     "3.33", "1", "3", "4", "c"),
    ("10 % 3 neye beraber olur?",
     "3", "1", "0", "2", "b"),
    ("2 ** 3 neye beraber olur?",
     "6", "5", "9", "8", "d"),
]),

(3, "float ve int Quiz", 60, 40, [
    ("int(3.9) neye beraber olur?",
     "4", "3", "3.9", "Xeta", "b"),
    ("round(3.567, 2) neye beraber olur?",
     "3.5", "3.57", "4.0", "3.6", "b"),
    ("type(5.0) nedir?",
     "int", "str", "float", "number", "c"),
    ("abs(-7) neye beraber olur?",
     "-7", "0", "7", "Xeta", "c"),
]),

(4, "String Quiz", 60, 45, [
    ('"Python"[0] neyi verir?',
     "n", "P", "y", "p", "b"),
    ('len("Salam") neye beraber olur?',
     "4", "6", "5", "3", "c"),
    ('"python".upper() neyi verir?',
     "Python", "PYTHON", "pYTHON", "python", "b"),
    ('"a,b,c".split(",") neyi verir?',
     '["a","b,c"]', '["a,b","c"]', '["a","b","c"]', '"abc"', "c"),
]),

(5, "Type Casting Quiz", 60, 40, [
    ('int("42") neyi verir?',
     "42.0", "Xeta", '"42"', "42", "d"),
    ("bool(0) neyi verir?",
     "True", "None", "False", "0", "c"),
    ('str(3.14) neyi verir?',
     "3", "3.14", '"3.14"', "Xeta", "b"),
    ("bool('') neyi verir?",
     "True", "False", "None", "Xeta", "b"),
]),

(6, "print() Quiz", 60, 35, [
    ('print("A", "B", sep="-") neyı cap eder?',
     "A B", "AB", "A-B", "A,B", "c"),
    ('print("Salam", end="!") sonunda ne olur?',
     "Salam sonra yeni seter", "Salam!", "!Salam", "Salam", "b"),
    ("Standart end parametri nedir?",
     '"!"', '"\\t"', '"\\n"', '""', "c"),
    ('print(1, 2, 3, sep=", ") neyı cap eder?',
     "1 2 3", "1,2,3", "123", "1, 2, 3", "d"),
]),

(8, "*args Quiz", 60, 40, [
    ("*args funksiyada ne isl eyir?",
     "Bir arqument qebul edir", "Deyishen sayda arqument qebul edir", "Yalniz stringler ucun", "Heç ne", "b"),
    ("ededler = [1,2,3]; print(*ededler) ne cap eder?",
     "[1,2,3]", "1,2,3", "(1,2,3)", "1 2 3", "d"),
    ("**kwargs nedir?",
     "Siyahi arqumentleri", "Tuple arqumentleri", "Acar=deger cutleri", "Renksiz arqument", "c"),
    ("def f(*args): return sum(args) — f(1,2,3,4) nedir?",
     "6", "10", "24", "Xeta", "b"),
]),

(9, "List Quiz", 60, 45, [
    ("m = [1,2,3]; m.append(4) — m nedir?",
     "[1,2,3]", "[4,1,2,3]", "[1,2,3,4]", "Xeta", "c"),
    ("m = [5,3,1,4,2]; m.sort() — m[0] nedir?",
     "5", "1", "3", "2", "b"),
    ("m = ['a','b','c']; m[1] nedir?",
     "a", "c", "b", "Xeta", "c"),
    ("len([1,[2,3],4]) nedir?",
     "4", "2", "3", "5", "c"),
]),

(10, "Tuple Quiz", 60, 40, [
    ("Tuple deyishdirile bilermi?",
     "Hemi, her zaman", "Xeyr, immutable-dir", "Berli shertlerde", "Yalniz metodlarla", "b"),
    ("t = (1,2,3); t[1] nedir?",
     "1", "2", "3", "Xeta", "b"),
    ("Tek elementli tuple necedir?",
     "(42)", "(42,)", "[42]", "{42}", "b"),
    ("x,y,z = (10,20,30) — y nedir?",
     "10", "30", "20", "Xeta", "c"),
]),

(11, "Dictionary Quiz", 60, 45, [
    ('d = {"a":1,"b":2}; d["a"] nedir?',
     "2", "Xeta", "1", "None", "c"),
    ('d.get("x", 0) — "x" yoxdursa nedir?',
     "Xeta", "None", "0", '"x"', "c"),
    ("d.keys() ne qaytarir?",
     "Deyerleri", "Cutleri", "Uzunlugu", "Acharlari", "d"),
    ('{x:x**2 for x in range(3)} nedir?',
     "{0,1,2}", "{0:0,1:1,2:4}", "[0,1,4]", "Xeta", "b"),
]),

(14, "Menteqi Ifadeler Quiz", 60, 40, [
    ("5 > 3 and 2 < 4 nedir?",
     "False", "None", "True", "Xeta", "c"),
    ("not True nedir?",
     "True", "None", "1", "False", "d"),
    ("3 in [1,2,3,4] nedir?",
     "False", "True", "3", "None", "b"),
    ("5 == 5.0 nedir?",
     "False", "TypeError", "True", "None", "c"),
]),

(15, "and ve or Quiz", 60, 40, [
    ("True and False nedir?",
     "True", "None", "False", "Error", "c"),
    ("False or True nedir?",
     "False", "True", "None", "Error", "b"),
    ("not False or False nedir?",
     "False", "True", "None", "Error", "b"),
    ("True and True or False nedir?",
     "False", "None", "Error", "True", "d"),
]),

(16, "if-else Quiz", 60, 45, [
    ("x=10; 'Boyuk' if x>5 else 'Kicik' — netice?",
     "Kicik", "Xeta", "None", "Boyuk", "d"),
    ("if 0: print('A') else: print('B') — ne cap edilir?",
     "A", "Heç ne", "AB", "B", "d"),
    ("elif ne vaxt yoxlanir?",
     "Her zaman", "if dogrudursa", "if yanlishsa", "else-den once", "c"),
    ("Kac elif ola biler?",
     "Yalniz 1", "Maksimum 3", "Yalniz 2", "Istenihen qeder", "d"),
]),

(18, "FOR Dovrues Quiz", 60, 45, [
    ("for i in range(3): — i kac defe tekrarlanir?",
     "2", "4", "3", "1", "c"),
    ("range(1,6) — kac element var?",
     "6", "4", "7", "5", "d"),
    ("for i in range(0,10,2): — ilk 3 deyerler?",
     "1,3,5", "2,4,6", "0,2,4", "0,1,2", "c"),
    ("enumerate(['a','b']) — ilk element?",
     "(1,'a')", "('a',0)", "(0,'b')", "(0,'a')", "d"),
]),

(19, "WHILE Dovrues Quiz", 60, 40, [
    ("n=0; while n<3: n+=1 — son n?",
     "2", "4", "3", "0", "c"),
    ("while True ile break olmasa ne olur?",
     "1 defe ishleyer", "Sonsuz dovr", "Xeta verir", "0 defe", "b"),
    ("while-else-de else ne vaxt icra olur?",
     "Her zaman", "break ile cixildiqda", "break olmadan bitdikde", "Hec vaxt", "c"),
    ("continue ne edir?",
     "Dovreden cixir", "Proqrami dayandirir", "Novbeti iterasiyaya kecir", "Hec ne", "c"),
]),

(21, "break ve continue Quiz", 60, 40, [
    ("break ne edir?",
     "Novbeti iterasiyaya kecir", "Dovreden tamam cixir", "Proqrami bitirir", "Xeta verir", "b"),
    ("continue ne edir?",
     "Dovreden cixir", "Proqrami dayandirir", "Cari iterasiyanı atlair novbetiye kecir", "Hec ne", "c"),
    ("for i in range(5): if i==3: break — son cap edilen i?",
     "4", "3", "2", "5", "c"),
    ("for i in [1,2,3]: if i==2: continue; print(i) — ne cap edilir?",
     "1 2 3", "2", "1 3", "1 2", "c"),
]),

(22, "List Comprehension Quiz", 60, 45, [
    ("[x**2 for x in range(4)] nedir?",
     "[1,4,9,16]", "[0,1,4,9]", "[0,2,4,6]", "[1,2,3,4]", "b"),
    ("[x for x in range(10) if x%2==0] — kac element?",
     "4", "6", "5", "3", "c"),
    ("[s.upper() for s in ['a','b']] nedir?",
     '["a","b"]', '["A","B"]', '["AB"]', 'Xeta', "b"),
    ("{x:x*2 for x in range(3)} nedir?",
     "{0:0,1:2,2:4}", "{1:2,2:4,3:6}", "{0:1,1:2,2:3}", "Xeta", "a"),
]),

(24, "Funksiyalar Quiz", 60, 50, [
    ("Funksiya yaratmaq ucun hansi acar soz ishledilir?",
     "func", "function", "def", "lambda", "c"),
    ("Default parametr nedir?",
     "Her zaman teleb olunan", "Verilmesse ishledilen standart deger", "Tek parametr", "Xeta veren", "b"),
    ("def f(a, b=5): return a+b — f(3) nedir?",
     "3", "5", "Xeta", "8", "d"),
    ("Lokal deyishen qlobal olur?",
     "Hemi", "global acharsozuyle", "Hec vaxt", "Yalniz return ile", "b"),
]),

(25, "return Quiz", 60, 45, [
    ("return olmayan funksiya ne qaytarir?",
     "0", "False", "None", "Xeta", "c"),
    ("def f(): return 1,2 — f() nedir?",
     "[1,2]", "{1,2}", "(1,2)", "Xeta", "c"),
    ("print vs return: print(x) deyeri saxlayirmi?",
     "Hemi", "Yalniz stringler ucun", "Xeyr, None qaytarir", "Berli shertlerde", "c"),
    ("def f(x): return x>0 — f(-3) nedir?",
     "True", "0", "-3", "False", "d"),
]),

(26, "*args **kwargs Quiz", 60, 50, [
    ("def f(*args) — args nedir?",
     "String", "Lughet", "Tuple", "Siyahi", "c"),
    ("def f(**kwargs) — kwargs nedir?",
     "Tuple", "Lughet", "Siyahi", "Integer", "b"),
    ("def f(a, b=1, *args) — f(1,2,3,4) — args nedir?",
     "(2,3,4)", "(3,4)", "(1,2,3,4)", "()", "b"),
    ("def cem(*n): return sum(n) — cem(1,2,3,4,5) nedir?",
     "10", "20", "15", "Xeta", "c"),
]),

(27, "Lambda Quiz", 60, 40, [
    ("lambda x: x*2 — bu nedir?",
     "Normal funksiya", "Sinif", "Anonim funksiya", "Modul", "c"),
    ("(lambda a,b: a+b)(3,4) nedir?",
     "34", "3", "7", "Xeta", "c"),
    ("sorted([3,1,2], key=lambda x: -x) nedir?",
     "[1,2,3]", "[3,2,1]", "[2,1,3]", "Xeta", "b"),
    ("global acharsozunun meqsedi nedir?",
     "Yeni deyishen yaratmaq", "Qlobal deyisheni funksiyadan deyishdirmek", "Deyisheni silmek", "Import etmek", "b"),
]),

(29, "Modullar Quiz", 60, 45, [
    ("import math — math.sqrt(25) nedir?",
     "5.0", "25.0", "5", "Xeta", "a"),
    ("random.randint(1,10) — neyin arasindan?",
     "0-9", "0-10", "1-10", "1-9", "c"),
    ("os.getcwd() ne qaytarir?",
     "Fayl adini", "Cari qovlugu", "Sistem adini", "Istifadeci adini", "b"),
    ("from math import pi — pi nedir?",
     "3", "3.14", "3.14159...", "None", "c"),
]),

(31, "CLASS Quiz", 60, 55, [
    ("__init__ ne vaxt cagirilir?",
     "Sinif silinende", "Metod cagirilande", "Obyekt yarananda", "Import zamanı", "c"),
    ("self ne demekdir?",
     "Sinifin adi", "Obyektin ozunu gosterir", "Valideyn sinif", "Global deyishen", "b"),
    ("t = Telebe('Eli', 20) — t.ad nedir?",
     "20", "Xeta", "Telebe", "Eli", "d"),
    ("Metodla funksiya ferqi?",
     "Ferq yoxdur", "Metod sinifin icindedir", "Funksiya daha surethdir", "Metod return etmir", "b"),
]),

(33, "Miras Quiz", 60, 50, [
    ("Miras ne edir?",
     "Sinifi kopyalayi", "Sinifi silir", "Bir sinif bashasinin xususiyyetlerini alir", "Iki sinifi birleshdirir", "c"),
    ("super().__init__() ne edir?",
     "Yeni obyekt yaradir", "Sinifi silir", "Valideyn sinifin __init__-ini cagırir", "Xeta verir", "c"),
    ("isinstance(obj, Sinif) ne qaytarir?",
     "Sinifin adini", "True/False", "Obyektin tipini", "None", "b"),
    ("Override ne demekdir?",
     "Metodu silmek", "Metodu mirasa vermek", "Valideyn metodunu yeniden yazmaq", "Yeni metod elave etmek", "c"),
]),

(36, "try-except Quiz", 60, 50, [
    ("try-except neden lazimdir?",
     "Kodu suretlendirmek ucun", "Xetanin programi cokmesinin qershisini almaq", "Modulları import etmek", "Deyishenleri silmek", "b"),
    ("finally blohu ne vaxt icra olur?",
     "Yalniz xeta olduqda", "Yalniz xeta olmadiqda", "Hec vaxt", "Her zaman, xeta olsa da olmasa da", "d"),
    ("int('abc') hansi xetanı verir?",
     "TypeError", "SyntaxError", "ValueError", "NameError", "c"),
    ("except Exception as e — e nedir?",
     "Xeta tipi", "Xeta mesajinin obyekti", "Nomer", "String", "b"),
]),

(38, "Fayl Emeliyyatlari Quiz", 60, 45, [
    ("open() ucun default rejim hansidir?",
     "w", "a", "r", "rb", "c"),
    ('"w" rejimi ne edir?',
     "Fayla elave edir", "Yalniz oxuyur", "Movcudu silir ve yeni yaradir", "Binary oxuyur", "c"),
    ("with open() ile fayl ucun ustunluk?",
     "Daha surethdir", "Fayl avtomatik baglianir", "Daha az RAM", "JSON oxuyur", "b"),
    ("f.readlines() ne qaytarir?",
     "Bir seter", "Hamisi bir string kimi", "Seterlerin siyahisi", "None", "c"),
]),

(40, "map() Quiz", 60, 45, [
    ("map(func, siyahi) ne edir?",
     "Siyahini siralayi", "Her elementde funksiyanı tetbiq edir", "Siyahini filtr edir", "Siyahini birleshdirir", "b"),
    ("list(map(str.upper, ['a','b'])) nedir?",
     '["a","b"]', "Xeta", '["A","B"]', '["AB"]', "c"),
    ("filter(lambda x: x>0, [-1,2,-3,4]) — neticede kac element?",
     "1", "3", "2", "4", "c"),
    ("map() lazy mi-dir?",
     "Xeyr, dehal hesablayi", "Beli, iterator qaytarir", "Asili deyil", "Yalniz listde", "b"),
]),

(42, "zip enumerate Quiz", 60, 45, [
    ("zip(['a','b'], [1,2]) — ilk element?",
     "('a',1)", "[a,1]", "{a:1}", "Xeta", "a"),
    ("enumerate(['x','y'], start=1) — ilk element?",
     "(0,'x')", "(1,'y')", "(1,'x')", "(0,'y')", "c"),
    ("all([True, True, False]) nedir?",
     "True", "False", "None", "Xeta", "b"),
    ("any([False, False, True]) nedir?",
     "False", "None", "Xeta", "True", "d"),
]),

(44, "String Metodlar Quiz", 60, 45, [
    ('"Python3".isalpha() nedir?',
     "True", "False", "None", "Xeta", "b"),
    ('"  salam  ".strip() nedir?',
     '"  salam  "', '"salam"', '"  salam"', '"salam  "', "b"),
    ('"a-b-c".split("-") nedir?',
     '["a","b","c"]', '["a-b-c"]', '"abc"', "Xeta", "a"),
    ('"salam".startswith("sal") nedir?',
     "False", "None", "True", "Xeta", "c"),
]),

(46, "SQLite Quiz", 60, 55, [
    ("SQLite harada saxlanilir?",
     "Serverda", "RAM-da", "Faylda", "Bulud servisde", "c"),
    ("conn.commit() ne edir?",
     "Baglantini keser", "Xetani tutur", "Deyishiklikleri daimi saxlayir", "Sorgu icra edir", "c"),
    ("? parametrinin rolu SQL-de?",
     "Sherhdir", "SQL inyeksiyasindan qoruyur", "Cavabdegi yeri gosterir mahsus", "Xeta atir", "b"),
    ("fetchall() ne qaytarir?",
     "Ilk setiri", "Butun neticeleri siyahi kimi", "None", "Seter sayini", "b"),
]),

(50, "Iterator Quiz", 60, 50, [
    ("iter() ne edir?",
     "Siyahini siralayi", "Obyektden iterator yaradir", "Obyekti silir", "None qaytarir", "b"),
    ("StopIteration ne zaman atilir?",
     "Xeta olduqda", "Iterator bitdikde", "next() cagirilmamishdan", "Her zaman", "b"),
    ("__iter__ ve __next__ hansi protokolun hissesidir?",
     "Context manager", "Descriptor", "Iterator protokolu", "Generator protokolu", "c"),
    ("for x in obj: — Python arxada ne cagırir?",
     "obj.loop()", "iter(obj) sonra defalarca next()", "obj.start()", "obj.items()", "b"),
]),

(52, "Generator Quiz", 60, 55, [
    ("return ile yield ferqi?",
     "Ferq yoxdur", "yield funksiyani durakladirib davam etdirir", "return daha surethdir", "yield xeta verir", "b"),
    ("Generator ne zaman hesablama aparir?",
     "Yarananda", "Tele olunan kimi (lazy)", "Programm bashlanda", "Hec vaxt", "b"),
    ("(x**2 for x in range(5)) - bu nedir?",
     "List comprehension", "Set comprehension", "Generator ifadesi", "Tuple comprehension", "c"),
    ("yield from ne edir?",
     "Basha iterator-dan deyerleri verir", "Funksiyanı bitirir", "Import edir", "Xeta atir", "a"),
]),

]

# Insert quizzes + questions
total_q = 0
for lesson_order, qtitle, pass_score, xp_bonus, questions in QUIZZES:
    if lesson_order not in lid:
        print(f"  SKIP: order {lesson_order} tapilmadi")
        continue
    lesson_id = lid[lesson_order]
    cur.execute(
        "INSERT INTO quizzes (lesson_id, title, pass_score, xp_bonus) VALUES (%s,%s,%s,%s) RETURNING id;",
        (lesson_id, qtitle, pass_score, xp_bonus)
    )
    quiz_id = cur.fetchone()[0]

    qdata = [(quiz_id, q[0], q[1], q[2], q[3], q[4], q[5]) for q in questions]
    execute_values(cur,
        "INSERT INTO questions (quiz_id,question_text,option_a,option_b,option_c,option_d,correct_answer) VALUES %s",
        qdata
    )
    total_q += len(questions)
    print(f"  Ders {lesson_order}: {qtitle} ({len(questions)} sual)")

conn.commit()
print(f"\nTamamlandi! {len(QUIZZES)} quiz, {total_q} sual.")
conn.close()
