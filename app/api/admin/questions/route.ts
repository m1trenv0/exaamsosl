import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import pg from 'pg'

const { Client } = pg

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    const examResult = await client.query(`
      SELECT * FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'No active exam' }, { status: 404 })
    }

    const exam = examResult.rows[0]

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
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  } finally {
    await client.end()
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    const { questions } = await request.json()

    await client.connect()

    const examResult = await client.query(`
      SELECT id FROM exams WHERE is_active = true LIMIT 1
    `)

    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'No active exam' }, { status: 404 })
    }

    const examId = examResult.rows[0].id

    // Delete existing questions
    await client.query(`DELETE FROM questions WHERE exam_id = $1`, [examId])

    // Insert new questions
    for (const q of questions) {
      await client.query(`
        INSERT INTO questions (exam_id, order_index, question_text, question_type, options)
        VALUES ($1, $2, $3, $4, $5)
      `, [examId, q.order_index, q.question_text, q.question_type, q.options ? JSON.stringify(q.options) : null])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to import' }, { status: 500 })
  } finally {
    await client.end()
  }
}
