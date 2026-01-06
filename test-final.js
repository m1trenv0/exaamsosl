/**
 * Final comprehensive test
 */

const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function test() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    
    const result = await client.query('SELECT order_index, question_type, options FROM questions ORDER BY order_index')
    
    console.log('═══════════════════════════════════════')
    console.log('  FINAL VERIFICATION')
    console.log('═══════════════════════════════════════\n')
    
    console.log(`Total questions: ${result.rows.length}\n`)
    
    const tests = []
    
    // Test each question
    result.rows.forEach(q => {
      const needsOptions = ['multiple_choice', 'multiple_select', 'true_false', 'categorization']
      const hasOptions = !!q.options
      const shouldHaveOptions = needsOptions.includes(q.question_type)
      
      if (shouldHaveOptions && !hasOptions) {
        console.log(`✗ Q${q.order_index}: ${q.question_type} - MISSING OPTIONS`)
        tests.push(false)
      } else if (shouldHaveOptions && hasOptions) {
        console.log(`✓ Q${q.order_index}: ${q.question_type}`)
        tests.push(true)
      } else {
        console.log(`✓ Q${q.order_index}: ${q.question_type}`)
        tests.push(true)
      }
    })
    
    console.log('\n═══════════════════════════════════════')
    if (tests.every(t => t)) {
      console.log('✅ ALL QUESTIONS VALID')
      console.log('✅ Open http://localhost:3001 to verify')
    } else {
      console.log('❌ SOME QUESTIONS HAVE ISSUES')
    }
    console.log('═══════════════════════════════════════\n')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

test()
