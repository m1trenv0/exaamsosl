import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function runMigration() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migration-add-password-attempts.sql')
    const migration = fs.readFileSync(migrationPath, 'utf-8')

    console.log('Running password attempts migration...')
    
    const { error } = await supabase.rpc('exec_sql', { sql: migration })

    if (error) {
      console.error('Migration error:', error)
      process.exit(1)
    }

    console.log('✅ Password attempts migration completed successfully!')
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()
