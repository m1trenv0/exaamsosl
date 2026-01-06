import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    // Get the active exam
    const examResult = await client.query(`
      SELECT id FROM exams WHERE is_active = true LIMIT 1
    `)

    if (!examResult.rows[0]) {
      return NextResponse.json({ messages: [], unreadCount: 0 })
    }

    const examId = examResult.rows[0].id

    // Get messages
    const messagesResult = await client.query(`
      SELECT * FROM chat_messages 
      WHERE exam_id = $1 
      ORDER BY created_at ASC
    `, [examId])

    // Get unread count (messages from admin that participant hasn't read)
    const unreadResult = await client.query(`
      SELECT COUNT(*) as count FROM chat_messages 
      WHERE exam_id = $1 AND sender = 'admin' AND is_read = false
    `, [examId])

    return NextResponse.json({ 
      messages: messagesResult.rows,
      unreadCount: parseInt(unreadResult.rows[0]?.count || '0')
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  } finally {
    await client.end()
  }
}

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    const { message, sender, image_data } = await request.json()

    await client.connect()

    // Get the active exam
    const examResult = await client.query(`
      SELECT id FROM exams WHERE is_active = true LIMIT 1
    `)

    if (!examResult.rows[0]) {
      return NextResponse.json({ error: 'No active exam' }, { status: 400 })
    }

    const examId = examResult.rows[0].id

    const result = await client.query(`
      INSERT INTO chat_messages (exam_id, message, sender, is_read, image_data)
      VALUES ($1, $2, $3, false, $4)
      RETURNING *
    `, [examId, message, sender || 'participant', image_data || null])

    return NextResponse.json({ message: result.rows[0] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  } finally {
    await client.end()
  }
}
