import { NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    // Get active exam
    const examResult = await client.query(`
      SELECT * FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'No active exam found' }, { status: 404 })
    }

    const exam = examResult.rows[0]

    // Get questions
    const questionsResult = await client.query(`
      SELECT * FROM questions 
      WHERE exam_id = $1 
      ORDER BY order_index ASC
    `, [exam.id])

    return NextResponse.json({
      exam,
      questions: questionsResult.rows,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to load exam' }, { status: 500 })
  } finally {
    await client.end()
  }
}
