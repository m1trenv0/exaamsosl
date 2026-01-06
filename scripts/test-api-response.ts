import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testApiResponse() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database\n')

    // Simulate what /api/exam does
    const examResult = await client.query(`
      SELECT * FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      console.log('✗ No active exam found')
      return
    }

    const exam = examResult.rows[0]
    console.log(`✓ Found active exam: "${exam.title}"`)

    const questionsResult = await client.query(`
      SELECT * FROM questions 
      WHERE exam_id = $1 
      ORDER BY order_index ASC
    `, [exam.id])

    console.log(`✓ Loaded ${questionsResult.rows.length} questions\n`)

    // Check specific questions
    const q10 = questionsResult.rows.find((q: { order_index: number }) => q.order_index === 10)
    const q11 = questionsResult.rows.find((q: { order_index: number }) => q.order_index === 11)
    const q13 = questionsResult.rows.find((q: { order_index: number }) => q.order_index === 13)

    console.log('--- Question 10 (should be multiple_select) ---')
    console.log('Type:', q10?.question_type)
    console.log('Has options:', !!q10?.options)
    console.log('Options type:', typeof q10?.options)
    if (q10?.options) {
      console.log('Options content:', JSON.stringify(q10.options, null, 2))
    }

    console.log('\n--- Question 11 (should be multiple_choice) ---')
    console.log('Type:', q11?.question_type)
    console.log('Has options:', !!q11?.options)
    console.log('Options type:', typeof q11?.options)
    if (q11?.options) {
      console.log('Options content:', JSON.stringify(q11.options, null, 2))
    }

    console.log('\n--- Question 13 (should be true_false) ---')
    console.log('Type:', q13?.question_type)
    console.log('Has options:', !!q13?.options)
    console.log('Options type:', typeof q13?.options)
    if (q13?.options) {
      console.log('Options content:', JSON.stringify(q13.options, null, 2))
    }

    // Simulate JSON response
    console.log('\n--- Simulated API Response ---')
    const apiResponse = {
      exam,
      questions: questionsResult.rows,
    }
    
    console.log('Question 10 in response:')
    const respQ10 = apiResponse.questions.find((q: { order_index: number }) => q.order_index === 10)
    console.log('  question_type:', respQ10?.question_type)
    console.log('  options:', JSON.stringify(respQ10?.options))

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

testApiResponse()
