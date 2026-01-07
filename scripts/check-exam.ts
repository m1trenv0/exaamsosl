/**
 * Check exam settings and chat question
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkExam() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database\n')
    
    const result = await client.query(`
      SELECT id, title, chat_question_index, is_active
      FROM exams
      ORDER BY created_at DESC
      LIMIT 1
    `)

    console.log('Current exam settings:')
    console.log(result.rows[0])

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

checkExam()
