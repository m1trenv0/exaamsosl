import { createClient } from '@/lib/supabase/client'
import * as fs from 'fs'
import * as path from 'path'

async function applyMigration() {
  try {
    console.log('📝 Reading migration file...')
    const migrationPath = path.join(process.cwd(), 'supabase', 'migration-add-password-attempts.sql')
    const migration = fs.readFileSync(migrationPath, 'utf-8')

    console.log('🔧 Applying migration to database...')
    console.log('\n=== SQL to execute ===')
    console.log(migration)
    console.log('======================\n')

    console.log('ℹ️  Please execute this SQL manually in Supabase SQL Editor:')
    console.log('   1. Go to Supabase Dashboard')
    console.log('   2. Open SQL Editor')
    console.log('   3. Paste the SQL above')
    console.log('   4. Click "Run"')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

applyMigration()
