import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Client } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../supabase/migration-add-chat-question-text.sql'),
      'utf-8'
    )

    await client.query(migrationSQL)
    console.log('✓ Migration completed successfully: Added chat_question_text column')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
