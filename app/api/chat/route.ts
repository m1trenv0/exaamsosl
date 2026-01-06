import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const exam_id = searchParams.get('exam_id')

  if (!exam_id) {
    return NextResponse.json({ error: 'exam_id required' }, { status: 400 })
  }

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()

    const result = await client.query(`
      SELECT * FROM chat_messages 
      WHERE exam_id = $1 
      ORDER BY created_at ASC
    `, [exam_id])

    return NextResponse.json({ messages: result.rows })
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
    const { exam_id, message, sender } = await request.json()

    await client.connect()

    const result = await client.query(`
      INSERT INTO chat_messages (exam_id, message, sender)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [exam_id, message, sender || 'participant'])

    return NextResponse.json({ message: result.rows[0] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  } finally {
    await client.end()
  }
}
