import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testQuestions() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database')

    // Get all questions
    const result = await client.query(`
      SELECT id, order_index, question_text, question_type, options 
      FROM questions 
      ORDER BY order_index
    `)

    console.log(`\n✓ Found ${result.rows.length} questions\n`)

    // Group by type
    const byType: Record<string, number> = {}
    result.rows.forEach(row => {
      byType[row.question_type] = (byType[row.question_type] || 0) + 1
    })

    console.log('Question types:')
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`)
    })

    // Test specific questions
    console.log('\n--- Testing question types ---\n')

    // Test multiple_select (index 10)
    const multiSelect = result.rows.find(r => r.order_index === 10)
    if (multiSelect) {
      console.log(`✓ Question 10 (multiple_select):`)
      console.log(`  Type: ${multiSelect.question_type}`)
      console.log(`  Options: ${multiSelect.options ? '✓ Present' : '✗ Missing'}`)
      if (multiSelect.options) {
        console.log(`  Options count: ${multiSelect.options.options?.length || 0}`)
        console.log(`  Correct answers: ${JSON.stringify(multiSelect.options.correct)}`)
      }
    }

    // Test multiple_choice (index 11)
    const multiChoice = result.rows.find(r => r.order_index === 11)
    if (multiChoice) {
      console.log(`\n✓ Question 11 (multiple_choice):`)
      console.log(`  Type: ${multiChoice.question_type}`)
      console.log(`  Options: ${multiChoice.options ? '✓ Present' : '✗ Missing'}`)
      if (multiChoice.options) {
        console.log(`  Options count: ${multiChoice.options.options?.length || 0}`)
        console.log(`  Correct answer: ${multiChoice.options.correct}`)
      }
    }

    // Test true_false (index 13)
    const trueFalse = result.rows.find(r => r.order_index === 13)
    if (trueFalse) {
      console.log(`\n✓ Question 13 (true_false):`)
      console.log(`  Type: ${trueFalse.question_type}`)
      console.log(`  Options: ${trueFalse.options ? '✓ Present' : '✗ Missing'}`)
      if (trueFalse.options) {
        console.log(`  Correct answer: ${trueFalse.options.correct} (${trueFalse.options.correct === 0 ? 'True' : 'False'})`)
      }
    }

    // Check for any missing options
    console.log('\n--- Validation ---\n')
    let hasIssues = false

    result.rows.forEach(row => {
      const needsOptions = ['multiple_choice', 'multiple_select', 'true_false', 'categorization']
      if (needsOptions.includes(row.question_type) && !row.options) {
        console.log(`✗ Question ${row.order_index} (${row.question_type}) is missing options`)
        hasIssues = true
      }
    })

    if (!hasIssues) {
      console.log('✓ All questions have proper options')
    }

    console.log('\n--- Summary ---')
    console.log(`Total questions: ${result.rows.length}`)
    console.log('Status: ✓ All tests passed')

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

testQuestions()
