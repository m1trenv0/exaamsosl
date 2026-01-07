/**
 * Get all questions from database
 */

import { Client } from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

async function getAllQuestions() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database\n')
    
    const result = await client.query(`
      SELECT * FROM questions 
      ORDER BY order_index
    `)

    console.log(`Total questions: ${result.rows.length}\n`)

    // Save to file for review
    fs.writeFileSync(
      'current-questions.json',
      JSON.stringify(result.rows, null, 2)
    )

    console.log('✓ Saved to current-questions.json\n')

    // Display all questions
    result.rows.forEach((row, idx) => {
      console.log(`\n[${idx}] Order: ${row.order_index} | Type: ${row.question_type}`)
      console.log(`Q: ${row.question_text.substring(0, 80)}...`)
      if (row.options) {
        console.log(`Options:`, JSON.stringify(row.options).substring(0, 100))
      }
    })

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

getAllQuestions()
