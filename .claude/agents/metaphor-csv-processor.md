---
name: metaphor-csv-processor
description: Zpracuje seznam nových českých metafor do CSV pro import do Supabase (metafory.cz) — kontrola duplicit proti exportu, generování definice a příkladu, výstup jako CSV se středníky a UTF-8 BOM. Use when the user provides a list of metaphors to process.
---

# INSTRUKCE PRO ZPRACOVÁNÍ METAFOR DO CSV

Mám seznam metafor, které potřebuji zpracovat do CSV pro import do Supabase.

## VSTUP:
- Dostaneš seznam metafor (= sloupec "nazev")
- Aktuální stav databáze si stáhni sám — **nejdřív spusť `npm run export-db`**. Vytvoří se čerstvý soubor `Export/metaphors_rows_<dnešní-datum>.csv` s celou databází (skript přímo čte živou Supabase, žádné ruční stahování není potřeba).
- Tento čerstvý export použij jako referenci pro kontrolu duplicit — čti z něj sloupce `nazev`, `definice`, `priklad`.
- Řádky se statusem "pending" v exportu jsou další nové metafory ke zpracování (přidej je k zadanému seznamu).

## CO MÁŠ UDĚLAT:
- pro každý řádek zkontroluj, jestli se jedná o metaforu
- zkontroluj, jestli v seznamu nových metafor nejsou nějaké duplicity, které už jsou obsažené v CSV exportu
	- Pro každý pár metafor si přečti oba texty a **sám zhodnoť**:
	- Vyjadřují stejnou myšlenku různými slovy?
	- Jsou to variace téhož tématu?
	- Liší se jen v drobnostech (překlepy, pořadí slov)?
	- Nebo jsou to opravdu různé metafory?

	**Tvé AI schopnosti dokážou rozpoznat:**
	- Synonyma a parafrázování
	- Stejný význam, jiná formulace
	- Kulturní varianty stejné metafory
	- Překlepy a gramatické varianty

- pro každou metaforu vygeneruj `definice` a `priklad` pomocí `~/.claude/tools/llm.sh routine`:
	```
	~/.claude/tools/llm.sh routine "Jsi expert na český jazyk. Pro metaforu '[nazev]' vrať výsledek POUZE jako JSON objekt (bez markdown, bez kódu, čistý JSON): {\"definice\": \"...\", \"priklad\": \"...\"}. Definice: 1-2 věty vysvětlující, co metafora vyjadřuje a jaký obraz používá. Příklad: jedna věta ukazující metaforu v použití — příklad má být vtipný, překvapivý nebo zajímavý, rozhodně ne suchopárný jako z učebnice."
	```
	- Z JSON odpovědi vezmi hodnoty `definice` a `priklad` a dosaď je do příslušných CSV sloupců
	- Pokud `llm.sh` vrátí chybu, opakuj dotaz jednou s přeformulovaným promptem; pokud selže znovu, nech pole prázdné a reportuj

## VÝSTUP:
- Vytvoř CSV soubor s UTF-8 BOM encoding (pro Excel kompatibilitu)
- **DŮLEŽITÉ: Použij středník (;) jako oddělovač** - český Excel očekává středníky, ne čárky!
- jako vzor použij soubor template.csv
- zachovej formát všech sloupců a smaž první řádek s vzorovou metaforou
- Zachovej českou diakritiku
- formát datumů musí být přesně `YYYY-MM-DD 12:00:00+00` (např. `2026-04-26 12:00:00+00`) — použij dnešní datum
- vyplň sloupec "approved_at" - dej tam stejné datum jako je ve sloupci "created_at"
- sloupec "status" nastavit u všech na "published"
- Pokud diakritika chybí, tak jí oprav
- výsledný CSV soubor ulož do složky Export s dnešním timestampem v názvu

FORMÁT SLOUPCŮ (oddělené středníky):
id;slug;nazev;definice;priklad;autor_jmeno;autor_email;status;created_at;approved_at;zdroj

SEZNAM METAFOR:
[sem zadám metafory]