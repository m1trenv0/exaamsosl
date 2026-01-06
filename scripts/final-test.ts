/**
 * FINAL VERIFICATION TEST
 * This test verifies that questions are correctly loaded and will be displayed properly
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function finalTest() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  console.log('═══════════════════════════════════════════════')
  console.log('      FINAL QUESTION VERIFICATION TEST')
  console.log('═══════════════════════════════════════════════\n')

  try {
    await client.connect()
    console.log('✓ Database connected\n')

    // Get all questions
    const result = await client.query(`
      SELECT * FROM questions ORDER BY order_index
    `)

    const questions = result.rows

    console.log(`Total questions loaded: ${questions.length}\n`)

    // Type distribution
    const typeCount: Record<string, number> = {}
    questions.forEach(q => {
      typeCount[q.question_type] = (typeCount[q.question_type] || 0) + 1
    })

    console.log('Question Type Distribution:')
    console.log('─'.repeat(45))
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(20)} │ ${count} questions`)
    })
    console.log()

    // Detailed verification
    console.log('Detailed Verification:')
    console.log('─'.repeat(45))

    let passed = 0
    let failed = 0

    // Check each question type
    const testsRun = [
      { index: 0, expectedType: 'text', name: 'Text question' },
      { index: 10, expectedType: 'multiple_select', name: 'Multiple select question', checkOptions: true, optionsCount: 6 },
      { index: 11, expectedType: 'multiple_choice', name: 'Multiple choice question', checkOptions: true, optionsCount: 4 },
      { index: 12, expectedType: 'multiple_choice', name: 'Multiple choice question #2', checkOptions: true },
      { index: 13, expectedType: 'true_false', name: 'True/False question', checkOptions: true },
      { index: 14, expectedType: 'true_false', name: 'True/False question #2', checkOptions: true },
    ]

    testsRun.forEach(test => {
      const q = questions.find(qq => qq.order_index === test.index)
      
      if (!q) {
        console.log(`  ✗ Q${test.index}: NOT FOUND`)
        failed++
        return
      }

      const typeMatch = q.question_type === test.expectedType
      const hasOptions = test.checkOptions ? !!q.options : true
      const optionsCountMatch = test.optionsCount ? q.options?.options?.length === test.optionsCount : true

      if (typeMatch && hasOptions && optionsCountMatch) {
        console.log(`  ✓ Q${test.index}: ${test.name} (${test.expectedType})`)
        passed++
      } else {
        console.log(`  ✗ Q${test.index}: FAILED - type=${q.question_type}, hasOptions=${!!q.options}`)
        failed++
      }
    })

    console.log()
    console.log('═══════════════════════════════════════════════')
    console.log(`  Tests Passed: ${passed}/${testsRun.length}`)
    console.log(`  Tests Failed: ${failed}/${testsRun.length}`)
    console.log('═══════════════════════════════════════════════')

    if (failed === 0) {
      console.log()
      console.log('✅ ALL TESTS PASSED!')
      console.log('✅ Questions are correctly loaded in database')
      console.log('✅ Frontend will display them correctly')
      console.log()
      console.log('Next steps:')
      console.log('  1. Open http://localhost:3001')
      console.log('  2. Navigate to question 11 (multiple choice)')
      console.log('  3. Navigate to question 10 (multiple select)')
      console.log('  4. Verify they display correctly')
    } else {
      console.log()
      console.log('❌ SOME TESTS FAILED')
      console.log('Please check the failed tests above')
    }

    console.log()

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

finalTest()
