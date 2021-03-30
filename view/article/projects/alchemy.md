
# Alchemy

---

<center>

*11. Ožujka 2018.*

</center>

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

$$
\begin{align}
W(x) = \frac{N(x) \cdot Ar(x)}{Mr(x)} \\
\end{align}
$$

Svi se maseni udjeli animiraju u vizualno atraktivnom grafu u obliku postotaka te se svakom elementu spoja pridružije jedinstvena boja.

### Implementacija
Ovaj je modul implementiran korištenjem `ArrayList` kao stoga i parsiranjem korisnikova unosa. Prije samog parsiranja se provjerava logička točnost molekule (imaju li sve zagrade svoje parove i nisu li korišteni nedopušteni znakovi poput `.` i `#`). Svaka je molekula objekt tipa Compound, a `getMass()` je njena javna metoda koja izračunava masu. Nakon parsiranja, iz resources direktorija, klasa `Reader` čita tekstualnu listu elemenata i njihovih masa i sprema u `Map<String, Double>`. Pomoću poznatih brojnosti elemenata u spoju i mase svakog pojedinog, lako izračunamo sumu njihovih masa. Kao što sam već naveo, koristio sam algoritam za stog koji u `ArrayList` dodaje sve elemente na koje naiđe prije znaka `)`. Tada provjerava ima li zagrada svoj indeks i sve elemente do prve prethodne pojave `(` množi tim indeksom. Na taj način sam riješio problem višestrukih zagrada.

### Otpornost 🛡
Proveo sam testiranje nad ovim modulom i zbilja je fleksibilan. Ovo su neki primjeri logičnih i nelogičnih formula koje bi mogle zbuniti aplikaciju:

<center>

|    Input     |   Output (masa) |
|:------------:|----------------:|
|   ()()()4    |               0 |
| (((()4)5)6)7 |               0 |
|  ()()0(())   |               0 |
|  (:#$:#;:%)  | Invalid formula |
|   CCCCCCC    |           84.07 |
|  ((Fe3)7)9   |       10554.705 |

</center>

Alchemy uspješno rješava čak i probleme ovog tipa. U slučaju pogrešnog unosa upozorava na nelogičnosti ispisom `Invalid formula`.

## Izjednačavanje kemijskih jednadžbi
### Matematička pozadina
Alchemy može i izjednačavati kemijske jednadžbe. To je modul koji učenicima uvijek dobro dođe kod učenja kemije ako zapnu ili krivo izjednače jednadžbu. Kako bismo ušli dublje u implementaciju, moram napomenuti da su kemijske jednadžbe isto što i matematičke jednadžbe, ali je broj jednadžba manji od broja nepoznanica i stoga se te nepoznanice ne mogu odrediti.
Jedino što možemo napraviti jest odrediti njihove međusobne odnose i to je upravo ono što želimo!
Elementi u kemijskoj jednadžbi predstavljaju dimenzije prostora. Da su svi kemijski elementi linearno nezavisni (međusobno okomiti) jedinični vektori, dokazuje činjenica da nijednom linearnom kombinacijom jednog ili više elemenata (jediničnih vektora), ne možemo dobiti neki drugi element. Drugim riječima, alkemija i kamen mudraca nisu mogući!
Iz matematičke perspektive, svaki je element jedinični vektor jedne dimenzije u hipotetskom multidimenzionalnom prostoru kemijske jednadžbe. Donja slika bi odgovarala spoju sumporne kiseline (H2SO4). Nju je moguće vizualizirati jer ima samo tri dimenzije. Sumporna je kiselina vektor OC u Kartezijevom koordinatnom sustavu.

<img>
<img>

U kemijskim jednadžbama razlikujemo reaktante i produkte, tj. lijevu i desnu stranu jednakosti. Stoga, produkti su zapravo reaktanti negativnih predznaka. Na primjer jednadžbu
$$H2+O2→H2O$$
možemo zapisati kao 
$$H2+O2-H2O→0$$.
Možemo reći da izjednačiti kemijsku jednadžbu zapravo znači pronaći omjer (skalare) svakog vektora reaktanta i produkta tako da njihov ukupni zbroj bude 0. Cilj je da kemijska jednadžba započne i završi u ishodištu koordinatnog sustava nakon iscrtavanja nekog vektorskog puta u prostoru. Tako je, primjerice, sljedeća slika vektorski prikaz već izjednačene jednadžbe
$$Na + Cl – NaCl → 0$$

### Implementacija
Unosom ispravne kemijske jednadžbe i pritiskom na gumb Balance Equation, Alchemy će iz textInputLayout uzeti unešeni string, razlomiti ga na u ArrayList, evaluirati ispravnost unosa i pozvati konstruktor Compound klase koja ga onda parsira i vraća brojeve elementata mapirane njihovim nazivima. Ti se brojevi zatim upisuju u matricu na odgovarajuća mjesta (prikaz dolje).

Dakle, izjednačavanje jednadžba nije ništa drugo nego pronalaženje skalara (ne trivijalnog koji bi bio nula) vektora svake pojedine molekule kako bi njihov konačni zbroj bio nul-vektor.  
Taj se problem može rješiti operacijama nad snopom vektora, tj. matricama. Ovo je primjer matrice gorenja etena:
$$C2H4 + O2 = CO2 + H2O$$

$$
A = \begin{bmatrix}
2 & 0 & 1 & 0 \\\\
4 & 0 & 0 & 2 \\\\
0 & 2 & 2 & 1
\end{bmatrix}
$$

Pretpostavimo da je `A` oznaka gore navedene reakcijske matrice. Onda možemo izračunati tražene koeficijente transponiranjem, proširivanjem odgovarajućom jediničnom matricom `U` i reduciranjem do tzv. row echelon form (`ref()`) Gaussovom eliminacijom:

$$
ref(A^{T} | U)
$$

Primijenimo li ovaj postupak za gore navedenu jednadžbu dobivamo sljedeći produkt:

Moramo ekstrahirati najdonji redak matrice i iz njega čitamo odnose:

Točnost možemo provjeriti množenjem matrice A njenim nul vektorom te ako dobijemo 0, znači da smo pronašli točne skalare vektora spojeva.

Odnosi koje dobivamo ovim postupkom često nisu cjelobrojni (što je i očekivano jer izračunavamo samo njihove odnose) pa sam napisao novu statičku klasu Ratio i metodu smallestIntRatio() za određivanje najmanjeg cjelobrojnog rješenja. Da će uvijek postojati neki omjer za koji su svi koeficijenti cijelobrojni, sigurni smo jer operacijama množenja i dijeljenja u matrici se ne izlazi iz skupa racionalnih brojeva ($$\mathbb{Q}$$). Drugim riječima, uvijek je moguće homotetično skalirati vektore reakcije da bi svaki od njih imao svaku komponentu cjelobrojnu:

Metoda je implementirana kao while petlja koja traži broj s najmanjim decimalnim dijelom te sve ostale brojeve dijeli njime i ponavlja taj postupak dok svi brojevi nebudu cjelobrojni (Najčešće pri prvom dijeljenju završava već s prvim brojem). Ovaj postupak ima zadanu preciznost do 10e-7 što je više nego dovoljno za bilo koju reakciju.

### Otpornost 🛡
Ovaj je modul također otporan na pogrešan unos. U slučaju da jednadžbu nije moguće izjednačiti, jedan ili više koeficijenata iz matrice će biti 0 što ukazuje na to da je jednadžba izjednačena bez njih, tj. može se razlomiti na više jednadžba što nije prihvatljivo i stoga ispisuje Invalid equation.. Rješenje koje sadrži nulu smatra se trivijalnim i ne prikazuje se korisnicima.

| Input                                                                     |                                                  Output                                                  |
|:--------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------:|
| Zn->S                                                                     |                                            Invalid equation.                                             |
| Fe->                                                                      |                                            Invalid equation.                                             |
| (:#$:#;:%)                                                                |                                            Invalid equation.                                             |
| CO2+H2O->C6H12O6+O2                                                       |                                      6 CO2 + 6 H2O->C6H12O6 + 6 O2                                       |
| K4Fe(CN)6 + KMnO4 + H2SO4 -> KHSO4 + Fe2(SO4)3 + MnSO4 + HNO3 + CO2 + H2O | 10 K4Fe(CN)6 + 122 KMnO4 + 299 H2SO4 -> 162 KHSO4 + 5 Fe2(SO4)3 + 122 MnSO4 + 60 HNO3 + 60 CO2 + 188 H2O |

Kao što je iz primjera vidljivo, Alchemy rješava i abnormalno kompleksne reakcije instantno – jednim klikom na gumb `Balance equation`.

## Korisničko sučelje
### Početni zaslon i kretanje aplikacijom
Alchemy je stvorena da bude iznimno jednostavna i brza. Klikom na ikonu aplikacije, odmah nam se prikazuje glavni izbornik (glavna aktivnost). Na njoj možemo pritiskom na gumbove ili odgovarajuće ikone odabrati opciju:
- Molecular Mass Calculator
- Chemical Equation Balancer
- Recent
A uskoro dolazi i opcija:
- Periodic Table
    - periodički sustav elemenata koji će sadržavati dodatne informacije o elementima

Sve ikone koje Alchemy koristi su besplatne i na raspolaganju svima. Ručno su odabrane da zajedno sa specifičnim fontom stvore takozvani material ili flat dizajn. Paleta boja korištenih u aplikaciji također je odabrana da ne napreže oči korisnika zbog velike svjetline mobilnih ekrana, a da pri tome izgleda stilizirano.

## Kalkulator molekulske mase
Odabir prve opcije (klik na ikonu (slika 3.) ili sam gumb), vodi do modula za izračunavanje molekulskih masa. Sve što moramo napraviti je unijeti neku ispravnu molekulsku formulu i pritisnuti na gumb `Get Relative Molecular Mass`. Nakon toga nam se sakrije tipkovnica, dolje ispiše relativna molekulska masa spoja te se iscrta i animira graf masenih udjela svih spojeva u grafu kao što je prikazano na slici. Kako nebi došlo do zabune, svakom je elementu iz spoja pridružena specifična boja. Korisnik se može poslužiti legendom koja se nalazi u podnožju grafa.

Kao što sam već rekao, modul radi za apsolutno svaku ispravnu molekulsku formulu, a kod pogrešnog ispisa se ne prikazuje graf, već se obavijesti korisnika ispisom `Invalid formula.`.

## Izjednačavanje kemijskih jednadžbi
Odabirom druge opcije (klikom na ikonu sa slike 4. ili sam gumb), dolazimo do modula za izračunavanje molekulskih masa. Potrebno je unijeti ispravnu kemijsku jednadžbu bez koeficijenata i simbol jednakosti predstaviti kao "=" ili "->" te pritisnuti gumb `Balance Equation`. To poziva metodu koja pokreće CEB modul i ispisuje izjednačenu kemijsku reakciju.

Sudeći po brojnim testnim primjerima, modul također radi za svaku kemijsku reakciju koja je smislena i izjednačiva. U slučaju pogrešnog unosa ili neizjednačivosti jednadžbe, korisnika se obavijesti (Invalid equation.).

Kako bi se osigurao nesmetani pregled izjednačene reakcije, implementiran je horizontalni klizač kako reakcija nebi bila razlomljena u više linija.

## Pohrana povijesti unosa
Odabirom treće opcije, prikazuje se lista povijesti unesenih jednadžbi (poredanih od novijih prema starijima) i molekulskih formula. Ovisno o tome koju odaberemo, Alchemy nas odvodi do odgovarajuće aktivnosti i umjesto nas ispunjava polje za unos kako bismo mogli brzo pristupiti dugim jednadžbama koje često upisujemo. Primjerice, ako bismo u ovom slučaju pritisnuli `GeH3`, otvorio bi se `Molecular Weight Calculator` sa `GeH3` na crti za unos, a kada bismo pak otvorili `CO2+H2O=C6H12O6+O2` onda bi se otvorio `Chemical Equation Balancer`. Pritiskom na gumb natrag, ne vraćamo se na glavnu aktivnost već u `Recent`.

Ovaj modul aplikacije ne pohranjuje pogrešne unose. Također postoji i opcija za obrisati povijest unosa, a uskoro ću implementirati i selektivno brisanje samo određenih `Entry`-ja.

Svaki modul Alchemy aplikacije podržava i horizontalni pregled aplikacije, ovisno o preferenciji korisnika. Horizontalni je pregled, recimo, bolji za neke kemijske jednadžbe jer može cijela izjednačena jednadžba stati na ekran te molekule kompleksnih formula čiji graf pruža veće zadovoljstvo korisniku kod horizontalnog pregledavanja.

Nije korišten nijedan template pri izradi aplikacije. Svaku klasu u kodu aplikacije sam sam napisao, a jedina vanjska knjižnica je MPAndroidChart (grafički prikaz masenih udjela) kao što sam naveo u odjeljku tehničkih informacija.

### Planovi ažuriranja i održavanja aplikacije
Iako je već prilično praktična, Alchemy je tek počela sjajiti. Primarni cilj je implementirati interaktivni periodički sustav elemenata koji osim elemenata sadrži i ključne informacije o svakom od njih.

Alchemy će također uskoro imati i autocomplete opciju koja će na temelju prijašnjih unosa pamtiti korisnikove spojeve te ih ponuditi kao opciju dovršavanja teksta.

Jedna velika ideja koju želim proučiti u malo daljoj budućnosti je mogućnost raspoznavanja spojeva i kemijskih jednadžbi OCR (optical character recognition) tehnologijom sa slika koja bi omogućila još brže rješavanje kemijskih problema kamerom mobitela. Planiram ju ostvariti koristeći open source modul [Tesseract](https://github.com/tesseract-ocr/tesseract).

---

Možete preuzeti originalnu verziju dokumentacije u PDF obliku <a href="/alchemy-doc.pdf">ovdje</a>.
*Softver korišten za izradu dokumentacije: Libre Office*
