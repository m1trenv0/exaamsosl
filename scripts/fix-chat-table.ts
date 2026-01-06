import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Client } = pg

async function checkTable() {
  const connectionString = process.env.DIRECT_URL
  
  if (!connectionString) {
    console.error('❌ DIRECT_URL not found in .env.local')
    process.exit(1)
  }

  const client = new Client({
    connectionString: connectionString.replace(/["']/g, ''), // Remove quotes
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Check current table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'chat_messages'
      ORDER BY ordinal_position;
    `)

    console.log('\n📊 Current chat_messages table structure:')
    console.table(result.rows)

    // Try to add columns if they don't exist
    console.log('\n🔧 Attempting to add missing columns...')
    
    const columns = result.rows.map(r => r.column_name)
    
    if (!columns.includes('sender')) {
      console.log('Adding sender column...')
      await client.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN sender TEXT DEFAULT 'participant' 
        CHECK (sender IN ('admin', 'participant'))
      `)
      console.log('✅ Added sender column')
    } else {
      console.log('✅ sender column already exists')
    }

    if (!columns.includes('is_read')) {
      console.log('Adding is_read column...')
      await client.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN is_read BOOLEAN DEFAULT FALSE
      `)
      console.log('✅ Added is_read column')
    } else {
      console.log('✅ is_read column already exists')
    }

    // Verify again
    const finalResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'chat_messages'
      ORDER BY ordinal_position;
    `)

    console.log('\n✅ Final table structure:')
    console.table(finalResult.rows)

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  } finally {
    await client.end()
  }
}

checkTable()
