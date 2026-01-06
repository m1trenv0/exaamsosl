import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET() {
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

    const messagesResult = await client.query(`
      SELECT * FROM chat_messages 
      WHERE exam_id = $1 
      ORDER BY created_at ASC
    `, [exam.id])

    return NextResponse.json({
      exam,
      messages: messagesResult.rows,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to load chat' }, { status: 500 })
  } finally {
    await client.end()
  }
}

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    const { exam_id, message, sender } = await request.json()

    await client.connect()

    await client.query(`
      INSERT INTO chat_messages (exam_id, message, sender)
      VALUES ($1, $2, $3)
    `, [exam_id, message, sender])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  } finally {
    await client.end()
  }
}
