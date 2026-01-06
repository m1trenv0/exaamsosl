import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import pg from 'pg'
import sampleQuestions from '@/sample-questions-canvas.json'

const { Client } = pg

export default async function LoadQuestionsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/api/auth/signin')
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  let message = ''
  let success = false

  try {
    await client.connect()

    const examResult = await client.query(`
      SELECT id FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      message = 'No active exam found'
    } else {
      const examId = examResult.rows[0].id
      
      // Delete existing questions
      await client.query(`DELETE FROM questions WHERE exam_id = $1`, [examId])

      // Insert new questions
      for (const q of sampleQuestions.questions) {
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

      message = `Successfully loaded ${sampleQuestions.questions.length} questions!`
      success = true
    }
  } catch (error) {
    message = `Error: ${error}`
  } finally {
    await client.end()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Load Sample Questions</h1>
        <div className={`p-4 rounded ${success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
        {success && (
          <div className="mt-6 space-y-2">
            <a href="/admin/dashboard" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Go to Admin Dashboard
            </a>
            <a href="/" className="block w-full text-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Go to Exam
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
