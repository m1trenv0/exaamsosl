import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    const { exam_id, question_id, answer_text } = await request.json()

    await client.connect()

    await client.query(`
      INSERT INTO participant_answers (exam_id, question_id, answer_text)
      VALUES ($1, $2, $3)
      ON CONFLICT (exam_id, question_id) 
      DO UPDATE SET answer_text = $3, updated_at = NOW()
    `, [exam_id, question_id, answer_text])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
  } finally {
    await client.end()
  }
}
