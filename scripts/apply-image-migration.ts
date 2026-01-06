import pg from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const { Client } = pg

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    const migrationSQL = readFileSync(
      join(process.cwd(), 'supabase', 'migration-add-image-support.sql'),
      'utf-8'
    )

    await client.query(migrationSQL)
    console.log('✅ Migration applied successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
