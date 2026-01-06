/**
 * Comprehensive test to verify questions are loaded correctly
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function verify() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    
    const result = await client.query(`
      SELECT * FROM questions 
      ORDER BY order_index
    `)

    console.log('✓ Connected to database\n')
    console.log(`Total questions: ${result.rows.length}\n`)

    // Group by type
    const byType: Record<string, number> = {}
    result.rows.forEach(row => {
      byType[row.question_type] = (byType[row.question_type] || 0) + 1
    })

    console.log('Distribution by type:')
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(20)} ${count}`)
    })

    // Verify specific questions
    console.log('\n=== VERIFICATION ===\n')

    let allGood = true

    // Q10 should be multiple_select
    const q10 = result.rows.find(r => r.order_index === 10)
    if (q10?.question_type === 'multiple_select' && q10.options?.options?.length === 6) {
      console.log('✓ Q10: multiple_select with 6 options')
    } else {
      console.log(`✗ Q10: Expected multiple_select with 6 options, got ${q10?.question_type} with ${q10?.options?.options?.length || 0} options`)
      allGood = false
    }

    // Q11 should be multiple_choice
    const q11 = result.rows.find(r => r.order_index === 11)
    if (q11?.question_type === 'multiple_choice' && q11.options?.options?.length === 4) {
      console.log('✓ Q11: multiple_choice with 4 options')
    } else {
      console.log(`✗ Q11: Expected multiple_choice with 4 options, got ${q11?.question_type}`)
      allGood = false
    }

    // Q12 should be multiple_choice  
    const q12 = result.rows.find(r => r.order_index === 12)
    if (q12?.question_type === 'multiple_choice') {
      console.log('✓ Q12: multiple_choice')
    } else {
      console.log(`✗ Q12: Expected multiple_choice, got ${q12?.question_type}`)
      allGood = false
    }

    // Q13-17 should be true_false
    for (let i = 13; i <= 17; i++) {
      const q = result.rows.find(r => r.order_index === i)
      if (q?.question_type === 'true_false') {
        console.log(`✓ Q${i}: true_false`)
      } else {
        console.log(`✗ Q${i}: Expected true_false, got ${q?.question_type}`)
        allGood = false
      }
    }

    console.log('\n=== RESULT ===')
    if (allGood) {
      console.log('✅ ALL TESTS PASSED - Questions are correctly loaded in database')
    } else {
      console.log('❌ SOME TESTS FAILED - Check the issues above')
    }

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

verify()
