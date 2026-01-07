/**
 * Check if chat_question_text column exists and update it
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function updateChatQuestionText() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database\n')
    
    // Check if column exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'exams' 
      AND column_name = 'chat_question_text'
    `)

    if (columnCheck.rows.length === 0) {
      console.log('Adding chat_question_text column...')
      await client.query(`
        ALTER TABLE exams 
        ADD COLUMN IF NOT EXISTS chat_question_text TEXT
      `)
      console.log('✓ Column added')
    } else {
      console.log('✓ Column chat_question_text already exists')
    }

    // Update the chat question text
    const chatQuestionText = `
Describe the role of effective communication in management. How does communication between stakeholders, employees, and the Board of Directors impact organizational success? Provide specific examples.

If you need clarification or have questions during the exam, you can use the chat panel (adjust the volume slider to reveal it).
    `.trim()

    const result = await client.query(`
      UPDATE exams 
      SET chat_question_text = $1
      WHERE is_active = true
      RETURNING id, title, chat_question_index, chat_question_text
    `, [chatQuestionText])

    console.log('\n✓ Updated exam:')
    console.log(result.rows[0])

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

updateChatQuestionText()
