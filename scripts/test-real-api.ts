// Test the actual API endpoint
async function testRealAPI() {
  try {
    console.log('Testing real API endpoint...\n')
    
    const response = await fetch('http://localhost:3001/api/exam')
    const data = await response.json()
    
    console.log('✓ API responded successfully\n')
    
    console.log(`Exam title: "${data.exam?.title}"`)
    console.log(`Total questions: ${data.questions?.length}\n`)
    
    if (data.questions) {
      // Check question 10
      const q10 = data.questions.find((q: any) => q.order_index === 10)
      console.log('--- Question 10 ---')
      console.log('Type:', q10?.question_type)
      console.log('Has options:', !!q10?.options)
      console.log('Options is object:', typeof q10?.options === 'object')
      console.log('Options value:', JSON.stringify(q10?.options))
      
      if (q10?.options) {
        console.log('Has options.options array:', Array.isArray(q10.options.options))
        console.log('Has options.correct:', 'correct' in q10.options)
      }
      
      // Check question 11
      const q11 = data.questions.find((q: any) => q.order_index === 11)
      console.log('\n--- Question 11 ---')
      console.log('Type:', q11?.question_type)
      console.log('Options:', JSON.stringify(q11?.options))
      
      // Check question 13
      const q13 = data.questions.find((q: any) => q.order_index === 13)
      console.log('\n--- Question 13 ---')
      console.log('Type:', q13?.question_type)
      console.log('Options:', JSON.stringify(q13?.options))
      
      // Check text question
      const q0 = data.questions.find((q: any) => q.order_index === 0)
      console.log('\n--- Question 0 (text) ---')
      console.log('Type:', q0?.question_type)
      console.log('Options:', JSON.stringify(q0?.options))
    }
    
  } catch (error) {
    console.error('✗ Error:', error)
  }
}

testRealAPI()
