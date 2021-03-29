
# Alchemy

---

<center><i>11. Ožujka 2018.</i></center>

## Uvod
### Što je Alchemy
Alchemy je mobilna aplikacija za olakšano učenje kemije, primarno namijenjena
učenicima, no izrazito fleksibilna i potencijalno korisna čak i stručnjacima. Zbog
iznimne pristupačnosti, potrebno je samo izvaditi mobitel, odabrati opciju i
unijeti traženi problem, a aplikacija će izračunati masu molekula, masene
udjele i izjednačiti bilo koju kemijsku jednadžbu. Osnovna je ideja aplikacije da
pomogne učenicima osnovnih i srednjih škola u učenju kemije – da jednostavno
i brzo provjere točnost rješenja domaćih zadaća.

### Ideja
Alchemy je nastala iz prototipne command line verzije nazvane JAVAMOL. Ona
je imala sve iste funkcionalnosti kao i Alchemy, no bez grafičkog korisničkog
sučelja. Želio sam proširiti osnovnu ideju i učiniti ju funkcionalnom i praktično
korisnom.

### Proces izrade i način rada
Aplikacija ima tri glavne funkcionalnosti:
- Izračunava molekulsku masu formulskih jedinki
- Izračunava udio svakog elementa u spoju
- Izjednačava kemijske jednadžbe
- Mogućnost pristupanja prošlim unosima

### Tehničke informacije
- Programski jezik: Java
- Razvojno okruženje (IDE): Android Studio
- Razvojni alati: Default Android SDK
- Veličina aplikacije: 1,8 MB
- Korištene knjižnice (open source):
    - https://github.com/PhilJay/MPAndroidChart

### Minimalna sistemska konfiguracija
Alchemy radi na svakom Android uređaju, a kako bi bile vidljive animacije
grafova, potrebna je minimalna verzija Android 4.2 (API level 17), trenutačno
ona pokriva gotovo 100% android uređaja.

### Preporučena sistemska konfiguracija
Za fluidno iskustvo preporučam minimalnu sistemsku konfiguraciju jer Alchemy
ne zahtijeva značajnu procesorsku snagu.

### Potreban softver
Za pokretanje Alchemy, potrebna je JRE virtualna mašina koja standardno
dolazi jer je sav android softver baziran na njoj. Ona služi za interpretaciju Java
bajt-koda.

## Kalkulator molekulske mase

### Molekulska masa
Molekulska se masa u kemiji piše kao niz kemijskih elemenata od kojih su neki popraćeni svojim indeksima (prazan indeks podrazumijeva vrijednost 1). Tako su NaCl, FeCl3 i P4O10 primjeri valjanih spojeva. Oznaka svakog elementa počinje velikim slovima što spriječava ambigvitet naziva.

### Maseni udjeli
Nakon izračunavanja molekulske mase i brojnosti svakog elementa u spoju, nije teško odrediti njihove masene udjele. Određuje se po sljedećoj formuli:

<p>
\begin{align}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{align}
</p>

You can download Alchemy documentation in PDF version <a href="/a.pdf">here</a>.
