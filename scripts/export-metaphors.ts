import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync } from 'fs'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

// Sloupce v pořadí shodném s ručním exportem ze Supabase
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

// CSV escaping shodný s exportem z Postgres/Supabase:
// pole obalíme uvozovkami jen když obsahuje čárku, uvozovku nebo nový řádek,
// vnitřní uvozovky zdvojíme. null/undefined → prázdný string.
function csvField(value: unknown): string {
  if (value === null || value === undefined) return ''

  // related_slugs je text[] → vyrenderuj jako Postgres array literal {a,b}
  let str: string
  if (Array.isArray(value)) {
    str = value.length > 0 ? `{${value.join(',')}}` : ''
  } else {
    str = String(value)
  }

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function formatDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function exportMetaphors() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env file')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Stahuji aktuální stav databáze ze Supabase...\n')

  const { data: metaphors, error } = await supabase
    .from('metaphors')
    .select(COLUMNS.join(', '))
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  if (!metaphors || metaphors.length === 0) {
    console.log('Žádné metafory v databázi.')
    return
  }

  const rows = metaphors as unknown as Array<Record<string, unknown>>

  // Render CSV (čárka jako oddělovač, hlavička shodná s ručním exportem)
  const header = COLUMNS.join(',')
  const lines = rows.map((row) => COLUMNS.map((col) => csvField(row[col])).join(','))
  const csv = [header, ...lines].join('\n') + '\n'

  const filename = `metaphors_rows_${formatDate(new Date())}.csv`
  const outputPath = join(__dirname, '../Export', filename)
  writeFileSync(outputPath, csv, 'utf-8')

  const published = rows.filter((m) => m.status === 'published').length
  const pending = rows.filter((m) => m.status === 'pending').length
  const rejected = rows.filter((m) => m.status === 'rejected').length

  console.log('Export hotov.')
  console.log(`  Celkem:    ${rows.length}`)
  console.log(`  Published: ${published}`)
  console.log(`  Pending:   ${pending}`)
  console.log(`  Rejected:  ${rejected}`)
  console.log(`\nSoubor: ${outputPath}`)
}

exportMetaphors().catch(console.error)
