import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Read migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../supabase/migration-add-sender-column.sql'),
      'utf8'
    )

    console.log('📝 Running migration...')
    await client.query(migrationSQL)
    console.log('✅ Migration completed successfully!')

    // Verify columns exist
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'chat_messages'
      ORDER BY ordinal_position;
    `)

    console.log('\n📊 Current chat_messages table structure:')
    console.table(result.rows)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
