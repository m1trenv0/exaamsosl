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

    const questionCountResult = await client.query(`
      SELECT COUNT(*) as count FROM questions WHERE exam_id = $1
    `, [exam.id])

    return NextResponse.json({
      exam,
      questionCount: parseInt(questionCountResult.rows[0].count),
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
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
    const { title, chat_question_index, chat_question_text } = await request.json()

    await client.connect()

    await client.query(`
      UPDATE exams 
      SET title = $1, chat_question_index = $2, chat_question_text = $3
      WHERE is_active = true
    `, [title, chat_question_index, chat_question_text])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  } finally {
    await client.end()
  }
}
