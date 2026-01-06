import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })

const { Client } = pg

async function getSupabaseKeys() {
  // Parse connection string
  const directUrl = process.env.DIRECT_URL!
  
  const client = new Client({
    connectionString: directUrl,
  })

  try {
    await client.connect()
    console.log('✅ Connected to Supabase database')

    // Get project reference from URL
    const match = directUrl.match(/postgres\.([a-zA-Z0-9]+)/)
    if (!match) {
      console.log('❌ Could not extract project reference')
      return
    }

    const projectRef = match[1]
    
    // Try to get keys from auth.config or vault
    const { rows } = await client.query(`
      SELECT 
        current_setting('app.settings.jwt_secret', true) as jwt_secret,
        current_setting('request.jwt.claims', true) as jwt_claims
    `)

    console.log('Database connection successful!')
    console.log('\n📝 Manually get your ANON_KEY:')
    console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/settings/api')
    console.log('2. Copy the "anon public" key')
    console.log('3. Add to .env.local')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

getSupabaseKeys()
