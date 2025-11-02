TL;DR

* Níže je **základní PRD (Product Requirements Document)** pro váš web s českými metaforami — kostra s klíčovými body.
* Zahrnuje: účel a cíle, cílové uživatele, hlavní funkce, ne-funkční požadavky, technické omezení, milníky.
* Můžeme vytvořit rozšířenou verzi s UI wireframy, podrobnými user stories a backlogem — chcete?

---

## 1. Účel a cíle projektu

**Účel**: Vytvořit online databázi českých metafor, kterou návštěvníci snadno prohledají, přidají nové metafory a sdílí je.
**Cíle**:

* Umožnit přidávání a správu metafor uživateli ve snadném formuláři.
* Zajistit přívětivé URL pro každou metaforu (slug).
* Udržet jednoduchou strukturu — žádné kategorie, žádné abecední řazení.
* Dosáhnout dobré použitelnosti a základní SEO optimalizace.

---

## 2. Cíloví uživatelé

* Jazykoví nadšenci, studenti a lektoři češtiny hledající metafory.
* Uživatelé, kteří chtějí **přispívat** vlastními metaforami.
* Webový návštěvník hledající vyhledanou metaforu, její definici a příklad.

---

## 3. Hlavní funkce (Functional Requirements)

| Funkce                   | Popis                                                                              | Priorita |
| ------------------------ | ---------------------------------------------------------------------------------- | -------- |
| Výpis metafor            | Zobrazení seznamu metafor podle data přidání nebo popularity.                      | Vysoká   |
| Detail metafory          | Stránka pro jednu metaforu – název, definice, příklad, autor, datum.               | Vysoká   |
| Vyhledávání a filtrování | Pole pro hledání názvu, definice nebo příkladu.                                    | Střední  |
| Přidání metafory         | Formulář pro uživatele: název, definice, příklad, autor (jméno/email) + schválení. | Vysoká   |
| Administrace             | Panel pro moderátora: schválení, editace, odstranění metafor, správa uživatelů.    | Vysoká   |
| URL/slug mechanismus     | Automatické generování URL na základě názvu metafory (viz pravidla slugů).         | Vysoká   |

---

## 4. Ne-funkční požadavky

* **Performance**: Stránky se musí načítat rychle (<2 s) i při rostoucí databázi.
* **SEO-přívětivost**: Struktura URL, meta-tagy, validní HTML.
* **Responsivita**: Funguje dobře na mobilu i desktopu.
* **Bezpečnost**: Schvalování uživatelských příspěvků, ochrana vůči spamům.
* **Udržitelnost**: Systém umožní snadný import/export dat (např. CSV) v budoucnu.

---

## 5. Omezení, předpoklady, závislosti

**Předpoklady**:

* Použití CMS (např. WordPress) nebo jiného systému umožňujícího vlastní typ obsahu.
* Uživatelé poskytnou základní data (název + definice + příklad).
  **Omezení**:
* Bez složitých taxonomií či kategorií — jednoduchá struktura.
* V prvotní verzi není blog/novinky.
  **Závislosti**:
* Plugin pro cache a rychlost (např. WP Rocket).
* Hosting s dostatečnými zdroji pro růst databáze.

---

## 6. Milníky a roadmapa

| Milník                                             | Datum      |
| -------------------------------------------------- | ---------- |
| Výběr technologie + nastavení prostředí            | DD.MM.YYYY |
| Vytvoření datového modelu (metafora) + návrh UI    | DD.MM.YYYY |
| Implementace osnovních funkcí (výpis, detail, URL) | DD.MM.YYYY |
| Implementace formuláře pro přidání + schvalování   | DD.MM.YYYY |
| Testování, SEO-kontrola, responsivita              | DD.MM.YYYY |
| Produkční spuštění verze 1.0                       | DD.MM.YYYY |

---

## 7. Úspěšnost a metriky

* Počet přidaných metafor v prvních 3 měsících (např. ≥100).
* Průměrná doba načtení stránky <2 s.
* % návštěvníků používajících vyhledávání > 30 %.
* Počet přispěvatelů > 20 v prvních 6 měsících.

---

## 8. Exkluze (co **není** součástí verze 1)

* Kategorie a typy metafor (viz vaše požadavky – odstraněno).
* Blog/novinky sekce.
* Abecední řazení výpisu.
* Vícejazyčný obsah (nejprve jen čeština).

---

### Shrnutí

Tento PRD dává jasný rámec pro vývoj webu s českými metaforami: co stavíme, pro koho, jaké funkce nutně musí být a co se odloží. Pokud chcete, můžeme připravit **detailní backlog / user stories** pro každou funkci.
