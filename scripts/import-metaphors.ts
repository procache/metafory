import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join, isAbsolute } from 'path'
import { readFileSync, readdirSync, statSync } from 'fs'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

// Sloupce ve výstupu z metaphor-csv-processor / export-metaphors
const COLUMNS = [
  'id',
  'slug',
  'nazev',
  'definice',
  'priklad',
  'autor_jmeno',
  'autor_email',
  'status',
  'created_at',
  'approved_at',
  'zdroj',
  'related_slugs',
] as const

type Row = Record<string, unknown>

// Parser jednoho řádku CSV s oddělovačem ';' a uvozovkami dle RFC 4180.
// Vnitřní zdvojené uvozovky "" → ".
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ';') {
      fields.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  fields.push(cur)
  return fields
}

// Postgres array literal {a,b} → string[]; prázdné → null
function parseArray(value: string): string[] | null {
  const v = value.trim()
  if (!v || v === '{}') return null
  const inner = v.replace(/^\{/, '').replace(/\}$/, '')
  if (!inner) return null
  return inner.split(',').map((s) => s.trim()).filter(Boolean)
}

// Prázdný string → null (Supabase uloží NULL místo "")
function nullify(value: string): string | null {
  return value.length === 0 ? null : value
}

function parseCsv(content: string): Row[] {
  // strip BOM
  const text = content.replace(/^﻿/, '')
  // rozdělit na řádky, tolerovat CRLF i LF; ignorovat prázdné konce
  const lines = text.split(/\r\n|\n/).filter((l) => l.length > 0)
  if (lines.length < 2) return []

  const header = parseCsvLine(lines[0])
  const rows: Row[] = []

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i])
    const row: Row = {}
    header.forEach((col, idx) => {
      const raw = fields[idx] ?? ''
      if (col === 'related_slugs') {
        row[col] = parseArray(raw)
      } else if (col === 'autor_email' || col === 'autor_jmeno' || col === 'zdroj' || col === 'approved_at') {
        row[col] = nullify(raw)
      } else {
        row[col] = raw
      }
    })
    rows.push(row)
  }
  return rows
}

// Najdi nejnovější metaphors_new_*.csv v Export/, pokud není zadán soubor
function findLatestCsv(): string {
  const exportDir = join(__dirname, '../Export')
  const candidates = readdirSync(exportDir)
    .filter((f) => f.startsWith('metaphors_new_') && f.endsWith('.csv'))
    .map((f) => {
      const full = join(exportDir, f)
      return { full, mtime: statSync(full).mtimeMs }
    })
    .sort((a, b) => a.mtime - b.mtime)
  if (candidates.length === 0) {
    throw new Error('Žádný metaphors_new_*.csv v Export/. Zadej cestu jako argument.')
  }
  return candidates[candidates.length - 1].full
}

async function importMetaphors() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env file')
  }

  // Argumenty: [cesta k CSV] [--commit]
  const args = process.argv.slice(2)
  const commit = args.includes('--commit')
  const fileArg = args.find((a) => !a.startsWith('--'))
  const csvPath = fileArg
    ? (isAbsolute(fileArg) ? fileArg : join(process.cwd(), fileArg))
    : findLatestCsv()

  console.log(`Soubor: ${csvPath}`)
  console.log(`Režim:  ${commit ? 'COMMIT (zápis do DB)' : 'DRY-RUN (bez zápisu)'}\n`)

  const rows = parseCsv(readFileSync(csvPath, 'utf-8'))
  if (rows.length === 0) {
    console.log('Prázdný soubor, nic k importu.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Zjisti, které slugy už v DB existují
  const slugs = rows.map((r) => r.slug as string)
  const { data: existing, error: selError } = await supabase
    .from('metaphors')
    .select('slug')
    .in('slug', slugs)

  if (selError) {
    throw new Error(`Select error: ${selError.message}`)
  }

  const existingSlugs = new Set((existing ?? []).map((r) => r.slug as string))
  const newRows = rows.filter((r) => !existingSlugs.has(r.slug as string))
  const conflictRows = rows.filter((r) => existingSlugs.has(r.slug as string))

  console.log(`Celkem v CSV: ${rows.length}`)
  console.log(`  Nové:      ${newRows.length}`)
  console.log(`  Existující: ${conflictRows.length} (přeskočeny)\n`)

  if (conflictRows.length > 0) {
    console.log('Přeskočené (slug už v DB):')
    conflictRows.forEach((r) => console.log(`  - ${r.nazev} (${r.slug})`))
    console.log('')
  }

  if (newRows.length === 0) {
    console.log('Žádné nové metafory k importu.')
    return
  }

  console.log('Nové metafory:')
  newRows.forEach((r) => console.log(`  + ${r.nazev} (${r.slug}) [${r.status}]`))
  console.log('')

  if (!commit) {
    console.log('DRY-RUN — nic nezapsáno. Spusť s --commit pro reálný import.')
    return
  }

  const { error: insError } = await supabase.from('metaphors').insert(newRows)
  if (insError) {
    throw new Error(`Insert error: ${insError.message}`)
  }

  console.log(`✓ Naimportováno ${newRows.length} nových metafor.`)

  await triggerRebuild()
}

// Po úspěšném importu spusť rebuild webu přes Netlify build hook.
// Hook URL je v .env jako NETLIFY_BUILD_HOOK (viz Netlify → Site settings →
// Build & deploy → Build hooks). Když není nastaven, jen připomene ruční rebuild.
async function triggerRebuild() {
  const hook = process.env.NETLIFY_BUILD_HOOK
  if (!hook) {
    console.log('\n⚠ NETLIFY_BUILD_HOOK není v .env — rebuild spusť ručně (push do main / Netlify trigger).')
    return
  }

  console.log('\nSpouštím rebuild webu (Netlify build hook)...')
  try {
    const res = await fetch(hook, { method: 'POST' })
    if (res.ok) {
      console.log('✓ Rebuild spuštěn. Web bude aktuální za ~2-3 min.')
    } else {
      console.log(`⚠ Build hook vrátil HTTP ${res.status}. Spusť rebuild ručně.`)
    }
  } catch (e) {
    console.log(`⚠ Volání build hooku selhalo: ${(e as Error).message}. Spusť rebuild ručně.`)
  }
}

importMetaphors().catch((e) => {
  console.error(e)
  process.exit(1)
})
