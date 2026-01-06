import fs from 'fs'
import path from 'path'
import pg from 'pg'

const { Client } = pg

async function loadQuestions() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Get active exam
    const examResult = await client.query(`
      SELECT id FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      console.error('❌ No active exam found')
      return
    }

    const examId = examResult.rows[0].id
    console.log(`📋 Found active exam: ${examId}`)

    // Read questions from JSON
    const jsonPath = path.join(process.cwd(), 'sample-questions-canvas.json')
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    const questions = jsonData.questions

    console.log(`📝 Loaded ${questions.length} questions from JSON`)

    // Delete existing questions
    await client.query(`DELETE FROM questions WHERE exam_id = $1`, [examId])
    console.log('🗑️  Deleted existing questions')

    // Insert new questions
    for (const q of questions) {
      await client.query(`
        INSERT INTO questions (exam_id, order_index, question_text, question_type, options)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        examId, 
        q.order_index, 
        q.question_text, 
        q.question_type, 
        q.options ? JSON.stringify(q.options) : null
      ])
    }

    console.log('✅ Successfully imported all questions!')
    
    // Verify
    const result = await client.query(`
      SELECT COUNT(*) as count FROM questions WHERE exam_id = $1
    `, [examId])
    
    console.log(`✅ Total questions in DB: ${result.rows[0].count}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

loadQuestions()
