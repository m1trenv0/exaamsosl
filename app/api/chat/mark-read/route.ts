import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Client } = pg

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    const body = await request.json()
    const { messageIds } = body

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'Invalid message IDs' }, { status: 400 })
    }

    await client.connect()

    // Mark messages as read
    await client.query(`
      UPDATE chat_messages 
      SET is_read = true 
      WHERE id = ANY($1)
    `, [messageIds])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await client.end()
  }
}
