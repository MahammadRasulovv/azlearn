"""Python kursu - 53 video, Azerbaycan dilinde konspekt + tapshiriqlar"""
import sys, psycopg2
from psycopg2.extras import execute_values
sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://azlearn:azlearn123@localhost:5432/azlearn_db')
conn.autocommit = False
cur = conn.cursor()

cur.execute("SELECT id FROM courses WHERE title ILIKE '%python%' LIMIT 1;")
row = cur.fetchone()
if not row:
    print("Python kursu tapilmadi!")
    conn.close()
    exit()
COURSE_ID = row[0]
print(f"Python kursu ID: {COURSE_ID}")

cur.execute("""DELETE FROM questions WHERE quiz_id IN (
    SELECT q.id FROM quizzes q JOIN lessons l ON q.lesson_id=l.id WHERE l.course_id=%s
);""", (COURSE_ID,))
cur.execute("""DELETE FROM quizzes WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id=%s);""", (COURSE_ID,))
cur.execute("""DELETE FROM quiz_attempts WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id=%s);""", (COURSE_ID,))
cur.execute("""DELETE FROM user_progress WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id=%s);""", (COURSE_ID,))
cur.execute("DELETE FROM lessons WHERE course_id=%s;", (COURSE_ID,))
print("Kohne dersler silindi.")

def n(text):
    return text.strip()

# ── NOTES ────────────────────────────────────────────────────────────────────
N1 = n("""
## Konspekt

Python 1991-ci ilde Guido van Rossum terefinden yaradilmish yukh sesiyyeli proqramlasdirma dilidir.

Niye Python?
- Oxunaql ve sade sintaksis
- Boyuk kitabxana ekosistemi
- Web, AI/ML, avtomatlasdirma, data elmi sahelerde genish istifade
- Dunyada en populyar dillerden biri

Qurashdirilma:
1. python.org saytina daxil ol
2. En son versiyonu yukle
3. PATH-a elave et secimini qeyd et
4. python --version ile yoxla

Ilk proqram:
print("Salam, Dunya!")

## Tapshiriqlar

1. Python-u oz kompüterine qurashdir ve python --version emrini islet
2. Terminal-de Python interpreterini ac ve print("Adim: [adin]") yaz
3. Hansı sahelerde Python istifade etmek isteyirsen? 3 sahe yaz
""")

N2 = n("""
## Konspekt

Deyishen nedir?
Deyishen - melumatı saxlayan bir qutudur.

ad = "Eli"
yas = 20
qiymet = 9.5

Riyazi operatorlar:
+  Toplama      5 + 3 = 8
-  Cixma        5 - 3 = 2
*  Vurma        5 * 3 = 15
/  Bolme        10 / 3 = 3.33
// Tam bolme    10 // 3 = 3
%  Qaliq        10 % 3 = 1
** Quvvet       2 ** 3 = 8

Sherh setirleri:
# Bu bir sherh setiridır
x = 5  # bu da sherhdir

Deyishen adlandirma qaydalar:
- Herfe ve ya _ ile bashlayi
- Bosluq ola bilmez
- Kicik herfer tovsiye edilir

## Tapshiriqlar

1. ad, soyad, yas, sheher deyishenlerini ozun haqqinda doldur ve print et
2. Iki ededin cemini, ferqini, hasilini ve bolmesini hesabla
3. Oz yashin nece gune beber oldugunu hesabla (yas * 365)
""")

N3 = n("""
## Konspekt

int vs float:
x = 5      # int (tam eded)
y = 5.0    # float (onluq eded)

print(type(x))  # int
print(type(y))  # float

Emeliyyat prioriteti (yuxaridan ashagiya):
1. ()  - Moterize
2. **  - Quvvet
3. * / // %  - Vurma/Bolme
4. + -  - Toplama/Cixma

print(2 + 3 * 4)    # 14
print((2 + 3) * 4)  # 20

Faydali funksiyalar:
round(3.7)  = 4
abs(-5)     = 5
int(3.9)    = 3
float(5)    = 5.0

## Tapshiriqlar

1. 17/5, 17//5, 17%5 - neticelerini hesabla ve ferqini izah et
2. Moterize istifade ederek 2+3*4 neticasini 20 et
3. Dairinin sahesi = pi * r^2. r=7 ucun hesabla (pi=3.14159)
""")

N4 = n("""
## Konspekt

String yaratmaq:
ad = "Eli"
soyad = 'Hesenov'

String emeliyyatlar:
s = "Python"
len(s)      -> 6
s[0]        -> P
s[-1]       -> n
s[0:3]      -> Pyt
s.upper()   -> PYTHON
s.lower()   -> python
s * 3       -> PythonPythonPython

String birlesdirme:
ad = "Eli"
soyad = "Hesenov"
tam_ad = ad + " " + soyad
print(f"Adim {ad}, soyadim {soyad}")   # f-string

Faydali metodlar:
"  python  ".strip()        -> "python"
"python".replace("p","P")  -> "Python"
"a,b,c".split(",")         -> ["a","b","c"]
"Python".startswith("Py")  -> True

## Tapshiriqlar

1. Adin ve soyadinin olan bir string yarat, uzunlugunu tap
2. "Salam Dunya" metnini boyuk herfe, sonra kicik herfe cevir
3. f-string ile: "Menim adim [ad], yashim [yas]-dir" cap et
""")

N5 = n("""
## Konspekt

Niye cevirmek lazimdir?
input() funksiyasi hemise string qaytarir. Riyazi emeliyyat ucun int-e cevirmek lazimdir.

Cevirmek:
int("42")     -> 42
int(3.9)      -> 3  (kesilir!)
float("3.14") -> 3.14
str(42)       -> "42"
bool(0)       -> False
bool(1)       -> True
bool("")      -> False
bool("python")-> True

Praktiki numune:
yas_str = input("Yashinizi daxil edin: ")
yas = int(yas_str)
print(f"5 il sonra: {yas + 5}")

## Tapshiriqlar

1. Istifadeciden iki eded al, cemini cap et
2. float("3.99") -> int() ne verir? Niye?
3. bool(""), bool(0), bool("False") - neticesini tap
""")

N6 = n("""
## Konspekt

print() parametrleri:
print("Salam")
print("Salam", "Dunya", sep="-")  -> Salam-Dunya
print("Salam", end="")            -> seter basina getmir

sep - ayirici:
print(1, 2, 3, sep=", ")     -> 1, 2, 3

end - son simvol:
print("A", end="")
print("B", end="")
print("C")
# ABC

Escape simvollar:
\n  - yeni seter
\t  - tab
\"  - dirmaq

## Tapshiriqlar

1. Bir setirde "Ad: Eli | Yas: 20 | Sheher: Baki" cap et
2. * simvollarindan 5x5 kvadrat cap et
3. end parametri ile eyni setirde 1 2 3 4 5 cap et
""")

N7 = n("""
## Konspekt

file parametri - fayla yazmaq:
f = open("cixis.txt", "w", encoding="utf-8")
print("Bu fayla yazilir", file=f)
f.close()

flush parametri - dehal goster:
import time
print("Yuklenir", end="", flush=True)
time.sleep(1)
print(" tamamlandi!")

Niye lazimdir?
- file: cixishi fayla yonlendir
- flush: uzun emeliyyatlarda canli ireleleyish goster

## Tapshiriqlar

1. print() ile log.txt faylina 3 seter yaz, sonra oxu
2. flush=True ile her saniye noqte cap eden proqram yaz
3. sys.stderr-e xeta mesaji yaz
""")

N8 = n("""
## Konspekt

Ulduzlu operator * ne edir?
ededler = [1, 2, 3]
print(*ededler)   -> 1 2 3

a = [1, 2]; b = [3, 4]
c = [*a, *b]      -> [1, 2, 3, 4]

*args - funksiyada:
def topla(*ededler):
    return sum(ededler)

topla(1, 2, 3)        -> 6
topla(1, 2, 3, 4, 5)  -> 15

**kwargs:
def tanit(**melumat):
    for acar, deger in melumat.items():
        print(f"{acar}: {deger}")

tanit(ad="Eli", yas=20)

## Tapshiriqlar

1. Istenihen sayda eded qebul edib ortalamasini hesablayan funksiya yaz
2. * ile iki siyahini birleshdir
3. **kwargs ile istifadeci profili cap eden funksiya yaz
""")

N9 = n("""
## Konspekt

List yaratmaq:
bos = []
ededler = [1, 2, 3, 4, 5]
qarishiq = [1, "salam", True, 3.14]

Emel iyyatlar:
m = ["alma", "armud", "gilas"]
m[0]             -> "alma"
m[-1]            -> "gilas"
m[0:2]           -> ["alma","armud"]
len(m)           -> 3
m.append("uzum") # sona elave
m.insert(1,"banan") # 1-ci yere
m.remove("armud")   # sil
m.pop()             # sonuncunu sil
m.sort()            # sirala
m.reverse()         # tersine

## Tapshiriqlar

1. 5 sevimli filmin siyahisini yarat, sort et, cap et
2. Siyahiya element elave et, ortasina yeni element daxil et, birini sil
3. Iki siyahini birleshdir
""")

N10 = n("""
## Konspekt

Tuple nedir?
Tuple - deyishdirilmeyen (immutable) siyahidir.

koordinat = (10, 20)
renglerr = ("qirmizi", "yashil", "mavi")
tek = (42,)  # tek elementli - vergul vacibdir!

Tuple vs List:
List [] - deyishdirilir, yavash
Tuple () - deyishdirilmir, suerli

Tuple emeliyyatlar:
t = (1, 2, 3, 2, 1)
t[0]          -> 1
t[1:3]        -> (2,3)
len(t)        -> 5
t.count(2)    -> 2
t.index(3)    -> 2

Unpack:
x, y, z = (10, 20, 30)

## Tapshiriqlar

1. Ad, soyad, yas melumatini tuple-da saxla, unpack et
2. Tuple-dan list, listden tuple yarat
3. Niye koordinatlari tuple-da saxlamaq daha duzgundur? Izah et
""")

N11 = n("""
## Konspekt

Dictionary nedir?
telebe = {
    "ad": "Eli",
    "yas": 20,
    "sehir": "Baki"
}

Emeliyyatlar:
d["a"]              -> deyeri oxu
d.get("x", 0)       -> yoxdursa default
d["d"] = 4          -> elave/yenile
del d["b"]          -> sil
"a" in d            -> True/False
d.keys()            -> acharlari
d.values()          -> deyerleri
d.items()           -> cutleri

Dovreye vurmaq:
for acar, deger in d.items():
    print(f"{acar} = {deger}")

Dict comprehension:
kvardat = {x: x**2 for x in range(5)}

## Tapshiriqlar

1. Ozun haqqinda 5 achari olan lughet yarat
2. Telebe qiymetlen lughetde saxla, ortalamanı hesabla
3. Iki lugheti birleshdir
""")

N12 = n("""
## Konspekt

input() necə isleyir?
ad = input("Adinizi daxil edin: ")
print(f"Salam, {ad}!")

Hemise string qaytarir:
yas = int(input("Yashiniz: "))
boy = float(input("Boyunuz (sm): "))

Praktiki numune:
a = float(input("1-ci eded: "))
b = float(input("2-ci eded: "))
print(f"Cem: {a+b}")

## Tapshiriqlar

1. Istifadeciden ad, yas, sheher al - formatlanmish tanitim cap et
2. Iki eded al, dort emeliyyatin neticasini cap et
3. 5 eded al, en boyugunu tap
""")

N13 = n("""
## Konspekt

Bu ders praktiki meshq dersidir. Evvelki mevzulari - deyishenler, stringler, listler, lughetler - birlikde istifade et.

Mesele helli:
1. Problemi anla
2. Addimlara bol
3. Her addimi kod ile hell et
4. Test et

Numune - Telebe qiymet sistemi:
ad = input("Adin: ")
qiymetler = []
for i in range(5):
    q = float(input(f"{i+1}-ci qiymet: "))
    qiymetler.append(q)
ortalama = sum(qiymetler) / len(qiymetler)
print("Kecdi!" if ortalama >= 51 else "Kesildi!")

## Tapshiriqlar

1. Alis-veris siyahisi proqrami yaz: elave et, sil, goster
2. Istifadecinin adini al, herflerini tersine cevir, boyuk herfe cap et
3. Lughetde 5 olke ve paytaxt saxla, istifadeci olke yazdiqda paytahti soyle
""")

N14 = n("""
## Konspekt

Muqayise operatorlari:
5 == 5   -> True
5 != 3   -> True
5 > 3    -> True
5 < 3    -> False
5 >= 5   -> True
5 <= 4   -> False

Menteqi operatorlar:
True and True   -> True
True and False  -> False
True or False   -> True
not True        -> False

in operatoru:
"a" in "salam"      -> True
3 in [1, 2, 3]      -> True

Heqiqet cedveli:
A=T, B=T: and=T, or=T
A=T, B=F: and=F, or=T
A=F, B=T: and=F, or=T
A=F, B=F: and=F, or=F

## Tapshiriqlar

1. Yas 18-den boyuk VE sheher Bakidirsa True cap et
2. Eded hem 2-ye hem 3-e bolunurse True olan ifade yaz
3. not, and, or istifade ederek 5 ferqli ifade yaz
""")

N15 = n("""
## Konspekt

and - her ikisi dogru olmali:
yas = 20; var_lisenz = True
if yas >= 18 and var_lisenz:
    print("Araba surulmek olar")

or - en azi biri dogru olmali:
gun = "Shenbе"
if gun == "Shenbe" or gun == "Bazar":
    print("Hefte sonu!")

Qisaldilmish qeyd:
if x in [1, 2, 3]:  # if x==1 or x==2 or x==3 evezine

Prioritet: not -> and -> or

## Tapshiriqlar

1. Saat 9-18 arasinda VE is gunudurse "Is saati" cap et
2. Istifadeci "admin" YAXUD "moderator" dirsa "Giris icazesi var"
3. Uzun il yoxlayan sert yaz
""")

N16 = n("""
## Konspekt

Esas struktur:
yas = 20
if yas >= 18:
    print("Yetkindir")
elif yas >= 13:
    print("Yeniyetmledir")
else:
    print("Ushaqdır")

Qisaldilmish if (ternary):
netice = "Kecdi" if bal >= 51 else "Kesildi"

Nested if:
if sayi > 0:
    if sayi % 2 == 0:
        print("Muebet cut")
    else:
        print("Muebet tek")
else:
    print("Menfi")

## Tapshiriqlar

1. Qiymet almaq: 91-100=A, 81-90=B, 71-80=C, 51-70=D, 0-50=F
2. BMI kalkulyatoru
3. Sade ATM: PIN yoxla, mebleh kifayet edirsə cek
""")

N17 = n("""
## Konspekt

Bu ders if/elif/else-in praktiki tetbiqidir. Murekkel shertli meseleleri hell etmeyi oyrен.

Hell strategiyasi:
1. Butun mumkun hallari mueyyen et
2. En dar shertden genish sherte
3. else ile bilinmeyen hallari tut

Numune - vergi hesablama:
gelir = float(input("Gelir: "))
if gelir <= 2500:
    vergi = 0
elif gelir <= 8000:
    vergi = gelir * 0.14
else:
    vergi = gelir * 0.35
print(f"Vergi: {vergi:.2f} AZN")

## Tapshiriqlar

1. Dash-qaychi-kagiz oyunu yaz
2. Il daxil et, hansi esre aid oldugunu soyle
3. Ucbucagin novunu teyin et
""")

N18 = n("""
## Konspekt

for dovrusu:
meyveler = ["alma", "armud", "gilas"]
for meyve in meyveler:
    print(meyve)

range ile:
for i in range(5):       # 0-4
for i in range(1, 6):    # 1-5
for i in range(0,10,2):  # 0,2,4,6,8

String uzerinde:
for herf in "Python":
    print(herf)

enumerate - indeks + deger:
for i, meyve in enumerate(meyveler):
    print(f"{i}: {meyve}")

Nested for:
for i in range(3):
    for j in range(3):
        print(f"({i},{j})", end=" ")

## Tapshiriqlar

1. 1-100 arasindaki cut ededlerin cemini tap
2. Vurma cedvelini (1-10) cap et
3. Siyahidan ededler arasinda yalniz muebet olanlari yeni siyahiya elave et
""")

N19 = n("""
## Konspekt

while dovrusu:
sayici = 0
while sayici < 5:
    print(sayici)
    sayici += 1

Sonsuz dovr + break:
while True:
    cavab = input("Cixmaq ucun q yaz: ")
    if cavab == "q":
        break
    print(f"Yazdin: {cavab}")

while-else:
n = 10
while n > 0:
    print(n)
    n -= 1
else:
    print("Bitdi!")  # break olmadan bitdikde

for vs while:
for - belli sayda tekrar
while - sherte bagli tekrar

## Tapshiriqlar

1. Istifadeci duzgun shifre girene kimi sor (max 3 cehd)
2. Ededin faktorialini while ile hesabla
3. Fibonacci ardiciллığını 100-den kicik olanlar ucun cap et
""")

N20 = n("""
## Konspekt

range() sintaksisi:
range(stop)              -> 0-dan stop-1-e
range(start, stop)       -> start-dan stop-1-e
range(start, stop, step) -> addimli

Numuneler:
list(range(5))        -> [0,1,2,3,4]
list(range(1,6))      -> [1,2,3,4,5]
list(range(0,10,2))   -> [0,2,4,6,8]
list(range(10,0,-1))  -> [10,9,...,1]

range() yaddash semerelidiр:
range(1000000) - yaddashda yalniz 3 eded saxlayir

## Tapshiriqlar

1. range() ile 1-100 arasindaki 3-e bolünen ededleri cap et
2. Tersine sayac: 10-dan 1-e
3. range() ile shahmat taxtasinin koordinatlarini cap et
""")

N21 = n("""
## Konspekt

break - dovruden tam cix:
for i in range(10):
    if i == 5:
        break
    print(i)  # 0 1 2 3 4

continue - bu iterasiyanı atla:
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1 3 5 7 9

Praktiki:
for e in [-3, 1, 8, -1]:
    if e < 0:
        print(f"Ilk menfi: {e}")
        break

## Tapshiriqlar

1. Istifadeci "stop" yazana kimi sozler al
2. 1-100 arasinda 7-ye bolünen ilk 5 ededi tap
3. Siyahidan bosh stringlari atlayan dovru yaz
""")

N22 = n("""
## Konspekt

List Comprehension:
[ifade for element in iterable if shert]

Muqayise:
# Adi usul
kvardat = []
for x in range(10):
    kvardat.append(x**2)

# LC
kvardat = [x**2 for x in range(10)]

Shertli LC:
cut = [x for x in range(20) if x % 2 == 0]
pozitiv = [x for x in [-3,1,-2,4,0] if x > 0]

String ile:
sozler = ["salam", "dunya"]
buyuk = [s.upper() for s in sozler]

Dict comprehension:
kvardat = {x: x**2 for x in range(5)}

## Tapshiriqlar

1. 1-50 arasinda hem 2-ye hem 3-e bolünen ededleri LC ile tap
2. Siyahidaki stringleri uzunluqlarina gore lughete cevir
3. Matris 3x3 sifirlarla dolu LC ile yarat
""")

N23 = n("""
## Konspekt

Bu ders dovruler, shertler ve veri strukturlarini birleshdirir.

Tipik mesele strukturu:
1. Melumat al
2. Emal et
3. Neticeni goster

Numune - Telebe Idareetme:
telabalar = {}
while True:
    emel = input("Elave et(a)/Goster(g)/Cix(c): ")
    if emel == "a":
        ad = input("Ad: ")
        q = float(input("Qiymet: "))
        telabalar[ad] = q
    elif emel == "g":
        for ad, q in telabalar.items():
            print(f"{ad}: {q}")
    elif emel == "c":
        break

## Tapshiriqlar

1. Shifre gucluluk yoxlayici: 8+ simvol, boyuk/kicik herf, reqem, xususi
2. Matris transpozu: [[1,2],[3,4]] -> [[1,3],[2,4]]
3. Metn analizi: soz sayı, en cox tekrarlanan soz, ortalama soz uzunlugu
""")

N24 = n("""
## Konspekt

Funksiya nedir?
Kod bloklarini adlandirıb tekrar istifade etmek ucun.

def salam_ver(ad):
    print(f"Salam, {ad}!")

salam_ver("Eli")

Default parametr:
def tanit(ad, yas=18, seher="Baki"):
    print(f"{ad}, {yas}, {seher}")

tanit("Eli")               # Eli, 18, Baki
tanit("Leyla", 22)         # Leyla, 22, Baki
tanit("Orxan", seher="Gence")

Scope:
x = 10  # qlobal
def f():
    x = 20  # lokal
    print(x)  # 20
f()
print(x)  # 10

## Tapshiriqlar

1. hesabla(a, b, emeliyyat="+") funksiyasi yaz
2. Celsius-Fahrenheit cevirmesi funksiyalari
3. Palindrom yoxlayan funksiya yaz
""")

N25 = n("""
## Konspekt

return ne edir?
def kvadrat(x):
    return x ** 2

netice = kvadrat(5)  # 25

Coxlu deger qaytarmaq:
def min_max(siyahi):
    return min(siyahi), max(siyahi)

kicik, boyuk = min_max([3,1,4,1,5])

return vs print:
def topla_print(a,b): print(a+b)      # None qaytarir
def topla_return(a,b): return a+b     # deyeri qaytarir

x = topla_print(3,4)   # x = None!
y = topla_return(3,4)  # y = 7

## Tapshiriqlar

1. Siyahinin min, max, ortalama, cemini tuple seklinde qaytaran funksiya
2. Fibonacci-nin n-ci hedini qaytaran funksiya
3. Kvadrat tenliyin kokulerini helleden funksiya
""")

N26 = n("""
## Konspekt

Parametr novleri:
def f(a, b=10, *args, **kwargs):
    print(a, b, args, kwargs)

f(1)               # 1 10 () {}
f(1,2,3,4)         # 1 2 (3,4) {}
f(1, x=5, y=6)     # 1 10 () {x:5,y:6}

Praktiki *args:
def cem(*ededler):
    return sum(ededler)

cem(1,2,3)     -> 6
cem(1,2,3,4,5) -> 15

Praktiki **kwargs:
def html_tag(tag, **attrs):
    attr_str = " ".join(f'{k}="{v}"' for k,v in attrs.items())
    return f"<{tag} {attr_str}>"

## Tapshiriqlar

1. Istenihen sayda sozu birleshdireb birlesdir(*sozler, sep=" ")
2. logger(**data) - lughet formatinda log yazan funksiya
3. Kalkulyatoru *args ile coxlu eded ucun genishlendir
""")

N27 = n("""
## Konspekt

Lambda - bir seterlik funksiya:
ikiqat = lambda x: x * 2
topla = lambda a, b: a + b

Lambda + sort:
telabalar.sort(key=lambda t: t["qiymet"])

Lambda + map/filter:
ededler = [1, 2, 3, 4, 5]
kvadratlar = list(map(lambda x: x**2, ededler))
cut_ededler = list(filter(lambda x: x%2==0, ededler))

global acar sozu:
sayi = 0
def artir():
    global sayi
    sayi += 1

artir(); artir()
print(sayi)  # 2

## Tapshiriqlar

1. Lambda ile siyahini uzunluguna gore sirala
2. filter + lambda ile 5-den boyuk ededleri sec
3. global istifade ederek ziyaretci sayaci yaz
""")

N28 = n("""
## Konspekt

Bu ders funksiyalar movzusunu mohkemletmek ucun praktiki meshqdir.

Yaxshi funksiya yazma prinsipleri:
- Bir funksiya - bir ish
- Deyishen adlari menali
- Tekrar kodu funksiyaya ciхar
- return istifade et

Numune - Bank Hesabi:
balans = 1000

def yoxla(): return balans

def yatir(meblaq):
    global balans
    balans += meblaq

def cek(meblaq):
    global balans
    if meblaq > balans:
        return "Kifayet etmir"
    balans -= meblaq

## Tapshiriqlar

1. Metni shifreleyen/deshifreyen funksiya (Sezar shifresı)
2. Rekursiv funksiya ile agaci cap et
3. Todo list: elave et, sil, tamamla, siyahila
""")

N29 = n("""
## Konspekt

Hazir modullar:
import math, random, os, datetime

math:
math.sqrt(16)    -> 4.0
math.pi          -> 3.14159
math.ceil(3.2)   -> 4
math.floor(3.9)  -> 3

random:
random.random()             -> 0.0-1.0
random.randint(1, 100)      -> tam eded
random.choice(["a","b"])    -> siyahidan sec
random.shuffle(siyahi)      -> qarishdir

os:
os.getcwd()              -> cari qovluq
os.listdir(".")          -> qovluq icindekiler
os.path.exists("f.txt")  -> var?

Oz modulu:
# hesab.py
def topla(a, b): return a + b
# main.py
import hesab
hesab.topla(3, 4)

## Tapshiriqlar

1. random ile 6/49 lotereya bilet generatoru yaz
2. datetime ile dogum tarixinden yas hesabla
3. os ile qovluqdaki .txt fayllarini listle
""")

N30 = n("""
## Konspekt

Bu ders oyreniyen modullar real layihelerde istifade etmek ucun meshq dersidir.

Mini layihe - Shifre Generatoru:
import random, string

def sifre_yarat(uzunluq=12, xususi=True):
    herbler = string.ascii_letters + string.digits
    if xususi:
        herbler += string.punctuation
    return "".join(random.choices(herbler, k=uzunluq))

print(sifre_yarat())

## Tapshiriqlar

1. math ile triqonometrik kalkulyator
2. random ile kart oyunu: 52 kart, qarishdir, 5 kart paylaht
3. datetime ile nece gunun qaldigini hesablayan geri sayim
""")

N31 = n("""
## Konspekt

OOP nedir?
Obyekt Yonumlu Proqramlasdirma - real dunya obyektlerini kodda modellemek.

Sinif yaratmaq:
class Telebe:
    def __init__(self, ad, yas):
        self.ad = ad
        self.yas = yas

    def tanit(self):
        print(f"Adim {self.ad}, yashim {self.yas}")

    def dog_gununu_kec(self):
        self.yas += 1

t1 = Telebe("Eli", 20)
t1.tanit()
t1.dog_gununu_kec()

Terminologiya:
- class - sinif (shablon)
- __init__ - konstruktor
- self - obyektin ozu
- Metod - sinifin funksiyasi
- Atribut - sinifin deyisheni

## Tapshiriqlar

1. Kitab sinfi: bashliq, muellif, il, oxundu(bool)
2. BankHesabi sinfi: balans, yatir(), cek(), balans_goster()
3. Kvadrat sinfi: tere, sahe(), perimetr(), boyut(n)
""")

N32 = n("""
## Konspekt

Bu ders CLASS-in real dunya problemine tetbiqini gosterir.

Numune - Ticarety Sistemi:
class Mehsul:
    def __init__(self, ad, qiymet, stok):
        self.ad = ad
        self.qiymet = qiymet
        self.stok = stok

    def sat(self, miqdar):
        if miqdar > self.stok:
            return False
        self.stok -= miqdar
        return miqdar * self.qiymet

    def __str__(self):
        return f"{self.ad}: {self.qiymet} AZN, stok: {self.stok}"

m = Mehsul("Alma", 1.5, 100)
print(m)

## Tapshiriqlar

1. Avtomobil sinfi: marka, model, il, qiymet, yas() metodu
2. Mehsul obyektleri yarat, toplam stok deyerini hesabla
3. __repr__ metodunu izah et ve sinife elave et
""")

N33 = n("""
## Konspekt

Miras nedir?
Bir sinif bashqa sinifin xususiyyetlerini alir.

class Heyvan:
    def __init__(self, ad):
        self.ad = ad
    def ses_cixar(self):
        print("...")

class It(Heyvan):
    def ses_cixar(self):      # override
        print("Hav-hav!")
    def oyna(self):
        print(f"{self.ad} oynayir")

class Pishik(Heyvan):
    def ses_cixar(self):
        print("Miyav!")

super() - valideyn sinfe muraciet:
class ElitIt(It):
    def __init__(self, ad, cins):
        super().__init__(ad)
        self.cins = cins

isinstance() yoxlamasi:
isinstance(h, It)     -> True
isinstance(h, Heyvan) -> True
isinstance(h, Pishik) -> False

## Tapshiriqlar

1. Forma bazasi -> Daire, Duzbuçaqli, Ucbuçaq (sahe() metodu)
2. Ishci -> Menecer, Muhendis - maash hesablama ferqli
3. super() ile miras zenciri (3 seviyye)
""")

N34 = n("""
## Konspekt

Bu ders OOP prinsiplerini istifade ederek real layihe qurur.

Layihe strukturu:
class Mahni:
    def __init__(self, ad, ifaci, muddet):
        self.ad = ad
        self.ifaci = ifaci
        self.muddet = muddet

    def __str__(self):
        dq = self.muddet // 60
        san = self.muddet % 60
        return f"{self.ifaci} - {self.ad} ({dq}:{san:02d})"

class Calar:
    def __init__(self):
        self.siyahi = []
        self.cari = 0

    def elave_et(self, mahni):
        self.siyahi.append(mahni)

## Tapshiriqlar

1. Kitabxana sinfi: kitab elave et, axtar, sil
2. Oyun sinfi: oyuncu adi, skor, seviyye artir
3. ChatBot sinfi: suallari lughetde saxla, bilmirsə "Bilmirem" qaytar
""")

N35 = n("""
## Konspekt

XOX (Tic-Tac-Toe) OOP ile:

class XOX:
    def __init__(self):
        self.taxta = [[" "]*3 for _ in range(3)]
        self.novbe = "X"

    def goster(self):
        for sira in self.taxta:
            print("|".join(sira))
            print("-"*5)

    def hamle_et(self, sira, sutun):
        if self.taxta[sira][sutun] != " ":
            return False
        self.taxta[sira][sutun] = self.novbe
        self.novbe = "O" if self.novbe=="X" else "X"
        return True

## Tapshiriqlar

1. XOX oyununu tamamla - qalibiyyet yoxlamasi elave et
2. Kompüter reqibi elave et (random secim)
3. Skor sistemi elave et
""")

N36 = n("""
## Konspekt

try-except nedir?
Proqramin xeta ile chokmasinin qarshisini almaq.

try:
    eded = int(input("Eded: "))
    netice = 100 / eded
except ValueError:
    print("Xeta: Eded daxil edin!")
except ZeroDivisionError:
    print("Xeta: Sifira bolmek olmaz!")
except Exception as e:
    print(f"Xeta: {e}")
else:
    print("Uğurla tamamlandi")  # xeta olmadiqda
finally:
    print("Hemise icra edilir")

Umumi xeta novleri:
ValueError       - yanlish tip cevirme
TypeError        - yanlish tip emeliyyat
IndexError       - siyahi heddini ashma
KeyError         - lughetde achar yoxdur
FileNotFoundError - fayl tapilmadi
ZeroDivisionError - sifira bolme

## Tapshiriqlar

1. Kalkulyatoru xeta idaresi ile guclendir
2. Fayldan melumat oxu - fayl yoxdursa yaradilsin
3. Oz xeta sinfi: class YasXetasi(Exception): pass
""")

N37 = n("""
## Konspekt

Xeta loglamasi:
import logging
logging.basicConfig(filename="xetalar.log", level=logging.ERROR)
try:
    pass
except Exception as e:
    logging.error(f"Xeta: {e}")

raise ile oz xetani at:
def yash_yoxla(yas):
    if yas < 0:
        raise ValueError("Yas menfi ola bilmez!")
    if yas > 150:
        raise ValueError("Yanlish yas!")
    return True

Context manager ile:
with open("fayl.txt") as f:
    melumat = f.read()
# fayl avtomatik baglaniр

## Tapshiriqlar

1. logging ile xeta fayli yaradan proqram yaz
2. Oz raise istifade eden 3 funksiya yaz
3. Xarici API sorgusu simulyasiyasi - timeout xetasini idar et
""")

N38 = n("""
## Konspekt

Fayl acmaq:
with open("fayl.txt", "r", encoding="utf-8") as f:
    melumat = f.read()

Rejim novleri:
r   - oxumaq
w   - yazmaq (movcudu silir)
a   - elave etmek
rb  - binary oxumaq
x   - yeni fayl yarat

Oxumaq usullari:
f.read()          -> hamisi
f.readline()      -> bir seter
f.readlines()     -> siyahi sheklinde
for seter in f:   -> seter-seter

Yazmaq:
with open("cixis.txt", "w", encoding="utf-8") as f:
    f.write("Salam Dunya\n")
    f.writelines(["Seter 1\n", "Seter 2\n"])

## Tapshiriqlar

1. Telebe adlari fayldan oxu, sirala, yeni fayla yaz
2. Lugheti JSON formatinda fayla yaz ve oxu
3. CSV fayli oxu - her sutunu ayrica siyahida topla
""")

N39 = n("""
## Konspekt

JSON ile ish:
import json

melumat = {"ad": "Eli", "yas": 20}
json_str = json.dumps(melumat, ensure_ascii=False)

with open("melumat.json", "w", encoding="utf-8") as f:
    json.dump(melumat, f, ensure_ascii=False, indent=2)

with open("melumat.json", "r", encoding="utf-8") as f:
    oxunan = json.load(f)

Planlama proqrami:
FAYL = "planlar.json"

def planlar_yukle():
    if os.path.exists(FAYL):
        with open(FAYL) as f:
            return json.load(f)
    return []

def planlar_saxla(planlar):
    with open(FAYL, "w", encoding="utf-8") as f:
        json.dump(planlar, f, ensure_ascii=False, indent=2)

## Tapshiriqlar

1. JSON ile elaqe kitabcasi: elave et, axtar, sil, saxla
2. Konfiqurasiya fayli sistemi
3. CSV ile telebe qeydlerini idar et
""")

N40 = n("""
## Konspekt

map() - her elementde funksiya tetbiq et:
ededler = [1, 2, 3, 4, 5]
kvardat = list(map(lambda x: x**2, ededler))

Hazir funksiya ile:
sozler = ["salam", "dunya"]
buyuk = list(map(str.upper, sozler))

map() ile iki siyahi:
a = [1, 2, 3]; b = [10, 20, 30]
cem = list(map(lambda x,y: x+y, a, b))
-> [11, 22, 33]

filter() - sherte uygunlari sec:
pozitiv = list(filter(lambda x: x > 0, range(-5,6)))

## Tapshiriqlar

1. map() ile siyahidaki ededleri AZN-den USD-e cevir
2. filter() ile uzunlugu 5-den artiq olan sozleri sec
3. map() + filter() birlikde: cut ededlerin kvadrati
""")

N41 = n("""
## Konspekt

Riyazi funksiyalar:
ededler = [3,1,4,1,5,9]
max(ededler)      -> 9
min(ededler)      -> 1
sum(ededler)      -> 23
abs(-5)           -> 5
round(3.567, 2)   -> 3.57
pow(2, 8)         -> 256

key parametri:
sozler = ["alma", "ki", "armud"]
max(sozler, key=len)  -> "armud"
min(sozler, key=len)  -> "ki"

sorted() vs sort():
sorted(a)             -> yeni siyahi qaytarir
a.sort()              -> yerindece siralair
sorted(a, reverse=True)     -> azalan
sorted(sozler, key=len)     -> uzunluga gore

## Tapshiriqlar

1. Telebe siyahisini qiymetine gore sirala
2. En uzun soz, en qisa soz, cemi herfer sayi
3. sorted() ile lugheti deyere gore sirala
""")

N42 = n("""
## Konspekt

zip() - siyahilari cutle:
adlar = ["Eli", "Leyla"]
yaslar = [20, 22]
for ad, yas in zip(adlar, yaslar):
    print(f"{ad}: {yas}")

profiller = dict(zip(adlar, yaslar))

enumerate() - indeks + deger:
for i, meyve in enumerate(["alma","armud"], start=1):
    print(f"{i}. {meyve}")

all() ve any():
qiymetler = [85, 90, 78]
all(q >= 51 for q in qiymetler)  -> hamisi kecibmi?
any(q >= 90 for q in qiymetler)  -> biri 90+mi?

reversed():
list(reversed([1,2,3,4,5]))  -> [5,4,3,2,1]

## Tapshiriqlar

1. zip() ile iki siyahini birleshdir, cut-cut cap et
2. all() ile shifrenin butun shertlerini eyni anda yoxla
3. enumerate() ile indeksleri cap et
""")

N43 = n("""
## Konspekt

Uzvluk sistemi arxitekturasi:
qeydiyyat -> login -> shexsi kabinet

Shifre hashleme:
import hashlib

def hash_sifre(sifre):
    return hashlib.sha256(sifre.encode()).hexdigest()

def sifre_yoxla(daxil, saxlanilan):
    return hash_sifre(daxil) == saxlanilan

JSON-da istifadeci:
{
  "istifadeciler": [
    {"ad":"ali", "sifre_hash":"abc..."}
  ]
}

## Tapshiriqlar

1. Tam uzvluk sistemi: qeydiyyat, giris, shifre deyishme, JSON
2. Shifre hashla, istifadeci adinin dublikatini yoxla
3. "Meni xatirla" funksiyasi: session faylinda saxla
""")

N44 = n("""
## Konspekt

Yoxlama metodlari:
"Python3".isalpha()  -> False
"Python".isalpha()   -> True
"123".isdigit()      -> True
"Python3".isalnum()  -> True
"  ".isspace()       -> True
"PYTHON".isupper()   -> True

Deyishdirme:
"  salam  ".strip()             -> "salam"
"python".replace("p","P")       -> "Python"
s.title()                       -> Her Soz Boyuk

Bolme/Birleshme:
"a,b,c".split(",")              -> ["a","b","c"]
" ".join(["Salam","Dunya"])     -> "Salam Dunya"

Axtarish:
"Python".find("th")             -> 2
"Python".count("p")             -> 0
"Python".startswith("Py")       -> True
"Python".endswith("on")         -> True

## Tapshiriqlar

1. E-mail validasiyasi: @ var, noqte var, bosluq yox
2. Metni sozlere bol, her sozun bash herfini boyut, yeniden birleshdir
3. Shifre yoxlama: 1 boyuk, 1 kicik, 1 reqem, 1 xususi
""")

N45 = n("""
## Konspekt

Set nedir?
Unikal elementler toplusu - sirasiz, duplikatsiz.

a = {1, 2, 3, 3, 2}  -> {1,2,3}
bos_set = set()

Set emeliyyatlari:
a = {1,2,3,4}; b = {3,4,5,6}
a | b   -> {1,2,3,4,5,6}  birleshme
a & b   -> {3,4}           kesishme
a - b   -> {1,2}           ferq
a ^ b   -> {1,2,5,6}       simetrik ferq

Set metodlari:
s.add(4)       -> elave
s.remove(2)    -> sil (yoxdursa xeta)
s.discard(9)   -> sil (xetasiz)
3 in s         -> True

Praktiki:
unikal = list(set([1,2,2,3,3,4]))

## Tapshiriqlar

1. Iki siyahida ortaq elementleri tap
2. Siyahidan duplikatlari sil, sirasi qor
3. Venn diaqrami mentiqini simulyasiya et
""")

N46 = n("""
## Konspekt

SQLite nedir?
Faylda saxlanilan yungul veritabani - server lazim deyil.

import sqlite3
conn = sqlite3.connect("mekteb.db")
cur = conn.cursor()

Cedvel yarat:
cur.execute(
    "CREATE TABLE IF NOT EXISTS telabeler "
    "(id INTEGER PRIMARY KEY AUTOINCREMENT, ad TEXT NOT NULL, qiymet REAL)"
)

CRUD:
cur.execute("INSERT INTO telabeler (ad,qiymet) VALUES (?,?)", ("Eli",85.5))
cur.execute("SELECT * FROM telabeler")
print(cur.fetchall())
cur.execute("UPDATE telabeler SET qiymet=? WHERE ad=?", (90,"Eli"))
cur.execute("DELETE FROM telabeler WHERE id=?", (1,))
conn.commit()
conn.close()

## Tapshiriqlar

1. Elaqe kitabcasi DB: ad, telefon, email - CRUD
2. Sade inventar: mehsul, qiymet, miqdar
3. Telebe qiymet sistemi: ad, fen, qiymet - ortalama hesabla
""")

N47 = n("""
## Konspekt

Bu ders OOP ve SQLite-i birleshdirir.

Sistem strukturu:
class Telebe:
    def __init__(self, ad, student_id):
        self.ad = ad
        self.student_id = student_id

class Fen:
    def __init__(self, ad, kredit):
        self.ad = ad
        self.kredit = kredit

class Universiyet:
    def __init__(self):
        self.db = sqlite3.connect("universiyet.db")
        self._cedveller_yarat()

    def telebe_elave_et(self, ad): ...
    def fen_elave_et(self, telebe_id, fen_id): ...
    def qiymet_ver(self, telebe_id, fen_id, qiymet): ...

## Tapshiriqlar

1. Universiyet sistemini tamamla
2. GPA hesablama: her fenin kreditine gore agirliqlı ortalama
3. En yaxshi telebeni, en cetinf feni tapan sorgular
""")

N48 = n("""
## Konspekt

Decorator nedir?
Funksiyalari deyishmeden funksionalliq elave etmek.

def zamanlayici(funksiya):
    import time
    def wrapper(*args, **kwargs):
        t0 = time.time()
        netice = funksiya(*args, **kwargs)
        print(f"{funksiya.__name__}: {time.time()-t0:.4f} san")
        return netice
    return wrapper

@zamanlayici
def agir_hesab(n):
    return sum(range(n))

agir_hesab(1000000)

Genish dekoratorlar:
@property      - getter kimi
@staticmethod  - sinif numunesi lazim deyil
@classmethod   - sinifin ozu arqument

## Tapshiriqlar

1. Login yoxlayan dekorator: @login_teleb_olunur
2. Cache dekoratoru: eyni arqumentle ikinci cekirishde saxlanmish netice
3. Retry dekoratoru: xeta cixsa N defe yeniden cehd et
""")

N49 = n("""
## Konspekt

Python-un guclu terefe - tekar ishleri avtomatlasdirma.

Fayl avtomatlasdirmasi:
import os, shutil
from pathlib import Path

def fayllari_sirala(qovluq):
    for fayl in Path(qovluq).iterdir():
        if fayl.is_file():
            uzanti = fayl.suffix.lower()
            hedef = Path(qovluq) / uzanti.strip(".")
            hedef.mkdir(exist_ok=True)
            shutil.move(str(fayl), str(hedef/fayl.name))

requests ile veb:
import requests
cavab = requests.get("https://api.example.com")
melumat = cavab.json()

schedule ile zamanlama:
import schedule, time
schedule.every(1).minutes.do(isimiz)
while True:
    schedule.run_pending()
    time.sleep(1)

## Tapshiriqlar

1. Masa ustu fayllar növüne gore qovluqlara sirala
2. Her gun avtomatik gundelik hesabat yaradan skript
3. Qiymet izleyici: saytdan qiymet cek, deyishdikde bildiris
""")

N50 = n("""
## Konspekt

Iterator nedir?
Elementler uzerinde bir-bir gezmeye imkan veren obyekt.

siyahi = [1,2,3]
it = iter(siyahi)
print(next(it))  # 1
print(next(it))  # 2

Oz iterator sinfi:
class SayGec:
    def __init__(self, max):
        self.max = max
        self.cari = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.cari >= self.max:
            raise StopIteration
        self.cari += 1
        return self.cari

for i in SayGec(5):
    print(i)  # 1 2 3 4 5

## Tapshiriqlar

1. Fibonacci saylarini iterator kimi yaradan sinif
2. Fayl seterlerini tersine oxuyan iterator
3. zip() funksiyasinin oz versiyasini iterator ile yaz
""")

N51 = n("""
## Konspekt

Bu ders iterator, dekorator ve funksional proqramlasdirmanı birleshdirir.

Funksional zencir:
from functools import reduce

ededler = range(1, 11)
netice = reduce(
    lambda a, b: a + b,
    filter(lambda x: x % 2 == 0,
           map(lambda x: x**2, ededler))
)
# 2^2 + 4^2 + 6^2 + 8^2 + 10^2 = 220

## Tapshiriqlar

1. reduce() ile siyahinin maksimumunu tap (max() istifadesiz)
2. Her cekirishde novbeti Fibonacci reqemini veren dekorator
3. Pipeline: metn -> sozlere bol -> normalize et -> unikal -> sirala
""")

N52 = n("""
## Konspekt

Generator nedir?
yield istifade eden funksiya - her defe bir deger verir.

def say_gec(n):
    for i in range(n):
        yield i

g = say_gec(5)
print(next(g))  # 0
print(next(g))  # 1

Generator vs List:
buyuk_list = [x**2 for x in range(1000000)]  # ~8MB
buyuk_gen  = (x**2 for x in range(1000000))  # ~100B

Sonsuz generator:
def sonsuz_say():
    n = 0
    while True:
        yield n
        n += 1

yield from:
def birleshdir(*siyahilar):
    for s in siyahilar:
        yield from s

## Tapshiriqlar

1. Sonsuz asal eded generatoru yaz
2. Boyuk faylin seter-seter oxuyan generatoru
3. send() metodu ile iki terefi generator yaz
""")

N53 = n("""
## Konspekt

Oyrendiyin her sheyin xulasesi:

Esaslar: deyishenler, tiplер, operatorlar
Axin idaresi: if/elif/else, for, while
Funksiyalar: def, return, *args, **kwargs, lambda
Veri strukturlari: list, tuple, dict, set
OOP: class, miras, polimorfizm
Xeta idaresi: try/except
Fayl emeliyyatlari: oxu, yaz, JSON
Modullar: math, random, os, datetime
Qabaqcil: decorator, iterator, generator

Novbeti addimlar:
Web: Django, Flask, FastAPI
Data: NumPy, Pandas, Matplotlib
AI/ML: TensorFlow, PyTorch
Avtomatlasdirma: Selenium, BeautifulSoup

## Son Tapshiriq

1. Kursda oyrenilenlerden bir TAM layihe yaz
2. GitHub-a yukle
3. README fayli yaz - ne etdiyin izah et

Ugurlar! Sen Python proqramcisan!
""")

# ── LESSONS ──────────────────────────────────────────────────────────────────
LESSONS = [
    (1,  'llIQYBIAs9A', 'Python Nedir? Niye Oyrenmeliyem?',       'Pythona giris, tetbiq saheleri, qurashdirilma',           40,  N1),
    (2,  'GuIrekCL7_8', 'Deyishenler, Operatorlar, Sherh Setirler','Deyishen elan etmek, riyazi operatorlar',                 50,  N2),
    (3,  'PAebrWr5WR4', 'float | int Ferqleri, Teyin Prioritetleri','Tam ve onluq ededler, emeliyyat sirasi',                 50,  N3),
    (4,  'yisKASiK70U', 'String Tipi ve Xususiyyetleri',           'Metn yaratmaq, birlesdirmek, kesmek',                     60,  N4),
    (5,  'i5WuvTPD200', 'Veri Cevirmeler (Type Casting)',          'int, float, str arasinda cevirmek',                       55,  N5),
    (6,  '_eGMuHsamlE', 'print() Funksiyasi ve Xususiyyetleri',    'print() parametrleri: sep, end',                          45,  N6),
    (7,  'VQNXMEvo4FM', 'print() - file ve flush Parametrleri',    'Fayla yazmaq, buffer bosaltmaq',                          40,  N7),
    (8,  '8IabpiwCZ2s', '*args - Ulduzlu Parametrler',             'Deyishen sayda arqument qebul etmek',                     60,  N8),
    (9,  'G9RLqNfXstA', 'List (Siyahi) Veri Tipi',                 'Siyahi yaratmaq, deyishdirmek, metodlar',                 65,  N9),
    (10, 'YxJBwKPBn9Y', 'Tuple Veri Tipi',                         'Deyishdirilmez siyahilar',                                55,  N10),
    (11, 'uG8w1zIhTKo', 'Dictionary (Lughet) Veri Tipi',           'Acar-deger cutleri ile islemek',                          65,  N11),
    (12, 'Bp0gmVkTqj8', 'input() Funksiyasi',                      'Istifadeciden melumat almaq',                             50,  N12),
    (13, 'Z3MYdA72ajg', 'Ozun Kodla! - Meshq 1',                   'Evvelki mevzulari tetbiq et',                             60,  N13),
    (14, 'X1bsevtYS_c', 'Menteqi Ifadeler',                        'True, False, muqayise operatorlari',                      55,  N14),
    (15, '-zHrKqxk0Rc', 'Menteqi Baglacilar (and | or)',           'and, or ile murekkel shertler',                           55,  N15),
    (16, 'QKvxubQJwkc', 'if & else Bloklari',                      'Shertli icra - if, elif, else',                           60,  N16),
    (17, 'osdeqjIseA4', 'Ozun Kodla! - if, elif, else',            'Shertli operatorlarla praktiki meshq',                    55,  N17),
    (18, 'P3Mhl2yTeBU', 'FOR Dovrues',                             'for ile siyahi, range, string uzerinde dovr',             65,  N18),
    (19, '8_cK5FjlZao', 'WHILE Dovrues',                           'while ile sherte bagli tekrar',                           60,  N19),
    (20, 'wILi3lhdeso', 'range() Funksiyasi',                      'range() ile eded ardiciллığları',                         50,  N20),
    (21, 'fS5rQ6zGLRY', 'break & continue',                        'Dovruden cixmaq ve novbeti iterasiyaya kecmek',           55,  N21),
    (22, 'hdQX1dhkNio', 'List Comprehension',                      'Siyahilari bir setirde yaratmaq',                         65,  N22),
    (23, 'CE1dUDeDias', 'Ozun Kodla! - Meshq 2',                   'Dovrular ve shertlerle kompleks meshq',                   65,  N23),
    (24, 'LDR2R_h2Qw0', 'Funksiyalar - Esaslar',                   'def ile funksiya yaratmaq',                               70,  N24),
    (25, '940wISdasLM', 'Funksiyalar ve return',                    'Deger qaytarmaq, coxlu return',                           65,  N25),
    (26, 'Idvj3jTktIc', 'Funksiyalar - *args, **kwargs',           'Cevik parametr qebulu',                                   70,  N26),
    (27, '3dNxmnkL6Lg', 'Lambda ve global',                        'Anonim funksiyalar, qlobal deyishenler',                  60,  N27),
    (28, 'uKz4gV50lpI', 'Ozun Kodla! - Meshq 3',                   'Funksiyalar ile kompleks meseleler',                      70,  N28),
    (29, '71SgX-jy9Iw', 'Modullar',                                'import, from...import, oz modulu',                        65,  N29),
    (30, 'wJ0YbZdkPyw', 'Ozun Kodla! - Meshq 4',                   'Modullar ile praktiki proqramlar',                        65,  N30),
    (31, 'cqe0xQDVGl4', 'CLASS - Sinif Yapisi Nedir?',             'OOP: obyekt, sinif, __init__, self',                      80,  N31),
    (32, '9gCM4Fe4mSw', 'OOP - Birja Robotu Numunesi',             'Sinifin real layihede tetbiqi',                           80,  N32),
    (33, 'TG3BGfoBcKI', 'Miras (Inheritance)',                     'Sinifleri genishletmek',                                  80,  N33),
    (34, 'YU1DSQo3FFg', 'Ozun Kodla! - MP3 Calar',                 'OOP ile real layihe',                                     75,  N34),
    (35, 'AOsyk9X8XDI', 'Ozun Kodla! - XOX Oyunu',                 'OOP ile oyun proqramlasdirmasi',                          80,  N35),
    (36, 'T_b4GPl93as', 'Xeta Tapma - try & except',               'Istisnalari idar etmek',                                  70,  N36),
    (37, 'waNwXPBH4zA', 'Xeta Tapma 2 - Praktiki Tetbiq',          'Excel, YouTube yuklemek ile xeta idaresi',                65,  N37),
    (38, 'EM_MP_zahKo', 'Fayl Emeliyyatlari',                      'Fayl oxumaq, yazmaq, elave etmek',                        70,  N38),
    (39, 'iUjRgYh_4b4', 'Fayl Emeliyyatlari 2 - Praktiki',         'Planlama proqrami, JSON ile ish',                         70,  N39),
    (40, 'L_mc-zmunQc', 'map() - Faydali Daxili Funksiyalar',      'map(), filter() ile funksional proqramlasdirma',          65,  N40),
    (41, '_LqWQhUD7rs', 'max(), min(), sum()',                      'Daxili funksiyalar desti',                                60,  N41),
    (42, 'G0VyvXJuquM', 'zip, enumerate, filter, all, any, len',   'Python-un en faydali daxili funksiyalari',                65,  N42),
    (43, 'zGR4RfUr-_M', 'Ozun Kodla! - Uzvluk Sistemi + JSON',    'JSON ile istifadeci sistemi',                             80,  N43),
    (44, 'w5B31gSToOY', 'String Sinif Funksiyalari',               'str metodlarinin tam desti',                              60,  N44),
    (45, '5tqtZPQR2-U', 'SET - Coxluq Veri Tipi',                  'Unikal elementler, coxluq emeliyyatlari',                 60,  N45),
    (46, 'I1UqCFohw8Q', 'Verilenter Bazasi - SQLite',              'Python ile SQLite istifadesi',                            90,  N46),
    (47, '2Tw7uO13-ww', 'Ozun Kodla! - Universiyet Simulyasiyasi', 'OOP + SQLite ile boyuk layihe',                           90,  N47),
    (48, 'GBEU5YqNaoI', 'Decorator & Praktiki Layihe',             'Dekoratorlar, GitHub istifadesi',                         80,  N48),
    (49, 'jbQxr_zdPcQ', 'Ozun Kodla! - Avtomatlasdirma',           'Python ile real dunya avtomatlasdirmasi',                 85,  N49),
    (50, 'bd_bZI_kb1M', 'Iteratorlar',                             'iter(), next(), oz iterator sinfin',                      75,  N50),
    (51, '4-0tLD_WftM', 'Ozun Kodla! - Meshq 5',                   'Iterator ve dekorator meshqleri',                         75,  N51),
    (52, '5MAhJysVOhU', 'Generator',                               'yield ile yaddash semerek ardicilliqlar',                 80,  N52),
    (53, 'dD2nOeUvwIQ', 'Son - Tebrikler!',                        'Kursun yekunlasdirilmasi, novbeti addimlar',              50,  N53),
]

data = [
    (COURSE_ID, order, title, desc, xp, notes, f"https://www.youtube.com/watch?v={vid}")
    for order, vid, title, desc, xp, notes in LESSONS
]

execute_values(cur,
    "INSERT INTO lessons (course_id,order_index,title,description,xp_reward,notes,youtube_url) VALUES %s",
    data
)

cur.execute("SELECT COUNT(*) FROM lessons WHERE course_id=%s;", (COURSE_ID,))
print(f"{cur.fetchone()[0]} ders elave edildi.")
conn.commit()
print("Tamamlandi!")
conn.close()
